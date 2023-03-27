import type { ComponentEventListener } from '../component/Component.js'
import {
  IPairSelectListEventMap,
  IPairSelectResultComponent,
  IPairSelectResultEventMap,
  IPairSelectableListComponent,
  ISelectListEventMap,
  ISelected,
} from '../../common/connectSelectable.js'
import '../pair-result/index.js'
import { attr } from '../../decorators/attr.js'
import { compile } from '../../common/dateFormat.js'
import { computed } from '../../common/reactive.js'
import { connectPairSelectable } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { fromAttr } from '../component/reactive.js'
import { makeDate, makeDateFrom } from '../../common/date.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { popupTemplate, resultTemplate } from './template.js'
import { style } from './style.js'
import { BlocksDate } from '../date/index.js'
import { BlocksPairResult, BlocksPairResultEventMap } from '../pair-result/index.js'
import { BlocksPopup, PopupOrigin } from '../popup/index.js'
import { Control } from '../base-control/index.js'

interface DatePickerEventMap extends IPairSelectResultEventMap {
  change: CustomEvent<{ value: any }>
  closed: CustomEvent
  opened: CustomEvent
}

export interface BlocksDateRangePicker extends Control {
  $popup: BlocksPopup
  $date: BlocksDate

  addEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: ComponentEventListener<DatePickerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: ComponentEventListener<DatePickerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// TODO, clear 后，关闭 popup
@defineClass({
  customElement: 'bl-date-range-picker',
  styles: [style],
})
export class BlocksDateRangePicker extends Control {
  static override get observedAttributes() {
    return [...BlocksPopup.observedAttributes, ...BlocksDate.observedAttributes, ...BlocksPairResult.observedAttributes]
  }

  static override get disableEventTypes(): readonly string[] {
    return ['focus', 'click', 'touchstart', 'keydown']
  }

  @attr('string') accessor placeholderFrom = '开始日期'

  @attr('string') accessor placeholderTo = '结束日期'

  @attr('string', { defaults: 'YYYY-MM-DD' }) accessor format!: string

  @attr('boolean') accessor open!: boolean

  @shadowRef('bl-pair-result') accessor $result!: BlocksPairResult

  #formatter = computed(format => compile(format), [fromAttr(this, 'format')])

  // model
  #valueFrom: Date | null = null
  #valueTo: Date | null = null
  // 弹出日期、时间面板时，记录操作前的值，以便放弃操作时恢复
  #prevValueFrom: Date | null = null
  #prevValueTo: Date | null = null

  constructor() {
    super()

    this.appendShadowChild(resultTemplate())
    this._disabledFeature.withTarget(() => [this, this.$result])
    this._tabIndexFeature.withTabIndex(-1)

    this.#setupPopup()
    this.#setupResult()
    this.#setupDateProxy()
  }

  #prevValue: any
  get value() {
    return this.$date.selected[0]
  }

  set value(value) {
    this.$date.selected = value === null ? [] : [value]
  }

  #disabledDate: any
  get disabledDate() {
    return this.#disabledDate
  }

  set disabledDate(value) {
    this.#disabledDate = value
  }

  #dateProxy = document.createElement('div') as unknown as IPairSelectableListComponent
  #clearConnectResult?: () => void
  connectResult() {
    this.disconnectResult()
    this.#clearConnectResult = connectPairSelectable(this.$result, this.#dateProxy)
  }
  disconnectResult() {
    if (this.#clearConnectResult) {
      this.#clearConnectResult()
      this.#clearConnectResult = undefined
    }
  }

  // 代理 date 对接 result
  #setupDateProxy() {
    const proxyDateChange = (e: ISelectListEventMap['select-list:change']) => {
      const selected = e.detail.value[0] ?? null
      let value: [ISelected | null, ISelected | null]
      if (selected) {
        value = [
          this.$result.active === 'first' ? selected : this.$result.firstSelected,
          this.$result.active === 'second' ? selected : this.$result.secondSelected,
        ]
      } else {
        value = [null, null]
      }
      dispatchEvent(this.#dateProxy, 'pair-select-list:change', { detail: { value } })
    }
    this.$date.addEventListener('select-list:change', proxyDateChange)

    this.#dateProxy.clearSelected = () => {
      this.$date.clearSelected()
    }
  }

  #setupResult() {
    // 面板关闭时，如果开始结束值不完整，则舍弃值
    {
      const discard = () => {
        if (!this.#valueFrom || !this.#valueTo) {
          this.#valueFrom = this.#prevValueFrom
          this.#valueTo = this.#prevValueTo
          this.#renderResult()
          this.$result.firstSelected = this.$result.secondSelected = null
          this.$result.active = null
        }
      }
      this.onConnected(() => {
        this.$popup.addEventListener('closed', discard)
      })
      this.onDisconnected(() => {
        this.$popup.removeEventListener('closed', discard)
      })
    }

    {
      this.onAttributeChanged((name, _, newValue) => {
        if (name === 'palceholder-from') {
          this.$result.placeholderFirst = this.placeholderFrom
        } else if (name === 'placeholder-to') {
          this.$result.placeholderSecond = this.placeholderTo
        } else if (BlocksPairResult.observedAttributes.includes(name)) {
          this.$result.setAttribute(name, newValue as string)
        }
      })
    }

