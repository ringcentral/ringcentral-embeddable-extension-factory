const os = require('os')
const extend = require('recursive-assign')
let config = {

  //dev related
  devCPUCount: os.cpus().length,
  devPort: 8020,

  //build options
  minimize: false,

  //congfigs to build app

  //ringcentral config
  ringCentralConfigs: {
    appKey: '',
    appServer: ''
  },

  //for third party related
  thirdPartyConfigs: {
    // appKey: ,
    // appSecret: ,
    // appRedirect: 'https://zxdong262.github.io/hubspot-embeddable-ringcentral-phone/app/redirect.html',
    // appServer: ,
    // apiServer:
  }

}

try {
  extend(config, require('./config.js'))
} catch (e) {
  console.log(e.stack)
  console.warn('warn:no custom config file, use "cp config.sample.js config.js" to create one')
}

module.exports = config



