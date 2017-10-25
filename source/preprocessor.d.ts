import { Request, Request_Processor, Version } from 'vineyard-lawn';
import { UserService } from "vineyard-users";
export declare class Preprocessor {
    versions: Version[];
    constructor(versions: Version[]);
    checkVersion(request: Request): void;
    common(request: Request): Promise<Request>;
    createAnonymous(): Request_Processor;
    createAuthorized(userService: UserService): Request_Processor;
}
