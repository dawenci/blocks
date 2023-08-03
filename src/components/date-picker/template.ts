import { makeTemplate } from '../../common/template.js'

export const resultTemplate = makeTemplate<'bl-select-result'>(/*html*/ `
<bl-select-result id="result" suffix-icon="date"></bl-select-result>
`)

export const popupTemplate = makeTemplate<'bl-popup'>(/*html*/ `
<bl-popup append-to-body class="date-picker-popup" origin="top-start" arrow="8" autoflip>
  <bl-date class="date-picker-panel"></bl-date>
  <div id="action" style="display:none;padding:5px;text-align:center;">
    <bl-button type="primary" size="small" block>确定</bl-button>
  </div>
</bl-popup>
`)
