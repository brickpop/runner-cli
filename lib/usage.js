function showUsage() {
  console.log(`Usage:

  run <command> [extra-arguments]   Run a command with optional parameters
  run --create <name>               Create a template file in the current folder
`)
}

module.exports = {
  showUsage
}
