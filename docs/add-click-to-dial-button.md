# Add click to dial button

![](screenshots/fac-3.png)

There is pre-defined functions in `src/chrome-extension/insert-click-to-call-button.js` to help handle inserting click-to-dial button in page, just need to write proper configs in `src/chrome-extension/content-insert-config.js`,
```js
export const insertClickToCallButton = [
  /* // config example
  {
    // must match page url
    urlCheck: href => {
      return href.includes('?interaction=call')
    },

    // define in the page how to get phone number,
    // if can not get phone number, will not insert the call button
    getContactPhoneNumber: () => {
      let phoneWrap = document.querySelector('[data-profile-property=\'phone\']')
      if (!phoneWrap) {
        return false
      }
      let phoneInput = phoneWrap.querySelector('input')
      if (!phoneInput) {
        return false
      }
      let {value} = phoneInput
      let isNumber = checkPhoneNumber(value)
      return isNumber ? value : false
    },

    // parent dom to insert call button
    // can be multiple condition
    // the first one matches, rest the array will be ignored
    parentsToInsertButton: [
      {
        getElem: () => {
          return document.querySelector('.start-call').parentNode
        },
        insertMethod: 'insertBefore',
        shouldInsert: () => {
          return !document.querySelector('.' + RCBTNCLS2)
        }
      },
      {
        getElem: () => {
          return document
            .querySelector('.panel-is-call button [data-key="twilio.notEnabled.skipOnboarding"]')
            .parentNode.parentNode
        },
        insertMethod: 'insertBefore',
        shouldInsert: () => {
          return !document.querySelector('.' + RCBTNCLS2)
        }
      }
    ]
  }
  */
]
```

## Realworld example
https://github.com/zxdong262/hubspot-embeddable-ringcentral-phone/blob/master/src/chrome-extension/content-insert-config.js