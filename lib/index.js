const prompts = require('prompts')
const {echo, rm, mv} = require('shelljs')
const {resolve} = require('path')
const os = require('os')
const {readFileSync, writeFileSync} = require('fs')
const tempDir = os.tmpdir()
const {log} = console
const download = require('download')

const templates = [
  {
    zip: 'https://github.com/zxdong262/ringcentral-chrome-extension-template-spa/archive/master.zip',
    folderName: 'ringcentral-chrome-extension-template-spa-master',
    title: 'Template for single page site',
    manifestPath: 'src/manifest.json'
  },
  {
    zip: 'https://github.com/zxdong262/ringcentral-chrome-extension-template-nospa/archive/master.zip',
    folderName: 'ringcentral-chrome-extension-template-nospa-master',
    title: 'Template for not single page site',
    manifestPath: 'src/manifest.json'
  }
  // {
  //   zip: 'https://github.com/zxdong262/ringcentral-embeddable-chrome-extension-template-spa/archive/master.zip',
  //   folderName: 'ringcentral-embeddable-chrome-extension-template-spa-master',
  //   title: 'Template for single page site with loose files',
  //   manifestPath: 'dist/manifest.json'
  // },
  // {
  //   zip: 'https://github.com/zxdong262/ringcentral-embeddable-chrome-extension-template-nospa/archive/master.zip',
  //   folderName: 'ringcentral-embeddable-chrome-extension-template-nospa-master',
  //   title: 'Template for not single page site with loose files',
  //   manifestPath: 'dist/manifest.json'
  // }
]

const choices = templates.map(k => {
  return {
    title: k.title,
    value: k
  }
})

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
    type: 'select',
    name: 'browser',
    message: 'Select a browser',
    choices: [
      { title: 'Chrome', value: 'chrome' },
      { title: 'Firefox', value: 'firefox' }
    ],
    initial: 0
  },
  {
    type: prev => prev == 'firefox' ? 'text' : null,
    name: 'extensionId',
    message: 'Enter a unique id for extension, eg: your_extension_name@your_org.com',
    validate: (input = '') => {
      const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
      if (!pattern.test(input)) {
        return 'Please use format as email, eg: your_extension_name@your_org.com'
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
    name: 'template',
    type: 'select',
    message: 'Pick a template',
    initial: 0,
    choices: choices
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
  if (res.browser === 'firefox') {
    return Object.keys(res).length === questions.length
  }
  return Object.keys(res).length === (questions.length - 1)
}

function filterPermissions(permissions, browser) {
  if (browser === 'firefox') {
    return permissions.filter((p) => {
      return p !== 'background' && p !== 'tabCapture' && p !== 'system.display'
    })
  }
  return permissions
}

async function editFiles(from, res, template) {

  // dist/manifest.json
  let pkg = resolve(from, template.manifestPath)
  let pkgInfo = require(pkg)
  let pkgObj = {
    name: res.npmName,
    version: res.version,
    description: res.description,
    permissions: [
      ...filterPermissions(pkgInfo.permissions, res.browser),
      res.siteMatch
    ],
    icons: pkgInfo.icons,
    background: pkgInfo.background,
    content_security_policy: pkgInfo.content_security_policy,
    manifest_version: 2
  }
  const contentScript = {
    matches: [
      res.siteMatch
    ],
    exclude_matches: [],
    js: [
      './content.js'
    ]
  }
  const pageAction = Object.assign(
    {},
    pkgInfo.page_action,
    {
      default_title: res.name
    }
  )
  if (res.browser === 'firefox') {
    delete pkgObj.background.persistent
    delete contentScript.exclude_matches
    pkgObj.browser_action = pageAction
    pkgObj.applications = {
      gecko: {
        id: res.extensionId,
        strict_min_version: '60.0'
      }
    }
  } else {
    pkgObj.page_action = pageAction
  }
  pkgObj.content_scripts = [contentScript]
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
  let {template} = res
  template = typeof template === 'object'
    ? template
    : templates[template]
  let {zip, folderName} = template
  let from = resolve(tempDir, folderName)
  await fetchZip(zip, from)
  await editFiles(from, res, template)
  mv(from, targetPath)
  echo(`Done! Now you can run "cd ${name}" and follow ${name}/README.md's instruction to dev/test the chrome extension!`)
}
