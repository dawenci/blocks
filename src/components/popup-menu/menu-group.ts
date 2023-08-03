import { attr, attrs } from '../../decorators/attr/index.js'
import { contentTemplate, itemTemplate } from './menu-group.template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { forEach } from '../../common/utils.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './menu-group.style.js'
import { BlNavMenu } from '../nav-menu/menu.js'
import { BlPopupMenu } from './menu.js'
import { BlPopupMenuItem } from './menu-item.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-popup-menu-group',
  styles: [style],
})
export class BlPopupMenuGroup extends BlComponent {
  static override get role() {
    return 'group'
  }

  @attr('string') accessor titleText = ''

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @shadowRef('#head') accessor $head!: HTMLElement
  @shadowRef('#body') accessor $body!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(contentTemplate())

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  _data!: MenuGroup

  #hostMenu!: BlPopupMenu | BlNavMenu
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

  override render() {
    super.render()
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
      $item.size = this.size
      $item.$hostMenu = this.$hostMenu
      bodyFragment.appendChild($item)
      // data 赋值在后（会触发 render）
      $item.data = item
    })
    this.$body.innerHTML = ''
    this.$body.appendChild(bodyFragment)
  }

  clearActive() {
    const children = this.$body.children as unknown as Array<BlPopupMenuItem | BlPopupMenuGroup>
    forEach(children, child => {
      if (child.clearActive) child.clearActive()
    })
  }
}
