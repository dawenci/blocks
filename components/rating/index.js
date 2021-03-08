import { getRegisteredSvgIcon } from '../../icon/store.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach } from '../../common/utils.js'
import { __transition_duration } from '../theme/var.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'

const halfValueGetter = enumGetter('value', [null, '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'])
const halfValueSetter = enumSetter('value', [null, '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'])
const valueGetter = enumGetter('value', [null, '1', '2', '3', '4', '5'])
const valueSetter = enumSetter('value', [null, '1', '2', '3', '4', '5'])
const halfGetter = boolGetter('half')
const halfSetter = boolSetter('half')

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
}

#layout {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
}

button {
  display: flex;
  flex-flow: row-reverse nowrap;
  position: relative;
  overflow: hidden;
  width: 20px;
  height: 20px;
  margin: 0 2px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transition: all var(--transition-duration, ${__transition_duration});
}
button:first-child {
  margin-left: 0;
}
button:last-child {
  margin-right: 0;
}
button:focus {
  outline: 0 none;
}

button > span {
  flex: 1 1 auto;
  overflow: hidden;
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
}
:host([half]) button > span {
  width: 50%;
}
:host([half]) button > span.left svg {
  right: auto;
}
:host([half]) button > span.right svg {
  left: auto;
}

svg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
}
:host([half]) svg {
  width: 200%;
}
#layout:hover,
button {
  fill: #f0f0f0;
}
button.selected {
  fill: #fadb14;
}
button.half-selected .left {
  fill: #fadb14;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <button></button>
  <button></button>
  <button></button>
  <button></button>
  <button></button>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

const $STAR_ICON = getRegisteredSvgIcon('star')

class BlocksRating extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'half']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')

    forEach(this.$layout.children, (button, index) => {
      button.onmouseover = e => {
        if (!this.half) {
          this._hoverValue = index + 1
        }
        else {
          let el = e.target
          while (!el.classList.contains('star')) {
            el = el.parentElement
          }
          this._hoverValue = index + (el.classList.contains('left') ? 0.5 : 1)
        }
        this.updateSelect()
      }

      button.onclick = e => {
        if (!this.half) {
          this.value = index + 1
        }
        else {
          let el = e.target
          while (!el.classList.contains('star')) {
            el = el.parentElement
          }
          this.value = index + (el.classList.contains('left') ? 0.5 : 1)
        }
        this.updateSelect()
      }
    })
    this.$layout.onmouseleave = e => {
      this._hoverValue = undefined
      this.updateSelect()
    }
  }

  get value() {
    const value = this.half ? halfValueGetter(this) : valueGetter(this)
    return value ? +value : value
  }

  set value(value) {
    return this.half ? halfValueSetter(this, '' + value) : valueSetter(this, '' + value)
  }

  get half() {
    return halfGetter(this)
  }

  set half(value) {
    halfSetter(this, value)
  }

  updateSelect() {
    const value = +(this._hoverValue ?? this.value ?? 0)
    let acc = 0
    forEach(this.$layout.children, button => {
      if (value - acc >= 1) {
        button.className = 'selected'
        acc += 1
      }
      else if (value - acc === 0.5) {
        button.className = 'half-selected'
        acc += 0.5
      }
      else {
        button.className = ''
      }
    })
  }

  render() {
    const star = document.createElement('span')
    star.className = 'star'
    star.appendChild($STAR_ICON.cloneNode(true))
    forEach(this.shadowRoot.querySelectorAll('button'), button => {
      if (this.half) {
        if (button.children.length !== 2) {
          button.innerHTML = ''
          button.appendChild(star.cloneNode(true)).classList.add('right')
          button.appendChild(star.cloneNode(true)).classList.add('left')
        }
      }
      else {
        if (button.children.length !== 1) {
          button.innerHTML = ''
          button.appendChild(star.cloneNode(true))
        }
      }
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

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.updateSelect()
  }
}

if (!customElements.get('bl-rating')) {
  customElements.define('bl-rating', BlocksRating)
}
