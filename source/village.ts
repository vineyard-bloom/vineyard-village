import {Modeler} from "vineyard-ground"
import * as sequelize from "sequelize";
import {getRootPath} from "./utility";

// const secrets = require('../../config/secrets.json')
// const general = require('../../config/general.json')

export interface ModelInterface {
  ground
  db
  User
}

export class Village<Model extends ModelInterface> {

  private model: Model
  private db
  private secrets
  private general
  private rootPath

  constructor() {
    this.rootPath = getRootPath().replace('\\', '/')
    this.secrets = this.load('config/secrets.json')
    this.general = this.load('config/general.json')
    this.model = this.createModel(this.load('src/model/schema.json'))
  }

  load(filename): any {
    return require(this.rootPath + '/' + filename)
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