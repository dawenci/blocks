import BlocksPopup from '../popup/index.js';
import { definePrivate } from '../../common/definePrivate.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_light, __color_primary, __font_family } from '../theme/var.js'
import { intGetter, intSetter } from '../../common/property.js';
import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js';
import { forEach } from '../../common/utils.js';
import { onClickOutside } from '../../common/onClickOutside.js';

const itemTemplate = document.createElement('blocks-popup-menu-item')
const groupTemplate = document.createElement('blocks-popup-menu-group')

class BlocksPopupMenu extends BlocksPopup {
  static get observedAttributes() {
    return BlocksPopup.observedAttributes.concat(['level', 'size'])
  }

  constructor() {
    super()

    definePrivate(this, '_data', [])
    this.$parentMenu = null

    this.onmouseenter = () => {
      this.enter()
    }

    this.onmouseleave = () => {
      this.leave()
    }
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

  get data() {
    return this._data
  }

  set data(value) {
    this._data = value
    this.render()
  }

  enter() {
    if (this.level === 0) return

    clearTimeout(this._enterTimer)
    this.open = true
    if (this.$parentMenu) {
      this.$parentMenu.enter?.()
    }

    // 清理父菜单项目 leave 的 timer，避免当前 menu 被关闭
    if (this.$parentItem) {
      clearTimeout(this.$parentItem._enterTimer)
    }
  }

  leave() {
    if (this.level === 0) return

    clearTimeout(this._enterTimer)
    this._enterTimer = setTimeout(() => {
      this.open = false
    }, 200)

    if (this.$parentMenu) {
      this.$parentMenu.leave?.()
    }

    // 清理父菜单项目 leave 的 timer，控制权交给 this 的 timer
    if (this.$parentItem) {
      clearTimeout(this.$parentItem._enterTimer)
    }
  }

  closeAll() {
    this.open = false
    if (this.$parentMenu) {
      this.$parentMenu.closeAll?.()
    }
  }

  clearActive() {
    forEach(this.children, child => {
      if (child.clearActive) child.clearActive()
    })
  }

  render() {
    super.render()

    const fragment = document.createDocumentFragment()
    this.data.forEach(item => {
      // group
      if (item.data) {
        const $group = fragment.appendChild(groupTemplate.cloneNode(true))
        $group.$hostMenu = this
        // data 赋值在后（会触发 render）
        $group.data = item
        return
      }
      // item
      const $item = fragment.appendChild(itemTemplate.cloneNode(true))
      $item.$hostMenu = this
      // data 赋值在后（会触发 render）
      $item.data = item
    })
    this.innerHTML = ''
    this.appendChild(fragment)

    super.updatePosition()
  }

  connectedCallback() {
    super.connectedCallback()
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.autoflip = true
    this.render()

    this._clearClickOutside = onClickOutside(this, () => {
      if (this.level === 0 && this.open) {
        this.open = false
      }
    })
  }

  disconnectedCallback() {
    if (this._clearClickOutside) {
      this._clearClickOutside()
    } 
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal)

    // 子菜单打开的时候，为父 item 加上 submenu-open class，以显示 hover 效果
    if (attrName === 'open' && this.$parentItem) {
      this.$parentItem.classList[this.open ? 'add' : 'remove']('submenu-open')
    }

    this.render()
  }
}

if (!customElements.get('blocks-popup-menu')) {
  customElements.define('blocks-popup-menu', BlocksPopupMenu)
}
