import type { ComponentEventListener } from '../component/Component.js'
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js'
import '../button/index.js'
import '../icon/index.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { onDragMove } from '../../common/onDragMove.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { strGetter, strSetter } from '../../common/property.js'
import { style } from './style.js'
import { windowTemplate } from './template.js'
import { Component } from '../component/Component.js'
import { SetupFocusCapture } from '../setup-focus-capture/index.js'
import { WithOpenTransition } from '../with-open-transition/index.js'

export interface WinEventMap extends WithOpenTransitionEventMap {
  'bl:resize': CustomEvent<{ width: number; height: number }>
}

export interface BlocksWindow extends WithOpenTransition {
  $header: HTMLElement
  $body: HTMLElement
  $content: HTMLElement
  $statusBar: HTMLElement
  $statusBarSlot: HTMLSlotElement
  $actions: HTMLElement
  $closeButton: HTMLButtonElement
  $maximizeButton: HTMLButtonElement
  $minimizeButton: HTMLButtonElement
  $icon: HTMLElement
  $name: HTMLElement
  $firstFocusable?: HTMLButtonElement
  $lastFocusable?: HTMLButtonElement

  addEventListener<K extends keyof WinEventMap>(
    type: K,
    listener: ComponentEventListener<WinEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof WinEventMap>(
    type: K,
    listener: ComponentEventListener<WinEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-window',
  styles: [style],
  mixins: [WithOpenTransition],
})
export class BlocksWindow extends Component {
  static get role() {
    return 'window'
  }

  /** 捕获焦点，tab 键不会将焦点移出 Dialog */
  @attr('boolean') accessor capturefocus!: boolean

  /** 失去焦点时，是否恢复获得焦点前的焦点 */
  @attr('boolean') accessor restorefocus!: boolean

  @attr('boolean') accessor maximized!: boolean

  @attr('boolean') accessor minimized!: boolean

  /** 标题图标 */
  @attr('string') accessor icon!: string | null

  /** 标题 */
  @attr('string') accessor name!: string | null

  @attr('string', {
    get: self => {
      return strGetter('actions')(self) ?? 'minimize,maximize,close'
    },
    set: (self, value) => {
      if (value !== null && typeof value !== 'string') return
      let newValue: string | null = String(value)
      if (typeof value === 'string') {
        newValue =
          value
            .split(',')
            .filter(action => ['minimize', 'maximize', 'close'].includes(action.trim()))
            .join(',') || null
      }
      strSetter('actions')(self, newValue)
    },
  })
  accessor actions!: string

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement

  #onResize?: (data: { width: number; height: number }) => void

  constructor() {
    super()

    this.appendShadowChild(windowTemplate())
    const shadowRoot = this.shadowRoot!
    const $header = shadowRoot.getElementById('header')!
    const $body = shadowRoot.getElementById('body')!
    const $content = shadowRoot.getElementById('content')!
    const $statusBar = shadowRoot.getElementById('status-bar')!
    const $statusBarSlot = shadowRoot.querySelector('[name=status-bar]') as HTMLSlotElement
    const $actions = shadowRoot.getElementById('actions')!
    const $closeButton = shadowRoot.getElementById('close') as HTMLButtonElement
    const $maximizeButton = shadowRoot.getElementById('maximize') as HTMLButtonElement
    const $minimizeButton = shadowRoot.getElementById('minimize') as HTMLButtonElement
    const $icon = shadowRoot.getElementById('icon')!
    const $name = shadowRoot.getElementById('name')!
    Object.assign(this, {
      $header,
      $body,
      $content,
      $statusBar,
      $statusBarSlot,
      $actions,
      $closeButton,
      $maximizeButton,
      $minimizeButton,
      $icon,
      $name,
    })

    sizeObserve(this, detail => {
      if (typeof this.#onResize === 'function') {
        this.#onResize(detail)
      }
      dispatchEvent(this, 'bl:resize', { detail })
    })

    $closeButton.onclick = () => {
      this.open = false
    }

    $maximizeButton.onclick = () => {
      this.maximized = !this.maximized
    }

    $minimizeButton.onclick = () => {
      this.minimized = !this.minimized
    }

    $header.ondblclick = () => {
      this.maximized = !this.maximized
    }

    // 主内容变化
    $content.addEventListener('slotchange', () => {
      this.render()
    })

    // 状态栏内容变化
    const updateSlot = () => {
      $body.classList.toggle('has-status-bar', !!$statusBarSlot.assignedNodes().length)
    }
    updateSlot()
    $statusBarSlot.addEventListener('slotchange', () => {
      updateSlot()
    })

    this.#setupVisible()
    this.#setupZoom()
    this.#setupFocus()
    this.#setupMoveEvents()
    this.#setupResizeEvents()

    this.onConnected(() => {
      // 将 tabindex 设置在 host 上，
      // 因为 tabindex 在 layout 上的话，鼠标点击 slot 里面的内容时会反复 blur
      this.setAttribute('tabindex', '-1')

      if (this.parentElement !== document.body) {
        document.body.appendChild(this)
      }
    })

    this.onAttributeChanged((attrName: string) => {
      if (attrName === 'actions') {
        this.#renderActions()
      }
      if (attrName === 'icon') {
        this.#renderIcon()
      }
      if (attrName === 'name') {
        this.#renderName()
      }
    })
  }

