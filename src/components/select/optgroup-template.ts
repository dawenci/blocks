let templateCache: HTMLTemplateElement

export function template() {
  if (templateCache) return templateCache

  const TEMPLATE_CSS = /*html*/ `<style>
  :host {
    display: block;
    box-sizing: border-box;
    line-height: 1.5;
    font-size: 14px;
  }
  :host(:focus) {
    outline: 0 none;
  }
  
  .header {
    font-weight: 700;
    padding: 4px 10px;
    cursor: default;
  }
  </style>`

  const TEMPLATE_HTML = /*html*/ `
  <header class="header"></header>
  <div class="list">
  <slot></slot>
  </div>
  `

  const template = document.createElement('template')
  template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

  return (templateCache = template)
}
