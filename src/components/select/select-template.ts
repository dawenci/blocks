import { __radius_base } from '../../theme/var-light.js'
import { makeStyleTemplate, makeTemplate } from '../../common/template.js'
import { BlocksPopup } from '../popup/index.js'

export const styleTemplate = makeStyleTemplate(/*css*/ `
:host(.dropdown)::part(suffix) {
  transform: rotate(180deg);
}
`)

export const slotTemplate = makeTemplate<HTMLSlotElement>(
  /*html*/ `<slot style="display:none;"></slot>`
)

export const popupTemplate =
  makeTemplate<BlocksPopup>(/*html*/ `<bl-popup append-to-body origin="top-start" arrow>
<div class="option-list" style="overflow:hidden;min-height:20px;border-radius:var(--bl-radius-base, ${__radius_base});"></div>
</bl-popup>`)
