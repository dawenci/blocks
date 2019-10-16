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
    transition: color .2s, border-color .2s;
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
    return [ 'max', 'min', 'step', 'range', 'vertical', 'disabled', 'size' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
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

  _getSize() {
    const track = this.shadowRoot.querySelector('.track')
    return parseFloat(window.getComputedStyle(track)
      .getPropertyValue(this.vertical ? 'height' : 'width'))
  }

  _updateButton() {
    // TODO
  }

  connectedCallback() {
    this.setAttribute('role', 'slider')
    this.setAttribute('tabindex', '0')

    let pointStart = null
    let positionStart = null
    let button = null

    this._onMove = (e) => {
      const size = this._getSize()
      const offset = this.vertical
        ? pointStart - e.pageY
        : e.pageX - pointStart
      let position = positionStart + offset
      
      if (position < 0) {
        position = 0
      }
      else if (position > (size - 14)) {
        position = size - 14
      }

      const axis = this.vertical ? 'bottom' : 'left'
      button.style[axis] = `${position}px`
    }

    this._onEnd = (e) => {
      window.removeEventListener('mousemove', this._onMove)
      window.removeEventListener('mouseup', this._onEnd)
      button.classList.remove('active')
      positionStart = null
      pointStart = null
      button = null
    }

    this._onStart = (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      if (e.target.classList.contains('button')) {
        button = e.target
        button.classList.add('active')
        positionStart = parseFloat(button.style[this.vertical ? 'bottom' : 'left']) || 0
        pointStart = this.vertical ? e.pageY : e.pageX
        window.addEventListener('mousemove', this._onMove)
        window.addEventListener('mouseup', this._onEnd)
      }
    }

    this.shadowRoot.addEventListener('mousedown', this._onStart)
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('mousedown', this._onStart)
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
}

if (!customElements.get('blocks-slider')) {
  customElements.define('blocks-slider', BlocksSlider)
}
