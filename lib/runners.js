const fs = require("fs")
const path = require("path")
const hasbin = require("hasbin")
const inquirer = require('inquirer')

const { asyncSpawn } = require("../lib/spawning")

const currentPath = process.cwd()

// DETECTORS

async function detectRunner() {
  let error, found

  [error, found] = checkTaskfile()
  if (error) {
    return [error, null]
  }
  else if (found) {
    return [null, "taskfile"]
  }

  [error, found] = await checkMakefile()
  if (error) {
    return [error, null]
  }
  else if (found) {
    return [null, "make"]
  }

  [error, found] = await checkGulpfile()
  if (error) {
    return [error, null]
  }
  else if (found) {
    return [null, "gulp"]
  }

  [error, found] = await checkPackageJson()
  if (error) {
    return [error, null]
  }
  else if (found) {
    return [null, "npm"]
  }

  return [new Error("Unable to detect any supported task file"), null]
}

function checkTaskfile() {
  if (fs.existsSync(path.join(currentPath, "taskfile")) || fs.existsSync(path.join(currentPath, "Taskfile"))) {
    if (!hasbin.sync("bash")) {
      return [new Error("Found taskfile, but 'bash' is not installed on your system"), false]
    }
    return [null, true]
  }
  return [null, false]
}

async function checkMakefile() {
  if (fs.existsSync(path.join(currentPath, "makefile")) || fs.existsSync(path.join(currentPath, "Makefile"))) {
    // check make presence
    if (!hasbin.sync("make")) {
      if (process.platform == "darwin") {
        let [error, done] = await promptInstallXCodeCommandLineTools()
        if (error || !done) return [error, false]
      }
      else if (process.platform == "linux") {
        if (hasbin.sync("apt-get")) {
          return [new Error("Found makefile, but make is not installed on your system\n\nPlease run 'apt-get install make'"), false]
        }
        else if (hasbin.sync("aptitude")) {
          return [new Error("Found makefile, but make is not installed on your system\n\nPlease run 'aptitude install make'"), false]
        }
        else if (hasbin.sync("yum")) {
          return [new Error("Found makefile, but make is not installed on your system\n\nPlease run 'yum install make'"), false]
        }
        return [new Error("Found makefile, but make is not installed on your system\n\nPlease use the package manager of your distro and install make"), false]
      }
      else if (process.platform == "win32") {
        return [new Error("Found makefile, but make is not installed on your system\n\nPlease visit http://gnuwin32.sourceforge.net/packages/make.htm and install make"), false]
      }
      else {
        return [new Error("Found makefile, but make is not installed on your system\n\nPlease visit https://www.gnu.org/software/make/ and install make for " + process.platform), false]
      }
    }
    return [null, "make"]
  }
  return [null, false]
}

async function checkGulpfile() {
  if (fs.existsSync(path.join(currentPath, "gulpfile.js"))) {
    // check global gulp
    if (!hasbin.sync("gulp")) {
      let [error, done] = await promptInstallGlobalGulp()
      if (error) return [error, false]
      else if (!done) return [null, false]
    }

    // check local gulp
    if (!fs.existsSync(path.join(currentPath, "node_modules", "gulp"))) {
      let [error, done] = await promptInstallLocalGulp()

      if (error) return [error, false]
      else if (!done) return [null, false]
    }

    return [null, "gulp"]
  }
  return [null, false]
}

async function checkPackageJson() {
  if (!fs.existsSync(path.join(currentPath, "package.json"))) {
    return [null, false]
  }
  else if (!hasbin.sync("npm")) {
    return [new Error("Found package.json file, but NPM is not installed on your system\n\nPlease, visit https://nodejs.org/ and install NodeJS and NPM"), false]
  }
  return [null, true]
}

// ARGUMENTS

function digestParameters(argv, runner) {
  const args = argv.slice(2)
  switch (runner) {
    case "npm":
      return ["npm", "run"].concat(args)
    case "gulp":
      if (args.length === 0) return ["gulp", "--tasks"]
      else return ["gulp"].concat(args)
    case "make":
      return ["make"].concat(args)
    case "taskfile":
      return ["bash", "taskfile"].concat(args)
    default:
      return [runner].concat(args)
  }
}

// PROMPTS

async function promptInstallGlobalGulp() {
  try {
    let choices = [
      { name: "Skip gulp", value: "skip" },
      { name: "Install global gulp", value: "install" },
    ]
    if (hasbin.sync("sudo")) {
      choices.push({ name: "Install global gulp with sudo", value: "installSudo" })
    }

    let answers = await inquirer.prompt([
      {
        type: "confirm",
        message: "Detected gulpfile.js but gulp is not installed on your system. Do you want to add it?",
        name: "action",
        choices
      }
    ])

    if (!answers.action) return [new Error("Invalid choice"), false]
    else if (answers.action == "skip") return [null, false]
    else if (answers.action == "install") await asyncSpawn("npm", ["install", "-g", "gulp"])
    else await asyncSpawn("sudo", ["npm", "install", "-g", "gulp"])

    return [null, true]
  }
  catch (err) {
    return [err, false]
  }
}

async function promptInstallLocalGulp() {
  try {
    let answers = await inquirer.prompt([
      {
        type: "list",
        message: "Gulp needs to be installed locally. Do you want to add it?",
        name: "action",
        choices: [
          { name: "Skip gulp", value: "skip" },
          { name: "Add gulp as a dependency", value: "depencency" },
          { name: "Add gulp as a dev dependency", value: "devDependency" }
        ]
      }
    ])

    if (!answers.action) return [new Error("Invalid choice"), false]
    else if (answers.action == "skip") return [null, false]

    // check existing package.json
    if (!fs.existsSync(path.join(currentPath, "package.json"))) {
      let error = isNpmInstalled()
      if (error) return [error, false]

      console.log("Creating package.json")
      await asyncSpawn("npm", ["init", "-y"])
    }

    if (answers.action == "depencency") {
      await asyncSpawn("npm", ["install", "gulp"])
    }
    else {
      await asyncSpawn("npm", ["install", "-D", "gulp"])
    }

    return [null, true]
  }
  catch (err) {
    return [err, false]
  }
}

async function promptInstallXCodeCommandLineTools() {
  try {
    if (!hasbin.sync("xcode-select")) return [new Error("Detected makefile but XCode is not installed on your mac\n\nPlease, open the Mac App Store and install XCode to continue")]

    let choices = [
      { name: "Skip make", value: "skip" },
      { name: "Install Xcode Command Line Tools", value: "install" },
    ]

    let answers = await inquirer.prompt([
      {
        type: "confirm",
        message: "Detected makefile but make is not installed on your mac. Do you want to install it?",
        name: "action",
        choices
      }
    ])

    if (!answers.action) return [new Error("Invalid choice"), false]
    else if (answers.action == "skip") return [null, false]
    else await asyncSpawn("xcode-select", ["--install"])

    return [null, true]
  }
  catch (err) {
    return [err, false]
  }
}

// ASSERTIONS

function isNpmInstalled() {
  if (!hasbin.sync("npm")) {
    return new Error("NPM is not installed on your system\n\nPlease, visit https://nodejs.org/ and install NodeJS and NPM")
  }
  return null
}

module.exports = {
  detectRunner,
  digestParameters
}
