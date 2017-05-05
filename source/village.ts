import {Modeler} from "vineyard-ground"
import * as sequelize from "sequelize";

// const secrets = require('../../config/secrets.json')
// const general = require('../../config/general.json')

export interface ModelInterface {
  ground
  db
}

export class Village<Model extends ModelInterface> {

  private model: Model
  private db
  private secrets
  private general

  constructor(secrets, general, schema) {
    this.secrets = secrets
    this.general = general
    this.model = this.createModel(schema)
  }

  getModel(): Model {
    return this.model
  }

  getSecrets() {
    return this.secrets
  }

  getGeneral() {
    return this.general
  }

  getGround(): Modeler {
    return this.model.ground
  }

  createModel(schema) {
    const db = new sequelize(this.secrets.database)
    const modeler = new Modeler(db, schema)
    const model = Object.assign({
      ground: modeler,
      db: db
    }, modeler.collections)
    return model
  }
}