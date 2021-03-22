import BlocksPopup from '../popup/index.js'
import BlocksInput from '../input/index.js'
import BlocksDate from '../date/index.js'
import BlocksTime from '../time/index.js'

import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_base, __color_primary, __height_base, __height_large, __height_small, __radius_base, __transition_duration } from '../../theme/var.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { dispatchEvent } from '../../common/event.js'
import { padLeft } from '../../common/utils.js'
import { boolSetter, enumGetter } from '../../common/property.js'

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  overflow: hidden;
  cursor: default;
  user-select: none;
  font-size: 14px;
  height: var(--height-base, ${__height_base});
  border: 1px solid var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
  background-color: #fff;
}
:host(:focus) {
  outline: 0 none;
}
:host(:focus-within) {
  border-color: var(--color-primary, ${__color_primary});
}
:host([size="small"]) {
  height: var(--height-small, ${__height_small});
  font-size: 12px;
}
:host([size="large"]) {
  height: var(--height-large, ${__height_large});
  font-size: 16px;
}


.prefix-icon, .suffix-icon {
  flex: 0 0 auto;
  display: block;
  position: relative;
  width: 16px;
  height: 16px;
  fill: #aaa;
  transition: transform var(--transition-duration, ${__transition_duration});
}
.prefix-icon {
  margin-left: 6px;
}
.suffix-icon {
  margin-right: 6px;
}
.prefix-icon > svg,
.suffix-icon > svg {
  width: 100%;
  height: 100%;
}

.clearable {
  flex: 0 0 auto;
  position: relative;
  display: block;
  width: 16px;
  height: 16px;
  margin: 0 6px 0 0;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 50%;
  background-color: transparent;
  opacity: 0;
  transform: rotate(45deg);
  transition: all var(--transition-duration, ${__transition_duration});
}
:host(:hover) .clearable {
  opacity: 1;
}
:host([clearable]:hover) .suffix-icon {
  visibility: hidden;
}
:host([suffix-icon]) .clearable {
  position: absolute;
  top: 0;
  right: 6px;
  bottom: 0;
  left: auto;
  margin: auto;
}

.clearable::before,
.clearable::after {
  display: block;
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  height: 2px;
  background: #ddd;
  margin: auto;
}
.clearable::before {
  width: 8px;
}
.clearable::after {
  height: 8px;
}
.clearable:hover {
  border-color: #aaa;
}
.clearable:hover::before,
.clearable:hover::after {
  background-color: #aaa;
}
.clearable:focus {
  outline: 0 none;
}



#layout {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

#layout > input {
  box-sizing: border-box;
  border: 0;
  margin: 0;
  padding: 0;
  background: transparent;
  cursor: default;
}
#layout > input:hover {
  background-color: rgba(0, 0, 0, .025);
}
#layout > input:focus {
  outline: 0;
}
#layout > input.active {
  background: var(--color-primary, ${__color_primary});
  color: #fff;
}

#from,
#to {
  width: 140px;
  height: 100%;
  border-radius: var(--radius-base, ${__radius_base});
  text-align: center;
}

:host(:not([mode="range"])) #separator,
:host(:not([mode="range"])) #to {
  display: none;
}
</style>`

const TEMPLATE_HTML_INPUT = `
<div id="layout">
  <input id="from" part="from" readonly />
  <b id="separator">~</b>
  <input id="to" part="to" readonly />
</div>
`

const TEMPLATE_HTML_POPUP = `
<bl-popup append-to-body class="datetime-picker-popup" origin="top-start" arrow>
  <div id="panes" style="display:flex;flex-flow:row nowrap;">
    <div id="date-pane" style="flex:0 0 auto;">
      <bl-date class="date-picker-panel"></bl-date>
    </div>

    <div id="time-pane" style="flex:0 0 auto;display:flex;flex-flow:column nowrap;border-left:1px solid rgba(0,0,0,.05);">
      <div id="time-value" style="flex:0 0 auto;display:flex;align-items:center;justify-content:center;"></div>
      <bl-time class="time-picker-panel"></bl-time>
    </div>
  </div>
  <div id="action" style="padding:5px;text-align:center;">
    <bl-button block type="primary" size="small">确定</bl-button>
  </div>
