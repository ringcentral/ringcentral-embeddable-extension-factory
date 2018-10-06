# Add hover contact element to show click-to-call tooltip button

![](screenshots/fac-2.png)

There is pre-defined functions in `src/chrome-extension/hover-to-show-call-button.js` to help adding hovering contact element to show click-to-call tooltip button event in page, just need to write proper configs in `src/chrome-extension/content-insert-config.js`,
```js
//hover contact node to show click to dial tooltip
export const hoverShowClickToCallButton = [
  /* //config example
  {
    // must match url
    urlCheck: href => {
      return href.includes('contacts/list/view/all/')
    },

    //elemment selector
    selector: 'table.table tbody tr',

    // element should inclues phone number element
    getPhoneElemFromElem: elem => {
      return elem.querySelector('.column-phone span span')
    }
  }
  */
]
```

## Realworld example
https://github.com/zxdong262/hubspot-embeddable-ringcentral-phone/blob/master/src/chrome-extension/content-insert-config.js