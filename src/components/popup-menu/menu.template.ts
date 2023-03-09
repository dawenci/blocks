import './menu-group.js'
import './menu-item.js'
import { makeDomTemplate } from '../../common/template.js'

export const itemTemplate = makeDomTemplate(
  document.createElement('bl-popup-menu-item')
)
export const groupTemplate = makeDomTemplate(
  document.createElement('bl-popup-menu-group')
)
