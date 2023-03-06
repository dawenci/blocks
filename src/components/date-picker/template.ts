import { makeElement } from '../../common/makeElement.js'
import { makeDomTemplate } from '../../common/template.js'
import { BlocksInput } from '../input/index.js'
import { PopupOrigin } from '../popup/index.js'

export const inputTemplate = (() => {
  const $input = makeElement({
    tagName: 'bl-input',
    props: {
      id: 'result',
      suffixIcon: 'date',
      readonly: true,
    },
  })
  return () => $input.cloneNode(true) as BlocksInput
})()

export const popupTemplate = makeDomTemplate(
  makeElement({
    tagName: 'bl-popup',
    props: {
      appendToBody: true,
      className: 'date-picker-popup',
      origin: PopupOrigin.TopStart,
      arrow: true,
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
