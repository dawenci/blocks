import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import { attr } from '../../decorators/attr/index.js'
import {
  connectSelectable,
  ISelected,
  ISelectListEventMap,
  ISelectResultComponent,
} from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { listTemplate, popupTemplate, styleTemplate, template } from './template.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { BlList } from '../list/index.js'
import { BlPopup, PopupOrigin } from '../popup/index.js'
import { BlControl } from '../base-control/index.js'

const ATTRS = BlPopup.observedAttributes.concat(BlList.observedAttributes)

export interface BlDropdownListEventMap extends BlComponentEventMap, ISelectListEventMap {
  'click-item': CustomEvent<{ id: any }>
}

export interface BlDropdownList extends BlControl, ISelectResultComponent {
  $popup: BlPopup
  $list: BlList

  addEventListener<K extends keyof BlDropdownListEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDropdownListEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof BlDropdownListEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDropdownListEventMap[K]>,
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
export class BlDropdownList extends BlControl implements ISelectResultComponent {
  static override get observedAttributes() {
    return ATTRS
  }

  @attr('enum', { enumValues: ['hover', 'click'] })
  accessor triggerMode: OneOf<['hover', 'click']> = 'click'
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

    this.#setupPopup()
    this.#setupList()
    this.#setupConnect()

    this.hook.onConnected(this.render)
  }

  #setupConnect() {
    this.$list.afterResultAccepted = () => {
      if (!this.multiple) {
        this.open = false
      }
    }
    this.afterListClear = () => {
      this.closePopup()
      // 点击 clear 后，取消 slot 里面的焦点
      // 否则，控件无法重新通过 focus 触发
      if (document.activeElement) {
        ;(document.activeElement as any).blur()
      }
    }
    // this 代理 slot 里的 $result
    connectSelectable(this, this.$list)
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
    dispatchEvent(this, 'select-result:after-accept-selected')
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

  #setupPopup() {
    const defaultAnchorGetter = () => this.$slot.assignedElements()?.[0] ?? this
    const updatePopupSize = () => {
      const anchorWidth = (this.$popup.anchorElement?.() as HTMLElement)?.offsetWidth ?? 0
      this.$popup.style.width = Math.max(200, anchorWidth) + 'px'
      this.$popup.style.height = 240 + this.$popup.arrow + 'px'
    }

    this.hook.onConnected(() => {
      this.setAnchorGetter(defaultAnchorGetter)
      if (!this.hasAttribute('origin')) {
        this.origin = PopupOrigin.TopStart
      }
      this.$popup.arrow = 8
      this.$popup.autoflip = true
      this.$popup.anchorElement = () => (this.getAnchorGetter() ?? defaultAnchorGetter)()
    })

    this.hook.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })

    this.hook.onAttributeChangedDeps(BlPopup.observedAttributes, (name, _, newValue) => {
      if (name === 'open') {
        // 首次打开的时候，挂载 $popup 的 DOM
        if (this.open && !document.body.contains(this.$popup)) {
          document.body.appendChild(this.$popup)
        }
        updatePopupSize()
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
    this.hook.onConnected(() => {
      this.$popup.addEventListener('opened', onOpened)
      this.$popup.addEventListener('closed', onClosed)
    })
    this.hook.onDisconnected(() => {
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
    this.hook.onConnected(() => {
      this.addEventListener('mousedown-clear', onClearStart)
      // focus 不冒泡，关注 slot 里面的 focus，需要用捕获模式，
      // 同时注册 click，以防止 slot 里内容无法聚焦
      this.addEventListener('focus', onSlotFocus, true)
      this.addEventListener('click', onSlotFocus, true)
      this.addEventListener('click-clear', onClearEnd)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('mousedown-clear', onClearStart)
      this.removeEventListener('focus', onSlotFocus, true)
      this.removeEventListener('click', onSlotFocus, true)
      this.removeEventListener('click-clear', onClearEnd)
    })
  }

  #setupList() {
    this.hook.onAttributeChanged((attrName, _, newValue) => {
      if (BlList.observedAttributes.includes(attrName)) {
        this.$list.setAttribute(attrName, newValue as string)
      }
    })

    const onOpened = () => this.redrawList()
    const onClickItem = (event: any) => {
      dispatchEvent(this, 'click-item', { detail: { id: event.detail.id } })
    }
    this.hook.onConnected(() => {
      this.$list.addEventListener('click-item', onClickItem)
      this.$popup.addEventListener('opened', onOpened)
    })
    this.hook.onDisconnected(() => {
      this.$list.removeEventListener('click-item', onClickItem)
      this.$popup.removeEventListener('opened', onOpened)
    })
  }
}
