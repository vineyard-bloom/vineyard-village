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