import type { BlNavMenuItem } from './menu-item.js'
import type { BlPopup } from '../popup/popup.js'
import './menu-group.js'
import './menu-item.js'
import '../tooltip/index.js'
import { append, unmount } from '../../common/mount.js'
import { attr, attrs } from '../../decorators/attr/index.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { contentTemplate, groupTemplate, itemTemplate } from './menu.template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { forEach } from '../../common/utils.js'
import { style } from './menu.style.js'
import { BlComponent } from '../component/Component.js'
import { PopupOrigin } from '../popup/origin.js'

export interface BlNavMenu extends BlComponent {
  $tooltip?: BlPopup
}

@defineClass({
  customElement: 'bl-nav-menu',
  styles: [style],
})
export class BlNavMenu extends BlComponent {
  static override get role() {
    return 'menu'
  }

  @attr('number') accessor enterDelay = 150

  @attr('number') accessor leaveDelay = 200

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @attr('int') accessor level = 0

  @attr('boolean') accessor submenu!: boolean

  @attr('boolean') accessor expand!: boolean

  @attr('boolean', {
    get(self) {
      return boolGetter('inline')(self)
    },
    set(self, value) {
      boolSetter('inline')(self, value)
      if (value) {
        boolSetter('horizontal')(self, false)
        boolSetter('collapse')(self, false)
      }
    },
  })
  accessor inline!: boolean

  @attr('boolean', {
    get(self) {
      return boolGetter('horizontal')(self)
    },
    set(self, value) {
      boolSetter('horizontal')(self, value)
      if (value) {
        boolSetter('inline')(self, false)
        boolSetter('collapse')(self, false)
      }
    },
  })
  accessor horizontal!: boolean

  @attr('boolean', {
    get(self) {
      return boolGetter('collapse')(self)
    },
    set(self, value) {
      boolSetter('collapse')(self, value)
      if (value) {
        boolSetter('inline')(self, false)
        boolSetter('horizontal')(self, false)
      }
    },
  })
  accessor collapse!: boolean

  _data: (MenuItem | MenuGroup)[]
  $parentMenu?: BlNavMenu
  $parentItem?: BlNavMenuItem

  constructor() {
    super()

    this.appendShadowChild(contentTemplate())

    this._data = []

    const onActive = (e: Event) => {
      this.clearActive()
      let $item = (e as CustomEvent).detail.$item
      while ($item) {
        $item.data.active = true
        $item.active = true
        $item = $item.$hostMenu.$parentItem
      }
    }

    this.hook.onConnected(() => {
      this.render()
      this.addEventListener('active', onActive)
    })

    this.hook.onDisconnected(() => {
      this.removeEventListener('active', onActive)
    })

    this.hook.onAttributeChanged(this.render)

    this.#setupAria()
  }

  get data() {
    return this._data
  }

  set data(value) {
    this._data = value
    this.render()
  }

  clearEnterTimer() {
    //
  }

  clearLeaveTimer() {
    //
  }

  // 清空整棵树上的菜单激活状态
  clearActive() {
    forEach(this.children, (child: any) => {
      if (child.clearActive) child.clearActive()
    })
  }

  horizontalRender() {
    const fragment = document.createDocumentFragment()
    const render = ($root: DocumentFragment, data: (MenuItem | MenuGroup)[] = []) => {
      data.forEach(item => {
        // 不渲染 group，直接渲染里面的项
        if ((item as MenuGroup).data) {
          render($root, (item as MenuGroup).data)
          return
        }
        // item
        const $item = itemTemplate()
        $item.setAttribute('host-context', 'horizontal')
        $item.$hostMenu = this
        $root.appendChild($item)
        $item.data = item as MenuItem
      })
    }
    render(fragment, this.data)
    this.innerHTML = ''
    this.appendChild(fragment)
  }

  verticalRender() {
    // 垂直模式时，inline / collapse 互斥
    const hostContext = this.inline ? 'inline' : this.collapse ? 'collapse' : 'vertical'
    const fragment = document.createDocumentFragment()
    const render = ($root: DocumentFragment, data: (MenuItem | MenuGroup)[] = []) => {
      data.forEach(item => {
        if (isGroup(item)) {
          if (this.collapse) {
            // 不渲染 group，直接渲染里面的项
            render($root, (item as MenuGroup).data)
          } else {
            const $group = groupTemplate()
            $group.$hostMenu = this
            $group.horizontal = this.horizontal
            $group.inline = this.inline
            $group.collapse = this.collapse
            $root.appendChild($group)
            $group.data = item as MenuGroup
          }
        } else {
          const $item = itemTemplate()
          $item.setAttribute('host-context', hostContext)
          $item.$hostMenu = this
          $root.appendChild($item)
          $item.data = item
        }
      })
    }
    render(fragment, this.data)
    this.innerHTML = ''
    this.appendChild(fragment)

    if (this.collapse) {
      if (!this.$tooltip) {
        this.$tooltip = document.createElement('bl-popup')
        this.$tooltip.origin = PopupOrigin.LeftCenter
        this.$tooltip.style.cssText = 'padding:8px;font-size:14px;'
        this.$tooltip.arrow = 6
        append(this.$tooltip, document.body)
        Array.prototype.forEach.call(this.children, $item => {
          if ($item.hasSubmenu) return
          $item.onmouseenter = () => {
            console.log('mouseenter')
            if (this.collapse && this.$tooltip) {
              this.$tooltip.anchorElement = () => $item
              this.$tooltip.innerText = $item.data.label
              this.$tooltip.open = true
            }
          }
          $item.onmouseleave = () => {
            console.log('mouseleave')
            if (this.$tooltip) {
              this.$tooltip.open = false
            }
          }
        })
      }
    } else {
      if (this.$tooltip) {
        unmount(this.$tooltip)
        this.$tooltip = undefined
      }
    }
  }

  override render() {
    super.render()
    // 水平模式
    if (this.horizontal) {
      this.horizontalRender()
    }
    // 垂直模式
    else {
      this.verticalRender()
    }
  }

  #setupAria() {
    const update = () => {
      this.setAttribute('aria-orientation', this.horizontal ? 'horizontal' : 'vertical')
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDep('horizontal', update)
  }
}

function isGroup(data: MenuItem | MenuGroup): data is MenuGroup {
  return Array.isArray((data as MenuGroup).data)
}
