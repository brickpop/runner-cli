const fs = require("fs")
const path = require("path")
const hasbin = require("hasbin")

function detectRunner() {
  let currentPath = process.cwd()

  if (fs.existsSync(path.join(currentPath, "package.json"))) {
    if (hasbin.sync("npm"))
      return [null, "npm"]
    else
      return [new Error("It looks like the npm binary is not installed on your system\n\nPlease, visit https://nodejs.org/ and install NodeJS and NPM"), null]
  }

  return [new Error("Unable to detect any supported task file on " + process.cwd()), null]
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
