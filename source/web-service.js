"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lawn = require("vineyard-lawn");
var vineyard_users_1 = require("vineyard-users");
var vineyard_lawn_1 = require("vineyard-lawn");
var preprocessor_1 = require("./preprocessor");
var GenericWebService = (function () {
    function GenericWebService(village, versions) {
        this.village = village;
        this.userModel = village.getModel().User;
        this.versions = versions;
        this.preprocessor = new preprocessor_1.Preprocessor(this.versions);
        this.server = new lawn.Server();
        this.server.enable_cors();
        this.userManager = new vineyard_users_1.UserManager(this.village.getModel().db, {
            user_model: this.userModel
        });
        this.userService = new vineyard_users_1.UserService(this.server.get_app(), this.userManager, {
            secret: this.village.getPrivateConfig().cookies.secret,
        });
        this.authorized = this.preprocessor.createAuthorized(this.userService);
        this.anonymous = this.preprocessor.createAnonymous();
        this.initialize_endpoints();
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
    GenericWebService.prototype.createPublicEndpoints = function (endpoints) {
        this.server.add_endpoints(endpoints, this.anonymous);
    };
    GenericWebService.prototype.createAuthorizedEndpoints = function (endpoints) {
        this.server.add_endpoints(endpoints, this.authorized);
    };
    GenericWebService.prototype.start = function () {
        return this.server.start(this.village.getPublicConfig().api);
    };
    GenericWebService.prototype.getUserManager = function () {
        return this.userManager;
    };
    return GenericWebService;
}());
exports.GenericWebService = GenericWebService;
//# sourceMappingURL=web-service.js.map