</bl-popup>
`

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = TEMPLATE_HTML_POPUP

class BlocksDateTimePicker extends HTMLElement {
  static get observedAttributes() {
    return BlocksInput.observedAttributes
      .concat(BlocksDate.observedAttributes)
      .concat(BlocksTime.observedAttributes)
      .concat([])
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    // input 部分
    const fragment = inputTemplate.content.cloneNode(true)
    this.$layout = fragment.querySelector('#layout')
    this.$from = fragment.querySelector('#from')
    this.$to = fragment.querySelector('#to')
    this.shadowRoot.appendChild(fragment)

    // 面板部分
    this.$popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup')
    this.$date = this.$popup.querySelector('bl-date')
    this.$time = this.$popup.querySelector('bl-time')
    this.$timeValue = this.$popup.querySelector('#time-value')

    this.$popup.anchor = () => this.$layout

    this._valueFrom = null
    this._valueTo = null
    this._prevValueFrom = undefined
    this._prevValueTo = undefined

    const setTime = (date) => {
      if (!date) {
        this.$time.hour = this.$time.minute = this.$time.second = null
        return
      }
      this.$time.hour = date.getHours()
      this.$time.minute = date.getMinutes()
      this.$time.second = date.getSeconds()
    }

    const setActive = ($el) => {
      this.$from.classList.remove('active')
      this.$to.classList.remove('active')
      if ($el) $el.classList.add('active')
    }

    const onfocus = (e) => {
      if (this.disabled) return

      if (this.isRange) {
        const target = e.target
        if (target.tagName === 'INPUT') {
          // 避免 click, focus 重复触发
          if (this.$from.classList.contains('active') && target === this.$from || this.$to.classList.contains('active') && target === this.$to) {
            return
          }
          setActive(target)
          this._active = target === this.$from ? 'from' : 'to'
        }

        if (!this._active) {
          this._active = 'from'
        }

        // 切换面板
        if (this.$popup.open) {
          setTime(this._active === 'from' ? this._valueFrom : this._valueTo)
        }        
      }

      this.$popup.open = true
    }
    // this.$from.onfocus = onfocus
    // this.$to.onfocus = onfocus
    this.$layout.onclick = onfocus

    const updateResult = (e) => {
      const detail = e.detail

      if (this.isRange) {
        const hasOldValue = !!this._valueFrom && !!this._valueTo
        const newValues = hasOldValue ? [copyDate(this._valueFrom), copyDate(this._valueTo)] : [today(), today()]
        this._valueFrom = newValues[0]
        this._valueTo = newValues[1]
        const activeValue = this._active === 'from' ? this._valueFrom : this._valueTo
  
        // change 的是 time 面板
        if (e.target === this.$time) {
          if (detail.hour != null && detail.minute != null && detail.second != null) {
            activeValue.setHours(detail.hour)
            activeValue.setMinutes(detail.minute)
            activeValue.setSeconds(detail.second)
    
            // 首次设置，自动选中日期
            if (!hasOldValue) {
              this.$date.value = newValues
              this.$date.render()
            }
          }
          else {
            this._valueFrom = null
            this._valueTo = null
          }
        }
  
        // change 的是 date 面板
        if (e.target === this.$date) {
          if (detail.value.length) {
            newValues[0].setFullYear(detail.value[0].getFullYear())
            newValues[0].setMonth(detail.value[0].getMonth())
            newValues[0].setDate(detail.value[0].getDate())
            newValues[1].setFullYear(detail.value[1].getFullYear())
            newValues[1].setMonth(detail.value[1].getMonth())
            newValues[1].setDate(detail.value[1].getDate())

            // 首次设置，自动设置时间
            if (!hasOldValue) {
              setTime(activeValue)
              this.$time.render()
            }
          }
          else {
            this._valueFrom = null
            this._valueTo = null
          }
        }
      }

      // 非区间模式
      else {
        const oldValue = this._valueFrom
        let newValue = oldValue ? copyDate(oldValue) : today()
        this._valueFrom = newValue

        // change 的是 time 面板
        if (e.target === this.$time) {
          if (detail.hour != null && detail.minute != null && detail.second != null) {
            newValue.setHours(detail.hour)
            newValue.setMinutes(detail.minute)
            newValue.setSeconds(detail.second)
            // 首次设置，自动选中日期
            if (!oldValue) {
              this.$date.value = newValue
              this.$date.render()
            }
          }
          else {
            this._valueFrom = null
          }
        }
  
        // change 的是 date 面板
        else if (e.target === this.$date) {
          if (detail.value) {
            newValue.setFullYear(detail.value.getFullYear())
            newValue.setMonth(detail.value.getMonth())
            newValue.setDate(detail.value.getDate())
            // 首次设置，自动设置时间
            if (!oldValue) {
              setTime(newValue)
              this.$time.render()
            }
          }
          else {
            this._valueFrom = null
          }
        }
      }

      this.render()
    }
    this.$date.addEventListener('change', updateResult)
    this.$time.addEventListener('change', updateResult)
    // 更新 time 面板
    const updateTimeResult = () => {
      if (this.$time.hour == null) {
        this.$timeValue.textContent = ''
      }
      else {
        this.$timeValue.textContent = `${padLeft('0', 2, this.$time.hour)}:${padLeft('0', 2, this.$time.minute)}:${padLeft('0', 2, this.$time.second)}`
      }
    }
    this.$time.addEventListener('change', updateTimeResult)

    this.$popup.querySelector('bl-button').onclick = this._confirm.bind(this)

    this.$popup.addEventListener('open-changed', () => {
      boolSetter('popup-open')(this, this.$popup.open)
    })

    this.$popup.addEventListener('opened', () => {
      this._prevValueFrom = this._valueFrom
      if (this.isRange) {
        this._prevValueTo = this._valueTo
      }

      if (this.isRange) {
        this.$date.value = this._valueFrom && this._valueTo ? [this._valueFrom, this._valueTo] : []
        setTime(this._active === 'from' ? this._valueFrom : this._valueTo)
      }
      else {
        this.$date.value = this._valueFrom
        setTime(this._valueFrom)
      }

      this._updateLayout()
      this._initClickOutside()
      dispatchEvent(this, 'opened')
    })

    this.$popup.addEventListener('closed', () => {
      if (this.isRange) {
        setActive(null)
        if (this._prevValueFrom !== undefined && this._prevValueTo !== undefined) {
          this._valueFrom = this._prevValueFrom
          this._valueTo = this._prevValueTo
          this._prevValueFrom = this._prevValueTo = undefined
          this.renderResult(this.$to, this._valueFrom)
          this.renderResult(this.$from, this._valueTo)
          if (this._valueFrom && this._valueTo) {
            this.$date.value = [this._valueFrom, this._valueTo]
          }
          else {
            this.$date.value = []
          }
        }
      }
      else {
        if (this._prevValueFrom !== undefined) {
          this._valueFrom = this._prevValueFrom
          this._prevValueFrom = undefined
          this.renderResult(this.$from, this._valueFrom)
          this.$date.value = this._valueFrom
        }
      }
      this._destroyClickOutside()
      dispatchEvent(this, 'closed')
    })
  }

  get isRange() {
    return enumGetter('mode', [null, 'range'])(this)
  }

  get date() {
    return this.$date.value
  }

  set date(value) {
    this.$date.value = value
  }

  _confirm() {
    this._prevValueFrom = undefined
    this._prevValueTo = undefined
    dispatchEvent(this, 'change', { detail: this.isRange ? [this._valueFrom, this._valueTo] : this._valueFrom })
    this.$popup.open = false
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach((attr) => {
      upgradeProperty(this, attr)
    })
    document.body.appendChild(this.$popup)

    this.render()
  }

  disconnectedCallback() {
    document.body.removeChild(this.$popup)
    this._destroyClickOutside()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (['clearable'].includes(name)) {
      this.$from.setAttribute(name, newValue)
    }
    if (['mode', 'depth', 'mindepth', 'startdepth', 'multiple', 'max', 'loading', 'start-week-on'].includes(name)) {
      this.$date.setAttribute(name, newValue)
    }
    this.render()
  }

  _initClickOutside() {
    if (!this._clearClickOutside) {
      this._clearClickOutside = onClickOutside([this, this.$popup], () => {
        if (this.$popup.open) this.$popup.open = false
      })
    }
  }

  _destroyClickOutside() {
    if (this._clearClickOutside) {
      this._clearClickOutside()
      this._clearClickOutside = undefined
    }
  }

  renderResult($part, date) {
    $part.value = !date ? '' : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  render() {
    if (this.isRange) {
      this.renderResult(this.$from, this._valueFrom)
      this.renderResult(this.$to, this._valueTo)
    }
    else {
      this.renderResult(this.$from, this._valueFrom)
    }
  }

  _updateLayout() {
    this.$time.style.height = this.$date.$content.offsetHeight + 'px'
    this.$timeValue.style.height = this.$date.offsetHeight - this.$date.$content.offsetHeight - 1 + 'px'
  }  
}

if (!customElements.get('bl-datetime-picker')) {
  customElements.define('bl-datetime-picker', BlocksDateTimePicker)
}

function copyDate(date) {
  const copy = new Date()
  copy.setTime(date.getTime())
  return copy
}

function today() {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}
