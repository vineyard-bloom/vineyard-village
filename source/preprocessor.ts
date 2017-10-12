import {Request, Bad_Request, Request_Processor, Version} from 'vineyard-lawn'
import {UserService} from "vineyard-users";

export class Preprocessor {
  versions: Version []

  constructor(versions: Version []) {
    if (!versions.length)
      throw new Error('Preprocessor.versions array cannot be empty.')

    this.versions = versions
  }

  checkVersion(request: Request) {
    // const versionString = request.data['version']
    // if (!versionString)
    //   throw new Bad_Request("Missing version property.")
    //
    // const version = new Version(versionString)

    const version = request.version
    if (!version)
      throw new Bad_Request("Missing version property.")

    if (!this.versions.some(v => v.equals(version)))
      throw new Bad_Request("Unsupported version number")
  }

  common(request: Request): Promise<Request> {
    this.checkVersion(request)
    return Promise.resolve(request)
  }

  createAnonymous(): Request_Processor {
    return request => this.common(request)
  }

  createAuthorized(userService: UserService): Request_Processor {
    return request => this.common(request)
      .then(request => {
        userService.require_logged_in(request)
        return request
      })
  }
}