"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lawn = require("vineyard-lawn");
var vineyard_users_1 = require("vineyard-users");
var vineyard_lawn_1 = require("vineyard-lawn");
var preprocessor_1 = require("./preprocessor");
var vineyard_lawn_logging_1 = require("vineyard-lawn-logging");
var GenericWebService = (function () {
    function GenericWebService(village, versions) {
        this.village = village;
        this.userModel = village.getModel().User;
        this.versions = versions;
        this.preprocessor = new preprocessor_1.Preprocessor(this.versions);
        this.requestLogger = new vineyard_lawn_logging_1.CommonRequestLogger(village.getModel().Request, this.village.getErrorLogger());
        this.server = new lawn.Server(null, this.requestLogger);
        this.server.enable_cors();
        this.server.get_app().enable('trust proxy'); // Added for IP tracking through proxies
        this.userManager = new vineyard_users_1.UserManager(this.village.getModel().db, {
            user_model: this.userModel,
            model: this.village.getModel()
        });
        // Backwards compatibility.  privateConfig.cookies is deprecated
        var privateConfig = this.village.getPrivateConfig();
        var cookies = privateConfig.api
            ? privateConfig.api.cookies
            : privateConfig.cookies;
        this.userService = new vineyard_users_1.UserService(this.server.get_app(), this.userManager, cookies);
        this.authorized = this.preprocessor.createAuthorized(this.userService);
        this.anonymous = this.preprocessor.createAnonymous();
        this.userService.loadValidationHelpers(this.server.getApiSchema());
    }
    GenericWebService.prototype.initialize_endpoints = function () {
        this.createPublicEndpoints([
            {
                method: vineyard_lawn_1.Method.post,
                path: "user/login",
                action: this.userService.create_login_handler()
            },
        ]);
        this.createAuthorizedEndpoints([
            {
                method: vineyard_lawn_1.Method.post,
                path: "user/logout",
                action: this.userService.create_logout_handler()
            },
        ]);
    };
    GenericWebService.prototype.compileApiSchema = function (schema) {
        return this.server.compileApiSchema(schema);
    };
    GenericWebService.prototype.addApiSchemaHelper = function (schema) {
        this.server.addApiSchemaHelper(schema);
    };
    GenericWebService.prototype.createPublicEndpoints = function (endpoints) {
        this.server.add_endpoints(endpoints, this.anonymous);
    };
    GenericWebService.prototype.createAuthorizedEndpoints = function (endpoints) {
        this.server.add_endpoints(endpoints, this.authorized);
    };
    GenericWebService.prototype.createEndpoints = function (endpoints, preprocessor) {
        this.server.add_endpoints(endpoints, preprocessor);
    };
    GenericWebService.prototype.getAuthorizedPreprocessor = function () {
        return this.authorized;
    };
    GenericWebService.prototype.getAnonymousPreprocessor = function () {
        return this.anonymous;
    };
    GenericWebService.prototype.start = function () {
        return this.server.start(this.village.getPublicConfig().api);
    };
    GenericWebService.prototype.stop = function () {
        return this.server.stop();
    };
    GenericWebService.prototype.getUserManager = function () {
        return this.userManager;
    };
    GenericWebService.prototype.getUserService = function () {
        return this.userService;
    };
    GenericWebService.prototype.getLawnService = function () {
        return this.server;
    };
    GenericWebService.prototype.getVillage = function () {
        return this.village;
    };
    return GenericWebService;
}());
exports.GenericWebService = GenericWebService;
//# sourceMappingURL=generic-web-service.js.map