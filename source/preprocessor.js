"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vineyard_users_1 = require("vineyard-users");
var Preprocessor = (function (_super) {
    __extends(Preprocessor, _super);
    function Preprocessor(versions) {
        return _super.call(this, versions) || this;
    }
    return Preprocessor;
}(vineyard_users_1.LoggedInPreprocessor));
exports.Preprocessor = Preprocessor;
//# sourceMappingURL=preprocessor.js.map