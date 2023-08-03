import type { BlButton } from '../button/index.js'
import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import { ISelectableListComponent, makeISelectableProxy } from '../../common/connectSelectable.js'
import '../button/index.js'
import '../datetime/index.js'
import '../popup/index.js'
import '../select-result/index.js'
import { attr } from '../../decorators/attr/index.js'
import { connectSelectable } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { inputTemplate, popupTemplate } from './template.js'
import { reactive, subscribe } from '../../common/reactive.js'
import { style } from './style.js'
import { BlPopup } from '../popup/index.js'
import { BlSelectResult } from '../select-result/index.js'
import { BlControl } from '../base-control/index.js'
import { BlDateTime, dateTimeEquals } from '../datetime/index.js'
import {
  PROXY_POPUP_ACCESSORS,
  PROXY_POPUP_ACCESSORS_KEBAB,
  PROXY_RESULT_ACCESSORS,
  PROXY_RESULT_ACCESSORS_KEBAB,
} from '../../common/constants.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

interface BlDateTimePickerEventMap extends BlComponentEventMap {
  change: CustomEvent<{ value: Date[] }>
  closed: CustomEvent
  opened: CustomEvent
}

export interface BlDateTimePicker
  extends BlControl,
    Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>,
    Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
  $popup: BlPopup
  $datetime: BlDateTime
  $confirmButton: BlButton

  addEventListener<K extends keyof BlDateTimePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDateTimePickerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlDateTimePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDateTimePickerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-datetime-picker',
  styles: [style],
  proxyAccessors: [
    { klass: BlPopup, names: PROXY_POPUP_ACCESSORS },
    { klass: BlSelectResult, names: PROXY_RESULT_ACCESSORS },
  ],
})
export class BlDateTimePicker extends BlControl {
  static override get observedAttributes() {
    return [...PROXY_POPUP_ACCESSORS_KEBAB, ...PROXY_RESULT_ACCESSORS_KEBAB, ...BlDateTime.observedAttributes]
  }

  @attr('string', { defaults: 'YYYY-MM-DD HH:mm:ss' }) accessor format!: string

  @attr('boolean') accessor open!: boolean

  @attr('string') accessor placeholder = '请选择日期时间'

  @shadowRef('#content') accessor $content!: HTMLElement
  @shadowRef('[part="result"]') accessor $result!: BlSelectResult

  #model = reactive<Date | null>(null, dateTimeEquals)

  constructor() {
    super()

    this.appendShadowChild(inputTemplate())

    this._disabledFeature.withTarget(() => [this, this.$result])
    this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex(0)

    this.#setupPopup()
    this.#setupResult()
    this.#setupConnect()
    this.#setupAria()
  }

  get disabledDate() {
    return this.$datetime.disabledDate
  }
  set disabledDate(value) {
    this.$datetime.disabledDate = value
  }

  get disabledTime() {
    return this.$datetime.disabledTime
  }
  set disabledTime(value) {
    this.$datetime.disabledTime = value
  }

  get value(): null | Date {
    return this.#model.content
  }

  set value(value: null | Date) {
    this.#model.content = value
  }

  _clickOutside: SetupClickOutside<this> = SetupClickOutside.setup({
    component: this,
    target() {
      return [this, this.$popup]
    },
    update() {
      if (this.open) {
        this.open = false
      }
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

  #setupPopup() {
    this.$popup = popupTemplate() as BlPopup & ISelectableListComponent
    this.$datetime = this.$popup.querySelector('bl-datetime')!
    this.$confirmButton = this.$popup.querySelector('bl-button')!
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
      }
      isClickClear = false
    }
    const onClearEnd = () => {
      isClickClear = false
    }
    this.$result.afterListClear = () => {
      this.open = false
      this.blur()
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

    // 代理 popup 事件
    {
      this.proxyEvent(this.$popup, 'opened')
      this.proxyEvent(this.$popup, 'closed')
    }

    this.hook.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })
    this.hook.onAttributeChangedDeps(PROXY_POPUP_ACCESSORS_KEBAB, (name, _, newValue) => {
      if (name === 'open') {
        // 首次打开的时候，挂载 $popup 的 DOM
        if (this.open && !document.body.contains(this.$popup)) {
          document.body.appendChild(this.$popup)
        }
        this.$popup.open = this.open

        // 打开 popup 前，如果 date 有值则切换视图到最后一个值所在日期面板
        if (!this.open) {
          this.$datetime.showValue(this.$datetime.selected ?? new Date())
        }
      } else {
        this.$popup.setAttribute(name, newValue as string)
      }
    })

    this.#setupDateTime()
  }

  #setupDateTime() {
    // 点击确定按钮，提交值
    this.$confirmButton.onclick = () => {
      this.open = false
    }

    this.$datetime.addEventListener('change', () => {
      this.#model.content = this.$datetime.selected
    })

    this.hook.onAttributeChanged((attrName, _, newValue) => {
      if (BlDateTime.observedAttributes.includes(attrName as any)) {
        this.$datetime.setAttribute(attrName, newValue as string)
      }
    })
  }

  #setupResult() {
    this.hook.onConnected(() => {
      if (this.$result.placeholder == null) {
        this.$result.placeholder = '请选择日期时间'
      }
      if (!this.$result.suffixIcon) {
        this.$result.suffixIcon = 'time'
      }
    })

    this.hook.onAttributeChangedDeps(PROXY_RESULT_ACCESSORS_KEBAB, (name, _, newValue) => {
      this.$result.setAttribute(name, newValue as string)
    })

    const renderPlaceholder = () => {
      this.$result.placeholder = this.placeholder ?? '请选择日期时间'
    }
    this.hook.onRender(renderPlaceholder)
    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  #setupConnect() {
    const $proxy = makeISelectableProxy<Date>()

    // 代理结果、选项之间的连接
    connectSelectable(this.$result, $proxy)
    connectSelectable($proxy, this.$datetime)

    // 处理 $date 面板发送过来的选中值
    $proxy.acceptSelected = selected => {
      this.#model.content = selected[0]?.value ?? null
    }
    // 处理 $result 发送过来的取消选中项
    $proxy.deselect = selected => {
      if (dateTimeEquals(this.#model.content, selected?.value)) {
        this.#model.content = null
      }
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
      const selected = value == null ? [] : [{ value, label: this.$datetime.formatter.content(value) }]

      this.$result.acceptSelected(selected)
      this.$datetime.selected = value

      if (value) this.$datetime.showValue(value)

      dispatchEvent(this, 'change', { detail: { value } })
    })
  }

  #setupAria() {
    this.hook.onConnected(() => {
      this.setAttribute('aria-haspopup', 'true')
    })
  }
}
