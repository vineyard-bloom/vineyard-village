import { Request_Processor } from 'vineyard-lawn';
import { UserService } from "../model/users";
export declare function createAnonymous(): Request_Processor;
export declare function createAuthorized(userService: UserService): Request_Processor;
