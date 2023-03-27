import '../popup/index.js'
import '../list/index.js'
import { makeDomTemplate, makeFragmentTemplate, makeStyleTemplate } from '../../common/template.js'

export const styleTemplate = makeStyleTemplate(/*css*/ `
bl-list {
  width: 100%;
  height: 100%;
  font-size: 14px;
}
`)

export const template = makeFragmentTemplate(/*html*/ `<slot></slot>`)

export const popupTemplate = makeDomTemplate(document.createElement('bl-popup'))

export const listTemplate = makeDomTemplate(document.createElement('bl-list'))
