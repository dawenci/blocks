import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { onDragMove, OnEnd, OnMove, OnStart } from '../../common/onDragMove.js'
import { setStyles } from '../../common/style.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlComponent, BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'

export interface ScrollableEventMap extends BlComponentEventMap {
  'bl:change:can-scroll-bottom': CustomEvent<{ value: boolean }>
  'bl:change:can-scroll-left': CustomEvent<{ value: boolean }>
  'bl:change:can-scroll-right': CustomEvent<{ value: boolean }>
  'bl:change:can-scroll-top': CustomEvent<{ value: boolean }>
  'bl:drag-scroll-end': CustomEvent
  'bl:resize': CustomEvent<{ width: number; height: number }>
  'bl:scroll': CustomEvent
}

export interface BlScrollable extends BlComponent {
  addEventListener<K extends keyof ScrollableEventMap>(
    type: K,
    listener: BlComponentEventListener<ScrollableEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof ScrollableEventMap>(
    type: K,
    listener: BlComponentEventListener<ScrollableEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-scrollable',
  styles: [style],
})
export class BlScrollable extends BlComponent {
  @attr('boolean') accessor shadow!: boolean

  #draggingFlag?: boolean
  #canScrollLeft?: boolean
  #canScrollRight?: boolean
  #canScrollTop?: boolean
  #canScrollBottom?: boolean

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement
  @shadowRef('[part="viewport"]') accessor $viewport!: HTMLElement
  @shadowRef('[part="horizontal-track"]') accessor $horizontal!: HTMLElement
  @shadowRef('[part="vertical-track"]') accessor $vertical!: HTMLElement
  @shadowRef('[part="horizontal-thumb"]') accessor $horizontalThumb!: HTMLElement
  @shadowRef('[part="vertical-thumb"]') accessor $verticalThumb!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.$layout.onmouseenter = () => {
      this._updateScrollbar()
    }

    sizeObserve(this.$layout, size => {
      this._updateScrollbar()
      dispatchEvent(this, 'bl:resize', { detail: size })
    })

    this._initMoveEvents()

    this.$viewport.onscroll = () => {
      if (!this.#draggingFlag) {
        this._updateScrollbar()
      }
      dispatchEvent(this, 'bl:scroll')
    }

    this.hook.onConnected(this.render)
  }

  get canScrollLeft() {
    return this.#canScrollLeft
  }

  set canScrollLeft(value) {
    if (this.#canScrollLeft !== value) {
      this.#canScrollLeft = value
      this.$layout.classList.toggle('shadow-left', value)
      dispatchEvent(this, 'bl:change:can-scroll-left', { detail: { value } })
    }
  }

  get canScrollRight() {
    return this.#canScrollRight
  }

  set canScrollRight(value) {
    if (this.#canScrollRight !== value) {
      this.#canScrollRight = value
      this.$layout.classList.toggle('shadow-right', this.canScrollRight)
      dispatchEvent(this, 'bl:change:can-scroll-right', { detail: { value } })
    }
  }

  get canScrollTop() {
    return this.#canScrollTop
  }

  set canScrollTop(value) {
    if (this.#canScrollTop !== value) {
      this.#canScrollTop = value
      this.$layout.classList.toggle('shadow-top', this.canScrollTop)
      dispatchEvent(this, 'bl:change:can-scroll-top', { detail: { value } })
    }
  }

  get canScrollBottom() {
    return this.#canScrollBottom
  }

  set canScrollBottom(value) {
    if (this.#canScrollBottom !== value) {
      this.#canScrollBottom = value
      this.$layout.classList.toggle('shadow-bottom', this.canScrollBottom)
      dispatchEvent(this, 'bl:change:can-scroll-bottom', { detail: { value } })
    }
  }

  get viewportScrollLeft() {
    return this.$viewport.scrollLeft
  }

  set viewportScrollLeft(value) {
    this.$viewport.scrollLeft = value
    this._updateScrollbar()
  }

  get viewportScrollTop() {
    return this.$viewport.scrollTop
  }

  set viewportScrollTop(value) {
    this.$viewport.scrollTop = value
    this._updateScrollbar()
  }

  get hasVerticalScrollbar() {
    return this.$viewport.scrollHeight > this.$viewport.clientHeight
  }

  get hasHorizontalScrollbar() {
    return this.$viewport.scrollWidth > this.$viewport.clientWidth
  }

