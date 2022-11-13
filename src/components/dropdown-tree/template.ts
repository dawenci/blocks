import '../popup/index.js'
import '../tree/index.js'
import { makeDomTemplate, makeStyleTemplate } from '../../common/template.js'

export const styleTemplate = makeStyleTemplate(/*css*/ `
bl-tree {
  width: 200px;
  height: 240px;
  font-size: 14px;
}
`)

export const popupTemplate = makeDomTemplate(document.createElement('bl-popup'))

export const treeTemplate = makeDomTemplate(document.createElement('bl-tree'))
