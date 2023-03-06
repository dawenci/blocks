import '../icon/index.js';
import '../input/index.js';
import '../color/index.js';
let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const TEMPLATE_HTML_INPUT = `<div id="result"><bl-icon value="down"></bl-icon></div>`;
    const TEMPLATE_HTML_POPUP = `
  <bl-popup append-to-body class="color-picker-popup" origin="top-start" arrow autoflip>
    <bl-color class="color-picker-panel" style="width:234px;"></bl-color>
    <div id="action" style="padding:5px;text-align:center;display:flex;">
      <bl-button type="primary" size="small" style="flex:1 1 auto;">确定</bl-button>
    </div>
  </bl-popup>
  `;
    const inputTemplate = document.createElement('template');
    inputTemplate.innerHTML = TEMPLATE_HTML_INPUT;
    const popupTemplate = document.createElement('template');
    popupTemplate.innerHTML = TEMPLATE_HTML_POPUP;
    return (templateCache = { inputTemplate, popupTemplate });
}
