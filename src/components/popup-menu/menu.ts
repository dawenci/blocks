import { attr, attrs } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { forEach } from '../../common/utils.js'
import { itemTemplate, groupTemplate } from './menu.template.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { BlPopupMenuGroup } from './menu-group.js'
import { BlPopupMenuItem } from './menu-item.js'
import { BlNavMenu } from '../nav-menu/menu.js'
import { BlNavMenuItem } from '../nav-menu/menu-item.js'
import { BlNavMenuGroup } from '../nav-menu/menu-group.js'
import { BlPopup } from '../popup/index.js'

@defineClass({
  customElement: 'bl-popup-menu',
})
export class BlPopupMenu extends BlPopup {
  static override get role() {
    return 'menu'
  }

  @attr('number') accessor enterDelay = 150

  @attr('number') accessor leaveDelay = 200

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @attr('int') accessor level = 0

  private _data: (MenuItem | MenuGroup)[]
  private _leaveTimer?: ReturnType<typeof setTimeout>
  private _enterTimer?: ReturnType<typeof setTimeout>
  private _clearClickOutside?: () => void

  $parentItem?: BlPopupMenuItem | BlNavMenuItem
  $parentMenu?: BlPopupMenu | BlNavMenu

  constructor() {
    super()

    this._data = []

    this.onmouseenter = () => {
      this.enter()
    }

    this.onmouseleave = () => {
      this.leave()
    }
  }

  get data() {
    return this._data
  }

  set data(value) {
    this._data = value
    this.render()
  }

  clearEnterTimer() {
    clearTimeout(this._enterTimer)
  }

  clearLeaveTimer() {
    clearTimeout(this._leaveTimer)
  }

  enter() {
    if (this.level === 0) return

    // 转移父 item 的 enter 控制权到 this
    if (this.$parentItem) {
      this.$parentItem.clearEnterTimer()
    }

    this.clearEnterTimer()
    this._enterTimer = setTimeout(() => {
      this.open = true
    }, this.enterDelay)

    if (this.$parentMenu instanceof BlPopupMenu) {
      if (this.$parentMenu.enter) {
        this.$parentMenu.enter()
      }
    }

    clearTimeout(this._leaveTimer)
    // 清理父菜单项目 leave 的 timer，避免当前 menu 被关闭
    if (this.$parentItem) {
      this.$parentItem.clearLeaveTimer()
    }
  }

  leave() {
    if (this.level === 0) return

    // 清理父菜单项目 leave 的 timer，控制权交给 this 的 timer
    if (this.$parentItem) {
      this.$parentItem.clearLeaveTimer()
    }
    clearTimeout(this._leaveTimer)
    this._leaveTimer = setTimeout(() => {
      this.open = false
    }, this.leaveDelay!)

    if (this.$parentMenu instanceof BlPopupMenu) {
      if (this.$parentMenu.leave) {
        this.$parentMenu.leave()
      }
    }

    clearTimeout(this._enterTimer)
    if (this.$parentItem) {
      this.$parentItem.clearEnterTimer()
    }
  }

  closeAll() {
    this.open = false
    if (this.$parentMenu instanceof BlPopupMenu) {
      this.$parentMenu.closeAll()
    }
  }

  clearActive() {
    const children = this.children as unknown as Array<
      BlNavMenuItem | BlNavMenuGroup | BlPopupMenuItem | BlPopupMenuGroup
    >
    forEach(children, child => {
      if (child.clearActive) child.clearActive()
    })
  }

  override render() {
    super.render()

    const fragment = document.createDocumentFragment()
    this.data.forEach(item => {
      // group
      if ((item as MenuGroup).data) {
        const $group = groupTemplate()
        $group.$hostMenu = this
        $group.size = this.size
        fragment.appendChild($group)
        // data 赋值在后（会触发 render）
        $group.data = item as MenuGroup
        return
      }
      // item
      const $item = itemTemplate()
      $item.$hostMenu = this
      $item.size = this.size
      fragment.appendChild($item)
      // data 赋值在后（会触发 render）
      $item.data = item
    })
    this.innerHTML = ''
    this.appendChild(fragment)

    super.updatePositionAndDirection()
  }

  override connectedCallback() {
    super.connectedCallback()
    this.autoflip = true
    this.render()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._destroyClickOutside()
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (BlPopup.observedAttributes.includes(attrName)) {
      super.attributeChangedCallback(attrName, oldValue, newValue)
    }

    if (attrName === 'open') {
      if (this.open) {
        this._initClickOutside()
      } else {
        this._destroyClickOutside()
      }
    }

    // 子菜单打开的时候，为父 item 加上 submenu-open class，以显示 hover 效果
    if (attrName === 'open' && this.$parentItem) {
      this.$parentItem.classList[this.open ? 'add' : 'remove']('submenu-open')
    }

    this.render()
  }

  _initClickOutside() {
    if (this._clearClickOutside) return
    this._clearClickOutside = onClickOutside(this, e => {
      if (this.level === 0 && this.open) {
        if ((e.target as any).$rootMenu !== this) {
          this.open = false
        }
      }
    })
  }

  _destroyClickOutside() {
    if (this._clearClickOutside) {
      this._clearClickOutside()
      this._clearClickOutside = undefined
    }
  }
}
