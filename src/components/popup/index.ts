import { defineClass } from '../../decorators/defineClass.js'

import { attr } from '../../decorators/attr.js'
import type { EnumAttr } from '../../decorators/attr.js'
import { strGetter, strSetter } from '../../common/property.js'
import { template } from './template.js'
import { Control } from '../base-control/index.js'
import {
  WithOpenTransition,
  WithOpenTransitionEventMap,
} from '../with-open-transition/index.js'
import { ComponentEventListener } from '../Component.js'
import { style } from './style.js'

// 箭头尺寸
const ARROW_SIZE = 8

// Popup 的原点，13 种取值的原点以及箭头（如果启用箭头）朝向情况如下：
export enum PopupOrigin {
  // 中间，无箭头
  Center = 'center',
  // 左上角，箭头朝上
  TopStart = 'top-start',
  // 上方中间，箭头朝上
  TopCenter = 'top-center',
  // 右上角，箭头朝上
  TopEnd = 'top-end',
  // 右上角，箭头朝右
  RightStart = 'right-start',
  // 右方中间，箭头朝右
  RightCenter = 'right-center',
  // 右下角，箭头朝右
  RightEnd = 'right-end',
  // 右下角，箭头朝下
  BottomEnd = 'bottom-end',
  // 下方中间，箭头朝下
  BottomCenter = 'bottom-center',
  // 左下角，箭头朝下
  BottomStart = 'bottom-start',
  // 左下角，箭头朝左
  LeftEnd = 'left-end',
  // 左方中间，箭头朝左
  LeftCenter = 'left-center',
  // 左上角，箭头朝左
  LeftStart = 'left-start',
}

const originArray = Object.values(PopupOrigin)

type AnchorFn = () => null | string | Element
type Anchor = null | string | Element | AnchorFn

interface PopupEventMap extends WithOpenTransitionEventMap {
  test: CustomEvent
  //
}

export interface BlocksPopup extends Control, WithOpenTransition {
  _ref: Control['_ref'] & {
    $arrow: HTMLElement
    $slot: HTMLSlotElement
  }

  addEventListener<K extends keyof PopupEventMap>(
    type: K,
    listener: ComponentEventListener<PopupEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof PopupEventMap>(
    type: K,
    listener: ComponentEventListener<PopupEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-popup',
  mixins: [WithOpenTransition],
  styles: [style],
})
export class BlocksPopup extends Control {
  static get role() {
    return 'popup'
  }

  static override get observedAttributes() {
    return [
      // Popup 锚定的布局框，是一个矩形区域，Popup 根据 origin 不同，
      // 会吸附在该矩形的四条边中的某一条的外侧（设置 inset 后在内测），或与改矩形中心对齐（origin 为 center 的情况）。
      // 支持传入元素 DOM 对象，或元素的 css selector 字符串，表示以该元素的布局矩形为锚定（表现为 Popup 吸附在元素上）；
      // 支持 null，表示以 offsetParent 的布局矩形为准（表现为 Popup 吸附在 offsetParent 上）；
      // 支持标准的 `[x1, y1, x2, y2]` 形式的两个坐标点用于左上角、右下角（表现为 Popup 吸附在 (x1,y1) 和 (x2,y2) 指定的矩形上（注意：该矩形的坐标是相对于 offsetParent 的 top\left 的）；
      // 支持传入一个 `[x, y]` 形式的坐标像素值，这是长宽为 0 的矩形的特例，相当于 `[x, y, x, y]`；
      // 支持传入函数，函数返回上述的几种合法值（坐标字符串、元素选择器、元素 DOM、null）
      'anchor',
      // 定位的 offset 值，形式 [x, y]，用来偏移吸附 anchor 的距离。
      'offset',
    ]
  }

  /**
   * Popup 的定位原点，决定 Popup 本身用哪个部位去吸附 anchor，以及 Popup 的箭头位置和朝向。
   * 例如，设为 TopStart，代表希望 Popup 的箭头在 Popup 的左上角，箭头方向朝上，箭头紧紧吸附在 anchor 的底部边线外侧（可通过 inset 调整为内侧）。
   * 其中，默认的 Center 是个特殊值，代表希望 Popup 的中心点与 anchor 的中心点重叠，且无需展示箭头，表现为 Popup 在 anchor 里居中。
   */
  @attr('enum', { enumValues: originArray })
  accessor origin: EnumAttr<typeof originArray> = PopupOrigin.Center

  /** 在锚定的布局框内部渲染 popup（默认吸附在边上，往外面渲染） */
  @attr('boolean') accessor inset!: boolean

