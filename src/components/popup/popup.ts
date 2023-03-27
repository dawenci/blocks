import type { ComponentEventListener } from '../component/Component.js'
import type { EnumAttr } from '../../decorators/attr.js'
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { updateBg } from './bg.js'
import { prop } from '../../decorators/prop.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'
import { PopupOrigin } from './origin.js'
import { SetupFocusCapture } from '../setup-focus-capture/index.js'
import { WithOpenTransition } from '../with-open-transition/index.js'

const originArray = Object.values(PopupOrigin)

export type BlocksPopupEventMap = WithOpenTransitionEventMap

export interface BlocksPopup extends WithOpenTransition {
  addEventListener<K extends keyof BlocksPopupEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksPopupEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlocksPopupEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksPopupEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-popup',
  attachShadow: {
    mode: 'open',
    // 如果启用焦点委托，将无法选中 shadowDOM 和 slot 中非可聚焦元素中的文本，因此禁用焦点委托。
    delegatesFocus: false,
  },
  styles: [style],
  mixins: [WithOpenTransition],
})
export class BlocksPopup extends Component {
  static get role() {
    return 'popup'
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

  /** 箭头尺寸（注意：Popup 的原点为 Center 时，不会展示箭头） */
  @attr('int') accessor arrow = 0

  /** 是否可以聚焦 */
  @attr('boolean') accessor focusable!: boolean

  /** 打开时是否自动聚焦 */
  @attr('boolean') override accessor autofocus!: boolean

  /** 捕获焦点，tab 键不会将焦点移出 Popup */
  @attr('boolean') accessor capturefocus!: boolean

  /** 自动翻转功能，Popup 在 x 或 y 轴上溢出文档时，自动翻转显示 */
  @attr('boolean') accessor autoflip!: boolean

  /** 失去焦点时，是否恢复获得焦点前的焦点 */
  @attr('boolean') accessor restorefocus!: boolean

  /** 定位的 X 轴 offset 值，用来偏移吸附 anchor 的水平距离。*/
  @attr('number') accessor offsetX = 0

  /** 定位的 Y 轴 offset 值，用来偏移吸附 anchor 的垂直距离。*/
  @attr('number') accessor offsetY = 0

  // Popup 锚定的布局框，是一个矩形区域，Popup 根据 origin 不同，
  // 会吸附在该矩形的四条边中的某一条的外侧（设置 inset 后在内测），或与改矩形中心对齐（origin 为 center 的情况）。
  //
  // 有多种方式可以指定这个锚定的布局框：
  // 1. 通过指定原点、宽高，确定一个矩形：设置 `anchorX` & `anchorY` & `anchorWidth` & `anchorHeight` attribute
  // 2. 通过指定一个元素的 CSS 选择器，以该元素的矩形框来确定：设置 `anchorSelector`
  // 3. 通过 JavaScript API 指定锚定的元素的获取函数: 设置 `anchorElement` 属性
  // 4. 使用默认锚定，什么都不用设置，默认使用 `offsetParent` 作为锚定元素
  // 优先级：anchorElement > anchorSelector > anchorX/anchorY/anchorWidth/anchorHeight > 默认
  /** 锚定矩形区域 x 轴原点 */
  @attr('number') accessor anchorX!: number
  /** 锚定矩形区域 y 轴原点 */
  @attr('number') accessor anchorY!: number
  /** 锚定矩形区域宽度 */
  @attr('number') accessor anchorWidth = 0
  /** 锚定矩形区域高度 */
  @attr('number') accessor anchorHeight = 0
  /** 锚定元素选择器 */
  @attr('string') accessor anchorSelector!: string

  #anchorElement?: () => HTMLElement
  /** 锚定元素访问器 */
  @prop({
    get(self) {
      return self.#anchorElement
    },
    set: (self, value: (() => HTMLElement) | undefined) => {
      self.#anchorElement = value
      self.updatePositionAndDirection()
    },
  })
  accessor anchorElement!: (() => Element) | undefined

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement
  @shadowRef('[part="default-slot"]') accessor $slot!: HTMLSlotElement
  @shadowRef('[part="bg"]', false) accessor $bg!: SVGElement
  @shadowRef('[part="shadow"]', false) accessor $shadow!: SVGElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupFocus()
    this.#setupAppendBody()
    this.#setupAnchorAdsorption()
    this.#setupArrow()
  }

