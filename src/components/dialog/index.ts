import '../button/index.js'
import '../modal-mask/index.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { onDragMove } from '../../common/onDragMove.js'
import { dialogTemplate } from './template.js'
import { style } from './style.js'
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js'
import { BlocksModalMask } from '../modal-mask/index.js'
import { Control } from '../base-control/index.js'
import { ComponentEventListener } from '../Component.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'

type BlocksDialogEventMap = WithOpenTransitionEventMap

interface BlocksDialog extends Control, WithOpenTransition {
  _ref: Control['_ref'] & {
    $mask: BlocksModalMask
    $firstFocusable?: HTMLButtonElement
    $lastFocusable?: HTMLButtonElement
    $close?: HTMLButtonElement
  }

  addEventListener<K extends keyof BlocksDialogEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksDialogEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlocksDialogEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksDialogEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-dialog',
  mixins: [WithOpenTransition],
  styles: [style],
})
class BlocksDialog extends Control {
  static get role() {
    return 'dialog'
  }

  /** 显示遮罩 */
  @attr('boolean') accessor mask!: boolean
  /** 是否提供关闭按钮 */
  @attr('boolean') accessor closeable!: boolean
  /** 捕获焦点，tab 键不会将焦点移出 Dialog */
  @attr('boolean') accessor capturefocus!: boolean
  /** 插入到 body */
  @attr('boolean') accessor appendToBody!: boolean
  /** 标题 */
  @attr('string') accessor titleText = ''

  removeAfterClose = false

  constructor() {
    super()

    this._ref.$layout.appendChild(dialogTemplate())
    const $mask = document.createElement('bl-modal-mask')
    this._ref.$mask = $mask

    // 避免点击 mask 的时候，dialog blur
    // 注：mousedown 到 mouseup 之间，dialog 会发生 blur
    const _refocus = () => {
      this.focus()
      this.removeEventListener('blur', _refocus)
    }
    $mask.addEventListener('mousedown', () => {
      this.focus()
      this.addEventListener('blur', _refocus)
    })
    $mask.addEventListener('mouseup', () => {
      this.removeEventListener('blur', _refocus)
    })

    // 打开时自动聚焦
    this.addEventListener('opened', () => {
      this._focus()
    })

    this.addEventListener('closed', () => {
      this._blur()
      if (this.removeAfterClose) {
        this.parentElement && this.parentElement.removeChild(this)
      }
    })

    this._ref.$layout.addEventListener('slotchange', () => {
      this.render()
    })

    if (this.capturefocus) {
      this._captureFocus()
    }
  }

  override render() {
    super.render()

    this._renderHeader()
    this._renderFooter()
    this._renderClose()
  }

  // 强制捕获焦点，避免 Tab 键导致焦点跑出去 popup 外面
  _captureFocus() {
    this._ref.$firstFocusable =
      this._ref.$layout.querySelector('#first') ||
      this._ref.$layout.insertBefore(document.createElement('button'), this._ref.$layout.firstChild)
    this._ref.$lastFocusable =
      this._ref.$layout.querySelector('#last') || this._ref.$layout.appendChild(document.createElement('button'))
    this._ref.$firstFocusable.id = 'first'
    this._ref.$lastFocusable.id = 'last'
    this._ref.$firstFocusable.onkeydown = e => {
      if (e.key === 'Tab' && e.shiftKey) {
        this._ref.$lastFocusable?.focus?.()
      }
    }
    this._ref.$lastFocusable.onkeydown = e => {
      if (e.key === 'Tab' && !e.shiftKey) {
        this._ref.$firstFocusable?.focus?.()
      }
    }
  }

  // 停止强制捕获焦点
  _stopCaptureFocus() {
    if (this._ref.$firstFocusable?.parentElement) {
      this._ref.$layout.removeChild(this._ref.$firstFocusable)
    }
    if (this._ref.$lastFocusable?.parentElement) {
      this._ref.$layout.removeChild(this._ref.$lastFocusable)
    }
  }

  _updateVisible() {
    if (this.open) {
      if (!this.style.left) {
        this.style.left = (document.body.clientWidth - this.offsetWidth) / 2 + 'px'
      }
      if (!this.style.top) {
        this.style.top = (document.body.clientHeight - this.offsetHeight) / 2 + 'px'
      }
      if (this._ref.$mask) {
        this._ref.$mask.open = true
      }
    } else {
      if (this._ref.$mask) {
        this._ref.$mask.open = false
      }
    }
  }