  /** 是否将节点插入到 document.body 中（通常用于确保 z-index 层次足够高，从而避免被遮挡） */
  @attr('boolean') accessor appendToBody!: boolean

  /** Popup 是否显示箭头（注意：Popup 的原点为 Center 时，不会展示箭头） */
  @attr('boolean') accessor arrow!: boolean

  /** 打开时是否自动聚焦 */
  @attr('boolean') override accessor autofocus!: boolean

  /** 捕获焦点，tab 键不会将焦点移出 Popup */
  @attr('boolean') accessor capturefocus!: boolean

  /** 自动翻转功能，Popup 在 x 或 y 轴上溢出文档时，自动翻转显示 */
  @attr('boolean') accessor autoflip!: boolean

  /** 失去焦点时，是否恢复获得焦点前的焦点 */
  @attr('boolean') accessor restorefocus!: boolean

  constructor() {
    super()

    this._ref.$layout.appendChild(template())

    const shadowRoot = this.shadowRoot!

    const $arrow = shadowRoot.querySelector('#arrow') as HTMLElement
    const $slot = shadowRoot.querySelector('slot') as HTMLSlotElement
    Object.assign(this._ref, {
      $arrow,
      $slot,
    })

    this.addEventListener('opened', () => {
      if (this.autofocus) this._focus()
      // 动画过程可能锚定点移动，动画结束后，更新下位置
      this.updatePositionAndDirection()
    })

    this.addEventListener('closed', () => {
      this._blur()
    })

    if (this.capturefocus) {
      this._captureFocus()
    }
  }

  get offset(): [number, number] {
    const value = strGetter('offset')(this)
    if (value) return JSON.parse(value)
    return [0, 0]
  }

  set offset(value: [number, number]) {
    strSetter('offset')(this, JSON.stringify(value))
  }

  #getAnchorFn?: AnchorFn
  get anchor() {
    return this.#getAnchorFn ?? strGetter('anchor')(this)
  }

  set anchor(value: Anchor) {
    if (typeof value === 'string' || value === null) {
      strSetter('anchor')(this, value)
      this.#getAnchorFn = undefined
    } else {
      strSetter('anchor')(this, null)
      if (typeof value === 'function') {
        this.#getAnchorFn = value
      } else if (value instanceof Node) {
        this.#getAnchorFn = () => value
      }
    }
    this.updatePositionAndDirection()
  }

  // Popup 锚定一个矩形框进行定位，根据设置不同，可以吸附在该矩形框的四条边上，或者与该框的中心点对齐
  // 该方法返回这个锚定框的四条边的相对于 anchor 的定位数值
  getAnchorFrame(): { x1: number; x2: number; y1: number; y2: number } {
    let x1
    let x2
    let y1
    let y2
    let layoutAnchor
    const anchor =
      typeof this.anchor === 'function' ? this.anchor() : this.anchor

    if (anchor === null) {
      // 1. 无锚定元素也无锚定坐标，则以拥有定位属性的祖先元素为锚定目标
      layoutAnchor = getOffsetParent(this)
    } else if (anchor instanceof Element) {
      // 2. 指定了锚定元素，直接采用
      layoutAnchor = anchor
    } else if (typeof anchor === 'string') {
      // 3. 字符串的场景，可能是元素选择器，也可能是坐标文本
      if (!anchor.trim()) {
        // 3.1 空字符串，视作 null
        layoutAnchor = getOffsetParent(this)
      } else if (/\[\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\]/.test(anchor)) {
        // 3.3 锚定绝对坐标所描述的矩形区域
        // [x1, y1, x2, y2]
        ;[x1, y1, x2, y2] = JSON.parse(anchor)
      } else if (/\[\s*\d+\s*,\s*\d+\s*\]/.test(anchor)) {
        // 4. 锚定绝对坐标所描述的矩形区域
        ;[x1, y1] = JSON.parse(anchor)
        x2 = x1
        y2 = y1
      } else {
        // 3.2 选择器
        layoutAnchor = document.querySelector(anchor)
        if (layoutAnchor === null) {
          layoutAnchor = getOffsetParent(this)
        }
      }
    }

    if (layoutAnchor) {
      // 指定 anchor 元素或者未指定（采用定位父元素）的情况
      const rect = layoutAnchor.getBoundingClientRect()
      y1 = Math.floor(rect.top)
      x1 = Math.floor(rect.left)
      y2 = y1 + rect.height
      x2 = x1 + rect.width
    } else {
      // 坐标的情况，需要加上定位父元素的原点作为偏移
      const { top, left } = getOffsetParent(this)!.getBoundingClientRect()
      x1 += left
      x2 += left
      y1 += top
      y2 += top
    }

    return { x1, y1, x2, y2 }
  }

