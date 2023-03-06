import { forEach } from '../../common/utils.js'
import { Component } from '../Component.js'
import {
  styleTemplate,
  contentTemplate,
  itemTemplate,
} from './menu-group-template.js'
import './menu-item.js'
import { BlocksNavMenu } from './menu.js'
import { customElement } from '../../decorators/customElement.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'

@customElement('bl-nav-menu-group')
export class BlocksNavMenuGroup extends Component {
  static override get observedAttributes() {
    return ['title-text', 'horizontal', 'collapse']
  }

  private _data!: MenuGroup

  $head: HTMLElement
  $body: HTMLElement

  @attr('string') accessor titleText = ''

  @attr('boolean') accessor horizontal!: boolean

  @attr('boolean') accessor collapse!: boolean

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(styleTemplate())
    shadowRoot.appendChild(contentTemplate())
    this.$head = shadowRoot.getElementById('head')!
    this.$body = shadowRoot.getElementById('body')!
  }

  // 持有当前 group 的 menu
  #hostMenu!: BlocksNavMenu
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

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
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
    // const { itemTemplate } = template()
    ;(this.data.data ?? []).forEach((item: any) => {
      // 嵌套 group 不作支持
      if (!item.label && item.data) return
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
    forEach(this.$body.children, (child: any) => {
      if (child.clearActive) child.clearActive()
    })
  }
}
