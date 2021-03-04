import { definePrivate } from '../../common/definePrivate.js'
import { boolGetter, boolSetter, intGetter, intSetter } from '../../common/property.js'
import { darkGetter, darkSetter, sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach } from '../../common/utils.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { __bg_base, __bg_baseDark, __border_color_light, __color_primary, __fg_base, __fg_baseDark, __font_family, __transition_duration } from '../theme/var.js'

const itemTemplate = document.createElement('blocks-nav-menu-item')
const groupTemplate = document.createElement('blocks-nav-menu-group')

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  transition: height var(--transition-duration, ${__transition_duration});
  background-color: var(--bg-base, ${__bg_base});
  color: var(--fg-base, ${__fg_base});
}
:host([dark]) {
  background-color: var(--bg-base-dark, ${__bg_baseDark});
  color: var(--fg-base-dark, ${__fg_baseDark});
}
:host([horizontal]) {
  width: auto;
  flex-flow: row nowrap;
}
:host(:not([submenu])) {
  border-right: 1px solid var(--border-color-base, ${__border_color_light});
  border-bottom: none;
}
:host(:not([submenu])[horizontal]) {
  border-bottom: 1px solid var(--border-color-base, ${__border_color_light});
  border-right: none;
}
:host([submenu][expand]) {
  height: auto;
}
:host([submenu]:not([expand])) {
  overflow: hidden;
  height: 0;
}

/* 垂直模式顶级菜单的折叠模式 */
:host(:not([horizontal]):not([submenu])[collapse]) {
  width: 80px;
  overflow: hidden;
}
</style>`

const TEMPLATE_HTML = `<slot></slot>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

// TODO, collapse 模式，tooltip 显示一级菜单文本
class BlocksNavMenu extends HTMLElement {
  static get observedAttributes() {
    return ['horizontal', 'collapse', 'inline', 'submenu', 'level', 'expand', 'size', 'dark']
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$menu = this.shadowRoot.getElementById('menu')

    definePrivate(this, '_data', [])
    this.$parentMenu = null

    this.addEventListener('active', (e) => {
      this.clearActive()
      let $item = e.detail.$item
      while ($item) {
        $item.data.active = true
        $item.active = true
        $item = $item.$hostMenu.$parentItem
      }
    })
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  get level() {
    return intGetter('level')(this) || 0
  }

  set level(value) {
    intSetter('level')(this, value)
  }

  get submenu() {
    return boolGetter('submenu')(this)
  }

  set submenu(value) {
    boolSetter('submenu')(this, value)
  }

  get expand() {
    return boolGetter('expand')(this)
  }

  set expand(value) {
    boolSetter('expand')(this, value)
  }

  get inline() {
    return boolGetter('inline')(this)
  }

  set inline(value) {
    boolSetter('inline')(this, value)
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

  get dark() {
    return darkGetter(this)
  }

  set dark(value) {
    darkSetter(this, value)
  }

  // 清空整棵树上的菜单激活状态
  clearActive() {
    forEach(this.children, child => {
      if (child.clearActive) child.clearActive()
    })
  }

  horizontalRender() {
    const fragment = document.createDocumentFragment()
    const render = ($root, data = []) => {
      data.forEach(item => {
        // 不渲染 group，直接渲染里面的项
        if (item.data) {
          render($root, item.data)
          return
        }
        // item
        const $item = $root.appendChild(itemTemplate.cloneNode(true))
        $item.$hostMenu = this
        $item.data = item
      })
    }
    render(fragment, this.data)
    this.innerHTML = ''
    this.appendChild(fragment)
  }

  verticalRender() {
    const fragment = document.createDocumentFragment()
    const render = ($root, data = []) => {
      data.forEach(item => {
        // 不渲染 group，直接渲染里面的项
        if (item.data) {
          if (this.collapse) {
            render($root, item.data)
          }
          else {
            const $group = $root.appendChild(groupTemplate.cloneNode(true))
            $group.horizontal = this.horizontal
            $group.collapse = this.collapse
            $group.$hostMenu = this
            $group.data = item
          }
          return
        }
        // item
        const $item = $root.appendChild(itemTemplate.cloneNode(true))
        $item.$hostMenu = this
        $item.data = item
      })
    }
    render(fragment, this.data)
    this.innerHTML = ''
    this.appendChild(fragment)
  }

  render() {
    // 水平模式
    if (this.horizontal) {
      this.horizontalRender()
    }

    // 垂直模式
    else {
      this.verticalRender()
    }
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
    // collapse 和 inline 互斥，inline 和 horizontal 互斥
    this.render()
  }
}

if (!customElements.get('blocks-nav-menu')) {
  customElements.define('blocks-nav-menu', BlocksNavMenu)
}
