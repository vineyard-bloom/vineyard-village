import { Modeler } from "vineyard-ground";
export interface ModelInterface {
    ground: any;
    db: any;
    User: any;
}
export interface DatabaseConfig {
    devMode?: boolean;
}
export interface CommonPrivateConfig {
    database: DatabaseConfig;
}
export interface PublicConfig {
}
export interface VillageSettings<PrivateConfig extends CommonPrivateConfig> {
    privateConfig: PrivateConfig;
    publicConfig: PublicConfig;
    schema: any;
}
export declare class GenericVillage<Model extends ModelInterface, PrivateConfig extends CommonPrivateConfig> {
    private model;
    private privateConfig;
    private publicConfig;
    constructor(settings: VillageSettings<PrivateConfig>);
    private createModel(schema);
    getModel(): Model;
    getPrivateConfig(): PrivateConfig;
    getPublicConfig(): PublicConfig;
    getGround(): Modeler;
}
