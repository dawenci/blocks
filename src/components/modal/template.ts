import '../dialog/index.js'
import '../button/index.js'
import '../input/index.js'
import { makeElement } from '../../common/makeElement.js'
import { makeDomTemplate } from '../../common/template.js'

export const confirmButtonTemplate = makeDomTemplate(
  makeElement({
    tagName: 'bl-button',
    attrs: {
      type: 'primary',
      slot: 'footer',
    },
    props: {
      className: 'confirm',
    },
    children: ['确定'],
  })
)

export const cancelButtonTemplate = makeDomTemplate(
  makeElement({
    tagName: 'bl-button',
    attrs: {
      slot: 'footer',
    },
    props: {
      className: 'cancel',
    },
    styles: {
      marginRight: '8px',
    },
    children: ['取消'],
  })
)
