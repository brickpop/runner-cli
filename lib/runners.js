function detectRunner() {
  // WIP
  return "npm"
}

function digestParameters(argv, runner) {
  switch (runner) {
    case "npm": return ["run"].concat(argv.slice(2))
    default: return argv.slice(2)
  }
}

module.exports = {
  detectRunner,
  digestParameters
}
