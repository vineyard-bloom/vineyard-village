import {Modeler, DevModeler} from "vineyard-ground"
import {StandardErrorLogger, initializeErrorLogSchema} from "vineyard-error-logging"
import {initializeRequestLogSchema} from "vineyard-lawn-logging"

const sequelize = require("sequelize")

export interface ModelInterface {
  ground
  db
  User
  Error
  Request
}

export interface DatabaseConfig {
  devMode?: boolean
}

export interface PrivateCookieConfig {
  secret: string
}

export interface PrivateApiConfig {
  cookies: PrivateCookieConfig
}

export interface CommonPrivateConfig {
  database: DatabaseConfig
  api?: PrivateApiConfig
  cookies?: PrivateCookieConfig // Deprecated.  Use api.cookies instead.
}

export interface PublicConfig {

}

export interface VillageSettings<PrivateConfig extends CommonPrivateConfig> {
  privateConfig: PrivateConfig
  publicConfig: PublicConfig
  schema: any
}

export class GenericVillage<Model extends ModelInterface, PrivateConfig extends CommonPrivateConfig> {
  private model: Model
  private privateConfig: PrivateConfig
  private publicConfig: PublicConfig
  private errorLogger: StandardErrorLogger

  constructor(settings: VillageSettings<PrivateConfig>) {
    this.privateConfig = settings.privateConfig
    this.publicConfig = settings.publicConfig
    this.model = this.createModel(settings.schema)
    this.errorLogger = new StandardErrorLogger(this.model.Error)
  }

  private createModel(schema): Model {
    const databaseConfig = this.privateConfig.database
    const db = new sequelize(databaseConfig)
    const modeler = !databaseConfig.devMode
      ? new Modeler(db, schema)
      : new DevModeler(db, schema)

    initializeErrorLogSchema(modeler)
    initializeRequestLogSchema(modeler)

    const model = Object.assign({
      ground: modeler,
      db: db
    }, modeler.collections)
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

  getPublicConfig() {
    return this.publicConfig
  }

  getGround(): Modeler {
    return this.model.ground
  }

}