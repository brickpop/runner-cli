#!/usr/bin/env node
"use strict"

const { detectRunner, digestParameters } = require("../lib/runners")
const { asyncSpawn } = require("../lib/spawning")
const { showUsage } = require("../lib/usage")
const { writeTemplate } = require("../lib/template")

async function main() {
  if (process.argv.length == 3 && (process.argv[2] == "-h" || process.argv[2] == "--help")) {
    showUsage()
    return Promise.resolve()
  }
  else if (process.argv[2] == "--new") {
    await writeTemplate()
    return Promise.resolve()
  }

  let [err, runner] = await detectRunner()
  if (err) {
    return Promise.reject(err)
  }

  const [cmd, ...args] = digestParameters(process.argv, runner)

  return asyncSpawn(cmd, args)
}

main().then(result => {
  process.exit(0)
}).catch(err => {
  console.error(err.message)
  process.exit(1)
})
