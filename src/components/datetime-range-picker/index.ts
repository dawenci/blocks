import type { BlButton } from '../button/index.js'
import type { BlComponentEventListener } from '../component/Component.js'
import type { ISelectPair } from '../../common/connectSelectable.js'
import '../button/index.js'
import '../datetime/index.js'
import '../pair-result/index.js'
import '../popup/index.js'
import { attr } from '../../decorators/attr/index.js'
import { compile } from '../../common/dateFormat.js'
import { computed, reactive, subscribe } from '../../common/reactive.js'
import { connectPairSelectable, connectSelectable, makeIPairSelectableProxy } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { fromAttr } from '../component/reactive.js'
import { copyDate, makeDate, makeDateFrom } from '../../common/date.js'
import { popupTemplate, resultTemplate } from './template.js'
import { style } from './style.js'
import { unmount } from '../../common/mount.js'
import { BlControl, BlControlEventMap } from '../base-control/index.js'
import { BlDateTime, dateTimeEquals } from '../datetime/index.js'
import { BlPopup } from '../popup/index.js'
import { BlPairResult } from '../pair-result/index.js'
import { PopupOrigin } from '../popup/index.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

export interface BlDateTimeRangePickerEventMap extends BlControlEventMap {
  change: CustomEvent<{ value: [Date | null, Date | null] }>
  closed: CustomEvent
  opened: CustomEvent
}

export interface BlDateTimeRangePicker extends BlControl {
  $popup: BlPopup
  $datetime: BlDateTime
  $confirmButton: BlButton

  addEventListener<K extends keyof BlDateTimeRangePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDateTimeRangePickerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlDateTimeRangePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDateTimeRangePickerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// TODO: size
@defineClass({
  customElement: 'bl-datetime-range-picker',
  styles: [style],
})
export class BlDateTimeRangePicker extends BlControl {
  static override get observedAttributes() {
    return [
      ...BlPopup.observedAttributes,
      ...BlDateTime.observedAttributes,
      ...BlPairResult.observedAttributes,
      'range',
      'placeholder-first',
      'placeholder-second',
    ]
  }

  @attr('boolean') accessor open!: boolean

  @attr('string') accessor placeholderFirst = '开始日期时间'

  @attr('string') accessor placeholderSecond = '结束日期时间'

  @attr('string', { defaults: 'YYYY-MM-DD HH:mm:ss' }) accessor format!: string

  @shadowRef('bl-pair-result') accessor $result!: BlPairResult

  #firstModel = reactive<Date | null>(null, dateTimeEquals)
  #secondModel = reactive<Date | null>(null, dateTimeEquals)
  #formatter = computed(format => compile(format), [fromAttr(this, 'format')])

  constructor() {
    super()

    this.appendShadowChild(resultTemplate())
    this._disabledFeature.withTarget(() => [this, this.$result])
    this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex(0)

    this.#setupPopup()
    this.#setupResult()
    this.#setupDateTimeProxy()
    this.#setupAria()
  }