  #setupVisible() {
    const updateVisible = () => {
      if (this.open) {
        if (!this.style.left) {
          this.style.left = (document.body.clientWidth - this.offsetWidth) / 2 + 'px'
        }
        if (!this.style.top) {
          this.style.top = (document.body.clientHeight - this.offsetHeight) / 2 + 'px'
        }
      }
    }

    this.onAttributeChangedDep('open', () => {
      updateVisible()
    })
  }

  #setupZoom() {
    this.onAttributeChangedDep('maximized', () => {
      if (this.maximized) {
        doTransitionEnter(this, 'maximized', () => {
          //
        })
      } else {
        doTransitionLeave(this, 'maximized', () => {
          //
        })
      }
    })
  }

  #setupFocus() {
    let $prevFocus: HTMLElement | null
    const _focus = () => {
      if (this.restorefocus && !$prevFocus) {
        $prevFocus = document.activeElement as HTMLElement
      }
      if (this.capturefocus && this._focusCapture.$firstFocusable) {
        this._focusCapture.$firstFocusable.focus()
      } else {
        this.focus()
      }
    }
    const _blur = () => {
      if (this._focusCapture.$firstFocusable) this._focusCapture.$firstFocusable.blur()
      this.blur()
      if ($prevFocus) {
        if (this.restorefocus && typeof $prevFocus.focus === 'function') {
          $prevFocus.focus()
        }
        $prevFocus = null
      }
    }
    const onOpened = () => _focus()
    const onClosed = () => _blur()
    this.onConnected(() => {
      this.addEventListener('opened', onOpened)
      this.addEventListener('closed', onClosed)
    })
    this.onDisconnected(() => {
      this.removeEventListener('opened', onOpened)
      this.removeEventListener('closed', onClosed)
    })
  }

  // 强制捕获焦点，避免 Tab 键导致焦点跑出去 popup 外面
  _focusCapture = SetupFocusCapture.setup({
    component: this,
    predicate: () => this.open,
    container: () => this.$layout,
    init: () => {
      this.onConnected(() => {
        if (this.capturefocus) this._focusCapture.start()
      })
      this.onAttributeChangedDep('capturefocus', () => {
        if (this.capturefocus) {
          this._focusCapture.start()
        } else {
          this._focusCapture.stop()
        }
      })
    },
  })

  #setupMoveEvents() {
    // 拖拽 header 移动
    let startLeft: number
    let startTop: number
    let clear: () => void
    this.onConnected(() => {
      clear = onDragMove(this.$header, {
        onStart: ({ stop }) => {
          if (this.maximized) return stop()
          const style = getComputedStyle(this)
          startLeft = parseFloat(style.left)
          startTop = parseFloat(style.top)
        },

        onMove: ({ offset }) => {
          this.style.left = startLeft + offset.x + 'px'
          this.style.top = startTop + offset.y + 'px'
        },
      })
    })
    this.onDisconnected(() => {
      clear()
    })
  }

  #setupResizeEvents() {
    // 拖拽 header 移动
    let startLeft: number
    let startTop: number
    let startWidth: number
    let startHeight: number
    let startMouseX: number
    let startMouseY: number
    let updateFn: (x: number, y: number) => void

    let currentLeft: number
    let currentTop: number
    let currentWidth: number
    let currentHeight: number

    const callAll =
      (...fns: any) =>
      (...args: any) =>
        fns.forEach((fn: any) => fn(...args))

    const resizeTop = (_x: number, y: number) => {
      // offset > 0:  往下拖拽缩小窗口, top 增加，height 减少
      // offset < 0: 往上拖拽放大窗口, top 减少，height 增加
      const offset = y - startMouseY
      const newTop = startTop + offset
      const newHeight = startHeight - offset
      if (newTop < 0 || newHeight < this.$header.offsetHeight) return
      currentTop = newTop
      currentHeight = newHeight
      this.style.top = newTop + 'px'
      this.style.height = newHeight + 'px'
    }
    const resizeBottom = (_x: number, y: number) => {
      // offset > 0:  往下拖拽放大窗口, height 增加
      // offset < 0: 往上拖拽缩小窗口, height 减少
      const offset = y - startMouseY
      const newHeight = startHeight + offset
      if (newHeight < this.$header.offsetHeight) return
      currentHeight = newHeight
      this.style.height = newHeight + 'px'
    }
    const resizeLeft = (x: number, _y: number) => {
      // offset > 0:  往右拖拽缩小窗口, left 增加，width 减少
      // offset < 0: 往左拖拽放大窗口, left 减少，width 增加
      const offset = x - startMouseX
      const newLeft = startLeft + offset
      const newWidth = startWidth - offset
      if (newLeft < 0 || newWidth < 200) return
      currentLeft = newLeft
      currentWidth = newWidth
      this.style.left = newLeft + 'px'
      this.style.width = newWidth + 'px'
    }
    const resizeRight = (x: number, _y: number) => {
      // offset > 0:  往右拖拽放大窗口, width 增加
      // offset < 0: 往左拖拽缩小窗口, width 减少
      const offset = x - startMouseX
      const newWidth = startWidth + offset
      if (newWidth < 200) return
      currentWidth = newWidth
      this.style.width = newWidth + 'px'
    }

    let clear: () => void
    this.onConnected(() => {
      clear = onDragMove(this.$layout, {
        onStart: ({ stop, start, $target }) => {
          if (this.maximized || this.minimized) return stop()
          if (($target as Element).tagName !== 'B') return stop()

          const style = getComputedStyle(this)
          currentLeft = startLeft = parseFloat(style.left)
          currentTop = startTop = parseFloat(style.top)
          currentWidth = startWidth = parseFloat(style.width)
          currentHeight = startHeight = parseFloat(style.height)

          startMouseX = start.pageX
          startMouseY = start.pageY

          switch ($target.id) {
            case 'resize-top': {
              updateFn = resizeTop
              break
            }
            case 'resize-right': {
              updateFn = resizeRight
              break
            }
            case 'resize-bottom': {
              updateFn = resizeBottom
              break
            }
            case 'resize-left': {
              updateFn = resizeLeft
              break
            }
            case 'resize-top-left': {
              updateFn = callAll(resizeTop, resizeLeft)
              break
            }
            case 'resize-top-right': {
              updateFn = callAll(resizeTop, resizeRight)
              break
            }
            case 'resize-bottom-right': {
              updateFn = callAll(resizeBottom, resizeRight)
              break
            }
            case 'resize-bottom-left': {
              updateFn = callAll(resizeBottom, resizeLeft)
              break
            }
          }
        },

        onMove: ({ current }) => {
          if (current.pageY > window.innerHeight || current.pageX > window.innerWidth) return
          updateFn(current.pageX, current.pageY)
        },
      })
    })

    this.onDisconnected(() => {
      clear()
    })
  }

  #renderName() {
    this.$name.title = this.$name.textContent = this.name ?? ''
  }

  #renderActions() {
    this.$minimizeButton.style.display = this.actions.includes('minimize') ? '' : 'none'
    this.$maximizeButton.style.display = this.actions.includes('maximize') ? '' : 'none'
    this.$closeButton.style.display = this.actions.includes('close') ? '' : 'none'
  }

  #renderIcon() {
    if (this.$icon?.childElementCount) {
      const $icon = this.$icon.firstElementChild as HTMLElement
      if ($icon.dataset.name === this.icon) return
    }

    const $icon = getRegisteredSvgIcon(this.icon ?? '')
    if ($icon) {
      ;($icon as any).dataset.name = this.icon
      this.$icon.innerHTML = ''
      this.$icon.appendChild($icon)
    } else {
      this.$icon.innerHTML = ''
    }
  }
}
