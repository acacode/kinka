const childProcess = require('child_process')
const isWin = require('os').platform() === 'win32'

function getCommandLine(task, env) {
  var file, args
  var options = {
    stdio: 'pipe',
    windowsVerbatimArguments: isWin,
    detached: !isWin,
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

function spawnCommand(command, callback) {
  const procOptions = getCommandLine(command, process.env)
  const proc = childProcess.spawn.apply(childProcess, procOptions)
  console.log(proc.pid, proc.kill)
  proc.stdout.on('data', message => {
    const fixedMessage = message.toString().replace('\n', '')
    callback(fixedMessage)
    proc.kill('SIGINT')
    proc.kill('SIGTERM')
  })
}

module.exports = spawnCommand
