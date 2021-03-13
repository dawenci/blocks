import { getRegisteredSvgIcon } from '../../icon/store.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach } from '../../common/utils.js'
import { __transition_duration } from '../../theme/var.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { clearableGetter, clearableSetter } from '../../common/propertyAccessor.js'

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
  position: relative;
  overflow: hidden;
  width: 18px;
  height: 18px;
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
  overflow: hidden;
  display: block;
  position: absolute;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
svg {
  position: absolute;
  z-index: 0;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  width: 18px;
  height: 18px;
  margin: auto;
}

button > .part {
  display: none;
  z-index: 1;
  width: 50%;
}
:host([half]) button .part,
:host([result-mode]) button .part {
  display: block;
}

button {
  fill: #f0f0f0;
}
button.selected {
  fill: #fadb14;
}
button.partially-selected > .part {
  fill: #fadb14;
}
:host([result-mode]) button {
  cursor: default;
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

class BlocksRate extends HTMLElement {
  static get observedAttributes() {
    return [
      // model 值
      'value',
      // 允许选择半颗星
      'half',
      // 允许 toggle 高亮
      'clearable',
      // 结果模式，可以百分比高亮星星
      'result-mode'
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')

    forEach(this.$layout.children, (button, index) => {
      button.onmouseover = e => {
        if (this.resultMode) return

        if (!this.half) {
          this._hoverValue = index + 1
        }
        else {
          let el = e.target
          while (!el.classList.contains('star')) {
            el = el.parentElement
          }
          this._hoverValue = index + (el.classList.contains('part') ? 0.5 : 1)
        }
        this.updateSelect()
      }

      button.onclick = e => {
        if (this.resultMode) return

        if (!this.half) {
          this.value = index + 1
        }
        else {
          let el = e.target
          while (!el.classList.contains('star')) {
            el = el.parentElement
          }
          this.value = index + (el.classList.contains('part') ? 0.5 : 1)
        }
        this.updateSelect()
      }
    })

    this.$layout.onmouseleave = e => {
      this._hoverValue = undefined
      this.updateSelect()
    }
  }

  get clearable() {
    return clearableGetter(this)
  }

  set clearable(value) {
    clearableSetter(this, value)
  }

  get value() {
    const value = this.resultMode ? this.getAttribute('value') : this.half ? halfValueGetter(this) : valueGetter(this)
    return value ? +value : value
  }

  set value(value) {
    if (this.resultMode) {
      this.setAttribute('value', value)
    }
    if (this.half) {
      halfValueSetter(this, '' + value)
    }
    else {
      valueSetter(this, '' + value)
    }
  }

  get half() {
    return halfGetter(this)
  }

  set half(value) {
    halfSetter(this, value)
  }

  get resultMode() {
    return boolGetter('result-mode')(this)
  }

  set resultMode(value) {
    boolSetter('result-mode')(this, value)
  }

  updateSelect() {
    if (this.resultMode) {
      const value = this.value ?? 0
      let acc = 0
      forEach(this.$layout.children, button => {
        if (value - acc >= 1) {
          button.className = 'selected'
          acc += 1
        }
        else if (value - acc > 0) {
          button.className = 'partially-selected'
          const n = (value - acc)
          button.querySelector('.part').style.width = `${n * 100}%`
          acc += n
        }
        else {
          button.className = ''
        }
      })
      return
    }

    const value = +(this._hoverValue ?? this.value ?? 0)
    let acc = 0
    forEach(this.$layout.children, button => {
      if (value - acc >= 1) {
        button.className = 'selected'
        acc += 1
      }
      else if (value - acc === 0.5) {
        button.className = 'partially-selected'
        button.querySelector('.part').style.width = ''
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
    forEach(this.$layout.children, button => {
      if (button.children.length !== 2) {
        button.innerHTML = ''
        button.appendChild(star.cloneNode(true))
        button.appendChild(star.cloneNode(true)).classList.add('part')
      }
    })
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
    this.updateSelect()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
    this.updateSelect()
  }
}

if (!customElements.get('bl-rate')) {
  customElements.define('bl-rate', BlocksRate)
}
