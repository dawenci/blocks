import '../modal-mask/index.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { openGetter, openSetter } from '../../common/propertyAccessor.js'
import { setStyles } from '../../common/style.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __bg_base, __fg_base, __transition_duration } from '../theme/var.js'

const modalGetter = boolGetter('modal')
const modalSetter = boolSetter('modal')
const placementGetter = enumGetter('placement', ['left', 'right', 'bottom', 'top'])
const placementSetter = enumSetter('placement', ['left', 'right', 'bottom', 'top'])

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  box-sizing: border-box;
  position: fixed;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  background-color: var(--bg-base, ${__bg_base});
  color: var(--fg-base, ${__fg_base});
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.1),
    0px 24px 38px 3px rgba(0, 0, 0, 0.10),
    0px 9px 46px 8px rgba(0, 0, 0, 0.10);
  transition-delay: 0, 0;
  transition-property: opacity, transform;
  transition-duration: var(--transition-duration, ${__transition_duration}), var(--transition-duration, ${__transition_duration});
  transform: scale(1);
}
#layout {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout"><slot></slot></div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksDrawer extends HTMLElement {
  static get observedAttributes() {
    return ['placement', 'open', 'modal', 'size']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
  }

  get modal() {
    return modalGetter(this)
  }

  set modal(value) {
    modalSetter(value)
  }

  get open() {
    return openGetter(this)
  }

  set open(value) {
    openSetter(this, value)
  }

  get placement() {
    return placementGetter(this)
  }

  set placement(value) {
    placementSetter(this, value)
  }

  get size() {
    const size = this.getAttribute('size')
    return size || '30%'
  }

  set size(value) {
    return this.setAttribute('size', value)
  }

  renderMask() {
    if (this.modal) {
      if (!this.$modal) this.$modal = document.createElement('div')
    }
    else {

    }
  }

  render() {
    let top = '0'
    let right = '0'
    let bottom = '0'
    let left = '0'

    this.renderMask()

    switch (this.placement) {
      case 'right': {
        setStyles(this, { top, right, bottom, left: 'auto', height: '100vh', width: this.size })
        break
      }
      case 'left': {
        setStyles(this, { top, right: 'auto', bottom, left, height: '100vh', width: this.size })
        break
      }
      case 'bottom': {
        setStyles(this, { top: 'auto', right, bottom, left, width: '100vw', height: this.size })
        break
      }
      case 'top': {
        setStyles(this, { top, right, bottom: 'auto', left, width: '100vw', height: this.size })
        break
      }
    }

  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    if (this.parentElement !== document.body) {
      document.body.appendChild(this)
    }

    this.render()

    // 设置初始样式，确保动画生效
    if (!this.open) {
      this.style.transform = this._transitionScale()
      this.style.transformOrigin = this._transitionOrigin()
      this.style.opacity = '0'
    }
    else {
      this._updateVisible()
    }
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'modal' && this.modal && !this.mask) {
      this.$mask = document.body.appendChild(document.createElement('blocks-modal-mask'))
      this.$mask.open = this.open
    }

    if (attrName === 'open' && this.$mask) {
      this.$mask.open = this.open
    }

    switch (attrName) {
      case 'open': {
        this._updateVisible()
        break
      }
    }
  }

  _updateVisible() {
    this._prepareForAnimate()
    if (this.open) {
      this._animateOpen()
    }
    else {
      this._animateClose()
    }
  }

  // 执行过渡前的准备工作，确保动画正常
  _prepareForAnimate() {
    this.style.display = ''
    this.offsetHeight
  }

  _transitionOrigin() {
    switch (this.placement) {
      case 'right': return 'right center'
      case 'left': return 'left center'
      case 'bottom': return 'center bottom'
      case 'top': return 'center top'
    }
  }

  _transitionScale() {
    return (this.placement === 'right' || this.placement === 'left') ? 'scale(0, 1)' : 'scale(1, 0)'
  }

  _animateOpen() {
    this.style.transform = this._transitionScale()
    this.style.transformOrigin = this._transitionOrigin()
    this.offsetHeight
    this.style.transform = 'scale(1)'
    this.style.opacity = ''
  }

  _animateClose() {
    this.offsetHeight
    this.style.transform = this._transitionScale()
    this.style.transformOrigin = this._transitionOrigin()
    this.style.opacity = '0'
  }
}

if (!customElements.get('blocks-drawer')) {
  customElements.define('blocks-drawer', BlocksDrawer)
}
