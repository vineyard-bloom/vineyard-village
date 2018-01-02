import {Modeler, DevModeler, PostgresClient, GeneralDatabaseConfig, SequelizeClient} from "vineyard-ground"
import {StandardErrorLogger, initializeErrorLogSchema} from "vineyard-error-logging"
import {initializeRequestLogSchema} from "vineyard-lawn-logging"
import {loadAndCheckConfig, loadModelSchema} from "./utility";

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
}

export interface PrivateApiConfig {
  cookies: PrivateCookieConfig
}

export interface CommonConfig {
  database: VillageDatabaseConfig
  api?: PrivateApiConfig
  cookies?: PrivateCookieConfig // Deprecated.  Use api.cookies instead.
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
  private errorLogger: StandardErrorLogger

  constructor(settings?: VillageSettings<Config>) {
    if (!settings) {
      settings = {
        schema: loadModelSchema<Model>(),
        config: loadAndCheckConfig<Config>(),
      }
    }
    this.privateConfig = (settings.privateConfig || settings.config) as any
    this.publicConfig = (settings.publicConfig || settings.config) as any
    this.config = settings.config
    this.model = this.createModel(settings.schema || {})
    this.errorLogger = new StandardErrorLogger(this.model.Error)
  }

  private createModel(schema: any): Model {
    const databaseConfig = this.privateConfig.database

    const client = databaseConfig.dialect == 'postgres'
      ? new PostgresClient(databaseConfig)
      : new SequelizeClient(databaseConfig)


    const modeler = !databaseConfig.devMode
      ? new Modeler(schema, client)
      : new DevModeler(schema, client)

    initializeErrorLogSchema(modeler)
    initializeRequestLogSchema(modeler)

    const model = Object.assign({
      ground: modeler,
      db: modeler.getLegacyDatabaseInterface(),
    }, modeler.collections) as any
    return model
  }

  getModel(): Model {
    return this.model
  }

  getErrorLogger(): StandardErrorLogger {
    return this.errorLogger
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