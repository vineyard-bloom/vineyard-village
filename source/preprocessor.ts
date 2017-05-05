import {Request, Bad_Request, Request_Processor} from 'vineyard-lawn'
import {UserManager, UserService} from "../model/users";

function checkVersion(request: Request) {
  const version = request.data['version']
  if (!version)
    throw new Bad_Request("Missing version property.")

  if (!version.match(/^1\.0/))
    throw new Bad_Request("Unsupported version number")
}

function common(request): Promise<Request> {
  checkVersion(request)
  return Promise.resolve(request)
}

export function createAnonymous(): Request_Processor {
  return request => common(request)
}

export function createAuthorized(userService: UserService): Request_Processor {
  return request => common(request)
    .then(request => {
      userService.requireLoggedIn(request)
      return request
    })
}