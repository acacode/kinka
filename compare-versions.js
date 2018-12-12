const proc = require('child_process')
const isWin = require('os').platform() === 'win32'
const currentVersion = require('./package.json').version

function getCommandLine(task, env) {
  var file, args
  var options = {
    stdio: 'pipe',
    windowsVerbatimArguments: isWin,
    env,
  }
  if (isWin) {
    file = process.env.comspec || 'cmd.exe'
    args = ['/s', '/c', task]
  } else {
    file = '/bin/sh'
    args = ['-c', task]
  }
  return [file, args, options]
}

function compareVersions() {
  const procOptions = getCommandLine('npm view kinka version', process.env)
  const command = proc.spawn.apply(proc, procOptions)

  command.stdout.on('data', message => {
    const npmVersion = message.toString().replace('\n', '')
    const versionsAreEqual = currentVersion === npmVersion
    if (versionsAreEqual) {
      console.error(
        'current version (' +
          currentVersion +
          ') should be updated (npm: ' +
          npmVersion +
          ')'
      )
    }
    command.kill('SIGINT')
    command.kill('SIGTERM')
    process.exit(+versionsAreEqual)
  })
}

compareVersions()
