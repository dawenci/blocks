import type { ComponentEventListener } from '../component/Component.js'
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js'
import { style } from './style.js'
import { Component } from '../component/Component.js'
import { WithOpenTransition } from '../with-open-transition/index.js'

export type BlocksModalMaskEventMap = WithOpenTransitionEventMap

export interface BlocksModalMask extends WithOpenTransition {
  addEventListener<K extends keyof BlocksModalMaskEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksModalMaskEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlocksModalMaskEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksModalMaskEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-modal-mask',
  styles: [style],
  mixins: [WithOpenTransition],
})
export class BlocksModalMask extends Component {
  @attr('int') accessor zIndex!: number | null

  override connectedCallback() {
    super.connectedCallback()

    this.openTransitionName = 'opacity'
    this.render()

    // 设置初始样式，确保动画生效
    if (this.open) {
      this._updateScrollLock()
    }

    this.onAttributeChangedDep('open', () => {
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
