import { sizeObserve } from '../../common/sizeObserve.js'
import { dispatchEvent } from '../../common/event.js'
import { setStyles } from '../../common/style.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __transition_duration } from '../../theme/var.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { onDragMove } from '../../common/onDragMove.js'

const TEMPLATE_CSS = `<style>
::-webkit-scrollbar {
  display: none;
}
:host {
  box-sizing: border-box;
  display: block;
}

#layout {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.track {
  opacity: 0;
  display: block;
  box-sizing: border-box;
  position: absolute;
  border-radius: 3px;
  user-select: none;
  transition: opacity var(--transition-duration, ${__transition_duration});
  backgrond: var(--bg-track, transparent);
  cursor: default;
}
#horizontal {
  top: auto;
  right: 6px;
  left: 0;
  bottom: 0;
  width: calc(100% - 6px);
  height: 6px;
}
#vertical {
  top: 0;
  right: 0;
  bottom: 6px;
  left: auto;
  width: 6px;
  height: calc(100% - 6px);
}

.thumb {
  display: block;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
  background: var(--bg-thumb, #000);
  user-select: none;
  transition: opacity var(--transition-duration, ${__transition_duration});
  opacity: .3;
}
#horizontal .thumb {
  height: 100%;
}
#vertical .thumb {
  width: 100%;
}
.thumb:hover,
.dragging-horizontal #horizontal .thumb,
.dragging-vertical #vertical .thumb {
  opacity: .5;
}

#layout.dragging .track,
#layout:hover .track {
  opacity: 1;
}

.top,
.right,
.bottom,
.left {
  display: none;
  position: absolute;
  pointer-events: none;
}
:host([shadow]) .shadow-top .top {
  display: block;
  height: 10px;
  top: -10px;
  right: 0;
  left: 0;
  box-shadow: 0 3px 7px rgba(0,0,0,.2);
}
:host([shadow]) .shadow-right .right {
  display: block;
  width: 10px;
  top: 0;
  bottom: 0;
  right: -10px;
  box-shadow: -3px 0px 7px rgba(0,0,0,.2);
}
:host([shadow]) .shadow-bottom .bottom {
  display: block;
  height: 10px;
  right: 0;
  bottom: -10px;
  left: 0;
  box-shadow: 0 -3px 7px rgba(0,0,0,.2);
}
:host([shadow]) .shadow-left .left {
  display: block;
  width: 10px;
  top: 0;
  bottom: 0;
  left: -10px;
  box-shadow: 3px 0px 7px rgba(0,0,0,.2);
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <div id="viewport">
    <slot></slot>
  </div>
  <div class="track" id="horizontal"><b class="thumb"></b></div>
  <div class="track" id="vertical"><b class="thumb"></b></div>
  <b class="top"></b>
  <b class="right"></b>
  <b class="bottom"></b>
  <b class="left"></b>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksScrollable extends HTMLElement {
  static get observedAttributes() {
    return ['shadow']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$viewport = shadowRoot.getElementById('viewport')
    this.$horizontal = shadowRoot.getElementById('horizontal')
    this.$horizontalThumb = this.$horizontal.firstElementChild
    this.$vertical = shadowRoot.getElementById('vertical')
    this.$verticalThumb = this.$vertical.firstElementChild

    this.$layout.onmouseenter = () => {
      this._updateScrollbar()
    }

    sizeObserve(this.$layout, () => {
      this._updateScrollbar()
      dispatchEvent(this, 'resize')
    })

    this._initMoveEvents()

    this.$viewport.onscroll = () => {
      if (!this._dragging) {
        this._updateScrollbar()
      }
      dispatchEvent(this, 'scroll')
    }
  }

  get shadow() {
    return boolGetter('shadow')(this)
  }

  set shadow(value) {
    boolSetter('shadow')(this, value)
  }

  get scrollTop() {
    return this.$viewport.scrollTop
  }

  set scrollTop(value) {
    this.$viewport.scrollTop = value
    this._updateScrollbar()
  }

  render() {}

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
        width: `${thumbWidth}px`
      })
      this._updateShadow()
    }
    else {
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
        height: `${thumbHeight}px`
      })
      this._updateShadow()
    }
    else {
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

  _updateShadow() {
    const trackWidth = this.$horizontal.clientWidth
    const trackHeight = this.$vertical.clientHeight
    const thumbLeft = this._getThumbLeft()
    const thumbTop = this._getThumbTop()
    const thumbWidth = this.$horizontalThumb.offsetWidth
    const thumbHeight = this.$verticalThumb.offsetHeight
    this.$layout.classList.toggle('shadow-left', thumbLeft > 0)
    this.$layout.classList.toggle('shadow-right', trackWidth - thumbWidth - thumbLeft > 0)
    this.$layout.classList.toggle('shadow-top', thumbTop > 0)
    this.$layout.classList.toggle('shadow-bottom', trackHeight - thumbHeight - thumbTop > 0)
  }

  _initMoveEvents() {
    let isVertical = false
    let startThumbPosition
    let startMousePosition

    const onMove = ({ preventDefault, stopImmediatePropagation, current }) => {
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
      }
      else {
        const trackWidth = this.$horizontal.clientWidth
        const thumbWidth = this.$horizontalThumb.offsetWidth
        let thumbLeft = startThumbPosition + (current.pageX - startMousePosition)
        if (thumbLeft === 0 || thumbLeft + thumbWidth === trackWidth) return
        if (thumbLeft < 0) thumbLeft = 0
        if (thumbLeft + thumbWidth > trackWidth) thumbLeft = trackWidth - thumbWidth
        this.$horizontalThumb.style.transform = `translateX(${thumbLeft}px)`
      }

      this._updateShadow()
      this._updateScrollable()
    }

    const onEnd = () => {
      this._dragging = false

      dispatchEvent(this, 'drag-scroll-end')
      this.$layout.classList.remove('dragging', 'dragging-vertical')
      this.$layout.classList.remove('dragging', 'dragging-horizontal')
    }

    const onStart = ({ preventDefault, stopImmediatePropagation, $target, start }) => {
      preventDefault()
      stopImmediatePropagation()
      this._dragging = true

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
        }
        else {
          // 期望滑块的中点座标
          const center = start.clientX - this.$horizontal.getBoundingClientRect().left
          // 推算出滑块 left 座标
          const thumbWidth = this.$horizontalThumb.offsetWidth
          let thumbLeft = center - thumbWidth / 2
          if (thumbLeft < 0) thumbLeft = 0
          if (thumbLeft + thumbWidth > this.$horizontal.clientWidth) thumbLeft = this.$horizontal.clientWidth - thumbWidth
          this.$horizontalThumb.style.transform = `translateX(${thumbLeft}px)`
        }

        this._updateShadow()
        this._updateScrollable()
        return
      }

      // 点击的是滑块，则启用拖动模式
      if (isVertical) {
        this.$layout.classList.add('dragging', 'dragging-vertical')
        startThumbPosition = this._getThumbTop()
        startMousePosition = start.pageY
      }
      else {
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

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    this.render()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}
}

if (!customElements.get('bl-scrollable')) {
  customElements.define('bl-scrollable', BlocksScrollable)
}
