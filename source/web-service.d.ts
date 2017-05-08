import { ModelInterface, GenericVillage } from "./village";
import { UserManager } from "vineyard-users";
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
    createPublicEndpoints(endpoints: any): void;
    createAuthorizedEndpoints(endpoints: any): void;
    start(): Promise<void>;
    getUserManager(): UserManager;
}
