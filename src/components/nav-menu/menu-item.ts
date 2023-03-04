import '../icon/index.js'
import '../popup-menu/index.js'
import { dispatchEvent } from '../../common/event.js'
import { Component } from '../Component.js'
import { PopupOrigin } from '../popup/index.js'
import { styleTemplate, contentTemplate } from './menu-item-template.js'
import { BlocksPopupMenu } from '../popup-menu/index.js'
import type { BlocksNavMenu } from './menu.js'
import { BlocksIcon } from '../icon/index.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'

@customElement('bl-nav-menu-item')
export class BlocksNavMenuItem extends Component {
  static override get observedAttributes() {
    return ['disabled', 'link', 'expand', 'active']
  }

  private $layout: HTMLElement
  private $label: HTMLElement
  private $icon: BlocksIcon
  private $arrow: HTMLElement

  private _leaveTimer?: number
  private _enterTimer?: number
  private _data!: MenuItem

  @attr('boolean') accessor expand!: boolean

  @attr('boolean') accessor active!: boolean

  @attr('boolean') accessor disabled!: boolean

  @attr('boolean') accessor link!: boolean

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(styleTemplate())
    shadowRoot.appendChild(contentTemplate())
    this.$layout = shadowRoot.getElementById('layout')!
    this.$label = shadowRoot.getElementById('label')!
    this.$icon = shadowRoot.getElementById('icon') as BlocksIcon
    this.$arrow = shadowRoot.getElementById('arrow')!

    this.$layout.addEventListener('click', e => {
      if (this.disabled) return
      if (this.hasSubmenu) {
        if (this.isInlineMode) {
          // 内联式子菜单
          this.expand = !this.expand
        } else if (this.$submenu instanceof BlocksPopupMenu) {
          // 弹出式子菜单
          // 点击立即显示子菜单
          if (!document.body.contains(this.$submenu!)) {
            document.body.appendChild(this.$submenu!)
          }
          this.clearLeaveTimer()
          this.clearEnterTimer()
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
    })

    this.onmouseenter = () => {
      if (!this.isInlineMode && this.$submenu) {
        if (!document.body.contains(this.$submenu)) {
          document.body.appendChild(this.$submenu)
        }

        // 子菜单的 enter 控制权转移到 this
        this.$submenu.clearEnterTimer()
        this.clearEnterTimer()
        this._enterTimer = setTimeout(() => {
          ;(this.$submenu as BlocksPopupMenu).open = true
        }, this.$hostMenu?.enterDelay ?? 0)

        clearTimeout(this._leaveTimer)
        // 清理子菜单的 leave timer，避免子菜单被关闭
        this.$submenu.clearLeaveTimer()
      }
    }

    this.onmouseleave = () => {
      if (!this.isInlineMode && this.$submenu) {
        // 清理子菜单 leave 的 timer，控制权交给 this 的 timer
        this.$submenu.clearLeaveTimer()
        this.clearLeaveTimer()
        this._leaveTimer = setTimeout(() => {
          ;(this.$submenu as BlocksPopupMenu).open = false
        }, this.$hostMenu?.leaveDelay ?? 0)

        clearTimeout(this._enterTimer)
        // 清理子菜单的 enter timer，避免子菜单被打开
        this.$submenu.clearEnterTimer()
      }
    }
  }

  // 持有当前 item 的 menu
  #hostMenu!: BlocksNavMenu
  get $hostMenu() {
    return this.#hostMenu
  }
  set $hostMenu($menu) {
    this.#hostMenu = $menu
  }

  #submenu?: BlocksNavMenu | BlocksPopupMenu
  get $submenu() {
    return this.#submenu
  }
  set $submenu($menu) {
    this.#submenu = $menu
  }

  #parentMenu?: BlocksNavMenu
  get $parentMenu() {
    return this.#parentMenu
  }
  set $parentMenu($menu) {
    this.#parentMenu = $menu
  }

  get $rootMenu() {
    let $menu = this.$hostMenu
    while ($menu?.$parentMenu) {
      $menu = $menu.$parentMenu
    }
    return $menu
  }

  get isInlineMode() {
    return this.$rootMenu?.inline
  }

  get isCollapseMode() {
    return this.$rootMenu.collapse
  }

  get hasSubmenu() {
    return !!this.data.children?.length
  }

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
      this.$icon.value = data.icon
      this.$icon.style.display = 'block'
    } else {
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
        this.$submenu = document.createElement(
          'bl-popup-menu'
        ) as BlocksPopupMenu
        this.$submenu.appendToBody = true
        this.$submenu.anchor = () => this

        if (
          (this.$rootMenu as BlocksNavMenu).horizontal &&
          this.$hostMenu!.level === 0
        ) {
          this.$submenu.origin = PopupOrigin.TopStart
        } else {
          this.$submenu.origin = PopupOrigin.LeftStart
        }
      } else {
        this.$submenu = document.createElement('bl-nav-menu') as BlocksNavMenu
        this.$submenu.submenu = true
        this.appendChild(this.$submenu)
      }

      this.$submenu.$parentItem = this
      this.$submenu.$parentMenu = this.$hostMenu
      this.$submenu.enterDelay = this.$hostMenu.enterDelay
      this.$submenu.leaveDelay = this.$hostMenu.leaveDelay
      this.$submenu.size = this.$hostMenu.size
      this.$submenu.level = this.$hostMenu.level + 1
      this.$submenu.data = data.children!
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

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'expand' && this.$submenu) {
      ;(this.$submenu as any).expand = this.expand
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
