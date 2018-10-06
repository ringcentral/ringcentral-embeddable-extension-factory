# Add click to dial button

![](screenshots/fac-1.png)

There is pre-defined functions in `src/chrome-extension/make-phone-number-clickable.js` to help handle inserting click-to-dial button in page, just need to write proper configs in `src/chrome-extension/content-insert-config.js`,
```js
// modify phone number text to click-to-call link
export const phoneNumberSelectors = [
  /*
  {
    urlCheck: (href) => {
      return href.includes('?blade=/details/contact')
    },
    selector: '#modal-details-body .metadata-span-phone'
  }
  */
]

```

## Realworld example
https://github.com/zxdong262/insightly-embeddable-ringcentral-phone/blob/master/src/chrome-extension/content-insert-config.js