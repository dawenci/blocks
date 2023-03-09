import '../../components/popup/index.js'
import '../../components/icon/index.js'
import { dispatchEvent } from '../../common/event.js'
import { BlocksPopupMenu } from './menu.js'
import { Component } from '../Component.js'
import { BlocksNavMenu } from '../nav-menu/menu.js'
import { contentTemplate, menuTemplate } from './menu-item.template.js'
import { style } from './menu-item.style.js'
import { BlocksIcon } from '../../components/icon/index.js'
import { PopupOrigin } from '../../components/popup/index.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'

@defineClass({
  customElement: 'bl-popup-menu-item',
  styles: [style],
})
export class BlocksPopupMenuItem extends Component {
  @attr('boolean') accessor disabled!: boolean

  @attr('boolean') accessor link!: boolean

  @attr('boolean') accessor active!: boolean

  _enterTimer?: number
  _leaveTimer?: number

  $layout: HTMLElement
  $label: HTMLElement
  $icon: HTMLElement
  $arrow: HTMLElement

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(contentTemplate())
    this.$layout = shadowRoot.getElementById('layout')!
    this.$label = shadowRoot.getElementById('label')!
    this.$icon = shadowRoot.getElementById('icon')!
    this.$arrow = shadowRoot.getElementById('arrow')!

    this.addEventListener('click', e => {
      if (this.disabled) return
      if (this.hasSubmenu) {
        // 点击立即显示子菜单
        if (!document.body.contains(this.$submenu!)) {
          document.body.appendChild(this.$submenu!)
        }
        this.clearEnterTimer()
        this.clearLeaveTimer()

        if (this.$submenu) {
          this.$submenu.clearEnterTimer()
          this.$submenu.clearLeaveTimer()
          this.$submenu.open = true
        }
        return
      }

      if (this.data.handler) {
        this.data.handler(e)
      } else if (this.data.href) {
        window.open(this.data.href, this.data.target ?? '_blank')
      }

      if (this.$rootMenu) {
        dispatchEvent(this.$rootMenu, 'active', { detail: { $item: this } })
      }
      ;(this.$hostMenu as any).closeAll()
    })

    this.onmouseenter = () => {
      if (this.$submenu) {
        if (!document.body.contains(this.$submenu)) {
          document.body.appendChild(this.$submenu)
        }

        // 子菜单的 enter 控制权转移到 this
        clearTimeout((this.$submenu as any)._enterTimer!)
        clearTimeout(this._enterTimer)
        this._enterTimer = setTimeout(() => {
          this.$submenu!.open = true
        }, (this.$hostMenu as any).enterDelay)

        clearTimeout(this._leaveTimer)
        // 清理子菜单的 leave timer，避免子菜单被关闭
        clearTimeout((this.$submenu as any)._leaveTimer)
      }
    }

    this.onmouseleave = () => {
      if (this.$submenu) {
        // 清理子菜单 leave 的 timer，控制权交给 this 的 timer
        clearTimeout((this.$submenu as any)._leaveTimer)
        clearTimeout(this._leaveTimer)
        this._leaveTimer = setTimeout(() => {
          ;(this.$submenu as any).open = false
        }, (this.$hostMenu as any).leaveDelay)

        clearTimeout(this._enterTimer)
        // 清理子菜单的 enter timer，避免子菜单被打开
        clearTimeout((this.$submenu as any)._enterTimer)
      }
    }
  }

  #submenu?: BlocksPopupMenu
  get $submenu() {
    return this.#submenu
  }
  set $submenu($menu) {
    this.#submenu = $menu
  }

  #hostMenu?: BlocksNavMenu | BlocksPopupMenu
  get $hostMenu() {
    return this.#hostMenu
  }
  set $hostMenu($menu) {
    this.#hostMenu = $menu
  }

  get $rootMenu() {
    let $menu = this.$hostMenu!
    while ($menu.$parentMenu) $menu = $menu.$parentMenu
    return $menu
  }

  get hasSubmenu() {
    return !!this.data.children?.length
  }

  get isLeaf() {
    return !this.hasSubmenu
  }

  _data?: any
  get data() {
    return this._data ?? {}
  }

  set data(value) {
    this._data = value
    this.render()
  }

  override render() {
    const data = this.data
    this.disabled = !!data.disabled

    if (data.icon) {
      ;(this.$icon as BlocksIcon).value = data.icon
      this.$icon.style.display = 'block'
    } else {
      ;(this.$icon as BlocksIcon).value = ''
      this.$icon.style.display = 'none'
    }

    this.$label.textContent = data.label ?? ''

    this.link = !!data.href

    this.active = !!data.active

    if (this.hasSubmenu) {
      this.classList.add('has-submenu')
      this.$submenu = menuTemplate()
      this.$submenu.size = this.$hostMenu!.size
      this.$submenu.enterDelay = this.$hostMenu!.enterDelay!
      this.$submenu.leaveDelay = this.$hostMenu!.leaveDelay!
      this.$submenu.appendToBody = true
      this.$submenu.$parentItem = this
      this.$submenu.$parentMenu = this.$hostMenu
      this.$submenu.level = this.$hostMenu!.level + 1
      this.$submenu.anchor = () => this
      this.$submenu.origin = PopupOrigin.LeftStart
      this.$submenu.data = data.children
    } else {
      this.classList.remove('has-submenu')
      this.$submenu = undefined
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this.$submenu && document.body.contains(this.$submenu)) {
      this.$submenu.parentElement!.removeChild(this.$submenu)
    }
  }

  clearEnterTimer() {
    clearTimeout(this._enterTimer)
  }

  clearLeaveTimer() {
    clearTimeout(this._leaveTimer)
  }

  clearActive() {
    this.data.active = false
    this.active = false
    if (this.$submenu) this.$submenu.clearActive()
  }
}
