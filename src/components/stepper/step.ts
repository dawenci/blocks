import type { NullableEnumAttr } from '../../decorators/attr.js'
import type { BlocksSteps } from './steps.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { parseIcon } from '../../icon/index.js'
import { Component } from '../Component.js'
import { template } from './step.template.js'
import { style } from './step.style.js'
import { domRef } from '../../decorators/domRef.js'

const statusEnum = ['wait', 'process', 'success', 'error']

@defineClass({
  customElement: 'bl-step',
  styles: [style],
})
export class BlocksStep extends Component {
  @attr('string') accessor stepTitle!: string

  @attr('string') accessor description!: string

  @attr('string') accessor icon!: string

  @attr('enum', { enumValues: statusEnum })
  accessor status!: NullableEnumAttr<typeof statusEnum>

  @domRef('#layout') accessor $layout!: HTMLElement

  @domRef('#icon') accessor $icon!: HTMLElement

  @domRef('#title') accessor $title!: HTMLElement

  @domRef('#description') accessor $description!: HTMLElement

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())

    const slots = shadowRoot.querySelectorAll(
      'slot'
    ) as ArrayLike<HTMLSlotElement>
    Array.prototype.forEach.call(slots, $slot => {
      const $parent = $slot.parentElement
      $slot.addEventListener('slotchange', () => {
        switch ($parent) {
          case this.$icon:
            return this._renderIcon()
          case this.$title:
            return this._renderTitle()
          case this.$description:
            return this._renderDescription()
        }
      })
    })
  }

  get $stepper(): BlocksSteps {
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
    this._renderContent(this.$icon, $default)
  }

  _renderTitle() {
    this._renderContent(this.$title, document.createTextNode(this.stepTitle!))
  }

  _renderDescription() {
    const $text = document.createTextNode(this.description ?? '')
    this._renderContent(this.$description, $text)
  }
}
