import { makeElement } from '../../common/makeElement.js'
import { makeDomTemplate, makeTemplate } from '../../common/template.js'
import { PopupOrigin } from '../popup/index.js'

export const resultTemplate = makeTemplate<'bl-pair-result'>(/*html*/ `
<bl-pair-result auto-switch auto-commit></bl-pair-result>
`)

export const popupTemplate = makeDomTemplate(
  makeElement({
    tagName: 'bl-popup',
    props: {
      appendToBody: true,
      className: 'date-picker-popup',
      origin: PopupOrigin.TopStart,
      arrow: 8,
      autoflip: true,
    },
    children: [
      {
        tagName: 'bl-date',
        props: { className: 'date-picker-panel' },
      },
      {
        tagName: 'div',
        props: { id: 'action' },
        styles: {
          display: 'none',
          padding: '5px',
          'text-align': 'center',
        },
        children: [
          {
            tagName: 'bl-button',
            props: {
              type: 'primary',
              size: 'small',
              block: true,
              innerHTML: '确定',
            },
          },
        ],
      },
    ],
  })
)