  override render() {
    //
  }

  updatePositionAndDirection() {
    if (!this.open) return

    const popup = this._ref.$layout
    const popupWidth = popup.offsetWidth
    const popupHeight = popup.offsetHeight

    // 定位的相对元素
    const layoutParent = getOffsetParent(this)
    if (!layoutParent) return
    const {
      scrollTop: layoutScrollTop,
      scrollLeft: layoutScrollLeft,
      scrollWidth: layoutWidth,
      scrollHeight: layoutHeight,
    } = layoutParent
    const { top: layoutOffsetTop, left: layoutOffsetLeft } =
      layoutParent.getBoundingClientRect()
    // 水平、垂直方向定位偏移值
    const [ox, oy] = this.offset

    // 锚定位置点
    // x1 最左取值，x2 最右取值
    // y1 最上取值，y2 最下取值
    const { x1, y1, x2, y2 } = this.getAnchorFrame()

    // Popup 的 top 定位坐标
    let top: number
    // Popup 的 left 定位坐标
    let left: number
    // Popup 投影的方向（水平）
    let shadowX: 'left' | 'center' | 'right'
    // Popup 投影的方向（垂直）
    let shadowY: 'top' | 'center' | 'bottom'
    // Popup 打开/关闭动画的原点（水平方向）
    let originX: 'left' | 'center' | 'right'
    // Popup 打开/关闭动画的原点（垂直方向）
    let originY: 'top' | 'center' | 'bottom'

    // 垂直翻转（投影、动画原点方向）
    const verticalFlip = () => {
      shadowY = (
        {
          top: 'bottom',
          bottom: 'top',
          center: 'center',
        } as any
      )[shadowY]
      originY = (
        {
          top: 'bottom',
          bottom: 'top',
          center: 'center',
        } as any
      )[originY]
    }

    // 水平翻转（投影、动画原点方向）
    const horizontalFlip = () => {
      shadowX = (
        {
          left: 'right',
          right: 'left',
        } as any
      )[shadowX]
      originX = (
        {
          left: 'right',
          right: 'left',
        } as any
      )[originX]
    }

    // 箭头尺寸
    const arrowSize = this.arrow ? ARROW_SIZE : 0

    // 配置 Popup 定位起始边（如果启用了箭头，也是箭头所在边）
    // 1. 起始边为上边，往下方展开 Popup
    // 吸附在 anchorFrame 的下边，如果启用 inset，则吸附在 anchorFrame 的上边
    if (this.origin.startsWith('top')) {
      top = (this.inset ? y1 : y2) + arrowSize + oy
      originY = 'top'
      shadowY = 'bottom'
      // 如果 popup 溢出视口，则检查翻转吸附在 y 的上方是否更好，如果是，则翻转
      if (this.autoflip && top + popupHeight > layoutHeight) {
        const flipTop = (this.inset ? y2 : y1) - arrowSize - oy - popupHeight
        if (flipTop > 0) {
          top = flipTop
          verticalFlip()
        }
      }
    }

    // 2. 起始边为右边，往左方展开 Popup
    // 吸附在 anchorFrame 的左边，如果启用 inset 则吸附在 anchorFrame 的右边
    else if (this.origin.startsWith('right')) {
      left = (this.inset ? x2 : x1) - arrowSize - ox - popupWidth
      originX = 'right'
      shadowX = 'left'
      if (this.autoflip && left < 0) {
        const flipLeft = (this.inset ? x1 : x2) + arrowSize + ox
        if (flipLeft + popupWidth < layoutWidth) {
          left = flipLeft
          horizontalFlip()
        }
      }
    }

    // 3. 起始边为下边，往上方展开
    // 吸附在 anchorFrame 的上边，如果启用 inset 则吸附在 anchorFrame 的下边
    else if (this.origin.startsWith('bottom')) {
      top = (this.inset ? y2 : y1) - arrowSize - oy - popupHeight
      originY = 'bottom'
      shadowY = 'top'
      // 如果 popup 溢出视口，则检查翻转吸附在目标的下边是否更好，如果是，则翻转
      if (this.autoflip && top < 0) {
        const flipTop = (this.inset ? y1 : y2) + arrowSize + oy
        if (flipTop + popupHeight < layoutHeight) {
          top = flipTop
          verticalFlip()
        }
      }
    }

    // 4. 起始边为左边，往右方展开 Popup
    // 吸附在 anchorFrame 的右边，如果启用 inset 则吸附在 anchorFrame 的左边
    else if (this.origin.startsWith('left')) {
      left = (this.inset ? x1 : x2) + arrowSize + ox
      originX = 'left'
      shadowX = 'right'
      if (this.autoflip && left + popupWidth > layoutWidth) {
        const flipLeft = (this.inset ? x2 : x1) - arrowSize - ox - popupWidth
        if (flipLeft > 0) {
          left = flipLeft
          horizontalFlip()
        }
      }
    }

    // 5. 无起始边，从中心往外展开 Popup
    else {
      top = y1 + (y2 - y1) / 2 - popupHeight / 2 + oy
      left = x1 + (x2 - x1) / 2 - popupWidth / 2 + ox
      originX = 'center'
      originY = 'center'
      shadowX = 'center'
      shadowY = 'center'
    }

    // 配置 Popup 在起始边上的原点位置（如果启用了箭头，也是箭头在起始边上的位置）
    if (this._isVertical()) {
      if (this.origin.endsWith('start')) {
        // 与起始边左侧对齐
        left = x1 + ox
        originX = 'left'
        shadowX = 'right'
        // 如果与 popup 的右侧溢出视口，则检查向左侧渲染是否更好，是则翻转成右对齐
        if (
          this.autoflip &&
          left + popupWidth > layoutWidth &&
          x2 - ox - popupWidth > 0
        ) {
          left = x2 - ox - popupWidth
          horizontalFlip()
        }
      } else if (this.origin.endsWith('end')) {
        // 与起始边右侧对齐
        left = x2 - ox - popupWidth
        originX = 'right'
        shadowX = 'left'
        // 如果与 popup 的左侧溢出视口，则检查向右侧渲染是否更好，是则翻转
        if (this.autoflip && left < 0 && x1 + ox + popupWidth < layoutWidth) {
          left = x1 + ox
          horizontalFlip()
        }
      } else if (this.origin.endsWith('center')) {
        // 与起始边中对齐，不翻转
        left = x1 + (x2 - x1) / 2 - popupWidth / 2 + ox
        originX = 'center'
        shadowX = 'center'
      }
    } else if (this._isHorizontal()) {
      if (this.origin.endsWith('start')) {
        // 默认与起始边顶部对齐
        top = y1 + oy
        originY = 'top'
        shadowY = 'bottom'
        // 如果与 popup 的下方溢出视口，则检查向上渲染是否更好，是则翻转
        if (
          this.autoflip &&
          top + popupHeight > layoutHeight &&
          y2 - oy - popupHeight > 0
        ) {
          top = y2 - oy - popupHeight
          verticalFlip()
        }
      } else if (this.origin.endsWith('end')) {
        // 默认与起始边底部对齐
        top = y2 - oy - popupHeight
        originY = 'bottom'
        shadowY = 'top'
        // 如果与 popup 的上方溢出视口，则检查向下渲染是否更好，是则翻转
        if (this.autoflip && top < 0 && y1 + oy + popupHeight < layoutHeight) {
          top = y1 + oy + popupHeight
          verticalFlip()
        }
      } else if (this.origin.endsWith('center')) {
        // 与起始边中对齐，不翻转
        top = y1 + (y2 - y1) / 2 - popupHeight / 2 + oy
        originY = 'center'
        shadowY = 'center'
      }
    }

    this.style.top = `${top! + layoutScrollTop - layoutOffsetTop}px`
    this.style.left = `${left! + layoutScrollLeft - layoutOffsetLeft}px`
    this._setOrigin(originY!, originX!)
  }

