import { openGetter, openSetter } from '../../common/propertyAccessor.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __transition_duration } from '../theme/var.js'
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js'
import { onTransition } from '../../common/onTransition.js'

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  position: fixed;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.3);
  opacity: 1;
  transition: all var(--transition-duration, ${__transition_duration}) cubic-bezier(.645, .045, .355, 1);
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

    // 过渡结束时
    this._onTransitionEnd = () => {
      if (!this.open) {
        this.style.display = 'none'
      }
    }
    onTransition(this, {
      end: () => this._onTransitionEnd()
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
    if (!this.open) {
      this.style.display = 'none'
      this.style.opacity = '0'
    }
    else {
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
    this._prepareForAnimate()
    if (this.open) {
      this._lockScroll()
      this._animateOpen()
    }
    else {
      this._unlockScroll()
      this._animateClose()
    }

    // 如果没有动画，则直接执行回调
    const styles = getComputedStyle(this)
    if (!parseFloat(styles.transitionDuration) && !parseFloat(styles.transitionDelay)) {
      this._onTransitionEnd()
    }
  }

  // 执行过渡前的准备工作，确保动画正常
  _prepareForAnimate() {
    this.style.display = ''
    this.offsetHeight
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
    this.offsetHeight
    this.style.opacity = ''
  }

  _animateClose() {
    this.offsetHeight
    this.style.opacity = '0'
  }
}

if (!customElements.get('blocks-modal-mask')) {
  customElements.define('blocks-modal-mask', BlocksModalMask)
}
