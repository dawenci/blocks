import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js'
import '../close-button/index.js'
import '../icon/index.js'
import '../modal-mask/index.js'
import { attr } from '../../decorators/attr/index.js'
import { capitalize } from '../../common/utils.js'
import { contentTemplate as template } from './template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent, onceEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { onKeymap } from '../../common/onKeymap.js'
import { setStyles } from '../../common/style.js'
import { style } from './style.js'
import { append, mountBefore, unmount } from '../../common/mount.js'
import { BlModalMask } from '../modal-mask/index.js'
import { BlPopup } from '../popup/index.js'
import { BlComponentEventListener } from '../component/Component.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

export type BlDrawerEventMap = WithOpenTransitionEventMap

export interface BlDrawer extends BlPopup {
  $mask: BlModalMask | null

  addEventListener<K extends keyof BlDrawerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDrawerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlDrawerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDrawerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-drawer',
  styles: [style],
})
export class BlDrawer extends BlPopup {
  static override get role() {
    return 'dialog'
  }

  @attr('boolean') accessor closeOnClickMask!: boolean
  @attr('boolean') accessor closeOnClickOutside!: boolean
  @attr('boolean') accessor closeOnPressEscape!: boolean
  @attr('boolean') accessor mask!: boolean
  @attr('boolean') accessor closeable!: boolean

  /** 标题 */
  @attr('string') accessor titleText = ''
  @attr('string') accessor size = '30%'
  @attr('enum', { enumValues: ['right', 'left', 'bottom', 'top'] })
  accessor placement: OneOf<['right', 'left', 'bottom', 'top']> = 'right'

  @shadowRef('[part="close"]', false) accessor $close!: HTMLButtonElement | null
  @shadowRef('[part="header"]') accessor $header!: HTMLElement
  @shadowRef('[part="body"]') accessor $body!: HTMLElement
  @shadowRef('[part="footer"]') accessor $footer!: HTMLElement
  @shadowRef('[part="header-slot"]') accessor $headerSlot!: HTMLSlotElement
  @shadowRef('[part="default-slot"]') accessor $bodySlot!: HTMLSlotElement
  @shadowRef('[part="footer-slot"]') accessor $footerSlot!: HTMLSlotElement

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

  constructor() {
    super()

    this.$layout.removeChild(this.$slot)
    this.$layout.appendChild(template())

    this.#setupPopup()
    this.#setupMask()
    this.#setupClose()
    this.#setupHeader()
    this.#setupFooter()
    this.#setupPlacement()
    this.#setupKeymap()
  }

  #setupPopup() {
    this.hook.onConnected(() => {
      this.autofocus = true
      if (this.parentElement !== document.body) {
        document.body.appendChild(this)
      }
    })
    this.hook.onConnected(() => {
      this.openTransitionName = `open${capitalize(this.placement)}`
    })
    this.hook.onAttributeChangedDep('placement', () => {
      this.openTransitionName = `open${capitalize(this.placement)}`
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

  #setupPlacement() {
    const update = () => {
      const top = '0'
      const right = '0'
      const bottom = '0'
      const left = '0'
      switch (this.placement) {
        case 'right': {
          setStyles(this, { top, right, bottom, left: 'auto', height: '100vh', width: this.size })
          break
        }
        case 'left': {
          setStyles(this, { top, right: 'auto', bottom, left, height: '100vh', width: this.size })
          break
        }
        case 'bottom': {
          setStyles(this, { top: 'auto', right, bottom, left, width: '100vw', height: this.size })
          break
        }
        case 'top': {
          setStyles(this, { top, right, bottom: 'auto', left, width: '100vw', height: this.size })
          break
        }
      }
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDeps(['placement', 'size'], update)
  }
}
