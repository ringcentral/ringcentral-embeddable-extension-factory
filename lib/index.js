const prompts = require('prompts')
const {echo, rm, mkdir, cp, mv} = require('shelljs')
const {resolve} = require('path')
const os = require('os')
const {readFileSync, writeFileSync} = require('fs')
const tempDir = os.tmpdir()
const {log} = console
const download = require('download')

const tempaltes = {
  'true': {
    zip: 'https://github.com/zxdong262/ringcentral-embeddable-chrome-extension-template-spa/archive/master.zip',
    folderName: 'ringcentral-embeddable-chrome-extension-template-spa-master'
  },
  'false': {
    zip: 'https://github.com/zxdong262/ringcentral-embeddable-chrome-extension-template-nospa/archive/master.zip',
    folderName: 'ringcentral-embeddable-chrome-extension-template-nospa-master'
  }
}

const questions = [
  {
    name: 'name',
    type: 'text',
    message: 'project name, eg: my great app',
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
      } else if (input.length > 300) {
        return 'project description max length: 300'
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
    message: 'Extension will work in what url, eg: https://example.com/*, must end with "/*"',
    initial: 'https://',
    validate: (input = '') => {
      if (!input) {
        return 'siteMatch is required'
      } else if (!input.startsWith('http')) {
        return 'site match should start with http'
      } else if (!input.endsWith('/*')) {
        return 'site url must ends "/*"'
      }
      return true
    }
  },
  {
    name: 'spa',
    type: 'toggle',
    message: 'Is this site single page app?',
    initial: true,
    active: 'yes',
    inactive: 'no'
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Can you confirm?',
    initial: true
  }
]

function fetchZip(url, folderPath) {
  log('fetching', url, '-->', tempDir)
  rm('-rf', folderPath, folderPath + '.zip')
  return download(url, tempDir, {
    extract: true
  })
    .then(() => true)
    .catch(e => {
      throw e
    })
}

function verifyResult(res) {
  return Object.keys(res).length === questions.length
}

async function editFiles(from, res) {

  // dist/manifest.json
  let pkg = resolve(from, 'dist/manifest.json')
  let pkgInfo = require(pkg)
  let pkgObj = {
    name: res.npmName,
    version: res.version,
    description: res.description,
    permissions: [
      ...pkgInfo.permissions,
      res.siteMatch
    ],
    page_action: Object.assign(
      {},
      pkgInfo.page_action,
      {
        default_title: res.name
      }
    ),
    icons: pkgInfo.icons,
    content_scripts: [
      {
        matches: [
          res.siteMatch
        ],
        exclude_matches: [],
        js: [
          './content.js'
        ]
      }
    ],
    background: pkgInfo.background,
    content_security_policy: pkgInfo.content_security_policy,
    manifest_version: 2
  }
  writeFileSync(
    pkg,
    JSON.stringify(pkgObj, null, 2)
  )

  // package.json
  pkg = resolve(from, 'package.json')
  pkgInfo = require(pkg)
  pkgObj = {
    name: res.npmName,
    version: res.version,
    description: res.description,
    keywords: pkgInfo.keywords,
    scripts: pkgInfo.scripts,
    devDependencies: pkgInfo.devDependencies,
    dependencies: pkgInfo.dependencies
  }
  writeFileSync(
    pkg,
    JSON.stringify(pkgObj, null, 2)
  )

  // README
  let readme = resolve(from, 'README.md')
  let readmeStr = readFileSync(readme).toString()
  let arr = readmeStr.split('## Features')
  let final = `
# ${res.name}

${res.description}

## Features${arr[1]}
  `
  writeFileSync(readme, final)

}

module.exports = async function ask({path: targetPath, name}) {
  questions[0].initial = name
  let res = await prompts(questions)
  if (!verifyResult(res)) {
    return process.exit(0)
  }
  delete res.confirm
  console.log(res)
  res.npmName = res.name.replace(/\s+/g, '-')
  echo('building')
  let {spa} = res
  let obj = tempaltes[spa.toString()]
  let {zip, folderName} = obj
  let from = resolve(tempDir, folderName)
  await fetchZip(zip, from)
  await editFiles(from, res)
  mv(from, targetPath)
  echo(`Done! Now you can run "cd ${name}" and follow ${name}/README.md's instruction to dev/test the chrome extension!`)
}
