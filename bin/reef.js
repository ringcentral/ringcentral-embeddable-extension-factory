#!/usr/bin/env node

const reef = require('../lib')
const resolve = require('path').resolve
const program = require('commander')

program
  .version(require('../package.json').version)
  .description('Cli tool to create a RingCentral Embeddable Voice chrome extension start kit for sites')
  .usage('[appName]')
  .parse(process.argv)

const arr = program.rawArgs

let path = program.args.shift()
if (!path) {
  return program.outputHelp()
}

path = resolve(path)

reef({
  path
})
