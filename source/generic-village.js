"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vineyard_ground_1 = require("vineyard-ground");
var vineyard_error_logging_1 = require("vineyard-error-logging");
var vineyard_lawn_logging_1 = require("vineyard-lawn-logging");
var utility_1 = require("./utility");
var GenericVillage = /** @class */ (function () {
    function GenericVillage(settings) {
        if (!settings) {
            settings = {
                schema: utility_1.loadModelSchema(),
                config: utility_1.loadAndCheckConfig(),
            };
        }
        this.privateConfig = (settings.privateConfig || settings.config);
        this.publicConfig = (settings.publicConfig || settings.config);
        this.config = settings.config;
        this.model = this.createModel(settings.schema || {});
        this.errorLogger = new vineyard_error_logging_1.StandardErrorLogger(this.model.Error);
    }
    GenericVillage.prototype.createModel = function (schema) {
        var databaseConfig = this.privateConfig.database;
        var client = databaseConfig.dialect == 'postgres'
            ? new vineyard_ground_1.PostgresClient(databaseConfig)
            : new vineyard_ground_1.SequelizeClient(databaseConfig);
        var modeler = !databaseConfig.devMode
            ? new vineyard_ground_1.Modeler(schema, client)
            : new vineyard_ground_1.DevModeler(schema, client);
        vineyard_error_logging_1.initializeErrorLogSchema(modeler);
        vineyard_lawn_logging_1.initializeRequestLogSchema(modeler);
        var model = Object.assign({
            ground: modeler,
            db: modeler.getLegacyDatabaseInterface(),
        }, modeler.collections);
        return model;
    };
    GenericVillage.prototype.getModel = function () {
        return this.model;
    };
    GenericVillage.prototype.getErrorLogger = function () {
        return this.errorLogger;
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