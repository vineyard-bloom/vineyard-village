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
  let currentModule = module
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

function compare(first, second, path: string[], secondName: string) {
  let messages = []
  for (let i in first) {
    const secondValue = second [i]
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

export function compareConfigs(firstName: string, first: any, secondName: string, second: any) {
  const messages = [].concat(
    compare(first, second, [], secondName),
    compare(second, first, [], firstName),
  )

  if (messages.length > 0) {
    console.error("Config errors: ")
    for (let message of messages) {
      console.error("  ", message)
    }
    process.exit()
  }

}