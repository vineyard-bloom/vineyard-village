"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vineyard_lawn_1 = require("vineyard-lawn");
function checkVersion(request) {
    var version = request.data['version'];
    if (!version)
        throw new vineyard_lawn_1.Bad_Request("Missing version property.");
    if (!version.match(/^1\.0/))
        throw new vineyard_lawn_1.Bad_Request("Unsupported version number");
}
function common(request) {
    checkVersion(request);
    return Promise.resolve(request);
}
function createAnonymous() {
    return function (request) { return common(request); };
}
exports.createAnonymous = createAnonymous;
function createAuthorized(userService) {
    return function (request) { return common(request)
        .then(function (request) {
        userService.requireLoggedIn(request);
        return request;
    }); };
}
exports.createAuthorized = createAuthorized;
//# sourceMappingURL=preprocessor.js.map