import { ModelInterface, Village } from "./village";
export declare class WebService<Model extends ModelInterface> {
    village: Village<Model>;
    private server;
    private userManager;
    private userService;
    private userModel;
    constructor(village: Village<Model>, userModel: any);
    initializePublicEndpoints(): void;
    initialize_authorized_endpoints(): void;
    start(addressSource: any): Promise<void>;
}
