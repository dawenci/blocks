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

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
   ] : [0,0,0]
}
function hexToRgba(hex, opacity) {
  return `rgba(${hexToRgb(hex).concat([opacity]).join(',')})`
}

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
    box-shadow: 0 0 2px 2px ${hexToRgba($colorPrimary, .5)};
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
    const attrValue = this.getAttribute('value')
    if (this.range) {
      if (/\[\s*\d+(\s*\,\s*\d+)\s*\]/.test(attrValue.trim())) {
        return JSON.parse(attrValue)
      }
      else {
        return [0, 0]
      }
    } 
    else {
      const value = parseInt(attrValue, 10)
      return value == value ? value : 0
    }
  }

  set value(value) {
    this.setAttribute('value', value)
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } 
    else {
      this.setAttribute('disabled', '')
    }
  }

  get range() {
    return this.getAttribute('range') !== null
  }

  set range(value) {
    if (value === null || value === false) {
      this.removeAttribute('range')
    } 
    else {
      this.setAttribute('range', '')
    }
  }

  get vertical() {
    return this.getAttribute('vertical') !== null
  }

  set vertical(value) {
    if (value === null || value === false) {
      this.removeAttribute('vertical')
    } 
    else {
      this.setAttribute('vertical', '')
    }
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

  connectedCallback() {
    this.setAttribute('role', 'slider')
    this.setAttribute('tabindex', '0')

    this.constructor.observedAttributes.forEach(attr => {
      this._upgradeProperty(attr)
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
    if (this.disabled) {
      this.removeAttribute('tabindex')
      this.setAttribute('aria-disabled', 'true')
    }
    else {
      this.setAttribute('tabindex', '0')
      this.setAttribute('aria-disabled', 'false')
    }
    if (name === 'range') {
      this._updateButton()
    }
  }

  // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
  // 属性可能在 prototype 还没有链接到该实例前就设置了，
  // 在用户使用一些框架加载组件时，可能回出现这种情况，
  // 因此需要进行属性升级，确保 setter 逻辑能工作，
  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop]
      delete this[prop]
      this[prop] = value
    }
  }
}

if (!customElements.get('blocks-slider')) {
  customElements.define('blocks-slider', BlocksSlider)
}
