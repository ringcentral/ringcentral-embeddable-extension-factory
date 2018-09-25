/**
 * config content insert related feature
 */

export default {

  //content modification for click to call feature
  insertClickToCallButton: [
    {
      urlCheck: href => {
        return href.includes('?interaction=call')
      },
      parentToInsertButton: [
        () => {
          return document.querySelector('.start-call').parentNode
        },
        () => {
          return document
            .querySelector('.panel-is-call button [data-key="twilio.notEnabled.skipOnboarding"]')
            .parentNode.parentNode
        }
      ],
      insertMethod: [
        'insertBefore',
        'append'
      ]
    }
  ],

  //hover contact node to show click to dial tooltip
  hoverShowClickToCallButton: [
    {
      urlCheck: href => {
        return href.includes('contacts/list/view/all/')
      },
      selector: 'table.table tbody tr'
    }
  ]
}
