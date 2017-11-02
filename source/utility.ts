import * as fs from "fs"
import * as  path from 'path'

function findPackageDirectory(originalPath: string) {
  let currentPath = originalPath
  while (!fs.existsSync(path.join(currentPath, 'package.json'))) {
    const nextPath = path.resolve(currentPath, '..')
    if (nextPath == currentPath)
      return null

    currentPath = nextPath
  }
  return currentPath
}

function listModules() {
  let currentModule: NodeModule | null = module
  const result = []

  while (currentModule != null) {
    result.unshift(currentModule)
    currentModule = currentModule.parent
  }

  return result
}

export function getRootPath(): string {
  const modules = listModules()
  for (var i = 0; i < modules.length; ++i) {
    const packageDirectory = findPackageDirectory(path.dirname(modules[i].filename))
    if (packageDirectory) {
      if (fs.existsSync(path.join(packageDirectory, 'config'))) {
        return packageDirectory
      }
    }
  }

  throw new Error("Could not find application root.")
}

function compare(first: any, second: any, path: string[], secondName: string): string[] {
  if (Array.isArray(first) && Array.isArray(second)) {
    return []
  }
  else if (Array.isArray(first)) {
    if (!second)
      return [] // This will already be handled by the other pass.  Returning an empty array to avoid duplicates.

    return [path + ' is not an array in ' + secondName]
  }
  else if (Array.isArray(second)) {
    // This will already be handled by the other pass.  Returning an empty array to avoid duplicates.
    return []
  }

  let messages: string[] = []

  for (let i in first) {
    const secondValue = second ? second [i] : undefined
    if (secondValue === undefined) {
      const pathString = path.concat(i).join('.')
      messages.push(secondName + ' is missing ' + pathString)
    }

    const firstValue = first[i]
    if (firstValue && typeof firstValue === 'object') {
      messages = messages.concat(compare(firstValue, secondValue, path.concat(i), secondName))
    }
  }

  return messages
}


export function diffConfigs(firstName: string, first: any, secondName: string, second: any) {
  return ([] as string[]).concat(
    compare(first, second, [], secondName),
    compare(second, first, [], firstName),
  )
}

export function compareConfigs(firstName: string, first: any, secondName: string, second: any) {
  const messages = diffConfigs(firstName, first, secondName, second)

  if (messages.length > 0) {
    console.error("Config errors: ")
    for (let message of messages) {
      console.error("  ", message)
    }
    process.exit()
  }
}

export function getConfigFolder(): string {
  const rootPath = getRootPath()
  return rootPath + '/' + 'config'
}

export function loadAndCheckConfig<T>(name: string = 'config', configFolder:string = getConfigFolder()): T {
  const config = require(configFolder + '/' + name + '.json')
  const sampleConfig = require(configFolder + '/' + name + '-sample.json')
  compareConfigs(name + ".json", config, name + "-sample.json", sampleConfig)
  return config
}

export function loadLabConfig<T>(): T {
  const fs = require('fs')
  const configFolder = getConfigFolder()
  const defaultConfig = require(configFolder + '/lab-default.json')
  const configFilePath = configFolder + '/lab.json'
  if (fs.existsSync(configFilePath))
    return Object.assign(defaultConfig, require(configFilePath))
  else
    return defaultConfig
}

export function loadModelSchema<T>(): T {
  const rootPath = getRootPath()
  return require(rootPath + '/src/model/schema.json')
}