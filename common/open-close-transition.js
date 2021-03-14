import { __transition_duration } from '../../theme/var.js'
import { openGetter, openSetter } from './propertyAccessor.js'
import { dispatchEvent } from './event.js'

const TEMPLATE = `
<style>
:host(:not([open])) {
  display: none;
}

/* 过渡过程持续生效 */
:host(.open-transition-active),
:host(.close-transition-active) {
  display: block;
  transition-delay: 0, 0;
  transition-property: opacity, transform;
  transition-duration: var(--transition-duration, ${__transition_duration}), var(--transition-duration, ${__transition_duration});
  transition-timing-function: cubic-bezier(.645, .045, .355, 1), cubic-bezier(.645, .045, .355, 1);
  pointer-events: none;
}

/* 打开动作，过渡开始时的状态 */
:host(.open-transition-from) {
  opacity: 0;
  transform: scale(0);
}
/* 打开动作，过渡结束时的状态 */
:host(.open-transition-to) {
  opacity: 1;
  transform: scale(1);
}

/* 关闭动作，过渡开始时的状态 */
:host(.close-transition-from) {
}
/* 关闭动作，过渡结束时的状态 */
:host(.close-transition-to) {
  opacity: 0;
  transform: scale(0);
}
</style>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE

export default class BlocksOpenCloseAnimation extends HTMLElement {
  static get observedAttributes() {
    return ['open']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    // 如果要覆盖过渡属性，
    // 必须更改该属性为 transition-property 中的某个属性，
    // 以便追踪该属性来识别过渡的开始、结束。
    this._openCloseTransitionProperty = 'opacity'

    const isOpenOrClose = () => {
      return this.classList.contains('open-transition-active') || this.classList.contains('close-transition-active')
    }

    // transition 的属性可能有多个，避免重复触发，只跟踪一个属性
    // 过渡开始执行（transition-delay 之前就开始算）
    this.addEventListener('transitionrun', ev => {
      if (ev.target !== this) return
      if (!isOpenOrClose() || ev.propertyName !== this._openCloseTransitionProperty) return
    })

    // 过渡真正开始时（transition-delay 后，动画开始执行才算）
    this.addEventListener('transitionstart', (ev) => {
      if (ev.target !== this) return
      if (!isOpenOrClose() || ev.propertyName !== this._openCloseTransitionProperty) return
    })

    const end = () => {
      this.classList.remove('open-transition-active')
      this.classList.remove('open-transition-from')
      this.classList.remove('close-transition-from')

      this.classList.remove('close-transition-active')
      this.classList.remove('open-transition-to')
      this.classList.remove('close-transition-to')

      let callback = this.open ? this.onOpen : this.onClose
      if (callback) callback.call(this)
      dispatchEvent(this, this.open ? 'open' : 'close')
    }

    // 过渡取消时
    this.addEventListener('ontransitioncancel', (ev) => {
      if (ev.target !== this) return
      if (!isOpenOrClose() || ev.propertyName !== this._openCloseTransitionProperty) return
      end()
    })

    // 过渡结束时
    this.addEventListener('transitionend', (ev) => {
      if (ev.target !== this) return
      if (!isOpenOrClose() || ev.propertyName !== this._openCloseTransitionProperty) return
      end()
    })
  }

  get open() {
    return openGetter(this)
  }

  set open(value) {
    openSetter(this, value)
  }

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(name) {
    if (name == 'open') {
      if (this.open) {
        this.classList.remove('close-transition-active')
        this.classList.remove('close-transition-from')
        this.classList.remove('close-transition-to')

        this.classList.add('open-transition-active')
        this.classList.add('open-transition-from')
        this.offsetHeight
        this.classList.replace('open-transition-from', 'open-transition-to')
      }
      else {
        this.classList.remove('open-transition-active')
        this.classList.remove('open-transition-from')
        this.classList.remove('open-transition-to')

        this.classList.add('close-transition-active')
        this.classList.add('close-transition-from')
        this.offsetHeight
        this.classList.replace('close-transition-from', 'close-transition-to')
      }
    }
  }
}
