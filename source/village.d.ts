import { Modeler } from "vineyard-ground";
export interface ModelInterface {
    ground: any;
    db: any;
    User: any;
}
export interface PrivateConfig {
}
export interface PublicConfig {
}
export interface VillageSettings {
    privateConfig: PrivateConfig;
    publicConfig: PublicConfig;
    schema: any;
}
export declare class GenericVillage<Model extends ModelInterface> {
    private model;
    private privateConfig;
    private publicConfig;
    constructor(settings: VillageSettings);
    private createModel(schema);
    getModel(): Model;
    getPrivateConfig(): any;
    getPublicConfig(): any;
    getGround(): Modeler;
}
