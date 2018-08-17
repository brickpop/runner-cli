function showUsage() {
  console.log(`Usage:

  run <command> [extra-args]   Run a command with optional parameters
  run --new                    Prompt and create a template file in the current folder
`)
}

module.exports = {
  showUsage
}
