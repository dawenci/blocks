import {
  connectSelectable,
  ISelected,
  ISelectResultComponent,
} from '../../common/connectSelectable.js'
import { dispatchEvent } from '../../common/event.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import {
  boolGetter,
  boolSetter,
  enumGetter,
  enumSetter,
  strGetter,
  strSetter,
} from '../../common/property.js'
import { Component } from '../Component.js'
import { BlocksList } from '../list/index.js'
import { BlocksPopup, PopupOrigin } from '../popup/index.js'
import { listTemplate, popupTemplate, styleTemplate } from './template.js'

const originGetter = enumGetter('origin', Object.values(PopupOrigin))
const originSetter = enumSetter('origin', Object.values(PopupOrigin))

const triggerModeGetter = enumGetter('trigger-mode', ['hover', 'click'])
const triggerModeSetter = enumSetter('trigger-mode', ['hover', 'click'])

const ATTRS = BlocksPopup.observedAttributes.concat(
  BlocksList.observedAttributes
)

export interface BlocksDropdownList extends Component {
  _ref: {
    $slot: HTMLSlotElement
    $popup: BlocksPopup
    $list: BlocksList
  }
  _hideTimer: number
}

export class BlocksDropdownList extends Component {
  static override get observedAttributes() {
    return ATTRS
  }

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    const $slot = shadowRoot.appendChild(document.createElement('slot'))
    const $popup = popupTemplate()
    const $list = listTemplate()
    $popup.appendChildren([styleTemplate(), $list])

    this._ref = {
      $slot,
      $popup,
      $list,
    }

    const defaultAnchorGetter = () => $slot.assignedElements()?.[0] ?? this
    this.setAnchorGetter(defaultAnchorGetter)
    $popup.anchor = () => (this.getAnchorGetter() ?? defaultAnchorGetter)()

    // this 代理 slot 里的 $result
    connectSelectable(this as any, $list)

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

    $list.addEventListener('click-item', (event: any) => {
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

  get triggerMode() {
    return triggerModeGetter(this) ?? 'click'
  }

  set triggerMode(value) {
    triggerModeSetter(this, value)
  }

  get open() {
    return boolGetter('open')(this)
  }

  set open(value) {
    boolSetter('open')(this, value)
  }

  get origin() {
    return originGetter(this)
  }

  set origin(value) {
    originSetter(this, value)
  }

  get data() {
    return this._ref.$list.data
  }

  set data(value) {
    this._ref.$list.data = value
  }

  get checked() {
    return this._ref.$list.checked
  }

  set checked(ids) {
    this._ref.$list.checked = ids
  }

  get checkedData() {
    return this._ref.$list.checkedData
  }

  set checkedData(value) {
    this._ref.$list.checkedData = value
  }

  get disabledField() {
    return this.getAttribute('disabled-field') ?? 'disabled'
  }

  set disabledField(value) {
    this.setAttribute('disabled-field', value)
  }

  get idField() {
    return this.getAttribute('id-field') || 'id'
  }

  set idField(value) {
    this.setAttribute('id-field', value)
  }

  get labelField() {
    return strGetter('label-field')(this)
  }

  set labelField(value) {
    strSetter('label-field')(this, value)
  }

  get checkable() {
    return boolGetter('checkable')(this)
  }

  set checkable(value) {
    boolSetter('checkable')(this, value)
  }

  get multiple() {
    return boolGetter('multiple')(this)
  }

  set multiple(value) {
    boolSetter('multiple')(this, value)
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
    this._ref.$list.redraw()
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

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (BlocksPopup.observedAttributes.includes(attrName)) {
      if (attrName === 'open') {
        this._ref.$popup.open = this.open
      } else {
        this._ref.$popup.setAttribute(attrName, newValue)
      }
    }
    if (BlocksList.observedAttributes.includes(attrName)) {
      this._ref.$list.setAttribute(attrName, newValue)
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

if (!customElements.get('bl-dropdown-list')) {
  customElements.define('bl-dropdown-list', BlocksDropdownList)
}
