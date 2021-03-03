import { definePrivate } from '../../common/definePrivate.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { __border_color_light, __color_primary, __font_family } from '../theme/var.js'

const itemTemplate = document.createElement('blocks-menu-item')
const submenuTemplate = document.createElement('blocks-submenu')
const groupTemplate = document.createElement('blocks-menu-group')

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  display: block;
  width: 250px;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
  border-right: 1px solid var(--border-color-base, ${__border_color_light});
}
:host([horizontal]) {
  width: auto;
  border-right: none;
  border-bottom: 1px solid var(--border-color-base, ${__border_color_light});
}
#menu {
  display: flex;
  flex-flow: column nowrap;
}
:host([horizontal]) #menu {
  flex-flow: row nowrap;
}
</style>`

const TEMPLATE_HTML = `
<div id="menu"></div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksMenu extends HTMLElement {
  static get observedAttributes() {
    return ['horizontal', 'collapse']
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$menu = this.shadowRoot.getElementById('menu')

    definePrivate(this, '_data', [])
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
    return this._data
  }

  set data(value) {
    this._data = value
    this.render()
  }

  render() {
    const fragment = document.createDocumentFragment()
    const render = ($root, data = []) => {
      data.forEach(item => {
        // group
        if (item.data) {
          // 水平模式，不渲染 group，直接渲染里面的项
          if (this.horizontal) {
            render($root, item.data)
          }
          else {
            const $group = $root.appendChild(groupTemplate.cloneNode(true))
            $group.title = item.title
            render($group, item.data)
          }
          return
        }

        // item
        const $item = $root.appendChild(itemTemplate.cloneNode(true))
        $item.data = item
        if (item.image) {
          const $img = $item.appendChild(document.createElement('img'))
          $img.src = item.image
        }
        else if (item.icon) {
          const $icon = getRegisteredSvgIcon(item.icon)
          if ($icon) {
            $item.appendChild($icon)
          }
        }
        const $label = $item.appendChild(document.createElement('span'))
        $label.innerHTML = item.label

        // 垂直模式，且非折叠状态，直接渲染子菜单，否则不直接渲染（必要时 popup 渲染）
        if (item.children && !this.horizontal && !this.collapse) {
          const $submenu = submenuTemplate.cloneNode(true)
          $submenu.setAttribute('slot', 'submenu')
          $item.appendChild($submenu)
          render($submenu, item.children)
        }
      })
    }
    render(fragment, this.data)
    this.$menu.innerHTML = ''
    this.$menu.appendChild(fragment)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
  }
}

if (!customElements.get('blocks-menu')) {
  customElements.define('blocks-menu', BlocksMenu)
}
