#!/usr/bin/env node
"use strict"

const { detectRunner, digestParameters } = require("../lib/runners")
const { asyncSpawn } = require("../lib/spawning")
const { showUsage } = require("../lib/usage")

function main() {
  if (process.argv.length == 2) {
    showUsage()
    return Promise.resolve()
  }

  let [err, runner] = detectRunner()
  if (err) {
    return Promise.reject(err)
  }

  const args = digestParameters(process.argv, runner)

  return asyncSpawn(runner, args)
}

main().then(result => {
  process.exit(0)
}).catch(err => {
  console.error(err.message)
  process.exit(1)
})
