"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lawn = require("vineyard-lawn");
const vineyard_users_1 = require("vineyard-users");
const vineyard_lawn_1 = require("vineyard-lawn");
const preprocessor_1 = require("./preprocessor");
class GenericWebService {
    constructor(village, versions) {
        this.village = village;
        this.userModel = village.getModel().User;
        this.versions = versions;
        this.preprocessor = new preprocessor_1.Preprocessor(this.versions);
        this.server = new lawn.Server(undefined, undefined);
        this.server.enableCors();
        this.server.getApp().enable('trust proxy'); // Added for IP tracking through proxies
        this.userManager = new vineyard_users_1.UserManager(this.village.getModel().db, {
            user_model: this.userModel,
            model: this.village.getModel()
        });
        // Backwards compatibility.  privateConfig.cookies is deprecated
        const privateConfig = this.village.getPrivateConfig();
        const cookies = privateConfig.api
            ? privateConfig.api.cookies
            : privateConfig.cookies;
        if (!cookies)
            throw new Error("Missing api.cookies config.");
        this.userService = new vineyard_users_1.UserService(this.server.getApp(), this.userManager, cookies);
        this.authorized = this.preprocessor.createAuthorized(this.userService);
        this.anonymous = this.preprocessor.createAnonymous();
        this.userService.loadValidationHelpers(this.server.getApiSchema());
    }
    initialize_endpoints() {
        this.createPublicEndpoints([
            {
                method: vineyard_lawn_1.Method.post,
                path: "user/login",
                action: this.userService.loginWithUsername
            },
        ]);
        this.createAuthorizedEndpoints([
            {
                method: vineyard_lawn_1.Method.post,
                path: "user/logout",
                action: this.userService.logout
            },
        ]);
    }
    compileApiSchema(schema) {
        return this.server.compileApiSchema(schema);
    }
    addApiSchemaHelper(schema) {
        this.server.addApiSchemaHelper(schema);
    }
    createPublicEndpoints(endpoints) {
        this.server.add_endpoints(endpoints, this.anonymous);
    }
    createAuthorizedEndpoints(endpoints) {
        this.server.add_endpoints(endpoints, this.authorized);
    }
    createEndpoints(endpoints, preprocessor) {
        this.server.add_endpoints(endpoints, preprocessor);
    }
    getAuthorizedPreprocessor() {
        return this.authorized;
    }
    getAnonymousPreprocessor() {
        return this.anonymous;
    }
    start() {
        return this.server.start(this.village.getPublicConfig().api);
    }
    stop() {
        return this.server.stop();
    }
    getUserManager() {
        return this.userManager;
    }
    getUserService() {
        return this.userService;
    }
    getLawnService() {
        return this.server;
    }
    getVillage() {
        return this.village;
    }
}
exports.GenericWebService = GenericWebService;
//# sourceMappingURL=generic-web-service.js.map