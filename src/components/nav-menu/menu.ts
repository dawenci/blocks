import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import type { EnumAttrs } from '../../decorators/attr.js'
import { style } from './menu.style.js'
import {
  contentTemplate,
  groupTemplate,
  itemTemplate,
} from './menu.template.js'
import { Component } from '../Component.js'
import { forEach } from '../../common/utils.js'
import { BlocksNavMenuItem } from './menu-item.js'

// TODO, collapse 模式，tooltip 显示一级菜单文本
@defineClass({
  customElement: 'bl-nav-menu',
  styles: [style],
})
export class BlocksNavMenu extends Component {
  static get role() {
    return 'navigation'
  }

  @attr('number') accessor enterDelay = 150

  @attr('number') accessor leaveDelay = 200

  @attrs.size accessor size!: EnumAttrs['size']

  @attr('int') accessor level = 0

  @attr('boolean') accessor submenu!: boolean

  @attr('boolean') accessor expand!: boolean

  @attr('boolean') accessor inline!: boolean

  @attr('boolean') accessor horizontal!: boolean

  @attr('boolean') accessor collapse!: boolean

  _data: (MenuItem | MenuGroup)[]
  $parentMenu?: BlocksNavMenu
  $parentItem?: BlocksNavMenuItem

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
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
}

function isGroup(data: MenuItem | MenuGroup): data is MenuGroup {
  return Array.isArray((data as MenuGroup).data)
}
