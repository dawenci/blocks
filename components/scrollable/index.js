import { onWheel } from '../../common/onWheel.js'
import { setStyles } from '../../common/style.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __transition_duration } from '../../theme/var.js'

const TEMPLATE_CSS = `<style>
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
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#horizontal,
#vertical {
  opacity: 0;
  display: block;
  box-sizing: border-box;
  position: absolute;
  border-radius: 3px;
  user-select: none;
  transition: opacity var(--transition-duration, ${__transition_duration});
}

#horizontal b,
#vertical b {
  display: block;
  box-sizing: border-box;
  position: absolute;
  border-radius: 3px;
  background: rgba(0,0,0, .25);
  user-select: none;
  transition: opacity var(--transition-duration, ${__transition_duration});
}

#horizontal b:hover,
#vertical b:hover,
#layout.dragging-horizontal b {
  background: rgba(0,0,0, .5);
}

#horizontal {
  top: auto;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 6px;
}

#vertical {
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  width: 6px;
  height: 100%;
}

#horizontal b {
  height: 100%;
}

#vertical b {
  width: 100%;
}

#layout.dragging-horizontal #horizontal,
#layout.dragging-horizontal #vertical,
#layout.dragging-vertical #horizontal,
#layout.dragging-vertical #vertical,
#layout:hover #horizontal,
#layout:hover #vertical {
  opacity: 1;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <div id="viewport">
    <slot></slot>
  </div>
  <div id="horizontal"><b></b></div>
  <div id="vertical"><b></b></div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksScrollable extends HTMLElement {
  static get observedAttributes() {
    return []
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

    onWheel(this.$viewport, (event, data) => {
      event.preventDefault()
      // 触顶
      if (data.pixelY < 0 && this.$viewport.scrollTop === 0) return
      // 触底
      if (data.pixelY > 0 && this.$viewport.scrollHeight - this.$viewport.scrollTop - this.$viewport.clientHeight === 0) return

      // 设置滚动距离，渲染更新
      this.$viewport.scrollTop += data.pixelY

      this._updateScrollbar()
    })

    this._initMoveEvents()
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

    const trackWidth = this.$horizontal.clientWidth
    const trackHeight = this.$vertical.clientHeight

    const contentRightSpace = contentWidth - contentLeftSpace - viewportWidth
    const contentBottomSpace = contentHeight - contentTopSpace - viewportHeight

    // 滚动条尺寸（不小于 20px）
    const thumbHeight = Math.max(Math.round((viewportHeight / contentHeight) * trackHeight), 20)
    const thumbWidth = Math.max(Math.round((viewportWidth / contentWidth) * trackWidth), 20)
    
    // 滚动条上右下左距离
    const verticalTrackSpace = trackHeight - thumbHeight
    const horizontalTrackSpace = trackWidth - thumbWidth
    const thumbTop = verticalTrackSpace * (contentTopSpace / (contentTopSpace + contentBottomSpace))
    const thumbLeft = horizontalTrackSpace * (contentLeftSpace / (contentLeftSpace + contentRightSpace))

    setStyles(this.$verticalThumb, {
      top: `${thumbTop}px`,
      height: `${thumbHeight}px`
    })

    setStyles(this.$horizontalThumb, {
      left: `${thumbLeft}px`,
      width: `${thumbWidth}px`
    })
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
    const thumbTop = parseFloat(this.$verticalThumb.style.top)
    const thumbLeft = parseFloat(this.$horizontalThumb.style.left)

    const verticalTrackSpace = trackHeight - thumbHeight
    const verticalContentSpace = contentHeight - viewportHeight
    const contentOffsetTop = (thumbTop / verticalTrackSpace) * verticalContentSpace

    const horizontalTrackSpace = trackWidth - thumbWidth
    const horizontalContentSpace = contentWidth - viewportWidth
    const contentOffsetLeft = (thumbLeft / horizontalTrackSpace) * horizontalContentSpace

    this.$viewport.scrollTop = contentOffsetTop
    this.$viewport.scrollLeft = contentOffsetLeft
  }

  _initMoveEvents() {
    let isVertical = false
    let startBarPosition
    let startMousePosition

    const move = (e) => {
      e.preventDefault()
      e.stopImmediatePropagation()

      if (isVertical) {
        const scrollableHeight = this.$viewport.clientHeight
        const barHeight = this.$verticalThumb.offsetHeight
        let barTop = startBarPosition + (e.pageY - startMousePosition)
        if (barTop === 0 || barTop + barHeight === scrollableHeight) return
        if (barTop < 0) barTop = 0
        if (barTop + barHeight > scrollableHeight) barTop = scrollableHeight - barHeight
        this.$verticalThumb.style.top = barTop + 'px'
      }
      else {
        const scrollableWidth = this.$viewport.clientWidth
        const barWidth = this.$horizontalThumb.offsetWidth
        let barLeft = startBarPosition + (e.pageX - startMousePosition)
        if (barLeft === 0 || barLeft + barWidth === scrollableWidth) return
        if (barLeft < 0) barLeft = 0
        if (barLeft + barWidth > scrollableWidth) barLeft = scrollableWidth - barWidth
        this.$horizontalThumb.style.left = barLeft + 'px'
      }

      this._updateScrollable()
    }

    const up = (e) => {
      e.preventDefault()
      e.stopImmediatePropagation()

      removeEventListener('mousemove', move)
      removeEventListener('mouseup', up)
      this.$layout.classList.remove('dragging-vertical')
      this.$layout.classList.remove('dragging-horizontal')
    }

    const down = (e) => {
      e.preventDefault()
      e.stopImmediatePropagation()

      isVertical = this.$vertical.contains(e.target)

      // 点击的是滑轨，将滑块移动到点击处（滑块中点对准点击处）
      if (e.target.tagName !== 'B') {
        if (isVertical) {
          // 期望滑块的中点座标
          const middle = e.clientY - this.$vertical.getBoundingClientRect().top
          // 推算出 top 座标
          const height = this.$verticalThumb.offsetHeight
          let top = middle - height / 2
          if (top < 0) top = 0
          if (top + height > this.$vertical.clientHeight) top = this.$vertical.clientHeight - height
          this.$verticalThumb.style.top = top + 'px'
        }
        else {
          // 期望滑块的中点座标
          const center = e.clientX - this.$horizontal.getBoundingClientRect().left
          // 推算出滑块 left 座标
          const width = this.$horizontalThumb.offsetWidth
          let left = center - width / 2
          if (left < 0) left = 0
          if (left + width > this.$horizontal.clientWidth) left = this.$horizontal.clientWidth - width
          this.$horizontalThumb.style.left = left + 'px'
        }

        this._updateScrollable()
        return
      }

      // 点击的是滑块，则启用拖动模式
      if (isVertical) {
        this.$layout.classList.add('dragging-vertical')
        const style = getComputedStyle(this.$verticalThumb)
        startBarPosition = parseFloat(style.top)
        startMousePosition = e.pageY
      }
      else {
        this.$layout.classList.add('dragging-horizontal')
        const style = getComputedStyle(this.$horizontalThumb)
        startBarPosition = parseFloat(style.left)
        startMousePosition = e.pageX
      }
      addEventListener('mousemove', move)
      addEventListener('mouseup', up)
    }

    this.$vertical.onmousedown = down
    this.$horizontal.onmousedown = down
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
