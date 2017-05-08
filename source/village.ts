import {Modeler} from "vineyard-ground"
import * as sequelize from "sequelize";

export interface ModelInterface {
  ground
  db
  User
}

export interface PrivateConfig {

}

export interface PublicConfig {

}

export interface VillageSettings {
  privateConfig: PrivateConfig
  publicConfig: PublicConfig
  schema: any
}

export class GenericVillage<Model extends ModelInterface> {
  private model: Model
  private privateConfig
  private publicConfig

  constructor(settings: VillageSettings) {
    this.privateConfig = settings.privateConfig
    this.publicConfig = settings.publicConfig
    this.model = this.createModel(settings.schema)
  }

  private  createModel(schema): Model {
    const db = new sequelize(this.privateConfig.database)
    const modeler = new Modeler(db, schema)
    const model = Object.assign({
      ground: modeler,
      db: db
    }, modeler.collections)
    return model
  }

  getModel(): Model {
    return this.model
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