import {
  __color_primary,
  __color_danger,
  __color_success,
  __color_warning,
  __transition_duration,
  __fg_base,
  __bg_base,
  __radius_base,
} from '../../theme/var-light.js'

let templateCache: HTMLTemplateElement

export function template() {
  if (templateCache) return templateCache

  const TEMPLATE_CSS = /*html*/ `<style>
  :host {
    display: inline-block;
    box-sizing: border-box;
    margin: 8px 28px;
    box-shadow: 0 0 5px -2px rgb(0,0,0,0.16),
      0 0 16px 0 rgb(0,0,0,0.08),
      0 0 28px 8px rgb(0,0,0,0.05);
    transition: all var(--transition-duration, ${__transition_duration}) ease-out;
    border-radius: var(--bl-radius-base, ${__radius_base});
    pointer-events: auto;
    background-color: var(--bl-bg-base, ${__bg_base});
    color: var(--bl-fg-base, ${__fg_base});
  }
  #layout {
    box-sizing: border-box;
    display: flex;
    flex-flow: row nowrap;  
    width: 100%;
    padding: 12px;
    position: relative;
  }
  #icon {
    flex: 0 0 auto;
    width: 24px;
    height: 24px;
    margin: 0 8px 0 0;
  }
  #icon:empty {
    display: none;
  }
  #main {
    flex: 1 1 100%;
  }
  ::slotted(h1) {
    margin: 0;
    font-size: 16px;
  }
  #content {
    line-height: 24px;
    font-size: 14px;
  }
  #close {
    flex: 0 0 auto;
    display: block;
    width: 18px;
    height: 18px;
    margin: 3px 0 0 12px;
    padding: 0;
    border: 0 none;
    background: transparent;
    fill: #aaa;
  }
  #close:hover {
    fill: #888;
  }
  #close:focus {
    outline: 0 none;
  }
  #close svg {
    width: 100%;
    height: 100%;
  }
  
  :host([type="success"]) {
    background-color: var(--bl-color-success-base, ${__color_success});
    color: #fff;
    fill: #fff;
  }
  :host([type="error"]) {
    background-color: var(--bl-color-danger-base, ${__color_danger});
    color: #fff;
    fill: #fff;
  }
  :host([type="warning"]) {
    background-color: var(--bl-color-warning-base, ${__color_warning});
    color: #fff;
    fill: #fff;
  }
  :host([type="info"]) {
    background-color: var(--bl-color-primary-base, ${__color_primary});
    color: #fff;
    fill: #fff;
  }
  </style>`

  const TEMPLATE_HTML = /*html*/ `
  <div id="layout">
    <div id="icon"></div>
    <div id="main">
      <div id="content">
        <slot></slot>
      </div>
    </div>
  </div>
  `

  const template = document.createElement('template')
  template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML
  return (templateCache = template)
}
