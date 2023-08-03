import type { BlSteps } from './steps.js'
import { attr, attrs } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { parseIcon } from '../../icon/index.js'
import { style } from './step.style.js'
import { template } from './step.template.js'
import { BlComponent } from '../component/Component.js'

const statusEnum = ['wait', 'process', 'success', 'error']

@defineClass({
  customElement: 'bl-step',
  styles: [style],
})
export class BlStep extends BlComponent {
  @attr('enum', { enumValues: ['horizontal', 'vertical'] })
  accessor direction!:  MaybeOneOf<['horizontal', 'vertical']>

  @attr('string') accessor stepTitle!: string

  @attr('string') accessor description!: string

  @attr('string') accessor icon!: string

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @attr('enum', { enumValues: statusEnum })
  accessor status!:  MaybeOneOf<typeof statusEnum>

  @shadowRef('#layout') accessor $layout!: HTMLElement

  @shadowRef('#icon') accessor $icon!: HTMLElement

  @shadowRef('#title') accessor $title!: HTMLElement

  @shadowRef('#description') accessor $description!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())
    const slots = this.querySelectorAllShadow('slot') as ArrayLike<HTMLSlotElement>
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

    this.hook.onConnected(() => {
      if (this.parentElement!.tagName !== 'BL-STEPPER') {
        this.parentElement!.removeChild(this)
        throw new Error('The parent element of `bl-step` should be `bl-stepper`.')
      }
    })

    this.hook.onConnected(this.render)
    this.hook.onAttributeChangedDep('icon', this._renderIcon)
    this.hook.onAttributeChangedDep('step-title', this._renderTitle)
    this.hook.onAttributeChangedDep('description', this._renderDescription)
  }

  get $stepper(): BlSteps {
    return this.closest('bl-stepper')! as BlSteps
  }

  override render() {
    super.render()
    this._renderIcon()
    this._renderTitle()
    this._renderDescription()
  }

  _renderContent($slotParent: HTMLElement, $default: HTMLElement | SVGElement | Text) {
    let empty = true
    const $slot = $slotParent.querySelector('slot')!
    if ($slot.assignedNodes().filter($node => $node.nodeType === 1 || $node.nodeType === 3).length) {
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
    let $default: HTMLElement | SVGElement | null = this.icon ? parseIcon(this.icon) : null
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
