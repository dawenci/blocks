import { __fg_placeholder, __height_base } from '../../theme/var-light.js'
import '../popup/index.js'
import '../time/index.js'

let templateCache: {
  inputTemplate: HTMLTemplateElement
  popupTemplate: HTMLTemplateElement
}

export function template() {
  if (templateCache) return templateCache
  const TEMPLATE_CSS = /*html*/ `<style>
  :host {
    display: inline-block;
    box-sizing: border-box;
    width: calc(var(--bl-height-base, ${__height_base}) * 3 + 12px * 3);
    height: 32px;
    user-select: none;
    cursor: default;
  }
  
  :host(:focus) {
    outline: 0 none;
  }
  
  #result {
    width: 100%;
  }
  
  :host([popup-open]) #result {
    color: var(--bl-fg-placeholder, ${__fg_placeholder});
  }
  </style>`

  const TEMPLATE_HTML_INPUT = /*html*/ `<bl-input suffix-icon="time" id="result" readonly />`

  const TEMPLATE_HTML_POPUP = /*html*/ `
  <bl-popup append-to-body class="time-picker-popup" origin="top-start" arrow autoflip>
    <bl-time class="time-picker-panel"></bl-time>
    <div id="action" style="padding:5px;text-align:center;">
      <bl-button block type="primary" size="small">确定</bl-button>
    </div>
  </bl-popup>
  `

  const inputTemplate = document.createElement('template')
  inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT

  const popupTemplate = document.createElement('template')
  popupTemplate.innerHTML = TEMPLATE_HTML_POPUP

  return (templateCache = {
    inputTemplate,
    popupTemplate,
  })
}
