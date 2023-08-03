import { makeTemplate } from '../../common/template.js';
export const resultTemplate = makeTemplate(`
<bl-pair-result part="result" id="result"></bl-pair-result>
`);
export const popupTemplate = makeTemplate(`
<bl-popup append-to-body class="datetime-picker-popup" origin="top-start" arrow="8">
  <bl-datetime part="datetime"></bl-datetime>
  <div id="action" style="padding:5px;text-align:center;">
    <bl-button block type="primary" size="small">确定</bl-button>
  </div>
</bl-popup>
`);
