"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vineyard_ground_1 = require("vineyard-ground");
const utility_1 = require("./utility");
class GenericVillage {
    constructor(settings, client) {
        if (!settings) {
            settings = {
                schema: utility_1.loadModelSchema(),
                config: utility_1.loadAndCheckConfig(),
            };
        }
        this.privateConfig = (settings.privateConfig || settings.config);
        this.publicConfig = (settings.publicConfig || settings.config);
        this.config = settings.config;
        this.model = this.createModel(settings.schema || {}, client);
    }
    createModel(schema, client = new vineyard_ground_1.SequelizeClient(this.privateConfig.database)) {
        const databaseConfig = this.privateConfig.database;
        const modeler = !databaseConfig.devMode
            ? new vineyard_ground_1.Modeler(schema, client)
            : new vineyard_ground_1.DevModeler(schema, client);
        const model = Object.assign({
            ground: modeler,
            db: modeler.getLegacyDatabaseInterface(),
        }, modeler.collections);
        return model;
    }
    getModel() {
        return this.model;
    }
    getPrivateConfig() {
        return this.privateConfig;
    }
    getConfig() {
        return this.privateConfig;
    }
    getPublicConfig() {
        return this.publicConfig;
    }
    getGround() {
        return this.model.ground;
    }
}
exports.GenericVillage = GenericVillage;
//# sourceMappingURL=generic-village.js.map