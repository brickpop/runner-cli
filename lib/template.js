const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

async function writeTemplate() {
  let answers = await inquirer.prompt([
    {
      type: "list",
      message: "What template do you want to use?",
      name: "action",
      choices: [
        { name: "Gulp file", value: "gulp" },
        { name: "NPM package", value: "npm" },
        { name: "Makefile", value: "make" },
        { name: "Shell script", value: "bash" }
      ]
    }
  ])

  switch (answers.action) {
    case "gulp":
      return writeGulpTemplate()
    case "npm":
      return writePackageJsonTemplate()
    case "make":
      return writeMakefileTemplate()
    case "bash":
      return writeTaskfileTemplate()
    default:
      console.error("Invalid choice")
      process.exit(1)
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
