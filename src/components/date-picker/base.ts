import type { BlButton } from '../button/index.js'
import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import { attr, attrs } from '../../decorators/attr/index.js'
import { connectSelectable, makeISelectableProxy } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { popupTemplate, resultTemplate } from './template.js'
import { reactive, subscribe } from '../../common/reactive.js'
import { style } from './style.js'
import { BlDate, dateEquals } from '../date/index.js'
import { BlSelectResult } from '../select-result/index.js'
import { BlPopup } from '../popup/index.js'
import { BlControl } from '../base-control/index.js'
import {
  PROXY_POPUP_ACCESSORS,
  PROXY_POPUP_ACCESSORS_KEBAB,
  PROXY_RESULT_ACCESSORS,
  PROXY_RESULT_ACCESSORS_KEBAB,
} from '../../common/constants.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

export interface BaseDatePickerEventMap extends BlComponentEventMap {
  change: CustomEvent<{ value: Date[] | Date | null }>
  closed: CustomEvent
  opened: CustomEvent
}

export interface BaseDatePicker
  extends BlControl,
    Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>,
    Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
  $popup: BlPopup
  $date: BlDate
  $confirmButton: BlButton

  addEventListener<K extends keyof BaseDatePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BaseDatePickerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BaseDatePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BaseDatePickerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  styles: [style],
  proxyAccessors: [
    { klass: BlPopup, names: PROXY_POPUP_ACCESSORS },
    { klass: BlSelectResult, names: PROXY_RESULT_ACCESSORS },
  ],
})
export class BaseDatePicker extends BlControl {
  static override get observedAttributes() {
    return [...PROXY_POPUP_ACCESSORS_KEBAB, ...PROXY_RESULT_ACCESSORS_KEBAB, ...BlDate.observedAttributes]
  }

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @attr('string', { defaults: 'YYYY-MM-DD' }) accessor format!: string

  @attr('boolean') accessor open!: boolean

  @shadowRef('#result') accessor $result!: BlSelectResult

  // model
  protected _model = reactive<Date[]>([], (a, b) => {
    if (a.length !== b.length) return false
    return a.every((aItem, index) => {
      const bItem = b[index]
      return dateEquals(aItem, bItem)
    })
  })

  constructor() {
    super()

    this.appendShadowChild(resultTemplate())

    this._disabledFeature.withTarget(() => [this, this.$result])

    this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex(0)

    this.#setupPopup()
    this.#setupResult()
    this.#setupConnect()
    this.#setupAria()
  }

  get value(): Date[] | Date | null {
    return this._model.content[0] ?? null
  }
  set value(value: Date[] | Date | null) {
    this._model.content = Array.isArray(value) ? value : value ? [value] : []
  }

  get disabledDate() {
    return this.$date.disabledDate
  }

  set disabledDate(value) {
    this.$date.disabledDate = value
  }

  /** 选择模式，支持 single, multiple，子类覆盖 */
  get mode(): 'single' | 'multiple' {
    return 'single'
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

  // popup 打开时、model 变化时，$date 面板显示到最后一个选中项所在的视图
  protected _showLastValueInPanel() {
    const dates = this._model.content
    if (dates.length) {
      this.$date.showValue(dates[dates.length - 1] ?? new Date())
    }
  }

  #setupResult() {
    this.hook.onConnected(() => {
      if (this.$result.placeholder == null) {
        this.$result.placeholder = '请选择日期'
      }
    })
    this.hook.onAttributeChanged((name, _, newValue) => {
      if (PROXY_RESULT_ACCESSORS_KEBAB.includes(name)) {
        this.$result.setAttribute(name, newValue as string)
      }
      if (name === 'mode') {
        this.$result.multiple = newValue === 'multiple'
      }
    })
    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
    this.hook.onAttributeChangedDep('format', () => {
      this.$date.notifySelectListChange()
    })
  }

  #setupPopup() {
    // DOM 准备
    this.$popup = popupTemplate()
    this.$date = this.$popup.querySelector('bl-date')!
    this.$date.dateEquals = dateEquals
    this.$confirmButton = this.$popup.querySelector('bl-button')!
    this.$popup.anchorElement = () => this.$result

    // 标记该次 focus 是点击了 clear 按钮触发的
    // 点击 clear 按钮，无需弹出弹窗
    let isClickClear = false
    const onClearStart = () => {
      isClickClear = true
    }
    const onFocus = () => {
      if (!isClickClear) this.open = true
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
        if (this.open) {
          this._showLastValueInPanel()
        }
      } else {
        this.$popup.setAttribute(name, newValue as string)
      }
    })

    // 代理 popup 事件
    {
      this.proxyEvent(this.$popup, 'opened')
      this.proxyEvent(this.$popup, 'closed')
    }

    this.#setupDate()
    this.#setupConfirm()
  }

  #setupDate() {
    this.hook.onAttributeChanged((attrName, _, newValue) => {
      if (BlDate.observedAttributes.includes(attrName as any)) {
        this.$date.setAttribute(attrName, newValue as string)
      }
    })
  }

  #setupConfirm() {
    // 点击确定按钮初始化
    const onClickConfirm = () => {
      this.open = false
    }
    // 多个结果时，显示“确定按钮”
    const renderAction = () => {
      const val = this.$date.mode
      this.$popup.querySelector<HTMLElement>('#action')!.style.display = val === 'multiple' ? 'block' : 'none'
    }
    this.$popup.hook.onConnected(renderAction)
    this.$date.hook.onAttributeChangedDep('mode', renderAction)
    this.hook.onConnected(() => {
      this.$confirmButton.onclick = onClickConfirm
    })
    this.hook.onDisconnected(() => {
      this.$confirmButton.onclick = null
    })
  }

  #setupConnect() {
    const $proxy = makeISelectableProxy<Date>()

    // 代理结果、选项之间的连接
    connectSelectable(this.$result, $proxy)
    connectSelectable($proxy, this.$date)

    // 处理 $date 面板发送过来的选中值
    $proxy.acceptSelected = selected => {
      this._model.content = selected.map(item => item.value)
      // afterResultAccepted
      if (this.mode === 'single') {
        this.open = false
      }
    }
    // 处理 $result 发送过来的取消选中项
    $proxy.deselect = selected => {
      this._model.content = this._model.content.filter(item => !dateEquals(item, selected.value))
    }
    // 处理 $result 发送过来的清空请求
    $proxy.clearSelected = () => {
      this._model.content = []
      // afterListClear
      this.open = false
      this.blur()
    }

    // model 更新时，分别同步到 $result / $date，刷新 $date 面板，触发 change
    subscribe(this._model, values => {
      const selected = values.map(value => {
        return { value, label: this.$date.formatter.content(value) }
      })

      this.$result.acceptSelected(selected)
      this.$date.selected = values

      this._showLastValueInPanel()

      const value = this.mode === 'single' ? values[0] ?? null : values
      dispatchEvent(this, 'change', { detail: { value } })
    })
  }

  #setupAria() {
    this.hook.onConnected(() => {
      this.setAttribute('aria-haspopup', 'true')
    })
  }
}
