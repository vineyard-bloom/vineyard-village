"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function findPackageDirectory(originalPath) {
    var currentPath = originalPath;
    while (!fs.existsSync(path.join(currentPath, 'package.json'))) {
        var nextPath = path.resolve(currentPath, '..');
        if (nextPath == currentPath)
            return null;
        currentPath = nextPath;
    }
    return currentPath;
}
function listModules() {
    var currentModule = module;
    var result = [];
    while (currentModule != null) {
        result.unshift(currentModule);
        currentModule = currentModule.parent;
    }
    return result;
}
function getRootPath() {
    var modules = listModules();
    for (var i = 0; i < modules.length; ++i) {
        var packageDirectory = findPackageDirectory(path.dirname(modules[i].filename));
        if (packageDirectory) {
            if (fs.existsSync(path.join(packageDirectory, 'config'))) {
                return packageDirectory;
            }
        }
    }
    throw new Error("Could not find application root.");
}
exports.getRootPath = getRootPath;
//# sourceMappingURL=utility.js.map