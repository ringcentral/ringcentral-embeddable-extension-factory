const reef = require('../lib')
const assert = require('assert')
const fs = require('fs')
const {rm} = require('shelljs')
const {resolve} = require('path')
const prompts = require('prompts')
const pkg = require('../package.json')

// const testConfig0 = {
//   name: 'my app',
//   npmName: 'my-app',
//   description: 'ma-app',
//   version: '0.0.1',
//   siteMatch: 'https://*.insightly.com/*',
//   template: 0,
//   confirm: true
// }

// const testConfig1 = {
//   name: 'my app1',
//   npmName: 'my-app1',
//   description: 'ma-app1',
//   version: '0.0.1',
//   siteMatch: 'https://*.redtailtechnology.com/*',
//   template: 1,
//   confirm: true
// }

const testConfig2 = {
  name: 'my app2',
  npmName: 'my-app2',
  description: 'ma-app2',
  version: '0.0.1',
  siteMatch: 'https://*.insightly.com/*',
  template: 0,
  confirm: true
}

const testConfig3 = {
  name: 'my app3',
  npmName: 'my-app3',
  description: 'ma-app3',
  version: '0.0.1',
  siteMatch: 'https://*.redtailtechnology.com/*',
  template: 1,
  confirm: true
}

// let tests = [
//   {
//     path: 'README.md',
//     strings: [
//       'name',
//       'description'
//     ]
//   },
//   {
//     path: 'dist/manifest.json',
//     strings: [
//       'name',
//       'description',
//       'version',
//       'siteMatch'
//     ]
//   },
//   {
//     path: 'package.json',
//     strings: [
//       'npmName',
//       'description',
//       'version'
//     ]
//   }
// ]


let tests1 = [
  {
    path: 'README.md',
    strings: [
      'name',
      'description'
    ]
  },
  {
    path: 'src/manifest.json',
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
  // it('spa1', function(done) {
  //   prompts.inject(testConfig0)
  //   let p = resolve(__dirname, './my-app')
  //   reef({
  //     path: p,
  //     name: 'my-app'
  //   })
  //   setTimeout(async function() {
  //     for (let t of tests) {
  //       let {path, strings} = t
  //       let fileStr = fs
  //         .readFileSync(
  //           p + '/' + path
  //         ).toString()
  //       for (let s of strings) {
  //         let v = testConfig0[s]
  //         assert(
  //           fileStr.includes(v),
  //           true
  //         )
  //       }
  //     }
  //     rm('-rf', p)
  //     done()
  //   }, 3000)
  // })

  // it('non spa1', function(done) {
  //   prompts.inject(testConfig1)
  //   let p = resolve(__dirname, './my-app1')
  //   reef({
  //     path: p,
  //     name: 'my-app1'
  //   })
  //   setTimeout(async function() {
  //     for (let t of tests) {
  //       let {path, strings} = t
  //       let fileStr = fs
  //         .readFileSync(
  //           p + '/' + path
  //         ).toString()
  //       for (let s of strings) {
  //         let v = testConfig1[s]
  //         assert(
  //           fileStr.includes(v),
  //           true
  //         )
  //       }
  //     }
  //     rm('-rf', p)
  //     done()
  //   }, 4000)
  // })

  it('spa2', function(done) {
    prompts.inject(testConfig2)
    let p = resolve(__dirname, './my-app2')
    reef({
      path: p,
      name: 'my-app2'
    })
    setTimeout(async function() {
      for (let t of tests1) {
        let {path, strings} = t
        let fileStr = fs
          .readFileSync(
            p + '/' + path
          ).toString()
        for (let s of strings) {
          let v = testConfig2[s]
          assert(
            fileStr.includes(v),
            true
          )
        }
      }
      rm('-rf', p)
      done()
    }, 4000)
  })

  it('no spa2', function(done) {
    prompts.inject(testConfig3)
    let p = resolve(__dirname, './my-app3')
    reef({
      path: p,
      name: 'my-app3'
    })
    setTimeout(async function() {
      for (let t of tests1) {
        let {path, strings} = t
        let fileStr = fs
          .readFileSync(
            p + '/' + path
          ).toString()
        for (let s of strings) {
          let v = testConfig3[s]
          assert(
            fileStr.includes(v),
            true
          )
        }
      }
      rm('-rf', p)
      done()
    }, 4000)
  })
})
