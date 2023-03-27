import type { ComponentEventListener } from '../component/Component.js'
import type { BlocksModalMask } from '../modal-mask/index.js'
import type { BlocksPopupEventMap } from '../popup/index.js'
import '../modal-mask/index.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { template } from './template.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { dispatchEvent, onceEvent } from '../../common/event.js'
import { onDragMove } from '../../common/onDragMove.js'
import { onKeymap } from '../../common/onKeymap.js'
import { style } from './style.js'
import { mountBefore, unmount, append } from '../../common/mount.js'
import { BlocksPopup } from '../popup/index.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

type BlocksDialogEventMap = BlocksPopupEventMap

interface BlocksDialog extends BlocksPopup {
  $mask: BlocksModalMask | null

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
  styles: [style],
})
class BlocksDialog extends BlocksPopup {
  static override get role() {
    return 'dialog'
  }

  /** 显示遮罩 */
  @attr('boolean') accessor mask!: boolean
  /** 是否提供关闭按钮 */
  @attr('boolean') accessor closeable!: boolean
  /** 标题 */
  @attr('string') accessor titleText = ''

  // TODO: 检查销毁逻辑
  @attr('boolean') accessor unmountAfterClose!: boolean

  @attr('boolean') accessor closeOnClickMask!: boolean
  @attr('boolean') accessor closeOnClickOutside!: boolean
  @attr('boolean') accessor closeOnPressEscape!: boolean

  @shadowRef('[part="close"]') accessor $close!: HTMLButtonElement | null
  @shadowRef('[part="header"]') accessor $header!: HTMLElement
  @shadowRef('[part="body"]') accessor $body!: HTMLElement
  @shadowRef('[part="footer"]') accessor $footer!: HTMLElement
  @shadowRef('[part="header-slot"]') accessor $headerSlot!: HTMLSlotElement
  @shadowRef('[part="default-slot"]') accessor $bodySlot!: HTMLSlotElement
  @shadowRef('[part="footer-slot"]') accessor $footerSlot!: HTMLSlotElement

  constructor() {
    super()

    this.$layout.removeChild(this.$slot)
    this.$layout.appendChild(template())

    this.#setupPopup()
    this.#setupMask()
    this.#setupHeader()
    this.#setupFooter()
    this.#setupClose()
    this.#setupDragEvent()
    this.#setupClickOutside()
    this.#setupKeymap()
  }

  _clickOutside: SetupClickOutside<this> = SetupClickOutside.setup({
    component: this,
    target() {
      return this.$mask ? [this, this.$mask] : [this]
    },
    update() {
      this.open = false
    },
  })