  get value(): [Date | null, Date | null] {
    return [this.#firstModel.content, this.#secondModel.content]
  }

  set value(value) {
    const first = value?.[0] ?? null
    const second = value?.[0] ?? null
    this.#firstModel.content = first
    this.#secondModel.content = second
  }

  #disabledDate: BlDateTime['disabledDate']
  get disabledDate() {
    return this.#disabledDate
  }
  set disabledDate(value) {
    this.#disabledDate = value
  }

  #disabledTime: BlDateTime['disabledTime']
  get disabledTime() {
    return this.#disabledTime
  }
  set disabledTime(value) {
    this.#disabledTime = value
  }

  _clickOutside: SetupClickOutside<this> = SetupClickOutside.setup({
    component: this,
    target() {
      return [this, this.$popup]
    },
    update() {
      if (this.$result.active !== null) {
        this.$result.active = null
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

  #isFirstActive() {
    return this.$result.active === 'first'
  }

  #isSecondActive() {
    return this.$result.active === 'second'
  }

  #setupResult() {
    {
      this.hook.onAttributeChanged((name, _, newValue) => {
        if (name === 'palceholder-first') {
          this.$result.placeholderFirst = this.placeholderFirst
        } else if (name === 'placeholder-second') {
          this.$result.placeholderSecond = this.placeholderSecond
        } else if (BlPairResult.observedAttributes.includes(name)) {
          this.$result.setAttribute(name, newValue as string)
        }
      })
    }
    this.hook.onConnected(() => {
      this.$result.placeholderFirst = this.placeholderFirst
      this.$result.placeholderSecond = this.placeholderSecond
    })

    const onActiveChange = () => {
      // 激活面板 1
      if (this.$result.active === 'first') {
        this.$result.withBlSilent(() => {
          this.$datetime.withBlSilent(() => {
            this.$popup.origin = PopupOrigin.TopStart
            this.$datetime.selected = this.#firstModel.content
            this.open = true
          })
        })
      }
      // 激活面板 2
      else if (this.$result.active === 'second') {
        this.$result.withBlSilent(() => {
          this.$datetime.withBlSilent(() => {
            this.$popup.origin = PopupOrigin.TopEnd
            this.$datetime.selected = this.#secondModel.content
            this.open = true
          })
        })
      }
      // 取消激活
      else {
        this.$datetime.withBlSilent(() => {
          // 没有两边同时有值的情况，清空
          if (!this.#firstModel.content || !this.#secondModel.content) {
            this.#firstModel.content = this.#secondModel.content = null
          }
          this.open = false
        })
      }
    }
    this.$popup.addEventListener('opened', () => {
      this.$datetime.scrollToActive()
    })

    this.hook.onConnected(() => {
      this.$result.addEventListener('active', onActiveChange)
    })
    this.hook.onDisconnected(() => {
      this.$result.removeEventListener('active', onActiveChange)
    })

    // 用户主动通过修改 open 打开 popup，此时没有激活的 input，手工激活
    // 用户主动通过修改 open 关闭 popup，更新 active 状态
    {
      const onOpened = () => {
        if (this.$result.active === null) {
          this.$result.active = 'first'
        }
      }
      const onClosed = () => {
        if (this.$result.active !== null) {
          this.$result.active = null
        }
      }
      this.hook.onConnected(() => {
        this.$popup.addEventListener('opened', onOpened)
        this.$popup.addEventListener('closed', onClosed)
      })
      this.hook.onDisconnected(() => {
        this.$popup.removeEventListener('opened', onOpened)
        this.$popup.removeEventListener('closed', onClosed)
      })
    }

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  #setupDateTimeProxy() {
    const $proxy = makeIPairSelectableProxy<Date>()
    // 代理结果、选项之间的连接
    connectSelectable($proxy, this.$datetime)
    connectPairSelectable(this.$result, $proxy)

    // 处理 $datetime 面板发送过来的选中值
    $proxy.acceptSelected = selected => {
      let fix: Date | null = null
      if (this.#isFirstActive()) {
        let firstDate = selected[0]?.value
        const secondDate = this.#secondModel.content
        // 一旦出现开始时间大于结束时间这种非法值，则需要自动纠正
        if (firstDate && secondDate && firstDate.getTime() > secondDate.getTime()) {
          firstDate = copyDate(secondDate)
          fix = firstDate
        }
        this.#firstModel.content = firstDate
      } else if (this.#isSecondActive()) {
        const firstDate = this.#firstModel.content
        let secondDate = selected[0]?.value
        // 一旦出现开始时间大于结束时间这种非法值，则需要自动纠正
        if (firstDate && secondDate && firstDate.getTime() > secondDate.getTime()) {
          secondDate = copyDate(firstDate)
          fix = secondDate
        }
        this.#secondModel.content = selected[0]?.value
      }
      if (fix) {
        this.$datetime.selected = fix
      }
    }

    // 处理 $result 发送过来的清空请求
    $proxy.clearSelected = () => {
      this.#firstModel.content = this.#secondModel.content = null
      // afterListClear
      this.open = false
      this.blur()
    }

    subscribe(this.#firstModel, model => {
      if (this.#isFirstActive()) {
        this.$datetime.selected = model
        if (model) this.$datetime.showValue(model)
      }
      const first = model == null ? null : { value: model, label: this.#formatter.content(model) }
      const second =
        this.#secondModel.content == null
          ? null
          : { value: this.#secondModel.content, label: this.#formatter.content(this.#secondModel.content) }
      const selected = [first, second] as ISelectPair

      dispatchEvent($proxy, 'pair-select-list:change', { detail: { value: selected } })
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    })

    subscribe(this.#secondModel, model => {
      if (this.#isSecondActive()) {
        this.$datetime.selected = model
        if (model) this.$datetime.showValue(model)
      }
      const first =
        this.#firstModel.content == null
          ? null
          : { value: this.#firstModel.content, label: this.#formatter.content(this.#firstModel.content) }
      const second = model == null ? null : { value: model, label: this.#formatter.content(model) }
      const selected = [first, second] as ISelectPair

      dispatchEvent($proxy, 'pair-select-list:change', { detail: { value: selected } })
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    })
  }

  #setupPopup() {
    this.$popup = popupTemplate()
    this.$datetime = this.$popup.querySelector('bl-datetime')!
    this.$confirmButton = this.$popup.querySelector('bl-button')!
    this.$popup.anchorElement = () => this.$result
    this.hook.onDisconnected(() => {
      unmount(this.$popup)
    })

    // 代理 popup 事件
    {
      this.proxyEvent(this.$popup, 'opened')
      this.proxyEvent(this.$popup, 'closed')
    }

    this.hook.onAttributeChanged((name, _, newValue) => {
      if (BlPopup.observedAttributes.includes(name as any)) {
        if (name === 'open') {
          // 首次打开的时候，挂载 $popup 的 DOM
          if (this.open && !document.body.contains(this.$popup)) {
            document.body.appendChild(this.$popup)
          }
          this.$popup.open = this.open
        } else {
          this.$popup.setAttribute(name, newValue as string)
        }
      }
    })

    this.#setupDateTime()
  }

  #setupDateTime() {
    // 点击确定按钮，关闭弹窗
    this.$confirmButton.onclick = () => {
      if (this.$result.active === 'first' && !this.$result.secondSelected) {
        this.$result.active = 'second'
      } else if (this.$result.active === 'second' && !this.$result.firstSelected) {
        this.$result.active = 'first'
      } else {
        this.$result.active = null
      }
    }

    this.hook.onAttributeChanged((name, _, newValue) => {
      if (BlDateTime.observedAttributes.includes(name as any)) {
        this.$datetime.setAttribute(name, newValue as string)
      }
    })

    this.#setupDisabledMethods()
  }

  // popup append 后设置才有效
  #setupDisabledMethods() {
    this.$datetime.disabledDate = (data, ctx) => {
      // 存在自定义实现，则使用
      if (this.disabledDate) {
        return this.disabledDate(data, ctx)
      }

      // 默认实现
      if (this.#isFirstActive()) {
        // 如果结束时间还没设置，则任何开始时间都允许
        if (!this.$result.secondSelected) return false
        // 否则开始时间不能大于结束时间
        const to = makeDateFrom('day', this.$result.secondSelected.value)
        const from = makeDate({
          year: data.year,
          monthIndex: data.month,
          day: data.date,
        })
        return from.getTime() > to.getTime()
      }
      //
      else if (this.#isSecondActive()) {
        // 如果开始时间还没设置，则任何结束事件都允许
        if (!this.$result.firstSelected) return false
        // 否则结束时间不能小于开始时间
        const from = makeDateFrom('day', this.$result.firstSelected.value)
        const to = makeDate({
          year: data.year,
          monthIndex: data.month,
          day: data.date,
        })
        return to.getTime() < from.getTime()
      }
      //
      else {
        return false
      }
    }

    this.$datetime.disabledTime = (h, m, s) => {
      if (this.disabledTime) {
        return this.disabledTime(h, m, s)
      }
      return [false, false, false]
    }
  }

  #setupAria() {
    this.hook.onConnected(() => {
      this.setAttribute('aria-haspopup', 'true')
    })
  }
}
