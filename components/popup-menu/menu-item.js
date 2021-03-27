import '../../components/popup/index.js'
import '../../components/icon/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { __fg_base, __fg_base_hover, __dark_bg_base_hover, __dark_fg_base_hover, __dark_bg_base_active, __dark_fg_base_active, __fg_base_active, __fg_disabled, __fg_placeholder, __font_family, __color_primary, __height_base, __height_small, __height_large, __dark_fg_base, __bg_base_hover } from '../../theme/var.js'
import { activeGetter, activeSetter, disabledGetter, disabledSetter } from '../../common/propertyAccessor.js'
import { dispatchEvent } from '../../common/event.js'
import { forEach } from '../../common/utils.js'

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  position: relative;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
  box-sizing: border-box;
  color: var(--fg-base, ${__fg_base});
  fill: var(--fg-base, ${__fg_base});
  user-select: none;
  cursor: default;
}
:host-context(bl-popup-menu[dark]) {
  color: var(--fg-base-dark, ${__dark_fg_base});
  fill: var(--fg-base-dark, ${__dark_fg_base});
}

:host(:hover),
:host(.submenu-open) {
  background-color: var(--bg-base-hover, ${__bg_base_hover});
  color: var(--fg-base-hover, ${__fg_base_hover});
  fill: var(--fg-base-hover, ${__fg_base_hover});
}
:host-context(bl-popup-menu[dark]):host(:hover),
:host-context(bl-popup-menu[dark]):host(.submenu-open) {
  background-color: var(--bg-base-dark-hover, ${__dark_bg_base_hover});
  color: var(--fg-base-dark-hover, ${__dark_fg_base_hover});
  fill: var(--fg-base-hover, ${__dark_fg_base_hover});
}

:host(:active),
:host(.submenu-open:active) {
  background-color: #f0f0f0;
  color: var(--fg-base-active, ${__fg_base_active});
  fill: var(--fg-base-active, ${__fg_base_active});
}
:host-context(bl-popup-menu[dark]):host(:active),
:host-context(bl-popup-menu[dark]):host(.submenu-open:active) {
  background-color: var(--bg-base-dark-hover, ${__dark_bg_base_active});
  color: var(--fg-base-dark-hover, ${__dark_fg_base_active});
  fill: var(--fg-base-hover, ${__dark_fg_base_active});
}

:host([link]) {
  cursor: pointer;
}
:host([active]),
:host([active]:hover),
:host([active]:active) {
  color: var(--color-primary, ${__color_primary});
  fill: var(--color-primary, ${__color_primary});
}
:host([disabled]),
:host([disabled]:hover),
:host([disabled]:active) {
  color: var(--fg-disabled, ${__fg_disabled});
  fill: var(--fg-disabled, ${__fg_disabled});
  cursor: not-allowed;
}

#layout {
  display: flex;
  align-items: center;
  height: 100%;
}
#label {
  overflow: hidden;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#arrow {
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  margin-left: 5px;
  fill: var(--fg-placeholder, ${__fg_placeholder});
}
#icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
bl-icon {
  display: none;
}
:host(.has-submenu) bl-icon {
  display: inline-block;
}

/* size */
:host {
  height: var(--height-base, ${__height_base});
}
:host-context(bl-popup-menu[size="small"]) {
  height: var(--height-small, ${__height_small});
}
:host-context(bl-popup-menu[size="large"]) {
  height: var(--height-large, ${__height_large});
}
#layout {
  padding: 0 12px;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <bl-icon id="icon"></bl-icon>
  <div id="label"></div>
  <bl-icon id="arrow" value="right"></bl-icon>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

const menuTemplate = document.createElement('bl-popup-menu')

