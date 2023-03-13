import '../button/index.js'
import '../icon/index.js'
import { strGetter, strSetter } from '../../common/property.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'
import { onDragMove } from '../../common/onDragMove.js'
import { windowStyleTemplate, windowTemplate } from './template.js'
import { ComponentEventListener } from '../Component.js'
import { Control } from '../base-control/index.js'
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js'
import { withOpenTransitionStyleTemplate } from '../with-open-transition/template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'

interface WinEventMap extends WithOpenTransitionEventMap {
  'bl:resize': CustomEvent<{ width: number; height: number }>
}

export interface BlocksWindow extends Control, WithOpenTransition {
  _ref: Control['_ref'] & {
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
  }

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
  mixins: [WithOpenTransition],
  customElement: 'bl-window',
})
export class BlocksWindow extends Control {
  static get role() {
    return 'window'
  }

  static override get observedAttributes() {
    return super.observedAttributes.concat([
      // 窗口按钮，'minimize,maximize,close'
      'actions',
    ])
  }

  /** 捕获焦点，tab 键不会将焦点移出 Dialog */
  @attr('boolean') accessor capturefocus!: boolean

  @attr('boolean') accessor maximized!: boolean

  @attr('boolean') accessor minimized!: boolean

  /** 标题图标 */
  @attr('string') accessor icon!: string | null

  /** 标题 */
  @attr('string') accessor name!: string | null

  get actions(): string {
    return strGetter('actions')(this) ?? 'minimize,maximize,close'
  }

  set actions(value: string) {
    if (value !== null && typeof value !== 'string') return
    let newValue: string | null = String(value)
    if (typeof value === 'string') {
      newValue =
        value
          .split(',')
          .filter(action => ['minimize', 'maximize', 'close'].includes(action.trim()))
          .join(',') || null
    }
    strSetter('actions')(this, newValue)
  }

  #prevFocus?: any
  #onResize?: (data: { width: number; height: number }) => void

