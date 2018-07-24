const fs = require('fs')
const path = require('path')

function writeTemplate(name) {
  switch (name) {
    case "gulp":
    case "gulpfile":
      return writeGulpTemplate()
    case "npm":
    case "node":
      return writePackageJsonTemplate()
    case "make":
    case "makefile":
      return writeMakefileTemplate()
    case "task":
    case "taskfile":
    case "script":
    case "bash":
    case "sh":
      return writeTaskfileTemplate()
    default:
      console.log(`Usage:

  run --create <name>

  Where <name> can be any of:
    - gulp, gulpfile
    - npm, node
    - make, makefile
    - task, taskfile
    - script, bash, sh
`)
  }
}

function writeGulpTemplate() {
  const target = path.resolve(process.cwd(), "gulpfile.js")
  if (fs.existsSync(target)) {
    console.error("Error: Refusing to overwrite the existing version of gulpfile.js.")
    return process.exit(1)
  }
  else {
    fs.copyFileSync(path.resolve(__dirname, "..", "templates", "gulpfile.js"), target)
    console.log("Created gulpfile.js\n")
    console.log("Execute 'run' to see the template actions")
  }
}

function writePackageJsonTemplate() {
  const target = path.resolve(process.cwd(), "package.json")
  if (fs.existsSync(target)) {
    console.error("Error: Refusing to overwrite the existing version of package.json.")
    return process.exit(1)
  }
  else {
    fs.copyFileSync(path.resolve(__dirname, "..", "templates", "package.json"), target)
    console.log("Created package.json\n")
    console.log("Execute 'run' to see the template actions")
  }
}

function writeMakefileTemplate() {
  const target = path.resolve(process.cwd(), "makefile")
  if (fs.existsSync(target)) {
    console.error("Error: Refusing to overwrite the existing version of makefile.")
    return process.exit(1)
  }
  else {
    fs.copyFileSync(path.resolve(__dirname, "..", "templates", "makefile"), target)
    console.log("Created makefile\n")
    console.log("Execute 'run' to see the template actions")
  }
}

function writeTaskfileTemplate() {
  const target = path.resolve(process.cwd(), "taskfile")
  if (fs.existsSync(target)) {
    console.error("Error: Refusing to overwrite the existing version of taskfile.")
    return process.exit(1)
  }
  else {
    fs.copyFileSync(path.resolve(__dirname, "..", "templates", "taskfile"), target)
    console.log("Created taskfile\n")
    console.log("Execute 'run' to see the template actions")
  }
}

module.exports = {
  writeTemplate
}
