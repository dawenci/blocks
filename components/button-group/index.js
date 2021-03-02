import '../button/index.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 0;
}
</style>
`
const TEMPLATE_HTML = `
<slot></slot>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksButtonGroup extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

if (!customElements.get('blocks-button-group')) {
  customElements.define('blocks-button-group', BlocksButtonGroup)
}
