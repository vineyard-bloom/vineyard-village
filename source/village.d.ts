import { Modeler } from "vineyard-ground";
import { StandardErrorLogger } from "vineyard-error-logging";
export interface ModelInterface {
    ground: any;
    db: any;
    User: any;
    Error: any;
    Request: any;
}
export interface DatabaseConfig {
    devMode?: boolean;
}
export interface PrivateCookieConfig {
    secret: string;
}
export interface PrivateApiConfig {
    cookies: PrivateCookieConfig;
}
export interface CommonPrivateConfig {
    database: DatabaseConfig;
    api?: PrivateApiConfig;
    cookies?: PrivateCookieConfig;
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
    private errorLogger;
    constructor(settings: VillageSettings<PrivateConfig>);
    private createModel(schema);
    getModel(): Model;
    getErrorLogger(): StandardErrorLogger;
    getPrivateConfig(): PrivateConfig;
    getPublicConfig(): PublicConfig;
    getGround(): Modeler;
}
