import { getRegisteredSvgIcon } from '../../icon/store.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { forEach } from '../core/utils.js'
import { $transitionDuration } from '../theme/var.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../core/property.js'

const halfValueGetter = enumGetter('value', [null, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5])
const halfValueSetter = enumSetter('value', [null, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5])
const valueGetter = enumGetter('value', [null, 1, 2, 3, 4, 5])
const valueSetter = enumSetter('value', [null, 1, 2, 3, 4, 5])
const halfGetter = boolGetter('half')
const halfSetter = boolSetter('half')

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
}

#layout {
  display: flex;
  flex-flow: row-reverse nowrap;
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
  transition: all ${$transitionDuration};
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
button:hover ~ button {
  fill: #fadb14;
}
button[selected] ~ button {
  fill: #fadb14;
}

:host(:not([half])) .star:hover,
:host(:not([half])) .star[selected] {
  fill: #fadb14;
}

:host([half]) .left:hover,
:host([half]) .left[selected],
:host([half]) .right:hover,
:host([half]) .right[selected],
:host([half]) .right:hover+.left,
:host([half]) .right[selected]+.left {
  fill: #fadb14;
}

:host([half]) button[selected] {

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

    this.$layout.onclick = e => {
      const target = e.target
      let star
      let button
      let el = target
      while (el && el !== this.$layout) {
        if (el.classList.contains('star')) {
          star = el
          star.setAttribute('selected', '')
        }
        if (el.tagName === 'BUTTON') {
          button = el
          el.setAttribute('selected', '')
          break
        }
        el = el.parentElement
      }
      forEach(this.$layout.querySelectorAll('[selected]'), el => {
        if (el !== star && el !== button) el.removeAttribute('selected')
      })
    }
  }

  get value() {
    return this.half ? halfValueGetter(this) : valueGetter(this)
  }

  set value(value) {
    return this.half ? halfValueSetter(this, value) : valueSetter(this, value)
  }

  get half() {
    return halfGetter(this)
  }

  set half(value) {
    halfSetter(this, value)
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

  attributeChangedCallback(attrName, oldVal, newVal) {}
}

if (!customElements.get('blocks-rating')) {
  customElements.define('blocks-rating', BlocksRating)
}