  toggleViewportClass(className: string, value: boolean) {
    this.$viewport.classList.toggle(className, value)
  }

  _updateScrollbar() {
    const {
      clientWidth: viewportWidth,
      clientHeight: viewportHeight,
      scrollWidth: contentWidth,
      scrollHeight: contentHeight,
      scrollTop: contentTopSpace,
      scrollLeft: contentLeftSpace,
    } = this.$viewport
    const showHorizontal = contentWidth > viewportWidth
    const showVertical = contentHeight > viewportHeight

    if (showHorizontal) {
      this.$horizontal.style.display = 'block'

      const trackWidth = this.$horizontal.clientWidth
      const contentRightSpace = contentWidth - contentLeftSpace - viewportWidth
      // 滚动条尺寸（不小于 20px）
      const thumbWidth = Math.max(Math.round((viewportWidth / contentWidth) * trackWidth), 20)

      const horizontalTrackSpace = trackWidth - thumbWidth
      const thumbLeft = horizontalTrackSpace * (contentLeftSpace / (contentLeftSpace + contentRightSpace))

      setStyles(this.$horizontalThumb, {
        transform: `translateX(${thumbLeft}px)`,
        width: `${thumbWidth}px`,
      })
      this._updateShadowState()
      this._udpateScrollbarState()
    } else {
      this.$horizontal.style.display = 'none'
    }

    if (showVertical) {
      this.$vertical.style.display = 'block'
      const trackHeight = this.$vertical.clientHeight
      const contentBottomSpace = contentHeight - contentTopSpace - viewportHeight
      // 滚动条尺寸（不小于 20px）
      const thumbHeight = Math.max(Math.round((viewportHeight / contentHeight) * trackHeight), 20)
      const verticalTrackSpace = trackHeight - thumbHeight
      const thumbTop = verticalTrackSpace * (contentTopSpace / (contentTopSpace + contentBottomSpace))
      setStyles(this.$verticalThumb, {
        transform: `translateY(${thumbTop}px)`,
        height: `${thumbHeight}px`,
      })
      this._updateShadowState()
      this._udpateScrollbarState()
    } else {
      this.$vertical.style.display = 'none'
    }
  }

  _updateScrollable() {
    const {
      clientWidth: viewportWidth,
      clientHeight: viewportHeight,
      scrollWidth: contentWidth,
      scrollHeight: contentHeight,
    } = this.$viewport
    const trackWidth = this.$horizontal.clientWidth
    const trackHeight = this.$vertical.clientHeight
    const thumbWidth = this.$horizontalThumb.offsetWidth
    const thumbHeight = this.$verticalThumb.offsetHeight
    const thumbTop = this._getThumbTop()
    const thumbLeft = this._getThumbLeft()

    const verticalTrackSpace = trackHeight - thumbHeight
    const verticalContentSpace = contentHeight - viewportHeight
    const contentOffsetTop = (thumbTop / verticalTrackSpace) * verticalContentSpace

    const horizontalTrackSpace = trackWidth - thumbWidth
    const horizontalContentSpace = contentWidth - viewportWidth
    const contentOffsetLeft = (thumbLeft / horizontalTrackSpace) * horizontalContentSpace

    this.$viewport.scrollTop = contentOffsetTop
    this.$viewport.scrollLeft = contentOffsetLeft
  }

  _getThumbTop() {
    return parseFloat((this.$verticalThumb.style.transform ?? '').slice(11, -3)) || 0
  }

  _getThumbLeft() {
    return parseFloat((this.$horizontalThumb.style.transform ?? '').slice(11, -3)) || 0
  }

  // 顶部还可以滚动的距离
  getScrollableTop() {
    return this.$viewport.scrollTop
  }

  // 右边还可以滚动的距离
  getScrollableRight() {
    const $viewport = this.$viewport
    return $viewport.scrollWidth - ($viewport.scrollLeft + $viewport.clientWidth)
  }

  // 下方还可以滚动的距离
  getScrollableBottom() {
    const $viewport = this.$viewport
    return $viewport.scrollHeight - ($viewport.scrollTop + $viewport.clientHeight)
  }

  // 左边还可以滚动的距离
  getScrollableLeft() {
    this.$viewport.scrollLeft
  }

  _updateShadowState() {
    const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = this.$viewport

    this.canScrollLeft = scrollLeft > 0
    this.canScrollRight = scrollWidth - (scrollLeft + clientWidth) > 0
    this.canScrollTop = scrollTop > 0
    this.canScrollBottom = scrollHeight - (scrollTop + clientHeight) > 0
  }

