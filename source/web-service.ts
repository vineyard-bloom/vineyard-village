import {ModelInterface, GenericVillage, CommonPrivateConfig} from "./village";
import * as lawn from 'vineyard-lawn'
import {UserManager, UserService} from "vineyard-users"
import {Method, Version} from "vineyard-lawn";
import {Preprocessor} from "./preprocessor";
import {CommonRequestLogger} from "vineyard-lawn-logging"

export class GenericWebService<Model extends ModelInterface, PrivateConfig extends CommonPrivateConfig> {
  village: GenericVillage<Model, CommonPrivateConfig>
  private server: lawn.Server
  private userManager: UserManager
  private userService: UserService
  private userModel
  private versions
  private preprocessor: Preprocessor
  private anonymous
  private authorized
  private requestLogger: CommonRequestLogger

  constructor(village: GenericVillage<Model, CommonPrivateConfig>, versions: Version[]) {
    this.village = village
    this.userModel = village.getModel().User
    this.versions = versions
    this.preprocessor = new Preprocessor(this.versions)
    this.requestLogger = new CommonRequestLogger(village.getModel().Request, this.village.getErrorLogger())
    this.server = new lawn.Server(null, this.requestLogger)
    this.server.enable_cors()

    this.userManager = new UserManager(this.village.getModel().db, {
      user_model: this.userModel
    })

    // Backwards compatibility.  privateConfig.cookies is deprecated
    const privateConfig = this.village.getPrivateConfig()
    const cookies = privateConfig.api
      ? privateConfig.api.cookies
      : privateConfig.cookies

    this.userService = new UserService(this.server.get_app(), this.userManager, {
      secret: cookies.secret,
    })

    this.authorized = this.preprocessor.createAuthorized(this.userService)
    this.anonymous = this.preprocessor.createAnonymous()
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

  compileApiSchema(schema) {
    return this.server.compileApiSchema(schema)
  }

  createPublicEndpoints(endpoints) {
    this.server.add_endpoints(endpoints, this.anonymous)
  }

  createAuthorizedEndpoints(endpoints) {
    this.server.add_endpoints(endpoints, this.authorized)
  }

  createEndpoints(endpoints, preprocessor) {
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

  getUserManager() {
    return this.userManager
  }

  getUserService() {
    return this.userService
  }

  getLawnService(): lawn.Server {
    return this.server
  }
}