  #isVerticalFlipped = false
  #isHorizontalFlipped = false
  updatePositionAndDirection() {
    if (!this.open) return

    const popupWidth = this.clientWidth
    const popupHeight = this.clientHeight

    // 定位的相对元素
    const layoutParent = getOffsetParent(this)
    if (!layoutParent) return

    const {
      scrollTop: layoutScrollTop,
      scrollLeft: layoutScrollLeft,
      scrollWidth: layoutWidth,
      scrollHeight: layoutHeight,
    } = layoutParent
    const { top: layoutOffsetTop, left: layoutOffsetLeft } = layoutParent.getBoundingClientRect()
    // 水平、垂直方向定位偏移值
    const offsetX = this.offsetX
    const offsetY = this.offsetY

    // 锚定位置点
    // x1 最左取值，x2 最右取值
    // y1 最上取值，y2 最下取值
    const { x1, y1, x2, y2 } = this.#getAnchorFrame()

    // Popup 的 top 定位坐标
    let top!: number
    // Popup 的 left 定位坐标
    let left!: number
    // Popup 打开/关闭动画的原点（水平方向）
    let originX!: 'left' | 'center' | 'right'
    // Popup 打开/关闭动画的原点（垂直方向）
    let originY!: 'top' | 'center' | 'bottom'

    this.#isVerticalFlipped = this.#isHorizontalFlipped = false

    // 垂直翻转（投影、动画原点方向）
    const verticalFlip = () => {
      this.#isVerticalFlipped = true
      originY = flipY(originY)
    }

    // 水平翻转（投影、动画原点方向）
    const horizontalFlip = () => {
      this.#isHorizontalFlipped = true
      originX = flipX(originX)
    }

    // 配置 Popup 定位起始边（如果启用了箭头，也是箭头所在边）
    // 1. 起始边为上边，往下方展开 Popup
    // 吸附在 anchorFrame 的下边，如果启用 inset，则吸附在 anchorFrame 的上边
    if (this.origin.startsWith('top')) {
      top = (this.inset ? y1 : y2) + offsetY
      originY = 'top'
      // 如果 popup 溢出视口，则检查翻转吸附在 y 的上方是否更好，如果是，则翻转
      if (this.autoflip && top + popupHeight > layoutHeight) {
        const flipTop = (this.inset ? y2 : y1) - offsetY - popupHeight
        if (flipTop > 0) {
          top = flipTop
          verticalFlip()
        }
      }
    }

    // 2. 起始边为右边，往左方展开 Popup
    // 吸附在 anchorFrame 的左边，如果启用 inset 则吸附在 anchorFrame 的右边
    else if (this.origin.startsWith('right')) {
      left = (this.inset ? x2 : x1) - offsetX - popupWidth
      originX = 'right'
      if (this.autoflip && left < 0) {
        const flipLeft = (this.inset ? x1 : x2) + offsetX
        if (flipLeft + popupWidth < layoutWidth) {
          left = flipLeft
          horizontalFlip()
        }
      }
    }

    // 3. 起始边为下边，往上方展开
    // 吸附在 anchorFrame 的上边，如果启用 inset 则吸附在 anchorFrame 的下边
    else if (this.origin.startsWith('bottom')) {
      top = (this.inset ? y2 : y1) - offsetY - popupHeight
      originY = 'bottom'
      // 如果 popup 溢出视口，则检查翻转吸附在目标的下边是否更好，如果是，则翻转
      if (this.autoflip && top < 0) {
        const flipTop = (this.inset ? y1 : y2) + offsetY
        if (flipTop + popupHeight < layoutHeight) {
          top = flipTop
          verticalFlip()
        }
      }
    }

    // 4. 起始边为左边，往右方展开 Popup
    // 吸附在 anchorFrame 的右边，如果启用 inset 则吸附在 anchorFrame 的左边
    else if (this.origin.startsWith('left')) {
      left = (this.inset ? x1 : x2) + offsetX
      originX = 'left'
      if (this.autoflip && left + popupWidth > layoutWidth) {
        const flipLeft = (this.inset ? x2 : x1) - offsetX - popupWidth
        if (flipLeft > 0) {
          left = flipLeft
          horizontalFlip()
        }
      }
    }

    // 5. 无起始边，从中心往外展开 Popup
    else {
      top = y1 + (y2 - y1) / 2 - popupHeight / 2 + offsetY
      left = x1 + (x2 - x1) / 2 - popupWidth / 2 + offsetX
      originX = 'center'
      originY = 'center'
    }

    // 配置 Popup 在起始边上的原点位置（如果启用了箭头，也是箭头在起始边上的位置）
    if (this.#isVertical()) {
      if (this.origin.endsWith('start')) {
        // 与起始边左侧对齐
        left = x1 + offsetX
        originX = 'left'
        // 如果与 popup 的右侧溢出视口，则检查向左侧渲染是否更好，是则翻转成右对齐
        if (this.autoflip && left + popupWidth > layoutWidth && x2 - offsetX - popupWidth > 0) {
          left = x2 - offsetX - popupWidth
          horizontalFlip()
        }
      } else if (this.origin.endsWith('end')) {
        // 与起始边右侧对齐
        left = x2 - offsetX - popupWidth
        originX = 'right'
        // 如果与 popup 的左侧溢出视口，则检查向右侧渲染是否更好，是则翻转
        if (this.autoflip && left < 0 && x1 + offsetX + popupWidth < layoutWidth) {
          left = x1 + offsetX
          horizontalFlip()
        }
      } else if (this.origin.endsWith('center')) {
        // 与起始边中对齐，不翻转
        left = x1 + (x2 - x1) / 2 - popupWidth / 2 + offsetX
        originX = 'center'
      }
    } else if (this.#isHorizontal()) {
      if (this.origin.endsWith('start')) {
        // 默认与起始边顶部对齐
        top = y1 + offsetY
        originY = 'top'
        // 如果与 popup 的下方溢出视口，则检查向上渲染是否更好，是则翻转
        if (this.autoflip && top + popupHeight > layoutHeight && y2 - offsetY - popupHeight > 0) {
          top = y2 - offsetY - popupHeight
          verticalFlip()
        }
      } else if (this.origin.endsWith('end')) {
        // 默认与起始边底部对齐
        top = y2 - offsetY - popupHeight
        originY = 'bottom'
        // 如果与 popup 的上方溢出视口，则检查向下渲染是否更好，是则翻转
        if (this.autoflip && top < 0 && y1 + offsetY + popupHeight < layoutHeight) {
          top = y1 + offsetY + popupHeight
          verticalFlip()
        }
      } else if (this.origin.endsWith('center')) {
        // 与起始边中对齐，不翻转
        top = y1 + (y2 - y1) / 2 - popupHeight / 2 + offsetY
        originY = 'center'
      }
    }

    // 设置翻转标志
    if (this.#isVerticalFlipped) {
      this.setAttribute('vertical-flipped', '')
    } else {
      this.removeAttribute('vertical-flipped')
    }
    if (this.#isHorizontalFlipped) {
      this.setAttribute('horizontal-flipped', '')
    } else {
      this.removeAttribute('horizontal-flipped')
    }

    // 设置变换原点
    this.style.transformOrigin = `${originY} ${originX}`
    this.style.top = `${top + layoutScrollTop - layoutOffsetTop}px`
    this.style.left = `${left + layoutScrollLeft - layoutOffsetLeft}px`
    this.updateArrow()
  }

