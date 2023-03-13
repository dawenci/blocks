import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { style } from './style.js'
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js'
import { Component, ComponentEventListener } from '../Component.js'
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js'

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
      this._updateVisible()
    }
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (attrName == 'open') {
      this._onOpenAttributeChange()
      this._updateVisible()
    }
  }

  _updateVisible() {
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

export type BlocksModalMaskEventMap = WithOpenTransitionEventMap

export interface BlocksModalMask extends Component, WithOpenTransition {
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
