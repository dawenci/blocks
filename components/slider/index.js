import { upgradeProperty } from '../../common/upgradeProperty.js'
import { boolGetter, boolSetter, intGetter, intSetter, numGetter, numSetter } from '../../common/property.js'
import { forEach, round } from '../../common/utils.js'
import { rgbaFromHex } from '../../common/color.js'
import { dispatchEvent } from '../../common/event.js'
import {
  __font_family,
  __radius_small,
  __color_primary,
  __color_primary_light,
  __color_primary_dark,
  __fg_disabled,
  __border_color_base,
  __border_color_disabled,
  __bg_disabled,
  __transition_duration,
} from '../../theme/var.js'
import { setDisabled, setRole } from '../../common/accessibility.js';
import { disabledGetter, disabledSetter } from '../../common/propertyAccessor.js';
import { onDragMove } from '../../common/onDragMove.js'

const [minGetter, maxGetter] = ['min', 'max'].map(prop => numGetter(prop))
const [minSetter, maxSetter] = ['min', 'max'].map(prop => numSetter(prop))
const [rangeGetter, verticalGetter] = ['range', 'vertical'].map(prop => boolGetter(prop))
const [rangeSetter, verticalSetter] = ['range', 'vertical'].map(prop => boolSetter(prop))
const roundGetter = intGetter('round')
const roundSetter = intSetter('round')

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
:host, :host * {
  box-sizing: border-box;
}
:host {
  all: initial;
  contain: content;
  box-sizing: border-box;
  display: inline-block;
  align-items: center;
  text-align: center;
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
  font-size: 0;
  width: 118px;
  height: auto;
}
:host([vertical]) {
  height: 118px;
  width: auto;
}

#layout {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 18px;
  border-radius: 7px;
  cursor: default;
  border: 0 none;
  /* padding，容纳 shadow */
  padding: 2px;
  user-select: none;
}
:host([vertical]) #layout {
  height: 100%;
  width: 18px;
  transform: rotate(180deg);
}

/* 滑轨，button 的容器 */
#layout #track {
  box-sizing: border-box;
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
}

/* 滑轨的背景，长或宽需要减去 button 的半径 */
#layout #track:after {
  box-sizing: border-box;
  display: block;
  content: "";
  position: absolute;
  width: auto;
  height: 4px;
  z-index: 0;
  top: 0;
  right: 7px;
  bottom: 0;
  left: 7px;
  margin: auto;
  background-color: rgba(0,0,0,.05);
  border-radius: 2px;
  overflow: hidden;
  transition: all var(--transition-duration, ${__transition_duration});
}
:host([vertical]) #layout #track:after {
  width: 4px;
  height: auto;
  top: 7px;
  right: 0;
  bottom: 7px;
  left: 0;
}

:host(:not([disabled]):hover) #layout #track:after {
  background-color: rgba(0,0,0,.1);
}

/* 按钮 */
.point {
  box-sizing: border-box;
  overflow: hidden;
  display: block;
  position: absolute;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 14px;
  height: 14px;
  margin: auto 0;
  padding: 0;
  border-radius: 50%;
  border: 2px solid var(--color-primary, ${__color_primary});
  background: #fff;
  transition: border-color var(--transition-duration, ${__transition_duration});
}
:host([vertical]) .point {
  top: auto;
  right: 0;
  margin: 0 auto;
}

/* range 控制点之间连线 */
.line {
  position: absolute;
  z-index: 1;
  top: 5px;
  overflow: hidden;
  display: block;
  width: 4px;
  height: 4px;
  background: var(--color-primary, ${__color_primary});
  pointer-events: none;
}
:host([vertical]) .line {
  top: auto;
  left: 5px;
}
:host([disabled]) .line {
  display: none;
}

.point:hover,
.point:focus,
.point.active {
  z-index: 3;
  border-color: var(--color-primary, ${__color_primary});
  outline: 0 none;
  box-shadow: 0 0 2px 2px ${rgbaFromHex(__color_primary, .5)};
}

:host([disabled]) .point,
:host([disabled]) .point:hover,
:host([disabled]) .point:focus,
:host([disabled]) .point:active {
  border: 2px solid var(--border-color-base, ${__border_color_base});
  box-shadow: none;
}
`

const template = document.createElement('template')
template.innerHTML = `
<div id="layout">
  <div id="track">
    <button class="point"></button>
  </div>