  _renderClose() {
    if (this.closeable) {
      if (!this._ref.$close) {
        this._ref.$close = document.createElement('button')
        this._ref.$close.id = 'close'
        this._ref.$close.appendChild(getRegisteredSvgIcon('cross')!)
        this._ref.$close.onclick = () => {
          this.open = false
        }
        if (this._ref.$lastFocusable) {
          this._ref.$layout.insertBefore(this._ref.$close, this._ref.$lastFocusable)
        } else {
          this._ref.$layout.appendChild(this._ref.$close)
        }
      }
    } else {
      if (this._ref.$close) {
        this._ref.$close.parentElement!.removeChild(this._ref.$close)
        this._ref.$close = undefined
      }
    }
  }

  _renderHeader() {
    if (this.querySelectorHost('[slot="header"]')) {
      this._ref.$layout.classList.remove('no-header')
    } else if (this.titleText) {
      this._ref.$layout.classList.remove('no-header')
      const $title = this.querySelectorShadow('h1') as HTMLElement
      $title.innerText = this.titleText
    } else {
      this._ref.$layout.classList.add('no-header')
    }
  }

  _renderFooter() {
    if (this.querySelector('[slot="footer"]')) {
      this._ref.$layout.classList.remove('no-footer')
    } else {
      this._ref.$layout.classList.add('no-footer')
    }
  }

  #prevFocus?: Element | null
  _focus() {
    if (!this.#prevFocus) {
      this.#prevFocus = document.activeElement
    }
    this.focus()
  }

  _blur() {
    this.blur()
    if (this.#prevFocus) {
      ;(this.#prevFocus as any)?.focus?.()
      this.#prevFocus = undefined
    }
  }

  override connectedCallback() {
    super.connectedCallback()

    // 将 tabindex 设置在 host 上，
    // 因为 tabindex 在 popup 上的话，鼠标点击 slot 里面的内容时会反复 blur
    this.setAttribute('tabindex', '-1')

    if (this.parentElement !== document.body) {
      document.body.appendChild(this)
    }

    if (this.mask) {
      this.parentElement?.insertBefore?.(this._ref.$mask, this)
    }

    this._renderHeader()
    this._renderFooter()

    this._initDragEvents()
  }

  _initDragEvents() {
    // 拖拽 header 移动
    let startX: number
    let startY: number

    const isHeader = (target: Element) => {
      if (this._ref.$layout.querySelector('header')!.contains(target)) {
        return true
      }
      // maybe header slot
      if (this.contains(target)) {
        let el: Element | null = target
        while (el && el !== this) {
          if (el.slot === 'header') return true
          el = el.parentElement
        }
      }
      return false
    }

    onDragMove(this._ref.$layout, {
      onStart: ({ $target, stop }) => {
        if (!isHeader($target)) return stop()
        const marginLeft = parseFloat(window.getComputedStyle(this).marginLeft || '0')
        const marginTop = parseFloat(window.getComputedStyle(this).marginTop || '0')
        startX = this.offsetLeft - marginLeft
        startY = this.offsetTop - marginTop
      },

      onMove: ({ offset }) => {
        this.style.left = startX + offset.x + 'px'
        this.style.top = startY + offset.y + 'px'
      },
    })
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this._ref.$mask && this._ref.$mask.parentElement) {
      this._ref.$mask.parentElement.removeChild(this._ref.$mask)
    }
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (attrName == 'open' && this.shadowRoot) {
      this._onOpenAttributeChange()
      this._updateVisible()
    }

    if (attrName === 'mask') {
      if (this.mask) {
        this.parentElement?.insertBefore?.(this._ref.$mask, this)
      } else if (this._ref.$mask.parentElement) {
        this._ref.$mask.parentElement.removeChild(this._ref.$mask)
      }
    }

    if (attrName === 'title-text') {
      this._renderHeader()
    }

    if (attrName === 'capturefocus') {
      if (this.capturefocus) {
        this._captureFocus()
      } else {
        this._stopCaptureFocus()
      }
    }
  }
}

export { BlocksDialog }
