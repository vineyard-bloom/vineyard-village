import {ModelInterface, Village} from "./village";
import * as lawn from 'vineyard-lawn'
import {UserManager, UserService} from "vineyard-users"
import * as preprocessor from './preprocessor'
import {Method} from "vineyard-lawn";

export class WebService<Model extends ModelInterface> {
  village: Village<Model>
  private server: lawn.Server
  private userManager: UserManager
  private userService: UserService
  private userModel

  constructor(village: Village<Model>, userModel) {
    this.village = village
    this.userModel = userModel
    this.server = new lawn.Server()
    this.server.enable_cors()
  }

  initializePublicEndpoints() {

    const anonymous = preprocessor.createAnonymous()

    this.server.add_endpoints([

      {
        method: Method.post,
        path: "user/login",
        action: this.userService.create_login_handler()
      },

    ], anonymous)

  }

  initialize_authorized_endpoints() {

    this.server.add_endpoints([

      {
        method: Method.post,
        path: "user/logout",
        action: this.userService.create_logout_handler()
      },

    ], preprocessor.createAuthorized(this))
  }

  start(addressSource) {
    this.userManager = new UserManager(this.village.getModel().db, {
      user_model: this.userModel
    })

    this.userService = new UserService(this.server.get_app(), this.userManager, {
      secret: this.village.getSecrets().cookies.secret,
    })

    return this.server.start(this.village.getGeneral().api)
  }

}