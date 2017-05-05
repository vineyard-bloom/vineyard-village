"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lawn = require("vineyard-lawn");
var vineyard_users_1 = require("vineyard-users");
var preprocessor = require("./preprocessor");
var vineyard_lawn_1 = require("vineyard-lawn");
var WebService = (function () {
    function WebService(village, userModel) {
        this.village = village;
        this.userModel = userModel;
        this.server = new lawn.Server();
        this.server.enable_cors();
    }
    WebService.prototype.initializePublicEndpoints = function () {
        var anonymous = preprocessor.createAnonymous();
        this.server.add_endpoints([
            {
                method: vineyard_lawn_1.Method.post,
                path: "user/login",
                action: this.userService.create_login_handler()
            },
        ], anonymous);
    };
    WebService.prototype.initialize_authorized_endpoints = function () {
        this.server.add_endpoints([
            {
                method: vineyard_lawn_1.Method.post,
                path: "user/logout",
                action: this.userService.create_logout_handler()
            },
        ], preprocessor.createAuthorized(this));
    };
    WebService.prototype.start = function (addressSource) {
        this.userManager = new vineyard_users_1.UserManager(this.village.getModel().db, {
            user_model: this.userModel
        });
        this.userService = new vineyard_users_1.UserService(this.server.get_app(), this.userManager, {
            secret: this.village.getSecrets().cookies.secret,
        });
        return this.server.start(this.village.getGeneral().api);
    };
    return WebService;
}());
exports.WebService = WebService;
//# sourceMappingURL=web-service.js.map