class BlocksPopupMenuItem extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'link', 'active']
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = this.shadowRoot.getElementById('layout')
    this.$label = this.shadowRoot.getElementById('label')
    this.$icon = this.shadowRoot.getElementById('icon')
    this.$arrow = this.shadowRoot.getElementById('arrow')

    this.addEventListener('click', e => {
      if (this.disabled) return
      if (this.hasSubmenu) {
        // 点击立即显示子菜单
        if (!document.body.contains(this.$submenu)) {
          document.body.appendChild(this.$submenu)
        }
        clearTimeout(this._leaveTimer)
        clearTimeout(this._enterTimer)
        clearTimeout(this.$submenu._enterTimer)
        clearTimeout(this.$submenu._leaveTimer)
        this.$submenu.open = true
        return
      }

      if (this.data.handler) {
        this.data.handler(e)
      }
      else if (this.data.href) {
        window.open(this.data.href, this.data.target ?? '_blank')
      }

      if (this.$rootMenu) {
        dispatchEvent(this.$rootMenu, 'active', { detail: { $item: this } })
      }
      this.$hostMenu.closeAll()
    })

    this.onmouseenter = () => {
      if (this.$submenu) {
        if (!document.body.contains(this.$submenu)) {
          document.body.appendChild(this.$submenu)
        }

        // 子菜单的 enter 控制权转移到 this
        clearTimeout(this.$submenu._enterTimer)
        clearTimeout(this._enterTimer)
        this._enterTimer = setTimeout(() => {
          this.$submenu.open = true
        }, this.$hostMenu.enterDelay)
        
        clearTimeout(this._leaveTimer)
        // 清理子菜单的 leave timer，避免子菜单被关闭
        clearTimeout(this.$submenu._leaveTimer)
      }
    }

    this.onmouseleave = () => {
      if (this.$submenu) {
        // 清理子菜单 leave 的 timer，控制权交给 this 的 timer
        clearTimeout(this.$submenu._leaveTimer)
        clearTimeout(this._leaveTimer)
        this._leaveTimer = setTimeout(() => {
          this.$submenu.open = false
        }, this.$hostMenu.leaveDelay)

        clearTimeout(this._enterTimer)
        // 清理子菜单的 enter timer，避免子菜单被打开
        clearTimeout(this.$submenu._enterTimer)
      }
    }
  }

  get $rootMenu() {
    let $menu = this.$hostMenu
    while ($menu.$parentMenu) $menu = $menu.$parentMenu
    return $menu
  }

  get hasSubmenu() {
    return !!this.data.children?.length
  }

  get isLeaf() {
    return !this.hasSubmenu
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get link() {
    return boolGetter('link')(this)
  }

  set link(value) {
    boolSetter('link')(this, value)
  }

  get active() {
    return activeGetter(this)
  }

  set active(value) {
    activeSetter(this, value)
  }

  get data() {
    return this._data ?? {}
  }

  set data(value) {
    this._data = value
    this.render()
  }

  render() {
    const data = this.data
    this.disabled = !!data.disabled

    if (data.icon) {
      this.$icon.value = data.icon
      this.$icon.style.display = 'block'
    }
    else {
      this.$icon.value = ''
      this.$icon.style.display = 'none'
    }

    this.$label.textContent = data.label ?? ''

    this.link = !!data.href

    this.active = !!data.active

    if (this.hasSubmenu) {
      this.classList.add('has-submenu')
      this.$submenu = menuTemplate.cloneNode(true)
      this.$submenu.dark = this.$hostMenu.dark
      this.$submenu.size = this.$hostMenu.size
      this.$submenu.enterDelay = this.$hostMenu.enterDelay
      this.$submenu.leaveDelay = this.$hostMenu.leaveDelay
      this.$submenu.appendToBody = true
      this.$submenu.$parentItem = this
      this.$submenu.$parentMenu = this.$hostMenu
      this.$submenu.level = this.$hostMenu.level + 1
      this.$submenu.anchor = () => this
      this.$submenu.origin = 'left-start'
      this.$submenu.data = data.children
    }
    else {
      this.classList.remove('has-submenu')
      this.$submenu = null
    }
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {
    if (this.$submenu && document.body.contains(this.$submenu)) {
      this.$submenu.parentElement.removeChild(this.$submenu)
    }
  }

  clearActive() {
    this.data.active = false
    this.active = false
    if (this.$submenu) this.$submenu.clearActive()
  }
}

if (!customElements.get('bl-popup-menu-item')) {
  customElements.define('bl-popup-menu-item', BlocksPopupMenuItem)
}
