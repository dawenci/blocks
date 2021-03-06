import '../../components/icon/index.js'
import '../../components/popup-menu/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __fg_base, __fg_base_hover, __fg_base_active, __fg_disabled, __fg_placeholder, __font_family, __height_base, __height_large, __transition_duration, __height_small, __color_primary, __dark_bg_base_hover, __bg_base_hover, __dark_fg_base_hover, __bg_base_active, __dark_bg_base_active, __dark_fg_base_active, __dark_fg_base } from '../../theme/var.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { dispatchEvent } from '../../common/event.js'

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  position: relative;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
  box-sizing: border-box;
  user-select: none;
}
#layout {
  box-sizing: box-sizing;
  display: flex;
  justify-content: center;
  align-items: center;
}
#label {
  overflow: hidden;
  flex: 1 1 auto;
  align-items: center;
  white-space: nowrap;
  display: inline;
  text-overflow: ellipsis;
}
#arrow {
  position: relative;
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  margin-left: 5px;
  fill: var(--fg-placeholder, ${__fg_placeholder});
  transition: transform var(--transition-duration, ${__transition_duration});
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

/* color */
#layout {
  color: var(--fg-base, ${__fg_base});
  fill: var(--fg-base, ${__fg_base});
  cursor: default;
}
:host-context(bl-nav-menu[dark]) #layout {
  color: var(--fg-base-dark, ${__dark_fg_base});
  fill: var(--fg-base-dark, ${__dark_fg_base});
}

:host #layout:hover,
:host(.submenu-open) #layout {
  background-color: var(--bg-base-hover, ${__bg_base_hover});
  color: var(--fg-base-hover, ${__fg_base_hover});
  fill: var(--fg-base-hover, ${__fg_base_hover});
}
:host-context(bl-nav-menu[dark]) #layout:hover,
:host-context(bl-nav-menu[dark]):host(.submenu-open) #layout {
  background-color: var(--bg-base-dark-hover, ${__dark_bg_base_hover});
  color: var(--fg-base-dark-hover, ${__dark_fg_base_hover});
  fill: var(--fg-base-hover, ${__dark_fg_base_hover});
}

:host #layout:active {
  background-color: var(--bg-base-active, ${__bg_base_active});
  color: var(--fg-base-active, ${__fg_base_active});
  fill: var(--fg-base-active, ${__fg_base_active});
}
:host-context(bl-nav-menu[dark]) #layout:active {
  background-color: var(--bg-base-dark-hover, ${__dark_bg_base_active});
  color: var(--fg-base-dark-hover, ${__dark_fg_base_active});
  fill: var(--fg-base-hover, ${__dark_fg_base_active});
}

:host([active]) #layout,
:host([active]) #layout:hover,
:host([active]) #layout:active {
  color: var(--color-primary, ${__color_primary});
  fill: var(--color-primary, ${__color_primary});
}

:host([link]) #layout {
  cursor: pointer;
}
:host([disabled]) #layout,
:host([disabled]:hover) #layout,
:host([disabled]:active) #layout {
  color: var(--fg-disabled, ${__fg_disabled});
  fill: var(--fg-disabled, ${__fg_disabled});
  cursor: not-allowed;
}

/* 由于子菜单可能 inline，高度设置在 layout，而非 host */
:host([active]) #layout {
  box-shadow: inset -2px 0 0 var(--color-primary, ${__color_primary}), 1px 0 0 var(--color-primary, ${__color_primary});
}
:host([disabled][active]) #layout {
  box-shadow: inset -2px 0 0 var(--fg-disabled, ${__fg_disabled}), 1px 0 0 var(--fg-disabled, ${__fg_disabled});
}
:host-context([horizontal]):host([active]) #layout {
  box-shadow: inset 0 -2px 0 var(--color-primary, ${__color_primary}), 0 1px 0 var(--color-primary, ${__color_primary});
}
:host-context([horizontal]):host([disabled][active]) #layout {
  box-shadow: inset 0 -2px 0 var(--fg-disabled, ${__fg_disabled}), 0 1px 0 var(--fg-disabled, ${__fg_disabled});
}

