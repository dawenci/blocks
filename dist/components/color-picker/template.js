import { __height_base, __height_large, __height_small, __radius_base, } from '../../theme/var-light.js';
import '../icon/index.js';
import '../input/index.js';
import '../color/index.js';
let templateCache;
export function template() {
    if (templateCache)
        return templateCache;
    const TEMPLATE_CSS = `<style>
  :host {
    display: inline-block;
    box-sizing: border-box;
    width: var(--bl-height-base, ${__height_base});
    height: var(--bl-height-base, ${__height_base});
    user-select: none;
    cursor: default;
    position: relative;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==) repeat;
  }
  :host(:focus) {
    outline: 0 none;
  }
  
  :host([disabled]) #result,
  :host([disabled]) bl-icon {
    cursor: not-allowed;
  }
  
  :host([size="small"]) {
    width: var(--bl-height-small, ${__height_small});
    height: var(--bl-height-small, ${__height_small});
  }
  :host([size="large"]) {
    width: var(--bl-height-large, ${__height_large});
    height: var(--bl-height-large, ${__height_large});
  }
  
  #result {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: var(--bl-radius-base, ${__radius_base});
  }
  bl-icon {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 16px;
    height: 16px;
    padding: 2px;
    margin: auto;
    border-radius: var(--bl-radius-base, ${__radius_base});
    fill: rgba(255,255,255,.8);
  }
  bl-icon.light {
    fill: rgba(0,0,0,.5);
  }
  </style>`;
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
    inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT;
    const popupTemplate = document.createElement('template');
    popupTemplate.innerHTML = TEMPLATE_HTML_POPUP;
    return (templateCache = { inputTemplate, popupTemplate });
}
