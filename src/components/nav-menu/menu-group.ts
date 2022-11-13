import {
  boolGetter,
  boolSetter,
  strGetter,
  strSetter,
} from '../../common/property.js'
import { forEach } from '../../common/utils.js'
import { Component } from '../Component.js'
import {
  styleTemplate,
  contentTemplate,
  itemTemplate,
} from './menu-group-template.js'
import './menu-item.js'
import { BlocksNavMenu } from './menu.js'

export class BlocksNavMenuGroup extends Component {
  private _data!: MenuGroup

  $head: HTMLElement
  $body: HTMLElement

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

  get titleText() {
    return strGetter('title')(this) ?? ''
  }

  set titleText(value) {
    strSetter('title')(this, value)
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

  static override get observedAttributes() {
    return ['title', 'horizontal', 'collapse']
  }
}

if (!customElements.get('bl-nav-menu-group')) {
  customElements.define('bl-nav-menu-group', BlocksNavMenuGroup)
}
