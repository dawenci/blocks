import { upgradeProperty } from '../core/upgradeProperty.js'
import { boolGetter, boolSetter, numGetter, numSetter } from '../core/property.js'
import { makeRgbaColor } from '../core/utils.js';
import { $colorDanger, $colorPrimary, $colorSuccess, $colorWarning, $radiusBase, $transitionDuration } from '../theme/var.js'

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
:host {
  display: block;
  position: relative;
}
.widget {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 1px;
  border-radius: ${$radiusBase};
}
.progress {
  position: absolute;
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
  width: 0;
  transition: ${$transitionDuration} all;
  border-radius: ${$radiusBase};
}
.value {
  position: absolute;
  top: auto;
  right: auto;
  bottom: -16px;
  left: 0;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  text-shadow: 1px 1px 0 rgba(255,255,255,.5);
}

.widget { background-color: ${makeRgbaColor($colorPrimary, .05)} }
.progress { background-color: ${$colorPrimary} }
.value { color: ${$colorPrimary} }
</style>`

const TEMPLATE_HTML = `
<div class="widget">
  <div class="progress"></div>
  <div class="value"></div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksProgress extends HTMLElement {
  static get observedAttributes() {
    return ['value']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this._progress = shadowRoot.querySelector('.progress')
    this._value = shadowRoot.querySelector('.value')
  }

  get value() {
    return numGetter('value')(this)
  }

  set value(value) {
    numSetter('value')(this, value)
  }

  get showNumber() {
    return boolGetter('show-number')(this)
  }

  set showNumber(value) {
    return boolSetter('show-number')(this, value)
  }

  render() {
    this._progress.style.width = `${this.value}%`
    if (this.showNumber) {
      this._value.style.display = 'block'
      this._value.textContent = `${this.value}%`
    }
    else {
      this._value.style.display = 'none'
    }
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
    this.render()
  }
}

if (!customElements.get('blocks-progress')) {
  customElements.define('blocks-progress', BlocksProgress)
}
