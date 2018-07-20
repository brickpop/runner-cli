var runningProcesses = 0
const { spawn } = require("child_process")

// Prevent Ctrl+C from killing the parent process before the children exit
process.on("SIGINT", () => {
  console.log("Terminating the process...")
  if (runningProcesses > 0) {
    setTimeout(() => process.exit(), 3000)
  } else {
    process.exit()
  }
})

function asyncSpawn(command, parameters = []) {
  return new Promise((resolve, reject) => {
    runningProcesses++
    console.log(command, ...parameters, "\n")

    spawn(command, parameters, {
      stdio: "inherit"
    })
      .on("close", code => {
        if (code)
          reject(new Error(command + " process exited with code " + code))
        else resolve()
      })
      .on("exit", code => {
        runningProcesses--
        if (code) reject(new Error(command + " process exited with code " + code))
        else resolve()
      })
  })
}

module.exports = {
  asyncSpawn
}
