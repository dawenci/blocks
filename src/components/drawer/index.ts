import '../icon/index.js'
import '../modal-mask/index.js'
import { setStyles } from '../../common/style.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { onKey } from '../../common/onKey.js'
import { capitalize } from '../../common/utils.js'
import { contentTemplate } from './template.js'
import { style } from './style.js'
import { BlocksModalMask } from '../modal-mask/index.js'
import { Control } from '../base-control/index.js'
import { applyMixins } from '../../common/applyMixins.js'
import {
  WithOpenTransition,
  WithOpenTransitionEventMap,
} from '../with-open-transition/index.js'
import { ComponentEventListener } from '../Component.js'
import { customElement } from '../../decorators/customElement.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'
import type { EnumAttr } from '../../decorators/attr.js'

type BlocksDrawerEventMap = WithOpenTransitionEventMap

export interface BlocksDrawer extends Control, WithOpenTransition {
  _ref: Control['_ref'] & {
    $name: HTMLElement
    $close: HTMLButtonElement
    $mask?: BlocksModalMask
    $firstFocusable?: HTMLButtonElement
    $lastFocusable?: HTMLButtonElement
  }

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

@customElement('bl-drawer')
@applyStyle(style)
export class BlocksDrawer extends Control {
  @attr('boolean') accessor capturefocus!: boolean
  @attr('boolean') accessor closeOnClickOutside!: boolean
  @attr('boolean') accessor closeOnEscape!: boolean
  @attr('boolean') accessor mask!: boolean
  @attr('boolean') accessor open!: boolean
  @attr('string') accessor name!: string
  @attr('string') accessor size = '30%'
  @attr('enum', { enumValues: ['right', 'left', 'bottom', 'top'] })
  accessor placement: EnumAttr<['right', 'left', 'bottom', 'top']> = 'right'

  constructor() {
    super()

    this._appendContent(contentTemplate())

    const shadowRoot = this.shadowRoot!
    const $name = shadowRoot.getElementById('name-prop')!
    const $close = shadowRoot.getElementById('close') as HTMLButtonElement
    Object.assign(this._ref, { $name, $close })
    $close.onclick = () => (this.open = false)

    if (this.capturefocus) {
      this._captureFocus()
    }
  }

  override render() {
    const top = '0'
    const right = '0'
    const bottom = '0'
    const left = '0'
    switch (this.placement) {
      case 'right': {
        setStyles(this, {
          top,
          right,
          bottom,
          left: 'auto',
          height: '100vh',
          width: this.size,
        })
        break
      }
      case 'left': {
        setStyles(this, {
          top,
          right: 'auto',
          bottom,
          left,
          height: '100vh',
          width: this.size,
        })
        break
      }
      case 'bottom': {
        setStyles(this, {
          top: 'auto',
          right,
          bottom,
          left,
          width: '100vw',
          height: this.size,
        })
        break
      }
      case 'top': {
        setStyles(this, {
          top,
          right,
          bottom: 'auto',
          left,
          width: '100vw',
          height: this.size,
        })
        break
      }
    }

    this._ref.$name.textContent = this.name
  }

  override connectedCallback() {
    super.connectedCallback()

    if (this.parentElement !== document.body) {
      document.body.appendChild(this)
    }

    this.render()

    if (this.mask) {
      const $mask = this._ensureMask()
      this.parentElement?.insertBefore?.($mask, this)
      $mask!.open = this.open
    }

    this._initClickOutside()
    this._initKeydown()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this._ref.$mask && document.body.contains(this._ref.$mask)) {
      this._ref.$mask.open = false
      this._ref.$mask.parentElement!.removeChild(this._ref.$mask)
    }

    this._destroyClickOutside()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'open') {
      this.openTransitionName = `open${capitalize(this.placement)}`
      this._onOpenAttributeChange()
      if (this.mask && this._ref.$mask) {
        this._ref.$mask.open = newValue
      }
    }

    if (attrName === 'mask' && this.mask) {
      if (this.mask && !this._ref.$mask) {
        const $mask = this._ensureMask()
        this.parentElement?.insertBefore?.($mask, this)
        $mask.open = this.open
      } else {
        if (this._ref.$mask && document.body.contains(this._ref.$mask)) {
          const $mask = this._ref.$mask!
          $mask.open = false
          $mask.parentElement!.removeChild(this._ref.$mask)
        }
      }
    }

    if (attrName === 'close-on-click-outside') {
      if (this.closeOnClickOutside) {
        this._initClickOutside
      } else {
        this._destroyClickOutside()
      }
    }

    if (attrName === 'close-on-escape') {
      if (this.closeOnEscape) {
        this._initKeydown()
      } else {
        this._destroyKeydown()
      }
    }

    if (attrName === 'capturefocus') {
      if (this.capturefocus) {
        this._captureFocus()
      } else {
        this._stopCaptureFocus()
      }
    }
  }

  #clearKeydown?: () => void
  _initKeydown() {
    if (this.closeOnEscape && !this.#clearKeydown) {
      this.#clearKeydown = onKey('escape', () => {
        if (this.open) this.open = false
      })
    }
  }

  _destroyKeydown() {
    if (this.#clearKeydown) {
      this.#clearKeydown()
      this.#clearKeydown = undefined
    }
  }

  #clearClickOutside?: () => void
  _initClickOutside() {
    if (this.closeOnClickOutside && !this.#clearClickOutside) {
      this.#clearClickOutside = onClickOutside(this, () => {
        if (this.open) this.open = false
      })
    }
  }

  _destroyClickOutside() {
    if (this.#clearClickOutside) {
      this.#clearClickOutside()
      this.#clearClickOutside = undefined
    }
  }

  _ensureMask() {
    if (!this._ref.$mask) {
      this._ref.$mask = document.createElement('bl-modal-mask')
    }
    this._ref.$mask.open = this.open
    return this._ref.$mask
  }

  // 强制捕获焦点，避免 Tab 键导致焦点跑出去 popup 外面
  _captureFocus() {
    const { $layout } = this._ref
    this._ref.$firstFocusable =
      $layout.querySelector('#first') ||
      $layout.insertBefore(document.createElement('button'), $layout.firstChild)
    this._ref.$lastFocusable =
      $layout.querySelector('#last') ||
      $layout.appendChild(document.createElement('button'))
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
}

applyMixins(BlocksDrawer, [WithOpenTransition])
