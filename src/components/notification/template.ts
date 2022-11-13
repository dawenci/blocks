import {
  __transition_duration,
  __fg_base,
  __bg_base,
} from '../../theme/var-light.js'

let templateCache: HTMLTemplateElement

export function template() {
  if (templateCache) return templateCache
  const TEMPLATE_CSS = /*html*/ `<style>
  :host {
    display: block;
    box-sizing: border-box;
    width: 350px;
    margin: 8px 28px;
    box-shadow: 0 0 5px -2px rgb(0,0,0,0.16),
      0 0 16px 0 rgb(0,0,0,0.08),
      0 0 28px 8px rgb(0,0,0,0.05);
    transition: all var(--transition-duration, ${__transition_duration}) ease-out;
    pointer-events: auto;
  }
  #layout {
    box-sizing: border-box;
    display: flex;
    flex-flow: row nowrap;  
    width: 100%;
    padding: 15px;
    position: relative;
    background-color: var(--bl-bg-base, ${__bg_base});
    color: var(--bl-fg-base, ${__fg_base});
  }
  #icon {
    flex: 0 0 auto;
    width: 24px;
    height: 24px;
    margin: 0 12px 0 0;
  }
  #icon:empty {
    display: none;
  }
  #main {
    flex: 1 1 100%;
  }
  #title {
    font-size: 16px;
    margin: 2px 0 4px;
  }
  #title:empty {
    display: none;
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
    margin: 0 0 0 12px;
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
  </style>`

  const TEMPLATE_HTML = /*html*/ `
  <div id="layout">
    <div id="icon"></div>
    <div id="main">
      <div id="title">
        <slot name="title"></slot>
      </div>
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
