const spawnCommand = require('./spawn-command')
const packageData = require('../package.json')

function createRelease() {
  spawnCommand('git log -1 --format="%ci [%H] %s"', lastGitLog =>
    spawnCommand(`git rev-parse --abbrev-ref HEAD`, activeBranch => {
      console.log(
        packageData.author.name,
        packageData.name,
        lastGitLog,
        activeBranch
      )
      const command =
        `github-release upload \\` +
        `--owner=${packageData.author.name} \\` +
        `--repo=${packageData.name} \\` +
        `--tag="${packageData.version}" \\` +
        `--name="${activeBranch}" \\` +
        `--body="latest message ${lastGitLog}"`
      console.log('commandcommandcommandcommand', command)
      spawnCommand(command, message => {
        console.log(message)
      })
    })
  )
}

// git log -1 --format='%ci %H %s' -> body

createRelease()
