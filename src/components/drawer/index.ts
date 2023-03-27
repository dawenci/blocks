import type { EnumAttr } from '../../decorators/attr.js'
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js'
import '../icon/index.js'
import '../modal-mask/index.js'
import { attr } from '../../decorators/attr.js'
import { capitalize } from '../../common/utils.js'
import { contentTemplate as template } from './template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent, onceEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { onKeymap } from '../../common/onKeymap.js'
import { setStyles } from '../../common/style.js'
import { style } from './style.js'
import { append, mountBefore, unmount } from '../../common/mount.js'
import { BlocksModalMask } from '../modal-mask/index.js'
import { BlocksPopup } from '../popup/index.js'
import { ComponentEventListener } from '../component/Component.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

type BlocksDrawerEventMap = WithOpenTransitionEventMap

export interface BlocksDrawer extends BlocksPopup {
  $mask: BlocksModalMask | null

  addEventListener<K extends keyof BlocksDrawerEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksDrawerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlocksDrawerEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksDrawerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-drawer',
  styles: [style],
})
export class BlocksDrawer extends BlocksPopup {
  @attr('boolean') accessor closeOnClickMask!: boolean
  @attr('boolean') accessor closeOnClickOutside!: boolean
  @attr('boolean') accessor closeOnPressEscape!: boolean
  @attr('boolean') accessor mask!: boolean
  @attr('boolean') accessor closeable!: boolean

  /** 标题 */
  @attr('string') accessor titleText = ''
  @attr('string') accessor size = '30%'
  @attr('enum', { enumValues: ['right', 'left', 'bottom', 'top'] })
  accessor placement: EnumAttr<['right', 'left', 'bottom', 'top']> = 'right'

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
    this.#setupClickOutside()
    this.#setupKeymap()
  }

  #setupPopup() {
    this.onConnected(() => {
      this.autofocus = true
      if (this.parentElement !== document.body) {
        document.body.appendChild(this)
      }
    })
    this.onConnected(() => {
      this.openTransitionName = `open${capitalize(this.placement)}`
    })
    this.onAttributeChangedDep('placement', () => {
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
        // if (this.$lastFocusable) {
        //   mountBefore($close, this.$lastFocusable)
        // } else {
        //   append($close, this.$layout)
        // }
        append($close, this.$layout)
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
    this.onRender(update)
    this.onConnected(update)
    this.onAttributeChangedDeps(['placement', 'size'], update)
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
