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
        var secondValue = second ? second[i] : undefined;
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
function getConfigFolder() {
    var rootPath = getRootPath();
    return rootPath + '/' + 'config';
}
exports.getConfigFolder = getConfigFolder;
function loadAndCheckConfig(name) {
    if (name === void 0) { name = 'config'; }
    var configFolder = getConfigFolder();
    var config = require(configFolder + '/' + name + '.json');
    var sampleConfig = require(configFolder + '/' + name + '-sample.json');
    compareConfigs(name + ".json", config, name + "-sample.json", sampleConfig);
    return config;
}
exports.loadAndCheckConfig = loadAndCheckConfig;
function loadLabConfig() {
    var fs = require('fs');
    var configFolder = getConfigFolder();
    var defaultConfig = require(configFolder + '/lab-default.json');
    var configFilePath = configFolder + '/lab.json';
    if (fs.fileExistsSync(configFilePath))
        return Object.assign(defaultConfig, require(configFilePath));
    else
        return defaultConfig;
}
exports.loadLabConfig = loadLabConfig;
function loadModelSchema() {
    var rootPath = getRootPath();
    return require(rootPath + '/src/model/schema.json');
}
exports.loadModelSchema = loadModelSchema;
//# sourceMappingURL=utility.js.map