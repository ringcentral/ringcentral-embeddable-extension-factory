const prompts = require('prompts')
const {echo, rm, mkdir, cp} = require('shelljs')
const glob = require('glob')
const {resolve} = require('path')
const {readFileSync, writeFileSync} = require('fs')

const questions = [
  {
    name: 'name',
    type: 'text',
    message: 'project name',
    validate: input => {
      if (!input) {
        return 'project name is required'
      } else if (input.length > 50) {
        return 'project name max length: 50'
      }
      return true
    }
  },
  {
    name: 'description',
    type: 'text',
    message: 'project description',
    validate: input => {
      if (!input) {
        return 'project description is required'
      } else if (input.length > 50) {
        return 'project description max length: 1000'
      }
      return true
    }
  },
  {
    name: 'version',
    type: 'text',
    message: 'project version',
    initial: '0.0.1'
  },
  {
    name: 'siteMatch',
    type: 'text',
    message: 'Extension will work in what url, eg: https://example.com/*',
    initial: 'http',
    validate: input => {
      if (!input) {
        return 'siteMatch is required'
      } else if (!input.startsWith('http')) {
        return 'site match should start with http'
      }
      return true
    }
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Can you confirm?',
    initial: true
  }
]

let workPath = resolve(__dirname, '../work')
let src = resolve(__dirname, '../templates')
let dist = workPath + '/app'

function replacer(str, res) {
  let nstr = str
  Object.keys(res).forEach(key => {
    nstr = nstr.replace(new RegExp(`{{${key}}}`, 'g'), res[key])
  })
  return nstr === str
    ? false
    : nstr
}

function verifyResult(res) {
  return Object.keys(res).length === questions.length
}

function listFiles(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, {}, function (err, files) {
      if (err) {
        return reject(err)
      }
      resolve(files)
    })
  })
}

async function listAllFiles(dist) {
  let p1 = dist + '/.*'
  let files1 = await listFiles(p1)
  let p2 = dist + '/**/*.*'
  let files2 = await listFiles(p2)
  return [
    ...files1,
    ...files2
  ]
}

async function replaceString(res, dist) {
  let files = await listAllFiles(dist)
  for (let file of files) {
    let str = readFileSync(file).toString()
    str = replacer(str, res)
    if (str) {
      writeFileSync(file, str)
    }
  }
}

module.exports = async function ask({path: targetPath}) {
  let res = await prompts(questions)
  if (!verifyResult(res)) {
    return process.exit(0)
  }
  delete res.confirm
  console.log(res)
  echo('building')
  rm('-rf', workPath)
  mkdir(workPath)
  cp('-r', src, dist)
  await replaceString(res, dist)
  cp('-rf', dist, targetPath)
  echo('done!')
}