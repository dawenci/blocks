import '../../components/icon/index.js'
import '../../components/popup/index.js'
import { attr, attrs } from '../../decorators/attr/index.js'
import { contentTemplate, menuTemplate } from './menu-item.template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './menu-item.style.js'
import { BlIcon } from '../../components/icon/index.js'
import { BlNavMenu } from '../nav-menu/menu.js'
import { BlPopupMenu } from './menu.js'
import { BlComponent } from '../component/Component.js'
import { PopupOrigin } from '../../components/popup/index.js'

@defineClass({
  customElement: 'bl-popup-menu-item',
  styles: [style],
})
export class BlPopupMenuItem extends BlComponent {
  static override get role() {
    return 'menuitem'
  }

  @attr('boolean') accessor disabled!: boolean

  @attr('boolean') accessor link!: boolean

  @attr('boolean') accessor active!: boolean

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @shadowRef('#layout') accessor $layout!: HTMLElement
  @shadowRef('#label') accessor $label!: HTMLElement
  @shadowRef('#icon') accessor $icon!: BlIcon
  @shadowRef('#arrow') accessor $arrow!: HTMLElement

  _enterTimer?: ReturnType<typeof setTimeout>
  _leaveTimer?: ReturnType<typeof setTimeout>

  constructor() {
    super()

    this.appendShadowChild(contentTemplate())

    const onClick = (e: MouseEvent) => {
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
    }
    const onMouseEnter = () => {
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
    const onMouseLeave = () => {
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
    this.hook.onConnected(() => {
      this.addEventListener('click', onClick)
      this.addEventListener('mouseenter', onMouseEnter)
      this.addEventListener('mouseleave', onMouseLeave)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('click', onClick)
      this.removeEventListener('mouseenter', onMouseEnter)
      this.removeEventListener('mouseleave', onMouseLeave)
    })

    this.hook.onConnected(this.render)
    this.hook.onDisconnected(() => {
      if (this.$submenu && document.body.contains(this.$submenu)) {
        this.$submenu.parentElement!.removeChild(this.$submenu)
      }
    })
  }

  #submenu?: BlPopupMenu
  get $submenu() {
    return this.#submenu
  }
  set $submenu($menu) {
    this.#submenu = $menu
  }

  #hostMenu?: BlNavMenu | BlPopupMenu
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
    super.render()
    const data = this.data
    this.disabled = !!data.disabled

    if (data.icon) {
      ;(this.$icon as BlIcon).value = data.icon
      this.$icon.style.display = 'block'
    } else {
      ;(this.$icon as BlIcon).value = ''
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
      this.$submenu.anchorElement = () => this
      this.$submenu.origin = PopupOrigin.LeftStart
      this.$submenu.data = data.children
    } else {
      this.classList.remove('has-submenu')
      this.$submenu = undefined
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