  _udpateScrollbarState() {
    this.$layout.classList.toggle('vertical-scrollbar', this.hasVerticalScrollbar)
    this.$layout.classList.toggle('horizontal-scrollbar', this.hasHorizontalScrollbar)
  }

  _initMoveEvents() {
    let isVertical = false
    let startThumbPosition: number
    let startMousePosition: number

    const onMove: OnMove = ({ preventDefault, stopImmediatePropagation, current }) => {
      preventDefault()
      stopImmediatePropagation()

      if (isVertical) {
        const trackHeight = this.$vertical.clientHeight
        const thumbHeight = this.$verticalThumb.offsetHeight
        let thumbTop = startThumbPosition + (current.pageY - startMousePosition)
        if (thumbTop === 0 || thumbTop + thumbHeight === trackHeight) return
        if (thumbTop < 0) thumbTop = 0
        if (thumbTop + thumbHeight > trackHeight) thumbTop = trackHeight - thumbHeight
        this.$verticalThumb.style.transform = `translateY(${thumbTop}px)`
      } else {
        const trackWidth = this.$horizontal.clientWidth
        const thumbWidth = this.$horizontalThumb.offsetWidth
        let thumbLeft = startThumbPosition + (current.pageX - startMousePosition)
        if (thumbLeft === 0 || thumbLeft + thumbWidth === trackWidth) return
        if (thumbLeft < 0) thumbLeft = 0
        if (thumbLeft + thumbWidth > trackWidth) thumbLeft = trackWidth - thumbWidth
        this.$horizontalThumb.style.transform = `translateX(${thumbLeft}px)`
      }

      this._updateShadowState()
      this._udpateScrollbarState()
      this._updateScrollable()
    }

    const onEnd: OnEnd = () => {
      this.#draggingFlag = false

      dispatchEvent(this, 'bl:drag-scroll-end')
      this.$layout.classList.remove('dragging', 'dragging-vertical')
      this.$layout.classList.remove('dragging', 'dragging-horizontal')
    }

    const onStart: OnStart = ({ preventDefault, stopImmediatePropagation, $target, start }) => {
      preventDefault()
      stopImmediatePropagation()
      this.#draggingFlag = true

      isVertical = this.$vertical.contains($target)

      // 点击的是滑轨，将滑块移动到点击处（滑块中点对准点击处）
      if ($target.tagName !== 'B') {
        if (isVertical) {
          // 期望滑块的中点座标
          const middle = start.clientY - this.$vertical.getBoundingClientRect().top
          // 推算出 top 座标
          const thumbHeight = this.$verticalThumb.offsetHeight
          let thumbTop = middle - thumbHeight / 2
          if (thumbTop < 0) thumbTop = 0
          if (thumbTop + thumbHeight > this.$vertical.clientHeight) thumbTop = this.$vertical.clientHeight - thumbHeight
          this.$verticalThumb.style.transform = `translateY(${thumbTop}px)`
        } else {
          // 期望滑块的中点座标
          const center = start.clientX - this.$horizontal.getBoundingClientRect().left
          // 推算出滑块 left 座标
          const thumbWidth = this.$horizontalThumb.offsetWidth
          let thumbLeft = center - thumbWidth / 2
          if (thumbLeft < 0) thumbLeft = 0
          if (thumbLeft + thumbWidth > this.$horizontal.clientWidth)
            thumbLeft = this.$horizontal.clientWidth - thumbWidth
          this.$horizontalThumb.style.transform = `translateX(${thumbLeft}px)`
        }

        this._updateShadowState()
        this._udpateScrollbarState()
        this._updateScrollable()
        return
      }

      // 点击的是滑块，则启用拖动模式
      if (isVertical) {
        this.$layout.classList.add('dragging', 'dragging-vertical')
        startThumbPosition = this._getThumbTop()
        startMousePosition = start.pageY
      } else {
        this.$layout.classList.add('dragging', 'dragging-horizontal')
        startThumbPosition = this._getThumbLeft()
        startMousePosition = start.pageX
      }

      dispatchEvent(this, 'drag-scroll-start')
    }

    onDragMove(this.$vertical, {
      onStart,
      onMove,
      onEnd,
    })

    onDragMove(this.$horizontal, {
      onStart,
      onMove,
      onEnd,
    })
  }
}
