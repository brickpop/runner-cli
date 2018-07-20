#!/usr/bin/env node
"use strict"

const { detectRunner, digestParameters } = require("../lib/runners")
const { asyncSpawn } = require("../lib/spawning")

const runner = detectRunner()
const args = digestParameters(process.argv, runner)

asyncSpawn(runner, args).then(result => {
  process.exit(0)
}).catch(err => {
  console.error(err.message)
  process.exit(1)
})