</div>
`

export class BlocksSlider extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'max', 'min', 'range', 'size', 'step', 'round', 'value', 'vertical']
  }

  get value() {
    const attrValue = this.getAttribute('value')?.trim?.() ?? ''
    if (!this.range) {
      const value = parseFloat(attrValue)
      return value == value ? value : 0
    }
    const values = attrValue.split(',').map(n => parseFloat(n))
    return values.every(n => this._isValidNumber(n)) ? values.sort((a, b) => a - b) : [0, 0]
  }

  set value(value) {
    if (this.range) {
      if (!Array.isArray(value)) return
      if (value.some(n => !this._isValidNumber(n))) return
      if (value.every((n, i) => n === this.value[i])) return
      value = value.slice()
      value.sort((a, b) => a - b)
    }
    else {
      if (!this._isValidNumber(value) || this.value === value) return
    }
    this.setAttribute('value', value)
  }

  get min() {
    return minGetter(this) || 0
  }

  set min(value) {
    minSetter(this, value)
  }

  get max() {
    const max = maxGetter(this)
    return (Object.is(max, NaN) || max == null ) ? 100 : max
  }

  set max(value) {
    maxSetter(this, value)
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get range() {
    return rangeGetter(this)
  }

  set range(value) {
    rangeSetter(this, value)
  }

  get vertical() {
    return verticalGetter(this)
  }

  set vertical(value) {
    verticalSetter(this, value)
  }

  get round() {
    return roundGetter(this) || 2
  }

  set round(value) {
    roundSetter(this, value)
  }

  get p1() {
    return this._p1 || 0
  }

  set p1(value) {
    value = value < 0 ? 0 : value > 1 ? 1 : value
    if (!value) value = 0
    if (this._p1 !== value) {
      this._p1 = value

      this._updatePointPosition()
      this._updateValue()
    }
  }

  get p2() {
    return this._p2 || 0
  }

  set p2(value) {
    value = value < 0 ? 0 : value > 1 ? 1 : value
    if (!value) value = 0
    if (this._p2 !== value) {
      this._p2 = value

      this._updatePointPosition()
      this._updateValue()
    }
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(cssTemplate.cloneNode(true))
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$track = shadowRoot.getElementById('track')
    this.$point = shadowRoot.querySelector('.point')
  }

  render() {}

  connectedCallback() {
    setRole(this, 'slider')
    setDisabled(this, this.disabled)
    this._updateTabindex()

    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    this._updatePositionByValue()
    this._clearDragEvents = this._initDragEvents()
  }

  disconnectedCallback() {
    this._clearDragEvents()
    this.$layout.onmousedown = null
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'disabled') {
      setDisabled(this, this.disabled)
      this._updateTabindex()
    }


    if (attrName === 'range') {
      this._updatePoints()
    }

    if (attrName === 'value') {
      if (!this._dragging) {
        this._updatePositionByValue()
      }
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    }

    this.render()
  }

  _updatePoints() {
    if (this.range) {
      this.$point2 = this.$point2 ?? document.createElement('button')
      this.$point2.className = 'point'
      this.$range = this.$range ?? document.createElement('span')
      this.$range.className = 'line'
      this.$track.appendChild(this.$point2)
      this.$track.appendChild(this.$range)
    }
    else {
      if (this.$point2) {
        this.$track.removeChild(this.$point2)
        this.$point2 = null
      }
      if (this.$range) {
        this.$track.removeChild(this.$range)
        this.$range = null
      }
    }
  }

  _initDragEvents() {
    this._dragging = false
    let positionStart = null
    let $active = null

    const swap = ($p1, $p2) => {
      $active = $p2

      $p1.classList.remove('active')
      $p1.blur()

      $p2.classList.add('active')
      $p2.focus()

      const position = this._getPointPosition($p2)
      this[$p1 === this.$point ? 'p1' : 'p2'] = this._percentByPosition(position)
    }

    return onDragMove(this.$track, {
      onStart: ({ start, $target, stop }) => {
        if (this.disabled) {
          stop()
          return
        }

        // 点击轨道，则一次性移动滑块
        if ($target === this.$track) {
          const rect = this.$track.getBoundingClientRect()
          if (this.vertical) {
            positionStart = this._getTrackSize() - (start.clientY - rect.y) - 7
          }
          else {
            positionStart = (start.clientX - rect.x) - 7
          }

          // 如果是区间，则需要确定移动哪个控制点
          // 1. 点击的是 min 点的左侧，则移动 min 点
          // 2. 点击的是 max 点的右侧，则移动 max 点
          // 3. 点击的是两点之间，则移动接近点击位置的那个点
          if (this.range) {
            const pos1 = this._getPointPosition(this.$point)
            const pos2 = this._getPointPosition(this.$point2)
            const min = Math.min(pos1, pos2)
            const max = Math.max(pos1, pos2)
            $active = positionStart < min ? this.$point
              : positionStart > max ? this.$point2
              : Math.abs(max - positionStart) > Math.abs(positionStart - min) ? this.$point
              : this.$point2
          }
          else {
            $active = this.$point
          }

          this[$active === this.$point ? 'p1' : 'p2'] = this._percentByPosition(positionStart)

          positionStart = null
          $active = null
          this._dragging = false
          return stop()
        }

        // 点击的是滑块，记录移动初始信息
        if ($target === this.$point || $target === this.$point2) {
          this._dragging = true
          $active = $target
          $active.classList.add('active')
          positionStart = parseFloat($active.style[this.vertical ? 'top' : 'left']) || 0
          return
        }
      },

      onMove: ({ offset, preventDefault }) => {
        preventDefault()
        const moveOffset = this.vertical ? -offset.y : offset.x

        let position = positionStart + moveOffset
        if (this.range) {
          if ($active === this.$point && position > this._getPointPosition(this.$point2)) {
            swap(this.$point, this.$point2)
          }
          else if ($active === this.$point2 && position < this._getPointPosition(this.$point)) {
            swap(this.$point2, this.$point)
          }
        }

        this[$active === this.$point ? 'p1' : 'p2'] = this._percentByPosition(position)
      },

      onEnd: () => {
        $active.classList.remove('active')
        positionStart = null
        $active = null
        this._dragging = false

        // 确保 step
        this._updatePositionByValue()
      },
    })
  }

  _isValidNumber(n) {
    return typeof n === 'number'
      && n === n
      && n >= this.min
      && n <= this.max
  }

  _getTrackSize() {
    return parseFloat(getComputedStyle(this.$track).getPropertyValue(this.vertical ? 'height' : 'width'))
  }

  _updateTabindex() {
    const $buttons = this.shadowRoot.querySelectorAll('.point')
    if (this.disabled) {
      forEach($buttons, button => {
        button.removeAttribute('tabindex')
      })
    }
    else {
      forEach($buttons, button => {
        button.setAttribute('tabindex', '0')
      })
    }
  }

  _positionTotal() {
    return this._getTrackSize() - 14
  }

  _valueTotal() {
    return this.max - this.min
  }

  _percentByPosition(position) {
    return position / this._positionTotal()
  }

  _percentByValue(value) {
    return (value - this.min) / this._valueTotal()
  }

  _getPointValue($point) {
    const percent = ($point === this.$point ? this.p1 : this.p2)
    const offset = (this.max - this.min) * percent
    const value = this.min + offset
    return round(value, this.round)
  }

  _getPointPosition($point) {
    const max = this._positionTotal()
    return $point === this.$point ? max * this.p1 : max * this.p2
  }

  _updateValue() {
    const value = this.range ? [
        round(this._getPointValue(this.$point), this.round),
        round(this._getPointValue(this.$point2), this.round)
      ].sort((a, b) => a - b)
      : round(this._getPointValue(this.$point), this.round)
    this.value = value
  }

  _updatePointPosition() {
    const total = this._positionTotal()
    const p1 = total * this.p1
    this.$point.style[this.vertical ? 'top' : 'left'] = `${p1}px`
    if (this.range) {
      const p2 = total * this.p2
      this.$point2.style[this.vertical ? 'top' : 'left'] = `${p2}px`
      this._updateRangeLine()
    }
  }

  _updateRangeLine() {
    const max = this._positionTotal()
    const p1 = max * this.p1
    const p2 = max * this.p2
    if (this.vertical) {
      this.$range.style.top = p1 + 'px'
      this.$range.style.height = p2 - p1 + 'px'
    }
    else {
      this.$range.style.left = p1 + 'px'
      this.$range.style.width = p2 - p1 + 'px'
    }
  }

  _setPointPositionByValue($point, value) {
    if (this._isValidNumber(value)) {
      value = round(value, this.round)
      this[$point === this.$point ? 'p1' : 'p2'] = this._percentByValue(value)
    }
  }

  _updatePositionByValue() {
    if (this.value) {
      if (this.range) {
        this._setPointPositionByValue(this.$point, this.value[0])
        this._setPointPositionByValue(this.$point2, this.value[1])
      }
      else {
        this._setPointPositionByValue(this.$point, this.value)
      }
    }
    else {
      this._updatePointPosition()
    }
  }
}

if (!customElements.get('bl-slider')) {
  customElements.define('bl-slider', BlocksSlider)
}
