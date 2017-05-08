import {ModelInterface, GenericVillage} from "./village";
import * as lawn from 'vineyard-lawn'
import {UserManager, UserService} from "vineyard-users"
import {Method, Version} from "vineyard-lawn";
import {Preprocessor} from "./preprocessor";

export class GenericWebService<Model extends ModelInterface> {
  village: GenericVillage<Model>
  private server: lawn.Server
  private userManager: UserManager
  private userService: UserService
  private userModel
  private versions
  private preprocessor: Preprocessor
  private anonymous
  private authorized

  constructor(village: GenericVillage<Model>, versions: Version[]) {
    this.village = village
    this.userModel = village.getModel().User
    this.versions = versions
    this.preprocessor = new Preprocessor(this.versions)
    this.server = new lawn.Server()
    this.server.enable_cors()

    this.userManager = new UserManager(this.village.getModel().db, {
      user_model: this.userModel
    })

    this.userService = new UserService(this.server.get_app(), this.userManager, {
      secret: this.village.getPrivateConfig().cookies.secret,
    })

    this.authorized = this.preprocessor.createAuthorized(this.userService)
    this.anonymous = this.preprocessor.createAnonymous()

    this.initialize_endpoints()
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

  createPublicEndpoints(endpoints) {
    this.server.add_endpoints(endpoints, this.anonymous)
  }

  createAuthorizedEndpoints(endpoints) {
    this.server.add_endpoints(endpoints, this.authorized)
  }

  start() {
    return this.server.start(this.village.getPublicConfig().api)
  }

  getUserManager() {
    return this.userManager
  }
}