
import onCallEnd from './on-call-end'
import initContactsFeature from './handle-contact-feature'
import {
  popup
} from './helpers'

function registerService() {
  // Listen message from background.js to open app window when user click icon.
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === 'openAppWindow') {
        popup()
      }
      sendResponse('ok')
    }
  )

  // handle call log sync:
  window.addEventListener('message', (e) => {
    const data = e.data
    if (data) {
      switch (data.type) {
        case 'rc-call-end-notify':
          onCallEnd(data)
          break
        default:
          break
      }
    }
  })

  // handle contacts sync feature
  initContactsFeature()

  // insert click-to-call button
  //handle
}

let registered = false
export default () => {
  window.addEventListener('message', function (e) {
    const data = e.data
    if (data && data.type === 'rc-adapter-pushAdapterState' && registered === false) {
      registered = true
      registerService()
    }
  })
}
