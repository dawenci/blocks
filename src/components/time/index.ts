import type { BlScrollable } from '../scrollable/index.js'
import type { BlComponentEventListener } from '../component/Component.js'
import type { ISelectListEventMap, ISelectableListComponent, ISelected } from '../../common/connectSelectable.js'
import '../scrollable/index.js'
import { attrs } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { padLeft } from '../../common/utils.js'
import { prop } from '../../decorators/prop/index.js'
import { IReactive, reactive, subscribe } from '../../common/reactive.js'
import { scrollTo } from '../../common/scrollTo.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlComponent } from '../component/Component.js'

export interface BlTimeEventMap extends ISelectListEventMap {
  change: CustomEvent<{ value: TimeModel | null }>
}

export interface BlTime extends BlComponent, ISelectableListComponent {
  addEventListener<K extends keyof BlTimeEventMap>(
    type: K,
    listener: BlComponentEventListener<BlTimeEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlTimeEventMap>(
    type: K,
    listener: BlComponentEventListener<BlTimeEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

export type TimeModel = { hour: number; minute: number; second: number }

export type ValueField = 'hour' | 'minute' | 'second'

export const valueFields = ['hour', 'minute', 'second'] as const

export const timeEquals = (a: TimeModel | null, b: TimeModel | null) => {
  if (a === b) return true
  if (a == null || b == null) return false
  return a.hour === b.hour && a.minute === b.minute && a.second === b.second
}

@defineClass({
  customElement: 'bl-time',
  styles: [style],
})
export class BlTime extends BlComponent implements ISelectableListComponent {
  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @prop({
    get(self) {
      return self.#model.content?.hour ?? null
    },
    set(self, value) {
      self.setField(self.#model, 'hour', value)
    },
  })
  accessor hour!: number | null

  @prop({
    get(self) {
      return self.#model.content?.minute ?? null
    },
    set(self, value) {
      self.setField(self.#model, 'minute', value)
    },
  })
  accessor minute!: number | null

  @prop({
    get(self) {
      return self.#model.content?.second ?? null
    },
    set(self, value) {
      self.setField(self.#model, 'second', value)
    },
  })
  accessor second!: number | null

  @shadowRef('#layout') accessor $layout!: HTMLElement
  @shadowRef('#hours') accessor $hours!: BlScrollable
  @shadowRef('#minutes') accessor $minutes!: BlScrollable
  @shadowRef('#seconds') accessor $seconds!: BlScrollable

  #model = reactive<TimeModel | null>(null, timeEquals)

  formatter = (model: TimeModel | null) => {
    if (model == null) return ''
    const hour = padLeft('0', 2, String(model.hour))
    const minute = padLeft('0', 2, String(model.minute))
    const second = padLeft('0', 2, String(model.second))
    return `${hour}:${minute}:${second}`
  }

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupResult()
    this.#setupDisabled()

    this.hook.onConnected(() => {
      this.upgradeProperty(['disabledTime', 'disabledHour', 'disabledMinute', 'disabledSecond'])
    })
  }

  get value() {
    return this.#model.content
  }

  set value(value: TimeModel | null) {
    this.setModel(this.#model, value)
  }

  #disabledTime?: (hour: number | null, minute: number | null, second: number | null) => [boolean, boolean, boolean]
  get disabledTime() {
    return this.#disabledTime
  }
  set disabledTime(value) {
    this.#disabledTime = value
    this.#updateDisabled()
  }

  isDisabled(field: ValueField, value: number): boolean {
    if (!this.disabledTime) return false
    switch (field) {
      case 'hour':
        return this.disabledTime(value, this.minute, this.second)[0]
      case 'minute':
        return this.disabledTime(this.hour, value, this.second)[1]
      case 'second':
        return this.disabledTime(this.hour, this.minute, value)[2]
    }
  }

  _getList(field: ValueField): BlScrollable {
    return this[`$${field}s`]
  }

  firstEnableModel(fixHour?: number, fixMinute?: number, fixSecond?: number): TimeModel | null {
    if (!this.disabledTime) return { hour: 0, minute: 0, second: 0 }
    let startHour = 0
    let endHour = 24
    if (fixHour != null) {
      startHour = fixHour
      endHour = fixHour + 1
    }
    let startMinute = 0
    let endMinute = 60
    if (fixMinute != null) {
      startMinute = fixMinute
      endMinute = fixMinute + 1
    }
    let startSecond = 0
    let endSecond = 60
    if (fixSecond != null) {
      startSecond = fixSecond
      endSecond = fixSecond + 1
    }
    for (let hour = startHour; hour < endHour; ++hour) {
      for (let minute = startMinute; minute < endMinute; ++minute) {
        for (let second = startSecond; second < endSecond; ++second) {
          const [h, m, s] = this.disabledTime(hour, minute, second)
          if (h || m || s) continue
          return { hour, minute, second }
        }
      }
    }
    return null
  }

  setModel(model: IReactive<TimeModel | null>, value: TimeModel | null) {
    if (value) {
      if (this.disabledTime && this.disabledTime(value.hour, value.minute, value.second).some(result => result)) {
        return
      }
    }
    model.content = value
  }

  setField(modelRef: IReactive<TimeModel | null>, field: ValueField, value: number | null) {
    // 要么全部 null，要么全部有值
    if (value == null) {
      modelRef.content = null
    } else {
      value = value | 0
      const max = field === 'hour' ? 24 : 60
      if (value < 0 || value >= max) return
      if (this.isDisabled(field, value)) return

      if (modelRef.content) {
        modelRef.content = Object.assign({}, modelRef.content, { [field]: value })
      } else {
        const model =
          field === 'hour'
            ? this.firstEnableModel(value)
            : field === 'minute'
            ? this.firstEnableModel(undefined, value)
            : this.firstEnableModel(undefined, undefined, value)
        modelRef.content = model
      }
    }
  }

  #setupResult() {
    const makeClickHandler = (field: ValueField) => {
      return (e: Event) => {
        const target = e.target as HTMLElement
        if (target.classList.contains('item')) {
          if (target.classList.contains('disabled')) return
          const value = +target.textContent!
          if (value === this.#model.content?.[field]) {
            // 值没有变化，不会触发 attributeChangedCallback，
            // 为了确保点击后滚动到选中值位置，人工触发执行动画
            this.scrollToActive()
          } else {
            this.setField(this.#model, field, value)
          }
        }
      }
    }
    this.hook.onConnected(() => {
      this.$hours.onclick = makeClickHandler('hour')
      this.$minutes.onclick = makeClickHandler('minute')
      this.$seconds.onclick = makeClickHandler('second')
    })
    this.hook.onDisconnected(() => {
      this.$hours.onclick = this.$minutes.onclick = this.$seconds.onclick = null
    })

    // 根据当前 hour/minute/second 设置滚动位置，更新 active 样式
    const updateActive = () => {
      valueFields.forEach(field => {
        const $scrollable = this._getList(field)
        const $old = $scrollable.querySelector('.active')
        const value = this.#model.content?.[field] ?? null
        if ($old && (value == null || value !== Number($old.textContent))) {
          $old.classList.remove('active')
        }
        if (value != null) {
          $scrollable.children[Number(value)].classList.add('active')
          this.scrollToActive()
        }
      })
    }
    subscribe(this.#model, () => {
      this.triggerChange()
      updateActive()
    })
    this.hook.onRender(updateActive)

    valueFields.forEach(field => {
      const $scrollable = this._getList(field)
      let timer: ReturnType<typeof setTimeout>
      $scrollable.addEventListener('bl:scroll', () => {
        clearTimeout(timer)
        // 被动滚动中（即非用户操作滚动时），不执行设值逻辑
        if (this.#passiveScrolling.get($scrollable)) {
          return
        }

        // 设置用户操作标志，避免触发设置值的时候的被动滚动动画行为
        this.#mouseScrolling = true
        const scrolled = $scrollable.viewportScrollTop
        const itemHeight = $scrollable.children[0].clientHeight
        const value = Math.trunc(scrolled / itemHeight) + (scrolled % itemHeight > 0.5 ? 1 : 0)
        if (!this.isDisabled(field, value)) {
          this.setField(this.#model, field, value)
          // this[field] = value
        }
        this.#mouseScrolling = false

        // 用户操作停止一段时间后，自动触发被动滚动动画，以对齐滚动位置到选中值
        timer = setTimeout(() => {
          this.scrollToActive()
        }, 160)
      })
    })
  }

  #setupDisabled() {
    this.hook.onRender(this.#updateDisabled)
  }

  #updateDisabled() {
    for (const field of valueFields) {
      this._getList(field)
        .querySelectorAll('.item')
        .forEach(($item, index) => {
          $item.classList.toggle('disabled', this.isDisabled(field, index))
        })
    }
  }

  // 记录列是否处于被动滚动动画中
  #passiveScrolling = new WeakMap<BlScrollable, boolean>()
  #cancelPassiveScroll: (() => void) | undefined
  _doPassiveScroll() {
    const cancelFns = valueFields.map(field => {
      const $scrollable = this._getList(field)
      const value = this[field]
      if (value == null) {
        this.#passiveScrolling.set($scrollable, true)
        // scroll 阶段
        $scrollable.viewportScrollTop = 0
        // scroll 之后
        requestAnimationFrame(() => {
          this.#passiveScrolling.set($scrollable, false)
        })
        return () => {
          //
        }
      } else {
        const top = ($scrollable.children[value] as HTMLElement).offsetTop
        this.#passiveScrolling.set($scrollable, true)
        return scrollTo($scrollable, top, {
          property: 'viewportScrollTop',
          duration: 0.16,
          done: () => {
            this.#passiveScrolling.set($scrollable, false)
          },
        })
      }
    })
    this.#cancelPassiveScroll = () => {
      cancelFns.forEach(fn => fn())
      this.#cancelPassiveScroll = undefined
    }
  }

  // 是否手动滚动中
  #mouseScrolling = false
  scrollToActive() {
    if (this.#mouseScrolling) return
    if (this.#cancelPassiveScroll) this.#cancelPassiveScroll()
    this._doPassiveScroll()
  }

  /**
   * 支持 ISelectableListComponent
   */
  triggerChange() {
    if (this.blSilent) return
    const value = this.#model.content
    const label = this.formatter(value)
    const selected = [{ value, label }]
    dispatchEvent(this, 'select-list:change', { detail: { value: selected } })
    dispatchEvent(this, 'change', { detail: { value } })
  }

  /**
   * 清空当前的选择值
   * ISelectableListComponent
   */
  clearSelected() {
    // 标记成被动滚动（即只执行滚动动画，而不触发选择），以避免设置 scrollTop 时设置 hour/minute/second
    // 否则清空后，会被 bl:scroll 的事件处理器重新设置为 0 而无法正确清空
    this.#passiveScrolling.set(this.$hours, true)
    this.#passiveScrolling.set(this.$minutes, true)
    this.#passiveScrolling.set(this.$seconds, true)
    this.$hours.viewportScrollTop = this.$minutes.viewportScrollTop = this.$seconds.viewportScrollTop = 0
    // 在 scroll 之后才释放被动滚动标志
    requestAnimationFrame(() => {
      this.#passiveScrolling.set(this.$hours, false)
      this.#passiveScrolling.set(this.$minutes, false)
      this.#passiveScrolling.set(this.$seconds, false)
    })

    if (this.hour !== null && this.minute !== null && this.second !== null) {
      this.#model.content = null
    }

    dispatchEvent(this, 'select-list:after-clear')
  }

  /**
   * ISelectableListComponent
   */
  deselect(selected: ISelected<TimeModel>) {
    if (timeEquals(this.#model.content, selected.value)) {
      this.#model.content = null
    }
  }
}
