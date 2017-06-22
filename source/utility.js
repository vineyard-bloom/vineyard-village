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
function compare(first, second, path, secondName) {
    var messages = [];
    for (var i in first) {
        var secondValue = second[i];
        if (secondValue === undefined) {
            var pathString = path.concat(i).join('.');
            messages.push(secondName + ' is missing ' + pathString);
        }
        var firstValue = first[i];
        if (firstValue && typeof firstValue === 'object') {
            messages = messages.concat(compare(firstValue, secondValue, path.concat(i), secondName));
        }
    }
    return messages;
}
function compareConfigs(firstName, first, secondName, second) {
    var messages = [].concat(compare(first, second, [], secondName), compare(second, first, [], firstName));
    if (messages.length > 0) {
        console.error("Config errors: ");
        for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
            var message = messages_1[_i];
            console.error("  ", message);
        }
        process.exit();
    }
}
exports.compareConfigs = compareConfigs;
//# sourceMappingURL=utility.js.map