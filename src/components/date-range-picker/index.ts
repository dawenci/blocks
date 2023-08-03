import type { BlComponentEventListener } from '../component/Component.js'
import type { ISelectPair } from '../../common/connectSelectable.js'
import '../pair-result/index.js'
import { attr } from '../../decorators/attr/index.js'
import { compile } from '../../common/dateFormat.js'
import { computed, reactive, subscribe } from '../../common/reactive.js'
import { connectPairSelectable, connectSelectable, makeIPairSelectableProxy } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { fromAttr } from '../component/reactive.js'
import { makeDate, makeDateFrom } from '../../common/date.js'
import { popupTemplate, resultTemplate } from './template.js'
import { style } from './style.js'
import { unmount } from '../../common/mount.js'
import { BlDate, dateEquals } from '../date/index.js'
import { BlPairResult } from '../pair-result/index.js'
import { BlPopup, PopupOrigin } from '../popup/index.js'
import { BlControl, BlControlEventMap } from '../base-control/index.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

export interface BlDateRangePickerEventMap extends BlControlEventMap {
  change: CustomEvent<{ value: any }>
  closed: CustomEvent
  opened: CustomEvent
}

export interface BlDateRangePicker extends BlControl {
  $popup: BlPopup
  $date: BlDate

  addEventListener<K extends keyof BlDateRangePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDateRangePickerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlDateRangePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDateRangePickerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// TODO: size
@defineClass({
  customElement: 'bl-date-range-picker',
  styles: [style],
})
export class BlDateRangePicker extends BlControl {
  static override get observedAttributes() {
    return [...BlPopup.observedAttributes, ...BlDate.observedAttributes, ...BlPairResult.observedAttributes]
  }

  @attr('string') accessor placeholderFirst = '开始日期'

  @attr('string') accessor placeholderSecond = '结束日期'

  @attr('string', { defaults: 'YYYY-MM-DD' }) accessor format!: string

  @attr('boolean') accessor open!: boolean

  @shadowRef('bl-pair-result') accessor $result!: BlPairResult

  #formatter = computed(format => compile(format), [fromAttr(this, 'format')])

  #firstModel = reactive<Date | null>(null, dateEquals)
  #secondModel = reactive<Date | null>(null, dateEquals)

  constructor() {
    super()

    this.appendShadowChild(resultTemplate())
    this._disabledFeature.withTarget(() => [this, this.$result])
    this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex(0)

    this.#setupPopup()
    this.#setupResult()
    this.#setupDateProxy()
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

  #disabledDate: any
  get disabledDate() {
    return this.#disabledDate
  }

  set disabledDate(value) {
    this.#disabledDate = value
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

  #setupDateProxy() {
    const $proxy = makeIPairSelectableProxy<Date>()
    // 代理结果、选项之间的连接
    connectSelectable($proxy, this.$date)
    connectPairSelectable(this.$result, $proxy)

    // 处理 $datetime 面板发送过来的选中值
    $proxy.acceptSelected = selected => {
      if (this.#isFirstActive()) {
        const firstDate = selected[0]?.value
        const secondDate = this.#secondModel.content
        // 一旦出现开始时间大于结束时间这种非法值，则需要自动纠正
        if (firstDate && secondDate && firstDate.getTime() > secondDate.getTime()) {
          firstDate.setTime(secondDate.getTime())
        }
        this.#firstModel.content = firstDate
      } else if (this.#isSecondActive()) {
        const firstDate = this.#firstModel.content
        const secondDate = selected[0]?.value
        // 一旦出现开始时间大于结束时间这种非法值，则需要自动纠正
        if (firstDate && secondDate && firstDate.getTime() > secondDate.getTime()) {
          secondDate.setTime(firstDate.getTime())
        }
        this.#secondModel.content = selected[0]?.value
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
        this.$date.selected = model ? [model] : []
        if (model) this.$date.showValue(model)
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
        this.$date.selected = model ? [model] : []
        if (model) this.$date.showValue(model)
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

  #setupResult() {
    {
      this.hook.onAttributeChanged((name, _, newValue) => {
        if (name === 'palceholder-from') {
          this.$result.placeholderFirst = this.placeholderFirst
        } else if (name === 'placeholder-second') {
          this.$result.placeholderSecond = this.placeholderSecond
        } else if (BlPairResult.observedAttributes.includes(name)) {
          this.$result.setAttribute(name, newValue as string)
        }
      })
      this.hook.onConnected(() => {
        this.$result.placeholderFirst = this.placeholderFirst
        this.$result.placeholderSecond = this.placeholderSecond
      })
    }

    const onActiveChange = () => {
      // 激活面板 1
      if (this.$result.active === 'first') {
        this.$result.withBlSilent(() => {
          this.$date.withBlSilent(() => {
            this.$popup.origin = PopupOrigin.TopStart
            this.$date.selected = this.#firstModel.content ? [this.#firstModel.content] : []
            this.$date.render() // force update (rerender disabled)
            this.open = true
          })
        })
      }
      // 激活面板 2
      else if (this.$result.active === 'second') {
        this.$result.withBlSilent(() => {
          this.$date.withBlSilent(() => {
            this.$popup.origin = PopupOrigin.TopEnd
            this.$date.selected = this.#secondModel.content ? [this.#secondModel.content] : []
            this.$date.render() // force update (rerender disabled)
            this.open = true
          })
        })
      }
      // 取消激活
      else {
        this.$date.withBlSilent(() => {
          // 没有两边同时有值的情况，清空
          if (!this.#firstModel.content || !this.#secondModel.content) {
            this.#firstModel.content = this.#secondModel.content = null
          }
          this.$date.render() // force update (rerender disabled)
          this.open = false
        })
      }
    }

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

  #setupPopup() {
    this.$popup = popupTemplate()
    this.$date = this.$popup.querySelector('bl-date')!
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

    this.#setupDate()
  }

  #setupDate() {
    this.hook.onAttributeChanged((name, _, newValue) => {
      if (BlDate.observedAttributes.includes(name as any)) {
        if (name !== 'mode') {
          // mode 需要永远保持 single
          this.$date.setAttribute(name, newValue as string)
        }
      }
    })

    this.#setupDisabledDate()
  }

  #setupDisabledDate() {
    // 设置 disabled 逻辑
    this.$date.disabledDate = (data, ctx) => {
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
  }

  #setupAria() {
    this.hook.onConnected(() => {
      this.setAttribute('aria-haspopup', 'true')
    })
  }
}
