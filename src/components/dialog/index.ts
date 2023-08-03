import type { BlComponentEventListener } from '../component/Component.js'
import type { BlModalMask } from '../modal-mask/index.js'
import type { BlPopupEventMap } from '../popup/index.js'
import '../close-button/index.js'
import '../modal-mask/index.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { template } from './template.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { dispatchEvent, onceEvent } from '../../common/event.js'
import { onDragMove } from '../../common/onDragMove.js'
import { onKeymap } from '../../common/onKeymap.js'
import { style } from './style.js'
import { mountBefore, unmount, append } from '../../common/mount.js'
import { BlPopup } from '../popup/index.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

export type BlDialogEventMap = BlPopupEventMap

interface BlDialog extends BlPopup {
  $mask: BlModalMask | null

  addEventListener<K extends keyof BlDialogEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDialogEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlDialogEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDialogEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-dialog',
  styles: [style],
})
class BlDialog extends BlPopup {
  static override get role() {
    return 'dialog'
  }

  /** 显示遮罩 */
  @attr('boolean') accessor mask!: boolean
  /** 是否提供关闭按钮 */
  @attr('boolean') accessor closeable!: boolean
  /** 标题 */
  @attr('string') accessor titleText = ''
  /** 关闭时卸载 DOM */
  @attr('boolean') accessor unmountOnClosed!: boolean
  /** 点击遮罩时关闭 */
  @attr('boolean') accessor closeOnClickMask!: boolean
  /** 点击外部时关闭 */
  @attr('boolean') accessor closeOnClickOutside!: boolean
  /** 按 ESC 键时关闭 */
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
    this.#setupKeymap()
    this.#setupAria()
  }

  _clickOutside: SetupClickOutside<this> = SetupClickOutside.setup({
    component: this,
    target() {
      return this.$mask ? [this, this.$mask] : [this]
    },
    update() {
      this.open = false
    },
    init() {
      const update = () => {
        if (this.open && this.closeOnClickOutside) {
          this._clickOutside.bind()
        } else {
          this._clickOutside.unbind()
        }
      }
      this.hook.onAttributeChangedDeps(['open', 'close-on-click-outside'], update)
    },
  })

  #setupPopup() {
    this.hook.onConnected(() => {
      this.autofocus = true
      if (this.parentElement !== document.body) {
        document.body.appendChild(this)
      }
    })

    const unmountDialog = () => {
      if (this.unmountOnClosed) unmount(this)
    }
    this.hook.onConnected(() => {
      this.addEventListener('closed', unmountDialog)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('closed', unmountDialog)
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

    this.hook.onConnected(() => {
      if (this.mask && this.open) _ensureMask()
    })

    this.hook.onDisconnected(() => {
      _destroyMask()
    })

    this.hook.onAttributeChangedDeps(['mask', 'open'], () => {
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
        const $close = document.createElement('bl-close-button')
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

    this.hook.onConnected(update)
    this.hook.onRender(update)
    this.hook.onAttributeChangedDep('closeable', update)
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
    this.hook.onConnected(() => {
      this.$headerSlot.addEventListener('slotchange', update)
    })
    this.hook.onDisconnected(() => {
      this.$headerSlot.removeEventListener('slotchange', update)
    })
    this.hook.onConnected(update)
    this.hook.onRender(update)
    this.hook.onAttributeChangedDep('title-text', update)
  }

  #setupFooter() {
    const update = () => {
      if (this.querySelector('[slot="footer"]')) {
        this.$layout.classList.remove('no-footer')
      } else {
        this.$layout.classList.add('no-footer')
      }
    }
    this.hook.onConnected(update)
    this.hook.onRender(update)
    this.hook.onConnected(() => {
      this.$footerSlot.addEventListener('slotchange', update)
    })
    this.hook.onDisconnected(() => {
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

    this.hook.onConnected(() => {
      _initKeydown()
    })

    this.hook.onDisconnected(() => {
      _destroyKeydown()
    })

    this.hook.onAttributeChangedDep('close-on-press-escape', () => {
      if (this.closeOnPressEscape) {
        _initKeydown()
      } else {
        _destroyKeydown()
      }
    })
  }

  #setupAria() {
    const update = () => {
      this.setAttribute('aria-modal', this.mask ? 'true' : 'false')
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDep('mask', update)
  }
}

export { BlDialog }
