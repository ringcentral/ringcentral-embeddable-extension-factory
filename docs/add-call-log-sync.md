# Add call log sync features
Related RingCentral Embeddable doc: https://github.com/ringcentral/ringcentral-embeddable/blob/master/docs/third-party-service-in-widget.md

Edit `src/chrome-extension/third-party-api.js` ,
```js
else if (data.path === '/callLogger') {
  // add your codes here to log call to your service
  // response to widget
  document.querySelector("#rc-widget-adapter-frame").contentWindow.postMessage({
    type: 'rc-post-message-response',
    responseId: data.requestId,
    response: { data: 'ok' },
  }, '*');
}
```