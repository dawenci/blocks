import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js'
import type { EnumAttr } from '../../decorators/attr.js'
import { attr } from '../../decorators/attr.js'
import {
  connectSelectable,
  ISelected,
  ISelectListEventMap,
  ISelectResultComponent,
} from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { listTemplate, popupTemplate, styleTemplate, template } from './template.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { BlocksList } from '../list/index.js'
import { BlocksPopup, PopupOrigin } from '../popup/index.js'
import { Control } from '../base-control/index.js'

const ATTRS = BlocksPopup.observedAttributes.concat(BlocksList.observedAttributes)

interface BlocksDropdownListEventMap extends ComponentEventMap, ISelectListEventMap {
  'click-item': CustomEvent<{ id: any }>
}

export interface BlocksDropdownList extends Control, ISelectResultComponent {
  $popup: BlocksPopup
  $list: BlocksList

  addEventListener<K extends keyof BlocksDropdownListEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksDropdownListEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof BlocksDropdownListEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksDropdownListEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-dropdown-list',
  attachShadow: {
    mode: 'open',
    delegatesFocus: true,
  },
})
export class BlocksDropdownList extends Control implements ISelectResultComponent {
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

  @shadowRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.$popup = popupTemplate()
    this.$list = listTemplate()
    this.$popup.appendChildren([styleTemplate(), this.$list])

    // this 代理 slot 里的 $result
    connectSelectable(this, this.$list, {
      afterHandleListChange: () => {
        if (!this.multiple) {
          this.open = false
        }
      },
      afterHandleResultClear: () => {
        this.closePopup()
        // 点击 clear 后，取消 slot 里面的焦点
        // 否则，控件无法重新通过 focus 触发
        if (document.activeElement) {
          ;(document.activeElement as any).blur()
        }
      },
    })

    this.#setupPopup()
    this.#setupList()

    this.onConnected(this.render)
  }

  _findResultComponent() {
    const canAcceptValue = ($el: Element): $el is ISelectResultComponent => {
      return typeof ($el as ISelectResultComponent).acceptSelected === 'function'
    }
    return this.$slot.assignedElements().find(canAcceptValue)
  }

  // 代理 slot 里的选择结果组件，实现 ISelectResultComponent
  acceptSelected(value: ISelected[]) {
    const $result = this._findResultComponent()
    if ($result && $result.acceptSelected) {
      $result.acceptSelected(value)
    }
  }

  get data() {
    return this.$list.data
  }

  set data(value) {
    this.$list.data = value
  }

  get checked() {
    return this.$list.checked
  }

  set checked(ids) {
    this.$list.checked = ids
  }

  get checkedData() {
    return this.$list.checkedData
  }

  set checkedData(value) {
    this.$list.checkedData = value
  }

  #anchorGetter?: () => Element
  getAnchorGetter() {
    return this.#anchorGetter
  }
  setAnchorGetter(value: () => Element) {
    this.#anchorGetter = value
  }

  openPopup() {
    this.open = true
  }

  closePopup() {
    this.open = false
    this.blur()
  }

  redrawList() {
    this.$list.redraw()
  }

  // TODO: resize popup/list
  #setupPopup() {
    this.onConnected(() => {
      if (!this.hasAttribute('origin')) {
        this.origin = PopupOrigin.TopStart
      }
      const defaultAnchorGetter = () => this.$slot.assignedElements()?.[0] ?? this
      this.setAnchorGetter(defaultAnchorGetter)
      this.$popup.arrow = 8
      this.$popup.autoflip = true
      this.$popup.anchorElement = () => (this.getAnchorGetter() ?? defaultAnchorGetter)()
      this.$popup.style.width = '200px'
      this.$popup.style.height = '240px'
    })

    this.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })

    this.onAttributeChangedDeps(BlocksPopup.observedAttributes, (name, _, newValue) => {
      if (name === 'open') {
        // 首次打开的时候，挂载 $popup 的 DOM
        if (this.open && !document.body.contains(this.$popup)) {
          document.body.appendChild(this.$popup)
        }
        this.$popup.open = this.open
      } else {
        this.$popup.setAttribute(name, newValue as string)
      }
    })

    let clear: (() => void) | undefined
    const initClickOutside = () => {
      if (!clear) {
        clear = onClickOutside([this, this.$popup], () => {
          this.open = false
        })
      }
    }
    const destroyClickOutside = () => {
      if (clear) {
        clear()
        clear = undefined
      }
    }
    const onOpened = () => initClickOutside()
    const onClosed = () => destroyClickOutside()
    this.onConnected(() => {
      this.$popup.addEventListener('opened', onOpened)
      this.$popup.addEventListener('closed', onClosed)
    })
    this.onDisconnected(() => {
      this.$popup.removeEventListener('opened', onOpened)
      this.$popup.removeEventListener('closed', onClosed)
    })

    // 标记该次 focus 是点击了 clear 按钮触发的
    // 点击 clear 按钮，无需弹出弹窗
    let isClickClear = false
    const onClearStart = () => {
      isClickClear = true
    }
    const onClearEnd = () => {
      isClickClear = false
    }
    const onSlotFocus = () => {
      if (!isClickClear) this.openPopup()
      isClickClear = false
    }
    this.onConnected(() => {
      this.addEventListener('mousedown-clear', onClearStart)
      // focus 不冒泡，关注 slot 里面的 focus，需要用捕获模式，
      // 同时注册 click，以防止 slot 里内容无法聚焦
      this.addEventListener('focus', onSlotFocus, true)
      this.addEventListener('click', onSlotFocus, true)
      this.addEventListener('click-clear', onClearEnd)
    })
    this.onDisconnected(() => {
      this.removeEventListener('mousedown-clear', onClearStart)
      this.removeEventListener('focus', onSlotFocus, true)
      this.removeEventListener('click', onSlotFocus, true)
      this.removeEventListener('click-clear', onClearEnd)
    })
  }

  #setupList() {
    this.onAttributeChanged((attrName, _, newValue) => {
      if (BlocksList.observedAttributes.includes(attrName)) {
        this.$list.setAttribute(attrName, newValue as string)
      }
    })

    const onOpened = () => this.redrawList()
    const onClickItem = (event: any) => {
      dispatchEvent(this, 'click-item', { detail: { id: event.detail.id } })
    }
    this.onConnected(() => {
      this.$list.addEventListener('click-item', onClickItem)
      this.$popup.addEventListener('opened', onOpened)
    })
    this.onDisconnected(() => {
      this.$list.removeEventListener('click-item', onClickItem)
      this.$popup.removeEventListener('opened', onOpened)
    })
  }
}
