import { makeTemplate } from '../../common/template.js';
export const resultTemplate = makeTemplate(`
<div id="layout"><bl-icon value="down"></bl-icon></div>
`);
export const popupTemplate = makeTemplate(`
<bl-popup append-to-body class="color-picker-popup" origin="top-start" arrow="8" autoflip>
  <bl-color class="color-picker-panel" style="width:234px;"></bl-color>
  <div id="action" style="padding:5px;text-align:center;display:flex;">
    <bl-button type="primary" size="small" style="flex:1 1 auto;">确定</bl-button>
  </div>
</bl-popup>
`);
