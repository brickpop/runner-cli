const fs = require("fs")
const path = require("path")
const hasbin = require("hasbin")

function detectRunner() {
  let currentPath = process.cwd()

  if (fs.existsSync(path.join(currentPath, "gulpfile.js"))) {
    if (hasbin.sync("gulp")) {
      return [null, "gulp"]
    }
    else {
      return [new Error("Found gulpfile.js but the gulp CLI is not installed on your system\n\nPlease, run 'npm install -g gulp' and try again. You may need to use sudo."), null]
    }
  }
  else if (fs.existsSync(path.join(currentPath, "package.json"))) {
    if (hasbin.sync("npm")) {
      return [null, "npm"]
    }
    else {
      return [new Error("Found package.json file, but NPM is not installed on your system\n\nPlease, visit https://nodejs.org/ and install NodeJS and NPM"), null]
    }
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