    const onActive = () => {
      if (this.$result.active === 'first') {
        this.disconnectResult()
        this.$popup.origin = PopupOrigin.TopStart

        this.$date.selected = this.#valueFrom === null ? [] : [this.#valueFrom]
        // 面板聚焦到 #valueFrom
        if (this.#valueFrom) {
          this.$date.showValue(this.#valueFrom)
        }
        this.$date.render() // force update (rerender disabled)

        this.connectResult()
        this.open = true
      } else if (this.$result.active === 'second') {
        this.disconnectResult()
        this.$popup.origin = PopupOrigin.TopEnd
        this.$date.selected = this.#valueTo === null ? [] : [this.#valueTo]
        // 面板聚焦到 #valueTo
        if (this.#valueTo) {
          this.$date.showValue(this.#valueTo)
        }
        this.$date.render() // force update (rerender disabled)
        this.connectResult()
        this.open = true
      } else {
        this.open = false
      }
    }
    this.onConnected(() => {
      this.$result.addEventListener('active', onActive)
    })
    this.onDisconnected(() => {
      this.$result.removeEventListener('active', onActive)
    })
    this.onDisconnected(this.disconnectResult)
    // 用户主动通过修改 open 打开 popup，此时没有激活的 input，手工激活
    {
      const onOpened = () => {
        if (this.$result.active === null) {
          this.$result.active = 'first'
        }
      }
      this.onConnected(() => {
        this.$popup.addEventListener('opened', onOpened)
      })
      this.onDisconnected(() => {
        this.$popup.removeEventListener('opened', onOpened)
      })
    }

    const onFirstChange = (e: BlocksPairResultEventMap['change-first']) => {
      this.#valueFrom = e.detail.value?.value ?? null
    }
    const onSecondChange = (e: BlocksPairResultEventMap['change-second']) => {
      this.#valueTo = e.detail.value?.value ?? null
    }
    const onCommit = () => {
      this.open = false
    }
    this.onConnected(() => {
      this.$result.addEventListener('change-first', onFirstChange)
      this.$result.addEventListener('change-second', onSecondChange)
      this.$result.addEventListener('change', onCommit)
    })
    this.onDisconnected(() => {
      this.$result.removeEventListener('change-first', onFirstChange)
      this.$result.removeEventListener('change-second', onSecondChange)
      this.$result.removeEventListener('change', onCommit)
    })

    this.onConnected(this.render)
    this.onAttributeChanged(this.render)
  }

  #renderResult() {
    this.$result.render()
  }
  #isFromActive() {
    return this.$result.active === 'first'
  }

  #setupPopup() {
    this.$popup = popupTemplate()
    this.$date = this.$popup.querySelector('bl-date')!
    this.$popup.anchorElement = () => this.$result
    this.onDisconnected(() => {
      if (document.body.contains(this.$popup)) {
        document.body.removeChild(this.$popup)
      }
    })

    // 点击 popup 外边，隐藏 popup
    {
      let clear: (() => void) | undefined
      const eventStart = () => {
        if (!clear) {
          clear = onClickOutside([this, this.$popup], () => {
            if (this.open) {
              this.$date.clearUncompleteRange()
              this.open = false
            }
          })
        }
      }
      const eventStop = () => {
        if (clear) {
          clear()
          clear = undefined
        }
      }
      this.onConnected(() => {
        this.$popup.addEventListener('opened', eventStart)
        this.$popup.addEventListener('closed', eventStop)
      })
      this.onDisconnected(() => {
        this.$popup.removeEventListener('opened', eventStart)
        this.$popup.removeEventListener('closed', eventStop)
      })
      this.onDisconnected(eventStop)
    }

    // 代理 popup 事件
    {
      this.$popup.addEventListener('opened', () => {
        dispatchEvent(this, 'opened')
      })
      this.$popup.addEventListener('closed', () => {
        dispatchEvent(this, 'closed')
      })
    }

    this.onAttributeChanged((attrName, _, newValue) => {
      if (BlocksPopup.observedAttributes.includes(attrName as any)) {
        if (attrName === 'open') {
          // 首次打开的时候，挂载 $popup 的 DOM
          if (this.open && !document.body.contains(this.$popup)) {
            document.body.appendChild(this.$popup)
          }
          this.$popup.open = this.open
        } else {
          this.$popup.setAttribute(attrName, newValue as string)
        }
      }
    })

    // 弹出面板时，将当前激活的开始或结束时间值同步到 $date 面板上
    this.$popup.addEventListener('opened', () => {
      this.#prevValueFrom = this.#valueFrom ?? null
      this.#prevValueTo = this.#valueTo ?? null
    })

    this.#setupDate()
  }

  #setupDate() {
    // TODO，disabled 没有生效
    // 设置 disabled 逻辑
    this.$date.disabledDate = (data, ctx) => {
      // 存在自定义实现，则使用
      if (this.disabledDate) {
        return this.disabledDate(data, ctx)
      }

      // 默认实现
      if (this.#isFromActive()) {
        // 如果结束时间还没设置，则任何开始时间都允许
        if (!this.#valueTo) return false
        // 否则开始时间不能大于结束时间
        const to = makeDateFrom('day', this.#valueTo)
        const from = makeDate({
          year: data.year,
          monthIndex: data.month,
          day: data.date,
        })
        return from.getTime() > to.getTime()
      } else {
        // 如果开始时间还没设置，则任何结束事件都允许
        if (!this.#valueFrom) return false
        // 否则结束时间不能小于开始时间
        const from = makeDateFrom('day', this.#valueFrom)
        const to = makeDate({
          year: data.year,
          monthIndex: data.month,
          day: data.date,
        })
        return to.getTime() < from.getTime()
      }
    }

    this.onAttributeChanged((attrName, _, newValue) => {
      if (BlocksDate.observedAttributes.includes(attrName as any)) {
        if (attrName !== 'mode') {
          // mode 需要永远保持 single
          this.$date.setAttribute(attrName, newValue as string)
        }
      }
    })
  }
}
