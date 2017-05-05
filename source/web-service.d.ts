import { ModelInterface, Village } from "./village";
import { Version } from "vineyard-lawn";
export declare class WebService<Model extends ModelInterface> {
    village: Village<Model>;
    private server;
    private userManager;
    private userService;
    private userModel;
    private versions;
    private preprocessor;
    private anonymous;
    private authorized;
    constructor(village: Village<Model>, versions: Version[]);
    private initialize_endpoints();
    createPublicEndpoints(endpoints: any): void;
    createAuthorizedEndpoints(endpoints: any): void;
    start(addressSource: any): Promise<void>;
}
