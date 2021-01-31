import { upgradeProperty } from '../core/upgradeProperty.js'
import { boolGetter, boolSetter, intGetter, intSetter, numGetter, numSetter } from '../core/property.js';
import { forEach, makeRgbaColor, round } from '../core/utils.js';
import { dispatchEvent } from '../core/event.js'
import {
  $fontFamily,
  $radiusSmall,
  $colorPrimary,
  $colorPrimaryLight,
  $colorPrimaryDark,
  $colorDisabled,
  $borderColorBase,
  $borderColorDisabled,
  $backgroundColorDisabled,
  $transitionDuration,
} from '../theme/var.js'
import { setDisabled, setRole } from '../core/accessibility.js';

const [minGetter, maxGetter] = ['min', 'max'].map(prop => numGetter(prop))
const [minSetter, maxSetter] = ['min', 'max'].map(prop => numSetter(prop))
const [disabledGetter, rangeGetter, verticalGetter] = ['disabled', 'range', 'vertical'].map(prop => boolGetter(prop))
const [disabledSetter, rangeSetter, verticalSetter] = ['disabled', 'range', 'vertical'].map(prop => boolSetter(prop))
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
  transition: color ${$transitionDuration}, border-color ${$transitionDuration};
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
  border: 2px solid ${$borderColorBase};
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
  border-color: ${$colorPrimary};
  outline: 0 none;
  box-shadow: 0 0 2px 2px ${makeRgbaColor($colorPrimary, .5)};
}

:host([disabled]) #layout button,
:host([disabled]) #layout button:hover,
:host([disabled]) #layout button:focus,
:host([disabled]) #layout button:active {
  border: 2px solid ${$borderColorBase};
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
    if (!this.range) {
      if (!this._isValidNumber(value)) return
    }
    else if (!Array.isArray(value) || value.length !== 2 || value.some(n => !this._isValidNumber(n))) return
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

  _getPointValue($point) {
    const total = this._getTrackSize() - 14
    const pos = parseInt($point.style[this.vertical ? 'bottom' : 'left']) || 0
    const ratio = pos / total
    const value = this.min + (this.max - this.min) * ratio
    
    return round(value, this.round)
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
    dispatchEvent(this, 'change', { detail: { value: this.value } })
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
    if (this.value) {
      this._updateValue()
    }

    {
      let pointStart = null
      let positionStart = null
      let $lastActiveButton = null
      let $button = null

      const setPosition = (value) => {
        const trackSize = this._getTrackSize()
        if (value < 0) {
          value = 0
        }
        else if (value > (trackSize - 14)) {
          value = trackSize - 14
        }
        const axis = this.vertical ? 'bottom' : 'left'
        $button.style[axis] = `${value}px`

        this._updateValue()
      }

      const move = (e) => {
        const offset = this.vertical ? pointStart - e.pageY : e.pageX - pointStart
        let position = positionStart + offset
        setPosition(position)
      }

      const up = () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
        $button.classList.remove('active')
        positionStart = null
        pointStart = null
        $button = null
      }

      this.$layout.onmousedown = (e) => {
        if (this.disabled) {
          e.preventDefault()
          e.stopPropagation()
          return
        }

        // 点击轨道，则先将滑块移动过去，再记录移动初始信息
        if (e.target === this.$track) {
          $lastActiveButton = $button = $lastActiveButton ?? this.$point2 ?? this.$point
          $button.classList.add('active')

          const rect = this.$track.getBoundingClientRect()
          pointStart = this.vertical ? e.pageY : e.pageX

          if (this.vertical) {
            positionStart = this._getTrackSize() - (this.vertical ? e.clientY - rect.y : e.clientX - rect.x) - 7
          }
          else {
            positionStart = (this.vertical ? e.clientY - rect.y : e.clientX - rect.x) - 7
          }
          setPosition(positionStart)

          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        }

        // 点击的是滑块，记录移动初始信息
        else if (e.target === this.$point || e.target === this.$point2) {
          $lastActiveButton = $button = e.target
          $button.classList.add('active')
          pointStart = this.vertical ? e.pageY : e.pageX
          positionStart = parseFloat($button.style[this.vertical ? 'bottom' : 'left']) || 0
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

    this.render()
  }
}

if (!customElements.get('blocks-slider')) {
  customElements.define('blocks-slider', BlocksSlider)
}