:host-context([horizontal]) {
  flex: 0 0 auto;
}
:host-context([horizontal]) #arrow,
:host-context([inline]) #arrow {
  transform: rotate(90deg);
}
:host-context([horizontal]):host(.submenu-open) #arrow,
:host-context([inline]):host([expand]) #arrow {
  transform: rotate(-90deg);
}
:host-context([collapse]) #label,
:host-context([collapse]) #arrow {
  display: none;
}

/* size */
:host {
  --height: var(--height-base, ${__height_base});
}
:host-context(bl-nav-menu[size="small"]) {
  --height: var(--height-small, ${__height_small});
}
:host-context(bl-nav-menu[size="large"]) {
  --height: var(--height-large, ${__height_large});
}
#layout {
  height: var(--height);
  padding: 0 12px;
}
:host-context([horizontal]) #layout {
  padding: 0 16px;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <bl-icon id="icon"></bl-icon>
  <div id="label"></div>
  <bl-icon id="arrow" value="right"></bl-icon>
</div>
<slot></slot>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksNavMenuItem extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'link', 'expand', 'active']
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = this.shadowRoot.getElementById('layout')
    this.$label = this.shadowRoot.getElementById('label')
    this.$icon = this.shadowRoot.getElementById('icon')
    this.$arrow = this.shadowRoot.getElementById('arrow')

    this.$layout.addEventListener('click', e => {
      if (this.disabled) return
      if (this.hasSubmenu) {
        if (this.isInlineMode) {
          this.expand = !this.expand
        }
        else {
          // 点击立即显示子菜单
          if (!document.body.contains(this.$submenu)) {
            document.body.appendChild(this.$submenu)
          }
          clearTimeout(this._leaveTimer)
          clearTimeout(this._enterTimer)
          clearTimeout(this.$submenu._enterTimer)
          clearTimeout(this.$submenu._leaveTimer)
          this.$submenu.open = true
        }
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
    })

    this.onmouseenter = () => {
      if (!this.isInlineMode && this.$submenu) {
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
      if (!this.isInlineMode && this.$submenu) {
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

  get isInlineMode() {
    return this.$rootMenu.inline
  }

  get isCollapseMode() {
    return this.$rootMenu.collapse
  }

  get expand() {
    return boolGetter('expand')(this)
  }

  set expand(value) {
    boolSetter('expand')(this, value)
  }

  get active() {
    return boolGetter('active')(this)
  }

  set active(value) {
    boolSetter('active')(this, value)
  }

  get hasSubmenu() {
    return !!this.data.children?.length
  }

  get disabled() {
    return boolGetter('disabled')(this)
  }

  set disabled(value) {
    boolSetter('disabled')(this, value)
  }

  get link() {
    return boolGetter('link')(this)
  }

  set link(value) {
    boolSetter('link')(this, value)
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

    this.$label.style.paddingLeft = this.$hostMenu.level * 28 + 'px'
    
    if (this.hasSubmenu) {
      this.innerHTML = ''
      this.classList.add('has-submenu')
      if (!this.isInlineMode) {
        this.$submenu = document.createElement('bl-popup-menu')
        this.$submenu.appendToBody = true
        this.$submenu.anchor = () => this

        if (this.$rootMenu.horizontal && this.$hostMenu.level === 0) {
          this.$submenu.origin = 'top-start'
        }
        else {
          this.$submenu.origin = 'left-start'
        }
      }
      else {
        this.$submenu = document.createElement('bl-nav-menu')
        this.$submenu.submenu = true
        this.appendChild(this.$submenu)
      }

      this.$submenu.$parentItem = this
      this.$submenu.$parentMenu = this.$hostMenu
      this.$submenu.enterDelay = this.$hostMenu.enterDelay
      this.$submenu.leaveDelay = this.$hostMenu.leaveDelay
      this.$submenu.dark = this.$hostMenu.dark
      this.$submenu.size = this.$hostMenu.size
      this.$submenu.level = this.$hostMenu.level + 1
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

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'expand' && this.$submenu) {
      this.$submenu.expand = this.expand
    }
  }

  clearActive() {
    this.data.active = false
    this.active = false
    if (this.$submenu) this.$submenu.clearActive()
  }
}

if (!customElements.get('bl-nav-menu-item')) {
  customElements.define('bl-nav-menu-item', BlocksNavMenuItem)
}
