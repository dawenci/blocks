import { __transition_duration } from '../../theme/var.js'
import { openGetter, openSetter } from './propertyAccessor.js'
import { dispatchEvent } from './event.js'

const TEMPLATE = `
<style>
:host(:not([open])) {
  display: none;
}

:host(.open-animation-prepare),
:host(.close-animation-prepare) {
  display: block;
}
:host(.open-animation-prepare) {
  opacity: 0;
  transform: scale(0);
}

:host(.open-animation),
:host(.close-animation) {
  display: block;
  transition-delay: 0, 0;
  transition-property: opacity, transform;
  transition-duration: var(--transition-duration, ${__transition_duration}), var(--transition-duration, ${__transition_duration});
  transition-timing-function: cubic-bezier(.645, .045, .355, 1), cubic-bezier(.645, .045, .355, 1);
  pointer-events: none;
}
:host(.open-animation) {
  opacity: 1;
  transform: scale(1);
}
:host(.close-animation) {
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

    // transition 的属性可能有多个，避免重复触发，只跟踪一个属性
    // 过渡开始执行（transition-delay 之前就开始算）
    this.addEventListener('transitionrun', ev => {
      if (ev.target !== this) return
      if (ev.propertyName !== 'opacity') return
    })

    // 过渡真正开始时（transition-delay 后，动画开始执行才算）
    this.addEventListener('transitionstart', (ev) => {
      if (ev.target !== this || ev.propertyName !== 'opacity') return
    })

    const end = () => {
      this.classList.remove('open-animation-prepare')
      this.classList.remove('close-animation-prepare')
      this.classList.remove('open-animation')
      this.classList.remove('close-animation')
      let callback = this.open ? this.onOpen : this.onClose
      if (callback) callback.call(this)
      dispatchEvent(this, this.open ? 'open' : 'close')
    }

    // 过渡取消时
    this.addEventListener('ontransitioncancel', (ev) => {
      if (ev.target !== this || ev.propertyName !== 'opacity') return
      end()
    })

    // 过渡结束时
    this.addEventListener('transitionend', (ev) => {
      if (ev.target !== this || ev.propertyName !== 'opacity') return
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
        this.classList.remove('close-animation-prepare')
        this.classList.remove('close-animation')
        this.classList.add('open-animation-prepare')
        this.offsetHeight
        this.classList.replace('open-animation-prepare', 'open-animation')
      }
      else {
        this.classList.remove('open-animation-prepare')
        this.classList.remove('open-animation')
        this.classList.add('close-animation-prepare')
        this.offsetHeight
        this.classList.replace('close-animation-prepare', 'close-animation')
      }
    }
  }
}
