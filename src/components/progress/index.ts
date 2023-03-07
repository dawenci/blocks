import { Component } from '../Component.js'
import { template } from './template.js'
import { customElement } from '../../decorators/customElement.js'
import { applyStyle } from '../../decorators/style.js'
import { NullableEnumAttr, attr } from '../../decorators/attr.js'

const status = ['success', 'error', 'warning']

export interface BlocksProgress extends Component {
  _ref: {
    $progress: HTMLElement
    $value: HTMLElement
  }
}

@customElement('bl-progress')
export class BlocksProgress extends Component {
  static override get observedAttributes() {
    return ['value', 'status', 'percentage']
  }

  @attr('number') accessor value!: number | null

  @attr('enum', { enumValues: status }) accessor status!: NullableEnumAttr<
    typeof status
  >

  @attr('boolean') accessor percentage!: boolean

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template().content.cloneNode(true))
    const $progress = shadowRoot.querySelector('#progress') as HTMLElement
    const $value = shadowRoot.querySelector('#value') as HTMLElement

    this._ref = {
      $progress,
      $value,
    }
  }

  override render() {
    this._ref.$progress.style.width = `${this.value}%`
    if (this.percentage) {
      this._ref.$value.style.display = 'block'
      this._ref.$value.textContent = `${this.value}%`
    } else {
      this._ref.$value.style.display = 'none'
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this.render()
  }
}
