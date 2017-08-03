import { Modeler } from "vineyard-ground";
import { StandardErrorLogger } from "vineyard-error-logging";
export interface ModelInterface {
    ground: any;
    db: any;
    User: any;
    Error: any;
    Request: any;
}
export declare type CommonModel = ModelInterface;
export interface DatabaseConfig {
    devMode?: boolean;
}
export interface PrivateCookieConfig {
    secret: string;
}
export interface PrivateApiConfig {
    cookies: PrivateCookieConfig;
}
export interface CommonConfig {
    database: DatabaseConfig;
    api?: PrivateApiConfig;
    cookies?: PrivateCookieConfig;
}
export declare type CommonPrivateConfig = CommonConfig;
export interface PublicConfig {
}
export interface VillageSettings<Config extends CommonConfig> {
    privateConfig?: Config;
    publicConfig?: PublicConfig;
    schema?: any;
    config?: CommonConfig;
}
export declare class GenericVillage<Model extends CommonModel, Config extends CommonConfig> {
    private model;
    private privateConfig;
    private publicConfig;
    private config;
    private errorLogger;
    constructor(settings?: VillageSettings<Config>);
    private createModel(schema);
    getModel(): Model;
    getErrorLogger(): StandardErrorLogger;
    getPrivateConfig(): Config;
    getConfig(): Config;
    getPublicConfig(): PublicConfig;
    getGround(): Modeler;
}
