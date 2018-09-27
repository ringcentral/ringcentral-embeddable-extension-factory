# Add contacts related feature

Related RingCentral Embeddable doc: https://github.com/ringcentral/ringcentral-embeddable/blob/master/docs/third-party-service-in-widget.md

Edit `src/chrome-extension/third-party-api.js` ,
```js
else if (path === '/contacts') {
    let contacts = []
    // todo get contacts list
    // read more about it: https://github.com/ringcentral/ringcentral-embeddable/blob/master/docs/third-party-service-in-widget.md
    rc.postMessage({
      type: 'rc-post-message-response',
      responseId: data.requestId,
      response: {
        data: contacts,
        nextPage: null
      }
    }, '*')
  }

  //
  else if (path === '/contacts/search') {
    let contacts = []
    //todo
    rc.postMessage({
      type: 'rc-post-message-response',
      responseId: data.requestId,
      response: {
        data: contacts
      }
    }, '*')
  }
  else if (path === '/contacts/match') {

    const matchedContacts = {
      '+12165325078': [
        /*
        {
          entityType: 'TestService',
          name: 'TestService 1',
          phoneNumbers: [{
            phoneNumber: '+12165325078',
            phoneType: 'directPhone',
          }]
        }
        */
      ]
    }
    document.querySelector("#rc-widget-adapter-frame").contentWindow.postMessage({
      type: 'rc-post-message-response',
      responseId: data.requestId,
      response: {
        data: matchedContacts
      },
    }, '*')
  }
```

## Realworld example
https://github.com/zxdong262/hubspot-embeddable-ringcentral-phone/blob/master/src/chrome-extension/third-party-api.js