  #setupArrow() {
    const update = () => {
      this.updateArrow()
      this.updatePositionAndDirection()
    }
    let clear: (() => void) | undefined
    const cleanup = () => {
      if (clear) clear()
      clear = undefined
    }
    this.onRender(update)
    this.onConnected(update)
    this.onAttributeChangedDep('arrow', update)
    this.onConnected(() => {
      clear = sizeObserve(this.$layout, update)
    })
    this.onDisconnected(() => {
      cleanup()
    })
  }
  updateArrow() {
    if (!this.open) return

    const $svg = this.$bg
    const origin = originTransform(this.origin, this.#isVerticalFlipped, this.#isHorizontalFlipped)
    const width = this.clientWidth
    const height = this.clientHeight
    const computedStyle = getComputedStyle(this)
    const radius = parseInt(computedStyle.getPropertyValue('--radius'), 10) || 2
    const lineWidth = parseInt(computedStyle.getPropertyValue('--border-width'), 10) || 0
    const stroke = computedStyle.getPropertyValue('--border-color') || 'transparent'
    const fill = computedStyle.getPropertyValue('--bg') || 'transparent'
    let arrowSize = this.arrow

    const direction = origin.split('-')[0] as 'top' | 'right' | 'left' | 'bottom' | 'center'
    for (const prop of ['top', 'right', 'bottom', 'left']) {
      this.$layout.style.setProperty(`padding-${prop}`, direction === prop ? `${this.arrow}px` : '0')
      this.$shadow.style.setProperty(prop, direction === prop ? `${this.arrow}px` : '0')
    }
    if (direction === 'center') {
      arrowSize = 0
      this.$shadow.style.setProperty('top', `${this.arrow}px`)
    }

    updateBg({
      $svg,
      width,
      height,
      arrowSize,
      lineWidth,
      radius,
      stroke,
      fill,
      origin,
    })
  }

  #setupAppendBody() {
    this.onConnected(() => {
      if (this.appendToBody && this.parentElement !== document.body) {
        document.body.appendChild(this)
      }
    })

    this.onAttributeChangedDep('append-to-body', () => {
      if (this.appendToBody && this.parentElement !== document.body && document.documentElement.contains(this)) {
        document.body.appendChild(this)
      }
    })
  }

  #setupAnchorAdsorption() {
    let refreshPos: (() => void) | null
    const _initAnchorEvent = () => {
      if (refreshPos) return
      refreshPos = this.updatePositionAndDirection.bind(this)
      // 使用捕获的方式，以保证内部元素滚动也能触发
      window.addEventListener('scroll', refreshPos, true)
      window.addEventListener('touchstart', refreshPos)
      window.addEventListener('click', refreshPos)
      window.addEventListener('resize', refreshPos)
    }
    const _destroyAnchorEvent = () => {
      if (!refreshPos) return
      window.removeEventListener('scroll', refreshPos, true)
      window.removeEventListener('touchstart', refreshPos)
      window.removeEventListener('click', refreshPos)
      window.removeEventListener('resize', refreshPos)
      refreshPos = null
    }
    this.onDisconnected(() => {
      _destroyAnchorEvent()
    })
    this.onConnected(() => {
      if (this.open) {
        _initAnchorEvent()
      }
    })
    this.onAttributeChangedDep('open', () => {
      if (this.open) {
        _initAnchorEvent()
      } else {
        _destroyAnchorEvent()
      }
    })

    this.onRender(this.updatePositionAndDirection)
    this.onConnected(this.updatePositionAndDirection)
    this.onAttributeChangedDeps(
      [
        'open',
        'anchor',
        'offset-x',
        'offset-y',
        'anchor-x',
        'anchor-y',
        'anchor-width',
        'anchor-height',
        'anchor-selector',
        'origin',
        'arrow',
      ],
      this.updatePositionAndDirection
    )
  }

  #setupFocus() {
    const initTabIndex = () => {
      if (this.focusable || this.autofocus) {
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1')
      }
    }
    this.onConnected(initTabIndex)
    this.onAttributeChangedDeps(['focusable', 'autofocus'], initTabIndex)

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

    const onOpened = () => {
      // 动画过程可能锚定点移动，动画结束后，更新下位置
      this.updatePositionAndDirection()
      if (this.autofocus) _focus()
    }

    const onClosed = () => {
      _blur()
    }

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

  // Popup 锚定一个矩形框进行定位，根据设置不同，可以吸附在该矩形框的四条边上，或者与该框的中心点对齐
  // 该方法返回这个锚定框的四条边的相对于 anchor 的定位数值
  #getAnchorFrame(): { x1: number; x2: number; y1: number; y2: number } {
    if (this.anchorElement || this.anchorSelector) {
      const element = this.anchorElement ? this.anchorElement() : document.querySelector(this.anchorSelector)
      if (element) {
        const rect = element.getBoundingClientRect()
        const y1 = Math.floor(rect.top)
        const x1 = Math.floor(rect.left)
        const y2 = y1 + rect.height
        const x2 = x1 + rect.width
        return { x1, y1, x2, y2 }
      }
    }

    if (this.anchorX != null && this.anchorY != null) {
      let x1 = this.anchorX ?? 0
      let y1 = this.anchorY ?? 0
      let x2 = x1 + (this.anchorWidth ?? 0)
      let y2 = y1 + (this.anchorHeight ?? 0)
      // 加上定位父元素的原点作为偏移
      const { top, left } = getOffsetParent(this)!.getBoundingClientRect()
      x1 += left
      x2 += left
      y1 += top
      y2 += top
      return { x1, y1, x2, y2 }
    }

    const element = getOffsetParent(this)!
    const rect = element.getBoundingClientRect()
    const y1 = Math.floor(rect.top)
    const x1 = Math.floor(rect.left)
    const y2 = y1 + rect.height
    const x2 = x1 + rect.width
    return { x1, y1, x2, y2 }
  }

  #isHorizontal() {
    return this.origin.startsWith('left') || this.origin.startsWith('right')
  }

  #isVertical() {
    return this.origin.startsWith('top') || this.origin.startsWith('bottom')
  }
}

