import { Modeler, GeneralDatabaseConfig, DatabaseClient } from "vineyard-ground";
import { StandardErrorLogger } from "vineyard-error-logging";
export interface ModelInterface {
    ground: any;
    db: any;
    User: any;
    Error: any;
    Request: any;
}
export declare type CommonModel = ModelInterface;
export interface PrivateCookieConfig {
    secret: string;
}
export interface VillageDatabaseConfig extends GeneralDatabaseConfig {
    devMode?: true;
}
export interface PrivateApiConfig {
    cookies: PrivateCookieConfig;
}
export interface CommonConfig {
    database: VillageDatabaseConfig;
    api?: PrivateApiConfig;
    cookies?: PrivateCookieConfig;
}
export declare type CommonPrivateConfig = CommonConfig;
export interface PublicConfig {
    api: any;
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
    constructor(settings?: VillageSettings<Config>, client?: DatabaseClient);
    private createModel(schema, client?);
    getModel(): Model;
    getErrorLogger(): StandardErrorLogger;
    getPrivateConfig(): Config;
    getConfig(): Config;
    getPublicConfig(): PublicConfig;
    getGround(): Modeler;
}
