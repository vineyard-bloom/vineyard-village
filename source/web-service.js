"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lawn = require("vineyard-lawn");
var vineyard_users_1 = require("vineyard-users");
var vineyard_lawn_1 = require("vineyard-lawn");
var preprocessor_1 = require("./preprocessor");
var WebService = (function () {
    function WebService(village, versions) {
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
            secret: this.village.getSecrets().cookies.secret,
        });
        this.authorized = this.preprocessor.createAuthorized(this.userService);
        this.anonymous = this.preprocessor.createAnonymous();
    }
    WebService.prototype.initialize_endpoints = function () {
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
    WebService.prototype.createPublicEndpoints = function (endpoints) {
        this.server.add_endpoints(endpoints, this.anonymous);
    };
    WebService.prototype.createAuthorizedEndpoints = function (endpoints) {
        this.server.add_endpoints(endpoints, this.authorized);
    };
    WebService.prototype.start = function (addressSource) {
        return this.server.start(this.village.getGeneral().api);
    };
    return WebService;
}());
exports.WebService = WebService;
//# sourceMappingURL=web-service.js.map