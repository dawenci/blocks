import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_light, __dark_border_color_light, __color_primary, __fg_secondary, __font_family } from '../theme/var.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { forEach } from '../../common/utils.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: block;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
}
#head {
  margin: 5px 10px;
  padding: 5px;
  border-bottom: 1px solid var(--border-color-light, ${__border_color_light});
  font-weight: 700;
  color: var(--fg-secondary, ${__fg_secondary});
}
:host-context(bl-nav-menu[dark]) #head {
  border-bottom: 1px solid var(--border-color-light-dark, ${__dark_border_color_light});
}
</style>
`
const TEMPLATE_HTML = `<div id="head"></div><div id="body"><slot></slot></div>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

const itemTemplate = document.createElement('bl-nav-menu-item')

class BlocksNavMenuGroup extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'horizontal', 'collapse']
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

  get horizontal() {
    return boolGetter('horizontal')(this)
  }

  set horizontal(value) {
    boolSetter('horizontal')(this, value)
  }

  get collapse() {
    return boolGetter('collapse')(this)
  }

  set collapse(value) {
    boolSetter('collapse')(this, value)
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
      // 嵌套 group 不作支持
      if (!item.label && item.data) return

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

if (!customElements.get('bl-nav-menu-group')) {
  customElements.define('bl-nav-menu-group', BlocksNavMenuGroup)
}
