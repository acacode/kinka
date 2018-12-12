const fs = require('fs')

function patchFile(pathToFile, changeFunc) {
  const file = require(pathToFile)
  fs.writeFile(pathToFile, JSON.stringify(changeFunc(file)), function(err) {
    if (err) throw new Error(err)
    console.log('file ' + pathToFile + ' has been patched')
  })
}

patchFile('./package.json', packageJson => {
  const packageVersion = packageJson.version
  packageJson.devDependencies = {}

  patchFile('./package-lock.json', lockFile => {
    lockFile.dependencies = {}
    lockFile.version = packageVersion
    return lockFile
  })
  return packageJson
})
