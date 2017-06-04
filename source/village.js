"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vineyard_ground_1 = require("vineyard-ground");
var vineyard_error_logging_1 = require("vineyard-error-logging");
var vineyard_lawn_logging_1 = require("vineyard-lawn-logging");
var sequelize = require("sequelize");
var GenericVillage = (function () {
    function GenericVillage(settings) {
        this.privateConfig = settings.privateConfig;
        this.publicConfig = settings.publicConfig;
        this.model = this.createModel(settings.schema);
        this.errorLogger = new vineyard_error_logging_1.StandardErrorLogger(this.model.Error);
    }
    GenericVillage.prototype.createModel = function (schema) {
        var databaseConfig = this.privateConfig.database;
        var db = new sequelize(databaseConfig);
        var modeler = !databaseConfig.devMode
            ? new vineyard_ground_1.Modeler(db, schema)
            : new vineyard_ground_1.DevModeler(db, schema);
        vineyard_error_logging_1.initializeErrorLogSchema(modeler);
        vineyard_lawn_logging_1.initializeRequestLogSchema(modeler);
        var model = Object.assign({
            ground: modeler,
            db: db
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
    GenericVillage.prototype.getPublicConfig = function () {
        return this.publicConfig;
    };
    GenericVillage.prototype.getGround = function () {
        return this.model.ground;
    };
    return GenericVillage;
}());
exports.GenericVillage = GenericVillage;
//# sourceMappingURL=village.js.map