function flipY(y: 'top' | 'center' | 'bottom'): 'top' | 'center' | 'bottom' {
  return y === 'top' ? 'bottom' : y === 'bottom' ? 'top' : 'center'
}

function flipX(x: 'left' | 'center' | 'right'): 'left' | 'center' | 'right' {
  return x === 'left' ? 'right' : x === 'right' ? 'left' : 'center'
}

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

function originTransform(origin: PopupOrigin, yFlipped: boolean, xFlipped: boolean): PopupOrigin {
  switch (origin) {
    case PopupOrigin.TopStart:
      return yFlipped && xFlipped
        ? PopupOrigin.BottomEnd
        : yFlipped
        ? PopupOrigin.BottomStart
        : xFlipped
        ? PopupOrigin.TopEnd
        : PopupOrigin.TopStart
    case PopupOrigin.TopCenter:
      return yFlipped ? PopupOrigin.BottomCenter : PopupOrigin.TopCenter
    case PopupOrigin.TopEnd:
      return yFlipped && xFlipped
        ? PopupOrigin.BottomStart
        : yFlipped
        ? PopupOrigin.BottomEnd
        : xFlipped
        ? PopupOrigin.TopStart
        : PopupOrigin.TopEnd
    case PopupOrigin.BottomStart:
      return yFlipped && xFlipped
        ? PopupOrigin.TopEnd
        : yFlipped
        ? PopupOrigin.TopStart
        : xFlipped
        ? PopupOrigin.BottomEnd
        : PopupOrigin.BottomStart
    case PopupOrigin.BottomCenter:
      return yFlipped ? PopupOrigin.TopCenter : PopupOrigin.BottomCenter
    case PopupOrigin.BottomEnd:
      return yFlipped && xFlipped
        ? PopupOrigin.TopStart
        : yFlipped
        ? PopupOrigin.TopEnd
        : xFlipped
        ? PopupOrigin.BottomStart
        : PopupOrigin.BottomEnd
    case PopupOrigin.LeftStart:
      return yFlipped && xFlipped
        ? PopupOrigin.RightEnd
        : yFlipped
        ? PopupOrigin.LeftEnd
        : xFlipped
        ? PopupOrigin.RightStart
        : PopupOrigin.LeftStart
    case PopupOrigin.LeftCenter:
      return xFlipped ? PopupOrigin.RightCenter : PopupOrigin.LeftCenter
    case PopupOrigin.LeftEnd:
      return yFlipped && xFlipped
        ? PopupOrigin.RightStart
        : yFlipped
        ? PopupOrigin.LeftStart
        : xFlipped
        ? PopupOrigin.RightEnd
        : PopupOrigin.LeftEnd
    case PopupOrigin.RightStart:
      return yFlipped && xFlipped
        ? PopupOrigin.LeftEnd
        : yFlipped
        ? PopupOrigin.RightEnd
        : xFlipped
        ? PopupOrigin.LeftStart
        : PopupOrigin.RightStart
    case PopupOrigin.RightCenter:
      return xFlipped ? PopupOrigin.LeftCenter : PopupOrigin.RightCenter
    case PopupOrigin.RightEnd:
      return yFlipped && xFlipped
        ? PopupOrigin.LeftStart
        : yFlipped
        ? PopupOrigin.RightStart
        : xFlipped
        ? PopupOrigin.LeftEnd
        : PopupOrigin.RightEnd
    case PopupOrigin.Center:
      return PopupOrigin.Center
  }
}
