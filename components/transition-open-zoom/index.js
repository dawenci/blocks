import { dispatchEvent } from '../../common/event.js'
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'
import { openGetter, openSetter } from '../../common/propertyAccessor.js'
import { __transition_duration } from '../../theme/var.js'

const TEMPLATE = `
<style>
:host(:not([open])) {
  display: none;
}

/* 过渡过程持续生效 */
:host(.zoom-enter-transition-active),
:host(.zoom-leave-transition-active) {
  display: block;
  transition-delay: 0, 0;
  transition-property: opacity, transform;
  transition-duration: var(--transition-duration, ${__transition_duration}), var(--transition-duration, ${__transition_duration});
  transition-timing-function: cubic-bezier(.645, .045, .355, 1), cubic-bezier(.645, .045, .355, 1);
  pointer-events: none;
}

/* 打开动作，过渡开始时的状态 */
:host(.zoom-enter-transition-from) {
  opacity: 0;
  transform: scale(0);
}
/* 打开动作，过渡结束时的状态 */
:host(.zoom-enter-transition-to) {
  opacity: 1;
  transform: scale(1);
}

/* 关闭动作，过渡开始时的状态 */
:host(.zoom-leave-transition-from) {
}
/* 关闭动作，过渡结束时的状态 */
:host(.zoom-leave-transition-to) {
  opacity: 0;
  transform: scale(0);
}
</style>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE

export class BlocksTransitionOpenZoom extends HTMLElement {
  static get observedAttributes() {
    return ['open']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
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
        doTransitionEnter(this, 'zoom', () => {
          if (this.onOpen) this.onOpen()
          dispatchEvent(this, 'opened')
        })
      }
      else {
        doTransitionLeave(this, 'zoom', () => {
          if (this.onClose) this.onClose()
          dispatchEvent(this, 'closed')
        })
      }
      dispatchEvent(this, 'open-changed')
    }
  }
}
