import { connectSelectable, ISelected, ISelectResultComponent } from '../../common/connectSelectable.js'
import { dispatchEvent } from '../../common/event.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { Component } from '../Component.js'
import { BlocksPopup, PopupOrigin } from '../popup/index.js'
import { BlocksTree } from '../tree/index.js'
import { treeTemplate, popupTemplate, styleTemplate } from './template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import type { EnumAttr } from '../../decorators/attr.js'

const ATTRS = BlocksPopup.observedAttributes.concat(BlocksTree.observedAttributes)

export interface BlocksDropdownTree extends Component {
  _ref: {
    $slot: HTMLSlotElement
    $popup: BlocksPopup
    $tree: BlocksTree
  }
  _hideTimer: number
}

@defineClass({
  customElement: 'bl-dropdown-tree',
})
export class BlocksDropdownTree extends Component {
  static override get observedAttributes() {
    return ATTRS
  }

  @attr('enum', { enumValues: ['hover', 'click'] })
  accessor triggerMode: EnumAttr<['hover', 'click']> = 'click'
  @attr('boolean') accessor open!: boolean
  @attr('enum', { enumValues: Object.values(PopupOrigin) })
  accessor origin!: PopupOrigin | null
  @attr('string') accessor disabledField = 'disabled'
  @attr('string') accessor idField = 'id'
  @attr('string') accessor labelField!: string | null
  @attr('boolean') accessor checkable!: boolean
  @attr('boolean') accessor multiple!: boolean

  constructor() {
    super()

    const $slot = this.shadowRoot!.appendChild(document.createElement('slot'))
    const $popup = popupTemplate()
    const $tree = treeTemplate()
    $popup.appendChildren([styleTemplate(), $tree])

    this._ref = {
      $slot,
      $popup,
      $tree,
    }

    const defaultAnchorGetter = () => $slot.assignedElements()?.[0] ?? this
    this.setAnchorGetter(defaultAnchorGetter)
    $popup.anchor = () => (this.getAnchorGetter() ?? defaultAnchorGetter)()

    // this 代理 slot 里的 $result
    connectSelectable(this as any, $tree)

    this.addEventListener(
      'focus',
      () => {
        this.openPopup()
      },
      // focus 不冒泡，关注 slot 里面的 focus，需要用捕获模式
      true
    )

    this.addEventListener('click', () => {
      this.openPopup()
    })

    const onEnter = () => {
      if (this.triggerMode === 'hover') {
        this.openPopup()
      }
    }

    const onLeave = () => {
      if (this.triggerMode === 'hover') {
        clearTimeout(this._hideTimer)
        this._hideTimer = setTimeout(() => {
          this.closePopup()
        }, 200)
      }
    }

    this.addEventListener('mouseenter', onEnter)
    $popup.addEventListener('mouseenter', onEnter)
    this.addEventListener('mouseleave', onLeave)
    $popup.addEventListener('mouseleave', onLeave)

    $popup.addEventListener('opened', () => {
      this.#initClickOutside()
      this.redrawList()
    })

    $popup.addEventListener('closed', () => {
      this.#destroyClickOutside()
    })

    $tree.addEventListener('click-item', (event: any) => {
      dispatchEvent(this, 'click-item', { detail: { id: event.detail.id } })
    })
  }

  _findResultComponent() {
    const canAcceptValue = ($el: Element): $el is ISelectResultComponent => {
      return (
        typeof ($el as ISelectResultComponent).acceptSelected === 'function' ||
        (typeof ($el as ISelectResultComponent).select === 'function' &&
          typeof ($el as ISelectResultComponent).deselect === 'function')
      )
    }
    return this._ref.$slot.assignedElements().find(canAcceptValue)
  }

  // 代理 slot 里的选择结果组件，实现 ISelectResultComponent
  acceptSelected(value: ISelected[]) {
    const $result = this._findResultComponent()
    if ($result && $result.acceptSelected) {
      $result.acceptSelected(value)
    }
  }

  // 代理 slot 里的选择结果组件，实现 ISelectResultComponent
  select(data: ISelected) {
    const $result = this._findResultComponent()
    if ($result && $result.select) {
      $result.select(data)
    }
  }

  // 代理 slot 里的选择结果组件，实现 ISelectResultComponent
  deselect(data: ISelected) {
    const $result = this._findResultComponent()
    if ($result && $result.deselect) {
      $result.deselect(data)
    }
  }

  get data() {
    return this._ref.$tree.data
  }

  set data(value) {
    this._ref.$tree.data = value
  }

  get checked() {
    return this._ref.$tree.checked
  }

  set checked(ids) {
    this._ref.$tree.checked = ids
  }

  get checkedData() {
    return this._ref.$tree.checkedData
  }

  set checkedData(value) {
    this._ref.$tree.checkedData = value
  }

  #anchorGetter?: () => Element
  getAnchorGetter() {
    return this.#anchorGetter
  }
  setAnchorGetter(value: () => Element) {
    this.#anchorGetter = value
  }

  openPopup() {
    clearTimeout(this._hideTimer)
    this.open = true
  }

  closePopup() {
    clearTimeout(this._hideTimer)
    this.open = false
  }

  redrawList() {
    this._ref.$tree.redraw()
  }

  override connectedCallback() {
    super.connectedCallback()
    if (!document.body.contains(this._ref.$popup)) {
      this._ref.$popup.appendTo(document.body)
    }

    if (!this.hasAttribute('origin')) {
      this.origin = PopupOrigin.TopStart
    }
    this.render()
  }

  override disconnectedCallback() {
    document.body.removeChild(this._ref.$popup)
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (BlocksPopup.observedAttributes.includes(attrName)) {
      if (attrName === 'open') {
        this._ref.$popup.open = this.open
      } else {
        this._ref.$popup.setAttribute(attrName, newValue)
      }
    }
    if (BlocksTree.observedAttributes.includes(attrName)) {
      this._ref.$tree.setAttribute(attrName, newValue)
    }
    if (attrName === 'open' && this.open) {
      this.redrawList()
    }
  }

  #clearClickOutside?: () => void
  #initClickOutside() {
    if (!this.#clearClickOutside) {
      this.#clearClickOutside = onClickOutside([this, this._ref.$popup], () => {
        this.open = false
      })
    }
  }

  #destroyClickOutside() {
    if (this.#clearClickOutside) {
      this.#clearClickOutside()
      this.#clearClickOutside = undefined
    }
  }
}
