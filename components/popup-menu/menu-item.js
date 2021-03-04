import '../../components/popup/index.js'
import '../../components/icon/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { __fg_base, __fg_base_hover, __fg_base_active, __fg_disabled, __fg_placeholder, __font_family } from '../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  position: relative;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
  box-sizing: border-box;
  color: var(--fg-base, ${__fg_base});
  fill: var(--fg-base, ${__fg_base});
  cursor: default;
}
:host(:not([disabled]):hover) {
  background-color: #f0f0f0;
  color: var(--fg-base-hover, ${__fg_base_hover});
  fill: var(--fg-base-hover, ${__fg_base_hover});
}
:host(:not([disabled]):active) {
  background-color: #f0f0f0;
  color: var(--fg-base-active, ${__fg_base_active});
  fill: var(--fg-base-active, ${__fg_base_active});
}
:host([link]) {
  cursor: pointer;
}
:host([disabled]) {
  color: var(--fg-disabled, ${__fg_disabled});
  fill: var(--fg-disabled, ${__fg_disabled});
  cursor: not-allowed;
}

#layout {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
}
#label {
  overflow: hidden;
  flex: 1 1 auto;
  display: flex;
  margin-right: 10px;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#arrow {
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  fill: var(--fg-placeholder, ${__fg_placeholder});
}
#icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
blocks-icon {
  display: none;
}
:host(.has-submenu) blocks-icon {
  display: inline-block;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <blocks-icon id="icon"></blocks-icon>
  <div id="label"></div>
  <blocks-icon id="arrow" value="right"></blocks-icon>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

const menuTemplate = document.createElement('blocks-popup-menu')

class BlocksPopupMenuItem extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'link']
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

      if (this.data.handler) {
        this.data.handler(e)
      }
      else if (this.data.href) {
        window.open(this.data.href, this.data.target ?? '_blank')
      }
    })

    this.onmouseenter = () => {
      if (this.$submenu) {
        clearTimeout(this._enterTimer)
        if (!document.body.contains(this.$submenu)) {
          document.body.appendChild(this.$submenu)
        }
        this.$submenu.open = true
        // 清理子菜单的 leave timer，避免子菜单被关闭
        clearTimeout(this.$submenu._enterTimer)
      }
    }

    this.onmouseleave = () => {
      if (this.$submenu) {
        clearTimeout(this._enterTimer)

        this._enterTimer = setTimeout(() => {
          this.$submenu.open = false
        }, 200)

        // 清理子菜单 leave 的 timer，控制权交给 this 的 timer
        if (this.$parentItem) {
          clearTimeout(this.$parentItem._enterTimer)
        }
      }
    }
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

    if (this.hasSubmenu) {
      this.classList.add('has-submenu')
      this.$submenu = menuTemplate.cloneNode(true)
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
}

if (!customElements.get('blocks-popup-menu-item')) {
  customElements.define('blocks-popup-menu-item', BlocksPopupMenuItem)
}
