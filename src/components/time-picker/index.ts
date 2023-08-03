import type { BlComponentEventListener } from '../component/Component.js'
import type { BlTimeEventMap, ValueField } from '../time/index.js'
import type { TimeModel } from '../time/index.js'
import '../input/index.js'
import '../select-result/index.js'
import '../popup/index.js'
import '../time/index.js'
import { attr } from '../../decorators/attr/index.js'
import { connectSelectable, makeISelectableProxy } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { prop } from '../../decorators/prop/index.js'
import { reactive, subscribe } from '../../common/reactive.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { template as popupTemplate } from './popup.template.js'
import { BlControl } from '../base-control/index.js'
import { BlPopup } from '../popup/index.js'
import { BlTime, timeEquals } from '../time/index.js'
import { BlSelectResult } from '../select-result/index.js'
import {
  PROXY_POPUP_ACCESSORS,
  PROXY_POPUP_ACCESSORS_KEBAB,
  PROXY_RESULT_ACCESSORS,
  PROXY_RESULT_ACCESSORS_KEBAB,
} from '../../common/constants.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

export interface BlTimePickerEventMap extends BlTimeEventMap {
  change: CustomEvent<{ value: TimeModel | null }>
}

export interface BlTimePicker
  extends BlControl,
    Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>,
    Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
  $popup: BlPopup
  $time: BlTime

  addEventListener<K extends keyof BlTimePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlTimePickerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlTimePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlTimePickerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-time-picker',
  styles: [style],
  proxyAccessors: [
    { klass: BlPopup, names: PROXY_POPUP_ACCESSORS },
    { klass: BlSelectResult, names: PROXY_RESULT_ACCESSORS },
  ],
})
export class BlTimePicker extends BlControl {
  static override get observedAttributes() {
    return [...PROXY_POPUP_ACCESSORS_KEBAB, ...PROXY_RESULT_ACCESSORS_KEBAB, ...BlTime.observedAttributes]
  }

  @attr('boolean') accessor open!: boolean

  @prop({
    get(self) {
      return self.#model.content?.hour ?? null
    },
    set(self, value) {
      BlTime.prototype.setField.call(self, self.#model, 'hour', value)
    },
  })
  accessor hour!: number | null

  @prop({
    get(self) {
      return self.#model.content?.minute ?? null
    },
    set(self, value) {
      BlTime.prototype.setField.call(self, self.#model, 'minute', value)
    },
  })
  accessor minute!: number | null

  @prop({
    get(self) {
      return self.#model.content?.second ?? null
    },
    set(self, value) {
      BlTime.prototype.setField.call(self, self.#model, 'second', value)
    },
  })
  accessor second!: number | null

  @shadowRef('[part="result"]') accessor $result!: BlSelectResult

  #model = reactive<TimeModel | null>(null, timeEquals)

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupResult()
    this.#setupPopup()
    this.#setupConnect()
    this.#setupAria()
  }

  get value() {
    return this.#model.content
  }

  set value(value: TimeModel | null) {
    BlTime.prototype.setModel.call(this, this.#model, value)
  }

  get disabledTime() {
    return this.$time.disabledTime
  }
  set disabledTime(value) {
    this.$time.disabledTime = value
  }

  isDisabled(field: ValueField, value: number) {
    return this.$time.isDisabled(field, value)
  }

  firstEnableModel(fixHour?: number, fixMinute?: number, fixSecond?: number): TimeModel | null {
    return this.$time.firstEnableModel(fixHour, fixMinute, fixSecond)
  }

  _clickOutside: SetupClickOutside<this> = SetupClickOutside.setup({
    component: this,
    target() {
      return [this, this.$popup]
    },
    update() {
      if (this.open) this.open = false
    },
    init() {
      this.hook.onAttributeChangedDep('open', () => {
        if (this.open) {
          this._clickOutside.bind()
        } else {
          this._clickOutside.unbind()
        }
      })
    },
  })

  #setupResult() {
    this.hook.onAttributeChangedDeps(PROXY_RESULT_ACCESSORS_KEBAB, (attrName, oldValue, newValue) => {
      this.$result.setAttribute(attrName, newValue as string)
    })
  }

  #setupPopup() {
    // 面板部分
    this.$popup = popupTemplate()
    this.$time = this.$popup.querySelector('bl-time')!

    this.$popup.anchorElement = () => this.$result

    // 标记该次 focus 是点击了 clear 按钮触发的
    // 点击 clear 按钮，无需弹出弹窗
    let isClickClear = false
    const onClearStart = () => {
      isClickClear = true
    }
    const onFocus = () => {
      if (!isClickClear) {
        this.open = true
        this.$time.scrollToActive()
      }
      isClickClear = false
    }
    const onClearEnd = () => {
      isClickClear = false
    }

    this.hook.onConnected(() => {
      // 触发顺序：mousedown-clear -> focus -> click-clear
      this.addEventListener('mousedown-clear', onClearStart)
      this.addEventListener('focus', onFocus)
      this.addEventListener('click-clear', onClearEnd)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('mousedown-clear', onClearStart)
      this.removeEventListener('focus', onFocus)
      this.removeEventListener('click-clear', onClearEnd)
    })

    const $confirm = this.$popup.querySelector('bl-button')!

    const onConfirm = this._confirm.bind(this)
    $confirm!.onclick = onConfirm

    this.hook.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })
    this.hook.onAttributeChangedDeps(PROXY_POPUP_ACCESSORS_KEBAB, (name, _, val) => {
      if (name === 'open') {
        // 首次打开的时候，挂载 $popup 的 DOM
        if (this.open && !document.body.contains(this.$popup)) {
          document.body.appendChild(this.$popup)
        }
        this.$popup.open = this.open
      } else {
        this.$popup.setAttribute(name, val as string)
      }
    })

    // 代理 popup 事件
    {
      this.proxyEvent(this.$popup, 'opened')
      this.proxyEvent(this.$popup, 'closed')
    }

    this.#setupTime()
  }

  #setupTime() {
    this.hook.onAttributeChangedDeps(BlTime.observedAttributes, (attrName, oldValue, newValue) => {
      this.$time.setAttribute(attrName, newValue as string)
    })
  }

  _confirm() {
    this.open = false
  }

  #setupConnect() {
    const $proxy = makeISelectableProxy<TimeModel>()

    // 代理结果、选项之间的连接
    connectSelectable(this.$result, $proxy)
    connectSelectable($proxy, this.$time)

    // 处理 $date 面板发送过来的选中值
    $proxy.acceptSelected = selected => {
      this.#model.content = selected[0]?.value ?? null
    }
    // 处理 $result 发送过来的清空请求
    $proxy.clearSelected = () => {
      this.#model.content = null
      // afterListClear
      this.open = false
      this.blur()
    }

    // model 更新时，分别同步到 $result / $date，刷新 $date 面板，触发 change
    subscribe(this.#model, value => {
      const selected = value == null ? [] : [{ value, label: this.$time.formatter(value) }]

      this.$result.acceptSelected(selected)
      this.$time.value = value

      dispatchEvent(this, 'change', { detail: { value } })
    })
  }

  #setupAria() {
    this.hook.onConnected(() => {
      this.setAttribute('aria-haspopup', 'true')
    })
  }
}
