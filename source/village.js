"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vineyard_ground_1 = require("vineyard-ground");
var sequelize = require("sequelize");
var GenericVillage = (function () {
    function GenericVillage(settings) {
        this.privateConfig = settings.privateConfig;
        this.publicConfig = settings.publicConfig;
        this.model = this.createModel(settings.schema);
    }
    GenericVillage.prototype.createModel = function (schema) {
        var db = new sequelize(this.privateConfig.database);
        var modeler = new vineyard_ground_1.Modeler(db, schema);
        var model = Object.assign({
            ground: modeler,
            db: db
        }, modeler.collections);
        return model;
    };
    GenericVillage.prototype.getModel = function () {
        return this.model;
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