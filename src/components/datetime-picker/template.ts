import { makeTemplate } from '../../common/template.js'

export const inputTemplate = makeTemplate<'bl-select-result'>(/*html*/ `
<bl-select-result part="result" id="result" suffix-icon="date"></bl-select-result>
`)

export const popupTemplate = makeTemplate<'bl-popup'>(/*html*/ `
<bl-popup append-to-body class="datetime-picker-popup" origin="top-start" arrow="8">
  <bl-datetime part="datetime"></bl-datetime>
  <div id="action" style="padding:5px;text-align:center;">
    <bl-button block type="primary" size="small">确定</bl-button>
  </div>
</bl-popup>
`)
