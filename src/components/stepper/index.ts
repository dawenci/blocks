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
import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import type { EnumAttrs, NullableEnumAttr } from '../../decorators/attr.js'

const statusEnum = ['wait', 'process', 'success', 'error']

export interface BlocksSteps extends Component {
  _ref: {
    $slot: HTMLSlotElement
    $layout: HTMLElement
  }
}

@defineClass({
  customElement: 'bl-stepper',
})
export class BlocksSteps extends Component {
  static override get observedAttributes() {
    return ['direction', 'size']
  }

  @attr('enum', { enumValues: ['horizontal', 'vertical'] })
  accessor direction!: NullableEnumAttr<['horizontal', 'vertical']>

  @attrs.size accessor size!: EnumAttrs['size']

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(stepperTemplate.content.cloneNode(true))
    const $slot = shadowRoot.querySelector('slot') as HTMLSlotElement
    const $layout = shadowRoot.getElementById('layout') as HTMLElement

    this._ref = {
      $slot,
      $layout,
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  stepIndex($step: HTMLElement) {
    return this._ref.$slot.assignedElements().findIndex($el => $el === $step)
  }
}

export interface BlocksStep extends Component {
  _ref: {
    $layout: HTMLElement
    $icon: HTMLElement
    $title: HTMLElement
    $description: HTMLElement
  }
}

@defineClass({
  customElement: 'bl-step',
})
export class BlocksStep extends Component {
  static override get observedAttributes() {
    return ['step-title', 'description', 'icon', 'status']
  }

  @attr('string') accessor stepTitle!: string

  @attr('string') accessor description!: string

  @attr('string') accessor icon!: string

  @attr('enum', { enumValues: statusEnum })
  accessor status!: NullableEnumAttr<typeof statusEnum>

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(stepTemplate.content.cloneNode(true))

    const $layout = shadowRoot.getElementById('layout') as HTMLElement
    const $icon = shadowRoot.getElementById('icon') as HTMLElement
    const $title = shadowRoot.getElementById('title') as HTMLElement
    const $description = shadowRoot.getElementById('description') as HTMLElement

    this._ref = {
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
    this._renderContent(this._ref.$icon, $default)
  }

  _renderTitle() {
    this._renderContent(
      this._ref.$title,
      document.createTextNode(this.stepTitle!)
    )
  }

  _renderDescription() {
    const $text = document.createTextNode(this.description ?? '')
    this._renderContent(this._ref.$description, $text)
  }
}
