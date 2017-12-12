"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function findPackageDirectory(originalPath) {
    let currentPath = originalPath;
    while (!fs.existsSync(path.join(currentPath, 'package.json'))) {
        const nextPath = path.resolve(currentPath, '..');
        if (nextPath == currentPath)
            return null;
        currentPath = nextPath;
    }
    return currentPath;
}
function listModules() {
    let currentModule = module;
    const result = [];
    while (currentModule != null) {
        result.unshift(currentModule);
        currentModule = currentModule.parent;
    }
    return result;
}
function getRootPath() {
    const modules = listModules();
    for (var i = 0; i < modules.length; ++i) {
        const packageDirectory = findPackageDirectory(path.dirname(modules[i].filename));
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
    if (Array.isArray(first) && Array.isArray(second)) {
        return [];
    }
    else if (Array.isArray(first)) {
        if (!second)
            return []; // This will already be handled by the other pass.  Returning an empty array to avoid duplicates.
        return [path + ' is not an array in ' + secondName];
    }
    else if (Array.isArray(second)) {
        // This will already be handled by the other pass.  Returning an empty array to avoid duplicates.
        return [];
    }
    let messages = [];
    for (let i in first) {
        const secondValue = second ? second[i] : undefined;
        if (secondValue === undefined) {
            const pathString = path.concat(i).join('.');
            messages.push(secondName + ' is missing ' + pathString);
        }
        const firstValue = first[i];
        if (firstValue && typeof firstValue === 'object') {
            messages = messages.concat(compare(firstValue, secondValue, path.concat(i), secondName));
        }
    }
    return messages;
}
function diffConfigs(firstName, first, secondName, second) {
    return [].concat(compare(first, second, [], secondName), compare(second, first, [], firstName));
}
exports.diffConfigs = diffConfigs;
function compareConfigs(firstName, first, secondName, second) {
    const messages = diffConfigs(firstName, first, secondName, second);
    if (messages.length > 0) {
        console.error("Config errors: ");
        for (let message of messages) {
            console.error("  ", message);
        }
        process.exit();
    }
}
exports.compareConfigs = compareConfigs;
function getConfigFolder() {
    const rootPath = getRootPath();
    return rootPath + '/' + 'config';
}
exports.getConfigFolder = getConfigFolder;
function loadAndCheckConfig(name = 'config', configFolder = getConfigFolder()) {
    const config = require(configFolder + '/' + name + '.json');
    const sampleConfig = require(configFolder + '/' + name + '-sample.json');
    compareConfigs(name + ".json", config, name + "-sample.json", sampleConfig);
    return config;
}
exports.loadAndCheckConfig = loadAndCheckConfig;
function loadLabConfig() {
    const fs = require('fs');
    const configFolder = getConfigFolder();
    const defaultConfig = require(configFolder + '/lab-default.json');
    const configFilePath = configFolder + '/lab.json';
    if (fs.existsSync(configFilePath))
        return Object.assign(defaultConfig, require(configFilePath));
    else
        return defaultConfig;
}
exports.loadLabConfig = loadLabConfig;
function loadModelSchema() {
    const rootPath = getRootPath();
    return require(rootPath + '/src/model/schema.json');
}
exports.loadModelSchema = loadModelSchema;
//# sourceMappingURL=utility.js.map