  constructor() {
    super()

    this._appendStyle(withOpenTransitionStyleTemplate())
    this._appendStyle(windowStyleTemplate())

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(windowTemplate())
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
    Object.assign(this._ref, {
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

    this.addEventListener('opened', () => {
      this.#focus()
    })

    this.addEventListener('closed', () => {
      this.#blur()
    })

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

    if (this.capturefocus) {
      this.#captureFocus()
    }

    this.#initMoveEvents()
    this.#initResizeEvents()
  }

  override connectedCallback() {
    super.connectedCallback()
    // 将 tabindex 设置在 host 上，
    // 因为 tabindex 在 layout 上的话，鼠标点击 slot 里面的内容时会反复 blur
    this.setAttribute('tabindex', '-1')

    if (this.parentElement !== document.body) {
      document.body.appendChild(this)
    }
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (attrName === 'actions') {
      this.#renderActions()
    }

    if (attrName === 'capturefocus') {
      if (this.capturefocus) {
        this.#captureFocus()
      } else {
        this.#stopCaptureFocus()
      }
    }

    if (attrName === 'icon') {
      this.#renderIcon()
    }

    if (attrName === 'maximized') {
      if (this.maximized) {
        doTransitionEnter(this, 'maximized', () => {
          //
        })
      } else {
        doTransitionLeave(this, 'maximized', () => {
          //
        })
      }
    }

    if (attrName === 'name') {
      this.#renderName()
    }

    if (attrName == 'open') {
      this._onOpenAttributeChange()
      this.#updateVisible()
    }
  }

  #initMoveEvents() {
    // 拖拽 header 移动
    let startLeft: number
    let startTop: number
    onDragMove(this._ref.$header, {
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
  }

  #initResizeEvents() {
    // 拖拽 header 移动
    let startLeft: number
    let startTop: number
    let startWidth: number
    let startHeight: number
    let startMouseX: number
    let startMouseY: number
    let currentLeft: number
    let currentTop: number
    let currentWidth: number
    let currentHeight: number
    let updateFn: (x: number, y: number) => void

    const callAll =
      (...fns: any) =>
      (...args: any) =>
        fns.forEach((fn: any) => fn(...args))

    const resizeTop = (x: number, y: number) => {
      // offset > 0:  往下拖拽缩小窗口, top 增加，height 减少
      // offset < 0: 往上拖拽放大窗口, top 减少，height 增加
      const offset = y - startMouseY
      const newTop = startTop + offset
      const newHeight = startHeight - offset
      if (newTop < 0 || newHeight < this._ref.$header.offsetHeight) return
      currentTop = newTop
      currentHeight = newHeight
      this.style.top = newTop + 'px'
      this.style.height = newHeight + 'px'
    }
    const resizeBottom = (x: number, y: number) => {
      // offset > 0:  往下拖拽放大窗口, height 增加
      // offset < 0: 往上拖拽缩小窗口, height 减少
      const offset = y - startMouseY
      const newHeight = startHeight + offset
      if (newHeight < this._ref.$header.offsetHeight) return
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

    onDragMove(this._ref.$layout, {
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
  }

  #renderName() {
    this._ref.$name.title = this._ref.$name.textContent = this.name ?? ''
  }

  #renderActions() {
    this._ref.$minimizeButton.style.display = this.actions.includes('minimize') ? '' : 'none'
    this._ref.$maximizeButton.style.display = this.actions.includes('maximize') ? '' : 'none'
    this._ref.$closeButton.style.display = this.actions.includes('close') ? '' : 'none'
  }

  #renderIcon() {
    if (this._ref.$icon?.childElementCount) {
      const $icon = this._ref.$icon.firstElementChild as HTMLElement
      if ($icon.dataset.name === this.icon) return
    }

    const $icon = getRegisteredSvgIcon(this.icon ?? '')
    if ($icon) {
      ;($icon as any).dataset.name = this.icon
      this._ref.$icon.innerHTML = ''
      this._ref.$icon.appendChild($icon)
    } else {
      this._ref.$icon.innerHTML = ''
    }
  }

  // 强制捕获焦点，避免 Tab 键导致焦点跑出去 popup 外面
  #captureFocus() {
    this._ref.$firstFocusable =
      this._ref.$layout.querySelector('#first') ||
      this._ref.$layout.insertBefore(document.createElement('button'), this._ref.$layout.firstChild)
    this._ref.$lastFocusable =
      this._ref.$layout.querySelector('#last') || this._ref.$layout.appendChild(document.createElement('button'))
    this._ref.$firstFocusable.id = 'first'
    this._ref.$lastFocusable.id = 'last'
    this._ref.$firstFocusable.onkeydown = e => {
      if (e.key === 'Tab' && e.shiftKey) {
        this._ref.$lastFocusable?.focus()
      }
    }
    this._ref.$lastFocusable.onkeydown = e => {
      if (e.key === 'Tab' && !e.shiftKey) {
        this._ref.$firstFocusable?.focus()
      }
    }
  }

  // 停止强制捕获焦点
  #stopCaptureFocus() {
    if (this._ref.$firstFocusable && this._ref.$firstFocusable.parentElement) {
      this._ref.$layout.removeChild(this._ref.$firstFocusable)
    }
    if (this._ref.$firstFocusable && this._ref.$lastFocusable?.parentElement) {
      this._ref.$layout.removeChild(this._ref.$lastFocusable)
    }
  }

  #updateVisible() {
    if (this.open) {
      if (!this.style.left) {
        this.style.left = (document.body.clientWidth - this.offsetWidth) / 2 + 'px'
      }
      if (!this.style.top) {
        this.style.top = (document.body.clientHeight - this.offsetHeight) / 2 + 'px'
      }
    }
  }

  #focus() {
    if (!this.#prevFocus) {
      this.#prevFocus = document.activeElement
    }
    this.focus()
  }

  #blur() {
    this.blur()
    if (this.#prevFocus) {
      this.#prevFocus?.focus()
      this.#prevFocus = undefined
    }
  }
}
