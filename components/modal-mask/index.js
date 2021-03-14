import BlocksOpenCloseAnimation from '../../common/open-close-transition.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __transition_duration } from '../../theme/var.js'
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js'


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
:host(.open-enter-transition-active),
:host(.open-leave-transition-active) {
  transition-duration: var(--transition-duration, ${__transition_duration}), 0s;
}
</style>`

const TEMPLATE_HTML = `
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksModalMask extends BlocksOpenCloseAnimation {
  static get observedAttributes() {
    return super.observedAttributes.concat(['open', 'z-index'])
  }

  constructor() {
    super()
    this.shadowRoot.appendChild(template.content.cloneNode(true))
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
    super.attributeChangedCallback(attrName, oldVal, newVal)

    if (attrName == 'open') {
      this._updateVisible()
    }
  }
 
  _updateVisible() {
    if (this.open) {
      this._lockScroll()
    }
    else {
      this._unlockScroll()
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
}

if (!customElements.get('bl-modal-mask')) {
  customElements.define('bl-modal-mask', BlocksModalMask)
}
