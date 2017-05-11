"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
function requestPromise(options) {
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (error)
                reject(error);
            else if (response.statusCode < 200 || response.statusCode >= 300)
                reject(new Error(response.statusCode + " " + response.statusMessage + ": " + JSON.stringify(options)));
            else
                resolve(body);
        });
    });
}
exports.requestPromise = requestPromise;
//# sourceMappingURL=request-promise.js.map