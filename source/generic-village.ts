import {Modeler, DevModeler} from "vineyard-ground"
import {StandardErrorLogger, initializeErrorLogSchema} from "vineyard-error-logging"
import {initializeRequestLogSchema} from "vineyard-lawn-logging"
import {loadAndCheckConfig, loadModelSchema} from "./utility";

const sequelize = require("sequelize")

export interface ModelInterface {
  ground: any
  db: any
  User: any
  Error: any
  Request: any
}

export type CommonModel = ModelInterface

export interface DatabaseConfig {
  devMode?: boolean
  dialect?: string
}

export interface PrivateCookieConfig {
  secret: string
}

export interface PrivateApiConfig {
  cookies: PrivateCookieConfig
}

export interface CommonConfig {
  database: DatabaseConfig
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
    const db = new sequelize(databaseConfig)
    if (databaseConfig.dialect == 'postgres') {
      const usePostgres = require('vineyard-ground').usePostgres
      if (usePostgres)
        usePostgres(db, databaseConfig)
    }

    const modeler = !databaseConfig.devMode
      ? new Modeler(db, schema)
      : new DevModeler(db, schema)

    initializeErrorLogSchema(modeler)
    initializeRequestLogSchema(modeler)

    const model = Object.assign({
      ground: modeler,
      db: db
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