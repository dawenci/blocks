import { Component } from '../Component.js'
import {
  boolGetter,
  boolSetter,
  intGetter,
  intSetter,
  numGetter,
  numSetter,
} from '../../common/property.js'
import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'
import { forEach } from '../../common/utils.js'
import { BlocksNavMenuItem } from './menu-item.js'
import {
  styleTemplate,
  contentTemplate,
  groupTemplate,
  itemTemplate,
} from './menu-template.js'

// TODO, collapse 模式，tooltip 显示一级菜单文本
export class BlocksNavMenu extends Component {
  static get role() {
    return 'navigation'
  }

  _data: (MenuItem | MenuGroup)[]

  $parentMenu?: BlocksNavMenu
  $parentItem?: BlocksNavMenuItem

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(styleTemplate())
    shadowRoot.appendChild(contentTemplate())

    this._data = []

    this.addEventListener('active', (e: Event) => {
      this.clearActive()
      let $item = (e as CustomEvent).detail.$item
      while ($item) {
        $item.data.active = true
        $item.active = true
        $item = $item.$hostMenu.$parentItem
      }
    })
  }

  get enterDelay() {
    return numGetter('enter-delay')(this) ?? 150
  }

  set enterDelay(value) {
    numSetter('enter-delay')(this, value)
  }

  get leaveDelay() {
    return numGetter('leave-delay')(this) ?? 200
  }

  set leaveDelay(value) {
    numSetter('leave-delay')(this, value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  get level() {
    return intGetter('level')(this) ?? 0
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
    const render = (
      $root: DocumentFragment,
      data: (MenuItem | MenuGroup)[] = []
    ) => {
      data.forEach(item => {
        // 不渲染 group，直接渲染里面的项
        if ((item as MenuGroup).data) {
          render($root, (item as MenuGroup).data)
          return
        }
        // item
        const $item = itemTemplate()
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
    const fragment = document.createDocumentFragment()
    const render = (
      $root: DocumentFragment,
      data: (MenuItem | MenuGroup)[] = []
    ) => {
      data.forEach(item => {
        // 不渲染 group，直接渲染里面的项
        if (isGroup(item)) {
          if (this.collapse) {
            render($root, (item as MenuGroup).data)
          } else {
            const $group = groupTemplate()
            $group.$hostMenu = this
            $group.horizontal = this.horizontal
            $group.collapse = this.collapse
            $root.appendChild($group)
            $group.data = item as MenuGroup
          }
        } else {
          const $item = itemTemplate()
          $item.$hostMenu = this
          $root.appendChild($item)
          $item.data = item
        }
      })
    }
    render(fragment, this.data)
    this.innerHTML = ''
    this.appendChild(fragment)
  }

  override render() {
    // 水平模式
    if (this.horizontal) {
      this.horizontalRender()
    }
    // 垂直模式
    else {
      this.verticalRender()
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    // collapse 和 inline 互斥，inline 和 horizontal 互斥
    this.render()
  }

  static override get observedAttributes() {
    return [
      'horizontal',
      'collapse',
      'inline',
      'submenu',
      'level',
      'expand',
      'size',
      'enter-delay',
      'leave-delay',
    ]
  }
}

if (!customElements.get('bl-nav-menu')) {
  customElements.define('bl-nav-menu', BlocksNavMenu)
}

function isGroup(data: MenuItem | MenuGroup): data is MenuGroup {
  return Array.isArray((data as MenuGroup).data)
}
