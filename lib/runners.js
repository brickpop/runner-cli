const fs = require("fs")
const path = require("path")
const hasbin = require("hasbin")
const inquirer = require('inquirer')

const { asyncSpawn } = require("../lib/spawning")

const currentPath = process.cwd()

// DETECTORS

async function detectRunner() {
  let error

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
      return ["run"].concat(args)
    case "gulp":
      if (args.length === 0) return ["--tasks"]
      else return args
    default:
      return args
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
