import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach } from '../../common/utils.js'
import { __color_primary, __fg_secondary, __font_family } from '../../theme/var.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: block;
  margin: 10px 0;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
}
#head {
  margin: 5px 10px;
  padding: 5px 0;
  font-weight: 500;
  font-size: 12px;
  color: var(--fg-secondary, ${__fg_secondary});
  cursor: default;
}
</style>
`
const TEMPLATE_HTML = `<div id="head"></div><div id="body"><slot></slot></div>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

const itemTemplate = document.createElement('bl-popup-menu-item')

export class BlocksPopupMenuGroup extends HTMLElement {
  static get observedAttributes() {
    return ['title']
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$head = this.shadowRoot.getElementById('head')
    this.$body = this.shadowRoot.getElementById('body')
  }

  get title() {
    return this.getAttribute('title')
  }

  set title(value) {
    this.setAttribute('title', value)
  }

  get data() {
    return this._data ?? {}
  }

  set data(value) {
    this._data = value
    this.render()
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    const data = this.data
    if (data.title) {
      this.$head.textContent = data.title
      this.$head.style.display = 'block'
    }
    else {
      this.$head.style.display = 'none'
    }

    const bodyFragment = document.createDocumentFragment()
    ;(this.data.data ?? []).forEach(item => {
      // 嵌套分组不作支持（可以简单实现支持，但场景不明）
      if (!item.label && item.data) {
        console.warn('Nested grouping is not supported.')
        return
      }
      // item
      const $item = bodyFragment.appendChild(itemTemplate.cloneNode(true))
      $item.$hostMenu = this.$hostMenu
      // data 赋值在后（会触发 render）
      $item.data = item
    })
    this.$body.innerHTML = ''
    this.$body.appendChild(bodyFragment)
  }

  clearActive() {
    forEach(this.$body.children, child => {
      if (child.clearActive) child.clearActive()
    })
  }
}

if (!customElements.get('bl-popup-menu-group')) {
  customElements.define('bl-popup-menu-group', BlocksPopupMenuGroup)
}
