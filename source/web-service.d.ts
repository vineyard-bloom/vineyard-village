import { ModelInterface, GenericVillage } from "./village";
import * as lawn from 'vineyard-lawn';
import { UserManager, UserService } from "vineyard-users";
import { Version } from "vineyard-lawn";
export declare class GenericWebService<Model extends ModelInterface> {
    village: GenericVillage<Model>;
    private server;
    private userManager;
    private userService;
    private userModel;
    private versions;
    private preprocessor;
    private anonymous;
    private authorized;
    constructor(village: GenericVillage<Model>, versions: Version[]);
    private initialize_endpoints();
    compileApiSchema(schema: any): {};
    createPublicEndpoints(endpoints: any): void;
    createAuthorizedEndpoints(endpoints: any): void;
    createEndpoints(endpoints: any, preprocessor: any): void;
    getAuthorizedPreprocessor(): any;
    getAnonymousPreprocessor(): any;
    start(): Promise<void>;
    getUserManager(): UserManager;
    getUserService(): UserService;
    getLawnService(): lawn.Server;
}
