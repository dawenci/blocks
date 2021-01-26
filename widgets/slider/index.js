import { upgradeProperty } from '../core/upgradeProperty.js'
import { boolGetter, boolSetter, numGetter, numSetter } from '../core/property.js';
import { forEach, makeRgbaColor } from '../core/utils.js';
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


const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host, :host * {
    box-sizing: border-box;
    user-select: none;
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

  .slider {
    position: relative;
    width: 100%;
    height: 18px;
    border-radius: 7px;
    cursor: default;
    border: 0 none;
    /* padding，容纳 shadow */
    padding: 2px;
  }

  :host([vertical]) {
    height: 118px;
    width: auto;
  }
  :host([vertical]) .slider {
    height: 100%;
    width: 18px;
  }

  /* 滑轨，button 的容器 */
  .slider .track {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  /* 滑轨的背景，长或宽需要减去 button 的半径 */
  .slider .track:after {
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
  :host([vertical]) .slider .track:after {
    width: 4px;
    height: auto;
    top: 7px;
    right: 0;
    bottom: 7px;
    left: 0;
  }

  /* 按钮 */
  .slider .button {
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
    border-radius: 50%;
    border: 2px solid ${$borderColorBase};
    background: #fff;
    transition: border-color .2s;
  }
  :host([vertical]) .slider .button {
    top: auto;
    right: 0;
  }

  .slider .button:hover,
  .slider .button:focus,
  .slider .button.active {
    z-index: 2;
    border-color: ${$colorPrimary};
    outline: 0 none;
    box-shadow: 0 0 2px 2px ${makeRgbaColor($colorPrimary, .5)};
  }

  :host([disabled]) .slider .button,
  :host([disabled]) .slider .button:hover,
  :host([disabled]) .slider .button:focus,
  :host([disabled]) .slider .button:active {
    border: 2px solid ${$borderColorBase};
    box-shadow: none;
  }
  </style>

  <div class="slider">
    <div class="track">
      <span tabindex="0" class="button"></span>
      <span tabindex="0" class="button"></span>
    </div>
  </div>
`

class BlocksSlider extends HTMLElement {
  static get observedAttributes() {
    return [ 'value', 'max', 'min', 'step', 'range', 'vertical', 'disabled', 'size' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})

    const fragment = template.content.cloneNode(true)
    shadowRoot.appendChild(fragment)
    this.slider = shadowRoot.querySelector('.slider')
  }

  get value() {
    const attrValue = this.getAttribute('value')?.trim?.()
    if (!this.range) {
      const value = parseInt(attrValue, 10)
      return value == value ? value : 0
    }
    return /\d+\,?\d+/.test(attrValue)
      ? attrValue.split(',').map(n => parseInt(n, 10))
      : [0, 0]
  }

  set value(value) {
    if (!this.range) {
      if (!this._isValidNumber(value)) return
    }
    else if (!Array.isArray(value) || value.length !== 2 || value.some(n => !this._isValidNumber(n))) return
    this.setAttribute('value', value)
  }

  get min() {
    return minGetter(this)
  }

  set min(value) {
    minSetter(this, value)
  }

  get max() {
    return maxGetter(this)
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

  _isValidNumber(n) {
    return typeof n === 'number'
      && n === n
      && n >= this.min
      && n <= this.max
  }

  _getTrackSize() {
    const track = this.slider.querySelector('.track')
    return parseFloat(getComputedStyle(track).getPropertyValue(this.vertical ? 'height' : 'width'))
  }

  _updateButton() {
    if (this.range) {
      this.slider.querySelectorAll('.button').forEach(button => button.style.display = 'block')
    }
    else {
      this.slider.querySelector('.button').style.display = 'none'
    }
  }

  _updateTabindex() {
    const buttons = this.shadowRoot.querySelectorAll('.button')
    if (this.disabled) {
      forEach(buttons, button => {
        button.removeAttribute('tabindex')
      })
    }
    else {
      forEach(buttons, button => {
        button.setAttribute('tabindex', '0')
      })
    }
  }

  connectedCallback() {
    setRole(this, 'slider')
    setDisabled(this, this.disabled)
    this._updateTabindex()

    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    this._updateButton()

    {
      let pointStart = null
      let positionStart = null
      let button = null

      const setPosition = (value) => {
        const trackSize = this._getTrackSize()
        if (value < 0) {
          value = 0
        }
        else if (value > (trackSize - 14)) {
          value = trackSize - 14
        }
        const axis = this.vertical ? 'bottom' : 'left'
        button.style[axis] = `${value}px`
      }
  
      const move = (e) => {
        const offset = this.vertical ? pointStart - e.pageY : e.pageX - pointStart
        let position = positionStart + offset
        setPosition(position)
      }
  
      const up = () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
        button.classList.remove('active')
        positionStart = null
        pointStart = null
        button = null
      }
  
      this.slider.onmousedown = (e) => {
        if (this.disabled) {
          e.preventDefault()
          e.stopPropagation()
          return
        }

        // 点击轨道，则先将滑块（第二个）移动过去，再记录移动初始信息
        if (e.target.classList.contains('track')) {
          button = this.slider.querySelectorAll('.button')[1]
          button.classList.add('active')

          const rect = this.slider.querySelector('.track').getBoundingClientRect()
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
        else if (e.target.classList.contains('button')) {
          button = e.target
          button.classList.add('active')
          pointStart = this.vertical ? e.pageY : e.pageX
          positionStart = parseFloat(button.style[this.vertical ? 'bottom' : 'left']) || 0
          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        }
      }
    }
  }

  disconnectedCallback() {
    this.slider.onmousedown = null
  }

  attributeChangedCallback(name, oldValue, newValue) {    
    if (name === 'disabled') {
      setDisabled(this, this.disabled)
      this._updateTabindex()
    }
    
    if (name === 'range') {
      this._updateButton()
    }
  }
}

if (!customElements.get('blocks-slider')) {
  customElements.define('blocks-slider', BlocksSlider)
}
