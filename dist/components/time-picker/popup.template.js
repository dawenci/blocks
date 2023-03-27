import { makeTemplate } from '../../common/template.js';
export const template = makeTemplate(`
<bl-popup append-to-body class="time-picker-popup" origin="top-start" arrow="8" autoflip>
  <bl-time class="time-picker-panel"></bl-time>
  <div id="action" style="padding:5px;text-align:center;">
    <bl-button block type="primary" size="small">确定</bl-button>
  </div>
</bl-popup>
`);