  #refreshPosition?: (() => void) | null
  _initAnchorEvent() {
    if (this.#refreshPosition) return
    this.#refreshPosition = () =>
      this.open && this.anchor && this.updatePositionAndDirection()
    // 使用捕获的方式，以保证内部元素滚动也能触发
    window.addEventListener('scroll', this.#refreshPosition, true)
    window.addEventListener('touchstart', this.#refreshPosition)
    window.addEventListener('click', this.#refreshPosition)
  }

  _destroyAnchorEvent() {
    if (!this.#refreshPosition) return
    window.removeEventListener('scroll', this.#refreshPosition, true)
    window.removeEventListener('touchstart', this.#refreshPosition)
    window.removeEventListener('click', this.#refreshPosition)
    this.#refreshPosition = null
  }

  override connectedCallback() {
    super.connectedCallback()

    if (this.appendToBody && this.parentElement !== document.body) {
      document.body.appendChild(this)
    }

    if (this.open) {
      this._onOpenAttributeChange()
      this._updateVisible()
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._destroyAnchorEvent()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    switch (attrName) {
      case 'open': {
        this._onOpenAttributeChange()
        this._updateVisible()
        break
      }

      case 'anchor': {
        this.anchor = newValue
        break
      }

      case 'offset': {
        this.updatePositionAndDirection()
        break
      }

      case 'arrow': {
        this._updateArrow()
        this.updatePositionAndDirection()
        break
      }

      case 'append-to-body': {
        if (
          this.appendToBody &&
          this.parentElement !== document.body &&
          document.documentElement.contains(this)
        ) {
          document.body.appendChild(this)
        }
        this.updatePositionAndDirection()
        break
      }

      case 'capturefocus': {
        if (this.capturefocus) {
          this._captureFocus()
        } else {
          this._stopCaptureFocus()
        }
        break
      }

      case 'origin': {
        this._updateClass()
        this._updateArrow()
        this.updatePositionAndDirection()
        break
      }

      default: {
        this.updatePositionAndDirection()
        break
      }
    }
  }

  // 强制捕获焦点，避免 Tab 键导致焦点跑出去 popup 外面
  #firstFocusable?: HTMLElement
  #lastFocusable?: HTMLElement
  _captureFocus() {
    this.#firstFocusable =
      this._ref.$layout.querySelector('#first') ||
      this._ref.$layout.insertBefore(
        document.createElement('button'),
        this._ref.$layout.firstChild
      )
    this.#lastFocusable =
      this._ref.$layout.querySelector('#last') ||
      this._ref.$layout.appendChild(document.createElement('button'))
    this.#firstFocusable.id = 'first'
    this.#lastFocusable.id = 'last'
    this.#firstFocusable.onkeydown = e => {
      if (e.key === 'Tab' && e.shiftKey) {
        this.#lastFocusable?.focus?.()
      }
    }
    this.#lastFocusable.onkeydown = e => {
      if (e.key === 'Tab' && !e.shiftKey) {
        this.#firstFocusable?.focus?.()
      }
    }
  }

  // 停止强制捕获焦点
  _stopCaptureFocus() {
    if (this.#firstFocusable && this.#firstFocusable.parentElement) {
      this._ref.$layout.removeChild(this.#firstFocusable)
    }
    if (this.#firstFocusable && this.#lastFocusable?.parentElement) {
      this._ref.$layout.removeChild(this.#lastFocusable)
    }
  }

  _updateVisible() {
    this._updateClass()
    this._updateArrow()
    this.updatePositionAndDirection()
    if (this.open) {
      this._initAnchorEvent()
    } else {
      this._destroyAnchorEvent()
    }
  }

  _isHorizontal() {
    return this.origin.startsWith('left') || this.origin.startsWith('right')
  }

  _isVertical() {
    return this.origin.startsWith('top') || this.origin.startsWith('bottom')
  }

  _updateClass() {
    if (this._isHorizontal()) {
      this._ref.$layout.classList.add('horizontal')
      this._ref.$layout.classList.remove('vertical')
    } else if (this._isVertical()) {
      this._ref.$layout.classList.remove('horizontal')
      this._ref.$layout.classList.add('vertical')
    } else {
      this._ref.$layout.classList.remove('horizontal')
      this._ref.$layout.classList.remove('vertical')
    }
  }

  _updateArrow() {
    if (this.arrow) {
      this._ref.$arrow.style.display = ''
    } else {
      this._ref.$arrow.style.display = 'none'
    }
  }

  #prevFocus?: HTMLElement | null
  _focus() {
    if (this.restorefocus && !this.#prevFocus) {
      this.#prevFocus = document.activeElement as HTMLElement
    }
    this.focus()
  }

  _blur() {
    this.blur()
    if (this.#prevFocus) {
      if (this.restorefocus && typeof this.#prevFocus.focus) {
        this.#prevFocus.focus()
      }
      this.#prevFocus = undefined
    }
  }

  // 设置原点 class
  _setOriginClass(value: string) {
    ;[...(this._ref.$layout.classList as any).values()].forEach(className => {
      if (className !== value && className.startsWith('origin-')) {
        this._ref.$layout.classList.remove(className)
      }
    })
    this._ref.$layout.classList.add(value)
  }

  // 设置 css 变换原点
  _setOrigin(y: 'bottom' | 'center' | 'top', x: 'left' | 'center' | 'right') {
    this._setOriginClass(`origin-${y}-${x}`)
    this.style.transformOrigin = `${y} ${x}`
  }
}

// // 等腰直角三角形，根据高求腰（矩形的边）
// function getArrowRectSize(height) {
//   return Math.round(height * Math.SQRT2)
// }

function getOffsetParent(popup: BlocksPopup) {
  let el: HTMLElement | null = popup
  while (el) {
    if (el.offsetParent) {
      return el.offsetParent
    }
    el = el.parentElement
  }
  return null
}
