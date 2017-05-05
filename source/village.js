"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vineyard_ground_1 = require("vineyard-ground");
var sequelize = require("sequelize");
var utility_1 = require("./utility");
var Village = (function () {
    function Village() {
        this.rootPath = utility_1.getRootPath().replace('\\', '/');
        this.secrets = this.load('config/secrets.json');
        this.general = this.load('config/general.json');
        this.model = this.createModel(this.load('src/model/schema.json'));
    }
    Village.prototype.load = function (filename) {
        return require(this.rootPath + '/' + filename);
    };
    Village.prototype.getModel = function () {
        return this.model;
    };
    Village.prototype.getSecrets = function () {
        return this.secrets;
    };
    Village.prototype.getGeneral = function () {
        return this.general;
    };
    Village.prototype.getGround = function () {
        return this.model.ground;
    };
    Village.prototype.createModel = function (schema) {
        var db = new sequelize(this.secrets.database);
        var modeler = new vineyard_ground_1.Modeler(db, schema);
        var model = Object.assign({
            ground: modeler,
            db: db
        }, modeler.collections);
        return model;
    };
    return Village;
}());
exports.Village = Village;
//# sourceMappingURL=village.js.map