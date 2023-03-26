import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { forEach } from '../../common/utils.js'
import { Component } from '../Component.js'
import { BlocksNavMenu } from '../nav-menu/menu.js'
import { contentTemplate, itemTemplate } from './menu-group.template.js'
import { style } from './menu-group.style.js'
import { BlocksPopupMenuItem } from './menu-item.js'
import { BlocksPopupMenu } from './menu.js'

@defineClass({
  customElement: 'bl-popup-menu-group',
  styles: [style],
})
export class BlocksPopupMenuGroup extends Component {
  @attr('string') accessor titleText = ''

  _data!: MenuGroup
  $head: HTMLElement
  $body: HTMLElement

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(contentTemplate())
    this.$head = shadowRoot.getElementById('head')!
    this.$body = shadowRoot.getElementById('body')!
  }

  #hostMenu!: BlocksPopupMenu | BlocksNavMenu
  get $hostMenu() {
    return this.#hostMenu
  }
  set $hostMenu($menu) {
    this.#hostMenu = $menu
  }

  get data() {
    return this._data ?? {}
  }

  set data(value) {
    this._data = value
    this.render()
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this.render()
  }

  override render() {
    const data = this.data
    if (data.title) {
      this.$head.textContent = data.title
      this.$head.style.display = 'block'
    } else {
      this.$head.style.display = 'none'
    }

    const bodyFragment = document.createDocumentFragment()
    ;(this.data.data ?? []).forEach(item => {
      // 嵌套分组不作支持（可以简单实现支持，但场景不明）
      if (!item.label && (item as any).data) {
        console.warn('Nested grouping is not supported.')
        return
      }
      // item
      const $item = itemTemplate()
      $item.$hostMenu = this.$hostMenu
      bodyFragment.appendChild($item)
      // data 赋值在后（会触发 render）
      $item.data = item
    })
    this.$body.innerHTML = ''
    this.$body.appendChild(bodyFragment)
  }

  clearActive() {
    const children = this.$body.children as unknown as Array<BlocksPopupMenuItem | BlocksPopupMenuGroup>
    forEach(children, child => {
      if (child.clearActive) child.clearActive()
    })
  }
}