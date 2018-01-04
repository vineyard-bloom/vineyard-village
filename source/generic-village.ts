import {
  Modeler, DevModeler, PostgresClient, GeneralDatabaseConfig, SequelizeClient,
  DatabaseClient
} from "vineyard-ground"
import {loadAndCheckConfig, loadModelSchema} from "./utility";
import {CookieSettings} from 'vineyard-users';

export interface ModelInterface {
  ground: any
  db: any
  User: any
  Error: any
  Request: any
}

export type CommonModel = ModelInterface

export interface PrivateCookieConfig {
  secret: string
}

export interface VillageDatabaseConfig extends GeneralDatabaseConfig {
  devMode?: boolean
  logging?: boolean
}

export interface PrivateApiConfig {
  cookies: CookieSettings
}

export interface CommonConfig {
  database: VillageDatabaseConfig
  api?: PrivateApiConfig
  cookies?: CookieSettings // Deprecated.  Use api.cookies instead.
}

export type CommonPrivateConfig = CommonConfig
// export interface CommonPrivateConfig {
//   // database: DatabaseConfig
//   // api?: PrivateApiConfig
//   // cookies?: PrivateCookieConfig // Deprecated.  Use api.cookies instead.
// }

export interface PublicConfig {
  api: any
}

export interface VillageSettings<Config extends CommonConfig> {
  privateConfig?: Config // Deprecated
  publicConfig?: PublicConfig // Deprecated
  schema?: any
  config?: CommonConfig
}

export class GenericVillage<Model extends CommonModel, Config extends CommonConfig> {
  private model: Model
  private privateConfig: Config
  private publicConfig: PublicConfig
  private config: CommonConfig | undefined

  constructor(settings?: VillageSettings<Config>, client?: DatabaseClient) {
    if (!settings) {
      settings = {
        schema: loadModelSchema<Model>(),
        config: loadAndCheckConfig<Config>(),
      }
    }

    this.privateConfig = (settings.privateConfig || settings.config) as any
    this.publicConfig = (settings.publicConfig || settings.config) as any
    this.config = settings.config
    this.model = this.createModel(settings.schema || {}, client)
  }

  private createModel(schema: any, client: DatabaseClient = new SequelizeClient(this.privateConfig.database)): Model {
    const databaseConfig = this.privateConfig.database

    const modeler = !databaseConfig.devMode
      ? new Modeler(schema, client)
      : new DevModeler(schema, client)

    const model = Object.assign({
      ground: modeler,
      db: modeler.getLegacyDatabaseInterface(),
    }, modeler.collections) as any
    return model
  }

  getModel(): Model {
    return this.model
  }

  getPrivateConfig() {
    return this.privateConfig
  }

  getConfig() {
    return this.privateConfig
  }

  getPublicConfig() {
    return this.publicConfig
  }

  getGround(): Modeler {
    return this.model.ground
  }

}