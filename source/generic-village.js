"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vineyard_ground_1 = require("vineyard-ground");
var utility_1 = require("./utility");
var GenericVillage = (function () {
    function GenericVillage(settings, client) {
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
    GenericVillage.prototype.createModel = function (schema, client) {
        if (client === void 0) { client = new vineyard_ground_1.SequelizeClient(this.privateConfig.database); }
        var databaseConfig = this.privateConfig.database;
        var modeler = !databaseConfig.devMode
            ? new vineyard_ground_1.Modeler(schema, client)
            : new vineyard_ground_1.DevModeler(schema, client);
        var model = Object.assign({
            ground: modeler,
            db: modeler.getLegacyDatabaseInterface(),
        }, modeler.collections);
        return model;
    };
    GenericVillage.prototype.getModel = function () {
        return this.model;
    };
    GenericVillage.prototype.getPrivateConfig = function () {
        return this.privateConfig;
    };
    GenericVillage.prototype.getConfig = function () {
        return this.privateConfig;
    };
    GenericVillage.prototype.getPublicConfig = function () {
        return this.publicConfig;
    };
    GenericVillage.prototype.getGround = function () {
        return this.model.ground;
    };
    return GenericVillage;
}());
exports.GenericVillage = GenericVillage;
//# sourceMappingURL=generic-village.js.map