import { openGetter, openSetter } from '../../common/propertyAccessor.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __transition_duration } from '../theme/var.js'
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js'
import { initOpenCloseAnimation } from '../../common/initOpenCloseAnimation.js'

const TEMPLATE_CSS = `<style>
:host {
  display: none;
  box-sizing: border-box;
  position: fixed;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.3);
}
:host([open]) {
  display: block;
}
</style>`

const TEMPLATE_HTML = `
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksModalMask extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'zIndex']
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    initOpenCloseAnimation(this, {
      transform: false,
    })
  }

  get open() {
    return openGetter(this)
  }

  set open(value) {
    openSetter(this, value)
  }

  render() {}

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()

    // 设置初始样式，确保动画生效
    if (this.open) {
      this._updateVisible()
    }
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName == 'open') {
      this._updateVisible()
    }
  }
 
  _updateVisible() {
    if (this.open) {
      this._lockScroll()
      this._animateOpen()
    }
    else {
      this._unlockScroll()
      this._animateClose()
    }
  }

  _lockScroll() {
    if (!this.isScrollLocked) {
      this.bodyPaddingRight = document.body.style.paddingRight
      this.bodyOverflowY = document.body.style.overflowY
      this.computedBodyPaddingRight = parseInt(getComputedStyle(document.body).paddingRight, 10)
    }

    const scrollBarWidth = getBodyScrollBarWidth()
    let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
    let bodyOverflowY = getComputedStyle(document.body).overflowY
    if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && !this.isScrollLocked) {
      document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px'
    }

    document.body.style.overflowY = 'hidden'
    this.isScrollLocked = true
  }

  _unlockScroll() {
    if (this.isScrollLocked) {
      document.body.style.paddingRight = this.bodyPaddingRight
      document.body.style.overflowY = this.bodyOverflowY
      this.isScrollLocked = false
    }
  }

  _animateOpen() {
    this.classList.remove('close-animation')
    this.classList.add('open-animation')
  }

  _animateClose() {
    this.classList.remove('open-animation')
    this.classList.add('close-animation')
  }
}

if (!customElements.get('bl-modal-mask')) {
  customElements.define('bl-modal-mask', BlocksModalMask)
}
