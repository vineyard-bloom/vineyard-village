"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vineyard_lawn_1 = require("vineyard-lawn");
var Preprocessor = (function () {
    function Preprocessor(versions) {
        if (!versions.length)
            throw new Error('Preprocessor.versions array cannot be empty.');
        this.versions = versions;
    }
    Preprocessor.prototype.checkVersion = function (request) {
        var version = request.data['version'];
        if (!version)
            throw new vineyard_lawn_1.Bad_Request("Missing version property.");
        if (!this.versions.some(function (v) { return v.equals(version); }))
            throw new vineyard_lawn_1.Bad_Request("Unsupported version number");
    };
    Preprocessor.prototype.common = function (request) {
        this.checkVersion(request);
        return Promise.resolve(request);
    };
    Preprocessor.prototype.createAnonymous = function () {
        var _this = this;
        return function (request) { return _this.common(request); };
    };
    Preprocessor.prototype.createAuthorized = function (userService) {
        var _this = this;
        return function (request) { return _this.common(request)
            .then(function (request) {
            userService.require_logged_in(request);
            return request;
        }); };
    };
    return Preprocessor;
}());
exports.Preprocessor = Preprocessor;
//# sourceMappingURL=preprocessor.js.map