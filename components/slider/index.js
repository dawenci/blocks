import { upgradeProperty } from '../../common/upgradeProperty.js'
import { boolGetter, boolSetter, intGetter, intSetter, numGetter, numSetter } from '../../common/property.js';
import { forEach, makeRgbaColor, round } from '../../common/utils.js';
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
} from '../theme/var.js'
import { setDisabled, setRole } from '../../common/accessibility.js';
import { disabledGetter, disabledSetter } from '../../common/propertyAccessor.js';

const [minGetter, maxGetter] = ['min', 'max'].map(prop => numGetter(prop))
const [minSetter, maxSetter] = ['min', 'max'].map(prop => numSetter(prop))
const [rangeGetter, verticalGetter] = ['disabled', 'range', 'vertical'].map(prop => boolGetter(prop))
const [rangeSetter, verticalSetter] = ['disabled', 'range', 'vertical'].map(prop => boolSetter(prop))
const roundGetter = intGetter('round')
const roundSetter = intSetter('round')

const TEMPLATE_CSS = `
<style>
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
  background-color: rgba(0,0,0,.1);
  border-radius: 2px;
  overflow: hidden;
  transition: all .2s;
}
:host([vertical]) #layout #track:after {
  width: 4px;
  height: auto;
  top: 7px;
  right: 0;
  bottom: 7px;
  left: 0;
}

/* 按钮 */
#layout button {
  box-sizing: border-box;
  overflow: hidden;
  display: block;
  position: absolute;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 14px;
  height: 14px;
  margin: auto;
  padding: 0;
  border-radius: 50%;
  border: 2px solid var(--border-color-base, ${__border_color_base});
  background: #fff;
  transition: border-color .2s;
}
:host([vertical]) #layout button {
  top: auto;
  right: 0;
}

#layout button:hover,
#layout button:focus,
#layout button.active {
  z-index: 2;
  border-color: var(--color-primary, ${__color_primary});
  outline: 0 none;
  box-shadow: 0 0 2px 2px ${makeRgbaColor(__color_primary, .5)};
}

:host([disabled]) #layout button,
:host([disabled]) #layout button:hover,
:host([disabled]) #layout button:focus,
:host([disabled]) #layout button:active {
  border: 2px solid var(--border-color-base, ${__border_color_base});
  box-shadow: none;
}
</style>
`
const TEMPLATE_HTML = `
<div id="layout">
  <div id="track">
    <button></button>
  </div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksSlider extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'max', 'min', 'step', 'range', 'vertical', 'disabled', 'size', 'round']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const fragment = template.content.cloneNode(true)
    shadowRoot.appendChild(fragment)
    this.$layout = shadowRoot.getElementById('layout')
    this.$track = shadowRoot.getElementById('track')
    this.$point = shadowRoot.querySelector('button')
  }

  get value() {
    const attrValue = this.getAttribute('value')?.trim?.()
    if (!this.range) {
      const value = parseFloat(attrValue)
      return value == value ? value : 0
    }
    const values = (attrValue || '').split(',').map(n => parseFloat(n))
    return values.every(n => this._isValidNumber(n)) ? values : [0, 0]
  }

  set value(value) {
    if (this.range) {
      if (!Array.isArray(value)) return
      if (value.some(n => !this._isValidNumber(n))) return
      if (value.every((n, i) => n === this.value[i])) return
      value = value.slice()
      value.sort()
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
    const $buttons = this.shadowRoot.querySelectorAll('button')
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

  _positionRange() {
    return [0, this._getTrackSize() - 14]
  }

  _normalizePosition(position) {
    const positionRange = this._positionRange()
    if (position < positionRange[0]) {
      position = positionRange[0]
    }
    else if (position > positionRange[1]) {
      position = positionRange[1]
    }
    return position
  }

  _getPointPosition($point) {
    return parseFloat($point.style[this.vertical ? 'bottom' : 'left']) || 0
  }

  _setPointPosition($point, value) {
    const axis = this.vertical ? 'bottom' : 'left'
    $point.style[axis] = `${value}px`
  }

  _getPointValue($point) {
    const total = this._getTrackSize() - 14
    const pos = parseFloat($point.style[this.vertical ? 'bottom' : 'left']) || 0
    const value = this.min + (this.max - this.min) * (pos / total)
    return round(value, this.round)
  }

  _setPointValue($point, value) {
    if (this._isValidNumber(value)) {
      value = round(value, this.round)
      if (this.range) {
        const values = this.value.slice()
        if ($point === this.$point) {
          values[0] = value
        }
        else {
          values[1] = value
        }
        this.value = values
      }
      else {
        this.value = value
      }
    }
  }

  _setPointPositionByValue($point, value) {
    if (this._isValidNumber(value)) {
      value = round(value, this.round)
      const total = this._getTrackSize() - 14
      const pos = total * ((value - this.min) / (this.max - this.min))
      $point.style[this.vertical ? 'bottom' : 'left'] = pos + 'px'
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
  }

  _updateValue() {
    if (this.range) {
      const value1 = this._getPointValue(this.$point)
      const value2 = this._getPointValue(this.$point2)
      const value = [round(value1, this.round), round(value2, this.round)]
      value.sort()
      this.value = value
    }
    else {
      this.value = this._getPointValue(this.$point)
    }
  }

  render() {
    if (this.range) {
      this.$point2 = this.$point2 ?? document.createElement('button')
      this.$track.appendChild(this.$point2)
    }
    else {
      if (this.$point2) {
        this.$track.removeChild(this.$point2)
        this.$point2 = null
      }
    }
  }

  connectedCallback() {
    setRole(this, 'slider')
    setDisabled(this, this.disabled)
    this._updateTabindex()

    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    this.render()
    this._updatePositionByValue()

    {
      this._dragging = false
      let moveStart = null
      let positionStart = null
      let $active = null

      const swap = ($point) => {
        const $p2 = $point === this.$point ? this.$point2 : this.$point
        this._setPointPosition($point, this._getPointPosition($p2))
        $point.classList.remove('active')
        $point.blur()
        $p2.classList.add('active')
        $p2.focus()
        $active = $p2
        this._updateValue()
      }
      
      const move = (e) => {
        const moveOffset = this.vertical ? moveStart - e.pageY : e.pageX - moveStart
        let position = this._normalizePosition(positionStart + moveOffset)
        if (this.range) {
          if ($active === this.$point && position > this._getPointPosition(this.$point2)) {
            swap($active)
          }
          else if ($active === this.$point2 && position < this._getPointPosition(this.$point)) {
            swap($active)
          }
        }
        this._setPointPosition($active, position)
        this._updateValue()
      }

      const up = () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
        $active.classList.remove('active')
        positionStart = null
        moveStart = null
        $active = null
        this._updateValue()
        this._dragging = false
      }

      this.$track.onmousedown = (e) => {
        if (this.disabled) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        this._dragging = true

        // 点击轨道，则先将滑块移动过去，再记录移动初始信息
        if (e.target === this.$track) {
          moveStart = this.vertical ? e.pageY : e.pageX
          const rect = this.$track.getBoundingClientRect()
          if (this.vertical) {
            positionStart = this._getTrackSize() - (this.vertical ? e.clientY - rect.y : e.clientX - rect.x) - 7
          }
          else {
            positionStart = (this.vertical ? e.clientY - rect.y : e.clientX - rect.x) - 7
          }
          positionStart = this._normalizePosition(positionStart)

          // 如果是区间，则需要确定移动哪个控制点
          // 1. 点击的是 min 点的左侧，则移动 min 点
          // 2. 点击的是 max 点的右侧，则移动 max 点
          // 3. 点击的是两点之间，则移动接近点击位置的那个点
          if (this.range) {
            const pos1 = this._getPointPosition(this.$point)
            const pos2 = this._getPointPosition(this.$point2)
            $active = positionStart < pos1 ? this.$point
              : positionStart > pos2 ? this.$point2
              : pos2 - positionStart > positionStart - pos1 ? this.$point
              : this.$point2
          }
          else {
            $active = this.$point
          }

          $active.classList.add('active')

          this._setPointPosition($active, positionStart)
          this._updateValue()

          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        }

        // 点击的是滑块，记录移动初始信息
        else if (e.target === this.$point || e.target === this.$point2) {
          $active = e.target
          $active.classList.add('active')
          moveStart = this.vertical ? e.pageY : e.pageX
          positionStart = parseFloat($active.style[this.vertical ? 'bottom' : 'left']) || 0
          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        }
      }
    }
  }

  disconnectedCallback() {
    this.$layout.onmousedown = null
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      setDisabled(this, this.disabled)
      this._updateTabindex()
    }

    if (name === 'value') {
      if (!this._dragging) {
        this._updatePositionByValue()
      }
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    }

    this.render()
  }
}

if (!customElements.get('blocks-slider')) {
  customElements.define('blocks-slider', BlocksSlider)
}