  #setupPopup() {
    this.onConnected(() => {
      this.autofocus = true
      if (this.parentElement !== document.body) {
        document.body.appendChild(this)
      }
    })
  }

  #setupMask() {
    const _ensureMask = () => {
      if (!this.$mask) {
        this.$mask = document.createElement('bl-modal-mask')
        mountBefore(this.$mask, this)
        this.$mask.open = this.open
        dispatchEvent(this, 'mask-mounted')

        // 避免点击 mask 的时候，dialog blur
        // 注：mousedown 到 mouseup 之间，dialog 会发生 blur
        const _refocus = () => {
          if (document.activeElement && !this.$layout.contains(document.activeElement)) {
            ;(document.activeElement as any).blur()
          }
          this.focus()
          this.removeEventListener('blur', _refocus)
        }
        this.$mask.addEventListener('mousedown', () => {
          _refocus()
          this.addEventListener('blur', _refocus)
        })
        this.$mask.addEventListener('mouseup', () => {
          _refocus()
          if (this.closeOnClickMask) {
            this.open = false
          }
        })
      }
    }
    const _destroyMask = () => {
      if (!this.$mask) return
      if (document.body.contains(this.$mask)) {
        if (this.$mask.open) {
          const destroy = () => {
            unmount(this.$mask!)
            this.$mask = null
          }
          onceEvent(this.$mask, 'closed', destroy)
          this.$mask.open = false
        } else {
          unmount(this.$mask)
          this.$mask = null
        }
      }
    }

    this.onConnected(() => {
      if (this.mask && this.open) _ensureMask()
    })

    this.onDisconnected(() => {
      _destroyMask()
    })

    this.onAttributeChangedDeps(['mask', 'open'], () => {
      if (!this.$mask && this.mask && this.open) {
        return _ensureMask()
      }
      if (this.$mask && !this.mask) {
        return _destroyMask()
      }
      if (this.mask && this.$mask) {
        this.$mask.open = this.open
        return
      }
    })
  }

  #setupClose() {
    const update = () => {
      if (this.closeable && !this.$close) {
        const $close = document.createElement('button')
        $close.setAttribute('part', 'close')
        $close.onclick = () => {
          this.open = false
        }
        if (this._focusCapture.$lastFocusable) {
          mountBefore($close, this._focusCapture.$lastFocusable)
        } else {
          append($close, this.$layout)
        }
        return
      }

      if (!this.closeable && this.$close) {
        unmount(this.$close)
      }
    }

    this.onConnected(update)
    this.onRender(update)
    this.onAttributeChangedDep('closeable', update)
  }

  #setupHeader() {
    const update = () => {
      if (this.querySelectorHost('[slot="header"]')) {
        this.$layout.classList.remove('no-header')
      } else if (this.titleText) {
        this.$layout.classList.remove('no-header')
        const $title = this.querySelectorShadow('h1') as HTMLElement
        $title.innerText = this.titleText
      } else {
        this.$layout.classList.add('no-header')
      }
    }
    this.onConnected(() => {
      this.$headerSlot.addEventListener('slotchange', update)
    })
    this.onDisconnected(() => {
      this.$headerSlot.removeEventListener('slotchange', update)
    })
    this.onConnected(update)
    this.onRender(update)
    this.onAttributeChangedDep('title-text', update)
  }

  #setupFooter() {
    const update = () => {
      if (this.querySelector('[slot="footer"]')) {
        this.$layout.classList.remove('no-footer')
      } else {
        this.$layout.classList.add('no-footer')
      }
    }
    this.onConnected(update)
    this.onRender(update)
    this.onConnected(() => {
      this.$footerSlot.addEventListener('slotchange', update)
    })
    this.onDisconnected(() => {
      this.$footerSlot.removeEventListener('slotchange', update)
    })
  }

  #setupDragEvent() {
    const isBody = (target: Element) => {
      if (this.$body.contains(target)) {
        return true
      }
      // maybe body slot
      if (this.contains(target)) {
        let el: Element | null = target
        while (el && el !== this) {
          if (el.slot === '') return true
          el = el.parentElement
        }
      }
      return false
    }

    const setupDragEvent = () => {
      // 拖拽 header 移动
      let startX: number
      let startY: number

      onDragMove(this.$layout, {
        onStart: ({ $target, stop }) => {
          if (isBody($target)) return stop()
          startX = this.offsetX
          startY = this.offsetY
        },

        onMove: ({ offset }) => {
          this.offsetX = startX + offset.x
          this.offsetY = startY + offset.y
        },
      })
    }

    setupDragEvent()
  }

  #setupKeymap() {
    let clear: (() => void) | undefined
    const _initKeydown = () => {
      if (this.closeOnPressEscape && !clear) {
        clear = onKeymap(document, [
          {
            key: 'escape',
            handler: () => {
              if (this.open) this.open = false
            },
          },
        ])
      }
    }

    const _destroyKeydown = () => {
      if (clear) {
        clear()
        clear = undefined
      }
    }

    this.onConnected(() => {
      _initKeydown()
    })

    this.onDisconnected(() => {
      _destroyKeydown()
    })

    this.onAttributeChangedDep('close-on-press-escape', () => {
      if (this.closeOnPressEscape) {
        _initKeydown()
      } else {
        _destroyKeydown()
      }
    })
  }

  #setupClickOutside() {
    this.onConnected(() => {
      this.addEventListener('opened', () => {
        if (this.closeOnClickOutside) this._clickOutside.bind()
      })
      this.addEventListener('closed', () => {
        this._clickOutside.unbind()
      })
    })

    this.onAttributeChangedDep('close-on-click-outside', () => {
      if (this.closeOnClickOutside) this._clickOutside.bind()
      else this._clickOutside.unbind()
    })
  }
}

export { BlocksDialog }
