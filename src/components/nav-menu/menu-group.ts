import type { BlNavMenu } from './menu.js'
import './menu-item.js'
import { attr } from '../../decorators/attr/index.js'
import { contentTemplate, itemTemplate } from './menu-group.template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { forEach } from '../../common/utils.js'
import { style } from './menu-group.style.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-nav-menu-group',
  styles: [style],
})
export class BlNavMenuGroup extends BlComponent {
  static override get role() {
    return 'group'
  }

  @attr('string') accessor titleText = ''

  @attr('boolean') accessor horizontal!: boolean

  @attr('boolean') accessor collapse!: boolean

  @attr('boolean') accessor inline!: boolean

  @shadowRef('#head') accessor $head!: HTMLElement

  @shadowRef('#body') accessor $body!: HTMLElement

  private _data!: MenuGroup

  constructor() {
    super()

    this.appendShadowChild(contentTemplate())

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  // 持有当前 group 的 menu
  #hostMenu!: BlNavMenu
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

    const hostContext = this.horizontal
      ? 'horizontal'
      : this.inline
      ? 'inline'
      : this.collapse
      ? 'collapse'
      : 'vertical'
    const bodyFragment = document.createDocumentFragment()
    ;(this.data.data ?? []).forEach((item: any) => {
      // 嵌套 group 不作支持
      if (!item.label && item.data) return
      const $item = itemTemplate()
      $item.setAttribute('host-context', hostContext)
      $item.$hostMenu = this.$hostMenu
      bodyFragment.appendChild($item)
      // data 赋值在后（会触发 render）
      $item.data = item
    })
    this.$body.innerHTML = ''
    this.$body.appendChild(bodyFragment)
  }

  clearActive() {
    forEach(this.$body.children, (child: any) => {
      if (child.clearActive) child.clearActive()
    })
  }
}
