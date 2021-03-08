import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __color_primary, __color_primary_light, __radius_base } from '../theme/var.js'
import { numGetter, numSetter } from '../../common/property.js'
import { scrollTo } from '../../common/scrollTo.js'
const durationGetter = numGetter('duration')
const durationSetter = numSetter('duration')
const visibilityHeightGetter = numGetter('visibility-height')
const visibilityHeightSetter = numSetter('visibility-height')

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
:host {
  position: fixed;
  bottom: 50px;
  right: 20px;
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary, ${__color_primary});
  color: #fff;
  font-family: sans-serif;
  font-size: 14px;
  cursor: pointer;  
}
:host(:hover) {
  background-color: var(--color-primary-light, ${__color_primary_light});
}
#layout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">UP</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksBackTop extends HTMLElement {
  static get observedAttributes() {
    return ['duration', 'target', 'visibility-height']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.querySelector('#layout')

    this.$layout.onclick = () => {
      scrollTo(this.targetElement, 0, {
        duration: this.duration,
        done: () => this.render()
      })
    }

    this._onTargetScroll = (e) => {
      if (e.target === this.targetElement) {
        this.render()
      }
    }
  }

  get duration() {
    return durationGetter(this)
  }

  set duration(value) {
    durationSetter(this, value)
  }

  get target() {
    if (this._target) {
      return this._target() ?? null
    }
    return this.getAttribute('target')
  }

  set target(value) {
    if (typeof value === 'string' || value === null) {
      this.setAttribute('target', value)
      this._target = undefined
      return
    }
    if (typeof value === 'function') {
      this._target = value
    }
    else if (value instanceof Node) {
      this._target = () => value
    }
    this.removeAttribute('target')
  }

  get targetElement() {
    const target = this.target
    if (target === null) {
      return window
    }
    if (target instanceof Element) {
      return target
    }
    if (typeof target === 'string') {
      try {
        return document.querySelector(target) ?? window
      }
      catch (error) {
        return window
      }
    }
  }

  get visibilityHeight() {
    return visibilityHeightGetter(this) || 400
  }

  set visibilityHeight(value) {
    visibilityHeightSetter(this, value)
  }

  render() {
    const scrollTop = this.targetElement.scrollTop
    if (scrollTop >= this.visibilityHeight) {
      this.style.display = ''
    }
    else {
      this.style.display = 'none'
    }
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()

    document.addEventListener('scroll', this._onTargetScroll, true)
  }

  disconnectedCallback() {
    document.removeEventListener('scroll', this._onTargetScroll, true)
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
  }
}

if (!customElements.get('bl-backtop')) {
  customElements.define('bl-backtop', BlocksBackTop)
}
