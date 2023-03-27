import '../popup/index.js'
import '../list/index.js'
import { makeTemplate } from '../../common/template.js'
import { BlocksPopup } from '../popup/index.js'
import { BlocksSelectResult } from '../select-result/index.js'

export const resultTemplate = makeTemplate<BlocksSelectResult>(/*html*/ `<bl-select-result></bl-select-result>`)

export const slotTemplate = makeTemplate<HTMLSlotElement>(/*html*/ `<slot part="slot" style="display:none;"></slot>`)

export const popupTemplate = makeTemplate<BlocksPopup>(/*html*/ `
<bl-popup append-to-body origin="top-start" arrow>
  <bl-list class="option-list" checkable id-field="value" label-field="label"></bl-list>
</bl-popup>
`)
