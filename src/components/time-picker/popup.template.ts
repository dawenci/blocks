import { makeTemplate } from '../../common/template.js'
import { BlocksPopup } from '../popup/index.js'

export const template = makeTemplate<BlocksPopup>(/*html*/ `
<bl-popup append-to-body class="time-picker-popup" origin="top-start" arrow autoflip>
  <bl-time class="time-picker-panel"></bl-time>
  <div id="action" style="padding:5px;text-align:center;">
    <bl-button block type="primary" size="small">确定</bl-button>
  </div>
</bl-popup>
`)
