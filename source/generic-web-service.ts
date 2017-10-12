import {ModelInterface, GenericVillage, CommonPrivateConfig} from "./generic-village";
import * as lawn from 'vineyard-lawn'
import {UserManager, UserService} from "vineyard-users"
import {Method, Version} from "vineyard-lawn";
import {Preprocessor} from "./preprocessor";
import {CommonRequestLogger} from "vineyard-lawn-logging"

export class GenericWebService<Model extends ModelInterface, PrivateConfig extends CommonPrivateConfig> {
  village: GenericVillage<Model, PrivateConfig>
  private server: lawn.Server
  private userManager: UserManager
  private userService: UserService
  private userModel:any
  private versions:any
  private preprocessor: Preprocessor
  private anonymous:any
  private authorized:any
  private requestLogger: CommonRequestLogger

  constructor(village: GenericVillage<Model, PrivateConfig>, versions: Version[]) {
    this.village = village
    this.userModel = village.getModel().User
    this.versions = versions
    this.preprocessor = new Preprocessor(this.versions)
    this.requestLogger = new CommonRequestLogger(village.getModel().Request, this.village.getErrorLogger())
    this.server = new lawn.Server(undefined, this.requestLogger)
    this.server.enable_cors()
    this.server.get_app().enable('trust proxy') // Added for IP tracking through proxies

    this.userManager = new UserManager(this.village.getModel().db, {
      user_model: this.userModel,
      model: this.village.getModel()
    })

    // Backwards compatibility.  privateConfig.cookies is deprecated
    const privateConfig = this.village.getPrivateConfig()
    const cookies = privateConfig.api
      ? privateConfig.api.cookies
      : privateConfig.cookies

    if (!cookies)
      throw new Error("Missing api.cookies config.")

    this.userService = new UserService(this.server.get_app(), this.userManager, cookies)

    this.authorized = this.preprocessor.createAuthorized(this.userService)
    this.anonymous = this.preprocessor.createAnonymous()

    this.userService.loadValidationHelpers(this.server.getApiSchema())
  }

  private initialize_endpoints() {
    this.createPublicEndpoints([

      {
        method: Method.post,
        path: "user/login",
        action: this.userService.create_login_handler()
      },

    ])

    this.createAuthorizedEndpoints([

      {
        method: Method.post,
        path: "user/logout",
        action: this.userService.create_logout_handler()
      },

    ])
  }

  compileApiSchema(schema: any): any {
    return this.server.compileApiSchema(schema)
  }

  addApiSchemaHelper(schema: any) {
    this.server.addApiSchemaHelper(schema)
  }

  createPublicEndpoints(endpoints: any) {
    this.server.add_endpoints(endpoints, this.anonymous)
  }

  createAuthorizedEndpoints(endpoints: any) {
    this.server.add_endpoints(endpoints, this.authorized)
  }

  createEndpoints(endpoints: any, preprocessor: any) {
    this.server.add_endpoints(endpoints, preprocessor)
  }

  getAuthorizedPreprocessor() {
    return this.authorized
  }

  getAnonymousPreprocessor() {
    return this.anonymous
  }

  start() {
    return this.server.start(this.village.getPublicConfig().api)
  }

  stop() {
    return this.server.stop()
  }

  getUserManager() {
    return this.userManager
  }

  getUserService() {
    return this.userService
  }

  getLawnService(): lawn.Server {
    return this.server
  }

  getVillage(): GenericVillage<Model, PrivateConfig> {
    return this.village
  }
}