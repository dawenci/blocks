import type { BlComponentEventListener } from '../component/Component.js'
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js'
import { style } from './style.js'
import { BlComponent } from '../component/Component.js'
import { WithOpenTransition } from '../with-open-transition/index.js'

export type BlModalMaskEventMap = WithOpenTransitionEventMap

export interface BlModalMask extends WithOpenTransition {
  addEventListener<K extends keyof BlModalMaskEventMap>(
    type: K,
    listener: BlComponentEventListener<BlModalMaskEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlModalMaskEventMap>(
    type: K,
    listener: BlComponentEventListener<BlModalMaskEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-modal-mask',
  styles: [style],
  mixins: [WithOpenTransition],
})
export class BlModalMask extends BlComponent {
  @attr('int') accessor zIndex!: number | null

  override connectedCallback() {
    super.connectedCallback()

    this.openTransitionName = 'opacity'
    this.render()

    // 设置初始样式，确保动画生效
    if (this.open) {
      this._updateScrollLock()
    }

    this.hook.onAttributeChangedDep('open', () => {
      this._updateScrollLock()
    })
  }

  _updateScrollLock() {
    if (this.open) {
      this._lockScroll()
    } else {
      this._unlockScroll()
    }
  }

  isScrollLocked?: boolean
  bodyPaddingRight?: string
  bodyOverflowY?: string
  computedBodyPaddingRight?: number

  _lockScroll() {
    if (!this.isScrollLocked) {
      this.bodyPaddingRight = document.body.style.paddingRight
      this.bodyOverflowY = document.body.style.overflowY
      this.computedBodyPaddingRight = parseInt(getComputedStyle(document.body).paddingRight, 10)
    }

    const scrollBarWidth = getBodyScrollBarWidth()
    const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight
    const bodyOverflowY = getComputedStyle(document.body).overflowY
    if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && !this.isScrollLocked) {
      document.body.style.paddingRight = this.computedBodyPaddingRight! + scrollBarWidth + 'px'
    }

    document.body.style.overflowY = 'hidden'
    this.isScrollLocked = true
  }

  _unlockScroll() {
    if (this.isScrollLocked) {
      document.body.style.paddingRight = this.bodyPaddingRight!
      document.body.style.overflowY = this.bodyOverflowY!
      this.isScrollLocked = false
    }
  }
}
