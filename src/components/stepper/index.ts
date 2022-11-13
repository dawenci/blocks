import {
  enumGetter,
  enumSetter,
  strGetter,
  strSetter,
} from '../../common/property.js'
import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'
import { parseIcon } from '../../icon/index.js'
import { Component } from '../Component.js'
import { stepperTemplate, stepTemplate } from './template.js'

export class BlocksSteps extends Component {
  ref: {
    $slot: HTMLSlotElement
    $layout: HTMLElement
  }

  static override get observedAttributes() {
    return ['direction', 'size']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(stepperTemplate.content.cloneNode(true))
    const $slot = shadowRoot.querySelector('slot') as HTMLSlotElement
    const $layout = shadowRoot.getElementById('layout') as HTMLElement

    this.ref = {
      $slot,
      $layout,
    }
  }

  get direction() {
    return enumGetter('direction', ['horizontal', 'vertical'])(this)
  }

  set direction(value) {
    enumSetter('direction', ['horizontal', 'vertical'])(this, value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  stepIndex($step: HTMLElement) {
    return this.ref.$slot.assignedElements().findIndex($el => $el === $step)
  }
}

if (!customElements.get('bl-stepper')) {
  customElements.define('bl-stepper', BlocksSteps)
}

export class BlocksStep extends Component {
  ref: {
    $layout: HTMLElement
    $icon: HTMLElement
    $title: HTMLElement
    $description: HTMLElement
  }

  static override get observedAttributes() {
    return ['step-title', 'description', 'icon', 'status']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(stepTemplate.content.cloneNode(true))

    const $layout = shadowRoot.getElementById('layout') as HTMLElement
    const $icon = shadowRoot.getElementById('icon') as HTMLElement
    const $title = shadowRoot.getElementById('title') as HTMLElement
    const $description = shadowRoot.getElementById('description') as HTMLElement

    this.ref = {
      $layout,
      $icon,
      $title,
      $description,
    }

    const slots = shadowRoot.querySelectorAll(
      'slot'
    ) as ArrayLike<HTMLSlotElement>
    Array.prototype.forEach.call(slots, $slot => {
      const $parent = $slot.parentElement
      $slot.addEventListener('slotchange', () => {
        switch ($parent) {
          case $icon:
            return this._renderIcon()
          case $title:
            return this._renderTitle()
          case $description:
            return this._renderDescription()
        }
      })
    })
  }

  get $stepper() {
    return this.closest('bl-stepper')! as BlocksSteps
  }

  get stepTitle() {
    return strGetter('step-title')(this)
  }

  set stepTitle(value) {
    strSetter('step-title')(this, value)
  }

  get description() {
    return strGetter('description')(this)
  }

  set description(value) {
    strSetter('description')(this, value)
  }

  get icon() {
    return strGetter('icon')(this)
  }

  set icon(value) {
    strSetter('icon')(this, value)
  }

  get status() {
    return enumGetter('status', ['wait', 'process', 'success', 'error'])(this)
  }

  set status(value) {
    enumSetter('status', ['wait', 'process', 'success', 'error'])(this, value)
  }

  override render() {
    this._renderIcon()
    this._renderTitle()
    this._renderDescription()
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    switch (attrName) {
      case 'icon': {
        this._renderIcon()
        break
      }
      case 'step-title': {
        this._renderTitle()
        break
      }
      case 'description': {
        this._renderDescription()
        break
      }
    }
  }

  _renderContent(
    $slotParent: HTMLElement,
    $default: HTMLElement | SVGElement | Text
  ) {
    let empty = true
    const $slot = $slotParent.querySelector('slot')!
    if (
      $slot
        .assignedNodes()
        .filter($node => $node.nodeType === 1 || $node.nodeType === 3).length
    ) {
      empty = false
    } else if ($default) {
      $slotParent.innerHTML = ''
      $slotParent.appendChild($slot)
      $slotParent.appendChild($default)
      empty = false
    }
    $slotParent.classList.toggle('empty', empty)
  }

  _renderIcon() {
    let $default: HTMLElement | SVGElement | null = this.icon
      ? parseIcon(this.icon)
      : null
    if (!$default) {
      $default = document.createElement('i')
      $default.textContent = String(this.$stepper.stepIndex(this) + 1)
    }
    this._renderContent(this.ref.$icon, $default)
  }

  _renderTitle() {
    this._renderContent(
      this.ref.$title,
      document.createTextNode(this.stepTitle!)
    )
  }

  _renderDescription() {
    const $text = document.createTextNode(this.description ?? '')
    this._renderContent(this.ref.$description, $text)
  }
}

if (!customElements.get('bl-step')) {
  customElements.define('bl-step', BlocksStep)
}
