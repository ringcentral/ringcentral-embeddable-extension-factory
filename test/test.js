const reef = require('../lib')
const assert = require('assert')
const fs = require('fs')
const {rm} = require('shelljs')
const {resolve} = require('path')
const prompts = require('prompts')
const pkg = require('../package.json')
const testConfig = {
  name: 'my app',
  npmName: 'my-app',
  description: 'ma-app',
  version: '0.0.1',
  siteMatch: 'https://*.insightly.com/',
  spa: true,
  confirm: true
}

const testConfig1 = {
  name: 'my app1',
  npmName: 'my-app1',
  description: 'ma-app1',
  version: '0.0.1',
  siteMatch: 'https://*.redtailtechnology.com/*',
  spa: false,
  confirm: true
}

let tests = [
  {
    path: 'README.md',
    strings: [
      'name',
      'description'
    ]
  },
  {
    path: 'dist/manifest.json',
    strings: [
      'name',
      'description',
      'version',
      'siteMatch'
    ]
  },
  {
    path: 'package.json',
    strings: [
      'npmName',
      'description',
      'version'
    ]
  }
]

describe(pkg.name, function() {
  this.timeout(100000)
  it('spa', function(done) {
    prompts.inject(testConfig)
    let p = resolve(__dirname, './my-app')
    reef({
      path: p,
      name: 'my-app'
    })
    setTimeout(async function() {
      for (let t of tests) {
        let {path, strings} = t
        let fileStr = fs
          .readFileSync(
            p + '/' + path
          ).toString()
        for (let s of strings) {
          let v = testConfig[s]
          assert(
            fileStr.includes(v),
            true
          )
        }
      }
      rm('-rf', p)
      done()
    }, 3000)
  })

  it('non spa', function(done) {
    prompts.inject(testConfig1)
    let p = resolve(__dirname, './my-app1')
    reef({
      path: p,
      name: 'my-app1'
    })
    setTimeout(async function() {
      for (let t of tests) {
        let {path, strings} = t
        let fileStr = fs
          .readFileSync(
            p + '/' + path
          ).toString()
        for (let s of strings) {
          let v = testConfig1[s]
          assert(
            fileStr.includes(v),
            true
          )
        }
      }
      rm('-rf', p)
      done()
    }, 3000)
  })
})
