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
  console.log('dev dependencies in package.json has been cleared')

  patchFile('./package-lock.json', lockFile => {
    lockFile.dependencies = {}
    lockFile.version = packageVersion
    console.log('dev dependencies in package-lock.json has been cleared')
    console.log(
      `version in package-lock.json became the same in package.json (${packageVersion})`
    )
    return lockFile
  })
  return packageJson
})
