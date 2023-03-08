import { BlocksPopup } from '../popup/index.js'
import { forEach } from '../../common/utils.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import type { EnumAttr } from '../../decorators/attr.js'

const ATTRS = ['trigger-mode', 'content', 'open-delay', 'close-delay']

@defineClass({
  customElement: 'bl-tooltip',
})
export class BlocksTooltip extends Component {
  static override get observedAttributes() {
    return BlocksPopup.observedAttributes.concat(ATTRS)
  }

  private $slot: HTMLSlotElement
  private $popup: BlocksPopup
  private _enterTimer?: number
  private _leaveTimer?: number
  private _clearClickOutside?: () => void

  @attr('string') accessor content = ''

  @attr('int') accessor openDelay = 200

  @attr('int') accessor closeDelay = 200

  @attr('enum', { enumValues: ['hover', 'click'] })
  accessor triggerMode: EnumAttr<['hover', 'click']> = 'hover'

  constructor() {
    super()

        const shadowRoot = this.shadowRoot!

    const { comTemplate, popupTemplate } = template()
    shadowRoot.appendChild(comTemplate.content.cloneNode(true))

    this.$slot = shadowRoot.getElementById('slot') as HTMLSlotElement
    this.$popup = (
      popupTemplate.content.cloneNode(true) as HTMLElement
    ).querySelector('bl-popup') as BlocksPopup

    this.$popup.anchor = () => this.$slot.assignedElements()?.[0] ?? this
    this.$popup.setAttribute('arrow', '')
    this.$popup.setAttribute('append-to-body', '')
    this.$popup.setAttribute('origin', 'bottom-center')
    forEach(this.attributes, attr => {
      if (BlocksPopup.observedAttributes.includes(attr.name)) {
        this.$popup.setAttribute(attr.name, attr.value)
      }
    })

    this.addEventListener('click', e => {
      clearTimeout(this._leaveTimer)
      this.open = true
    })

    const onmouseenter = () => {
      if (this.triggerMode === 'hover') {
        clearTimeout(this._leaveTimer)
        clearTimeout(this._enterTimer)
        this._enterTimer = setTimeout(() => {
          this.open = true
        }, this.openDelay ?? 0)
      }
    }

    const onmouseleave = () => {
      if (this.triggerMode === 'hover') {
        clearTimeout(this._enterTimer)
        clearTimeout(this._leaveTimer)
        this._leaveTimer = setTimeout(() => {
          this.open = false
        }, this.closeDelay ?? 0)
      }
    }

    this.addEventListener('mouseenter', onmouseenter)
    this.$popup.addEventListener('mouseenter', onmouseenter)
    this.addEventListener('mouseleave', onmouseleave)
    this.$popup.addEventListener('mouseleave', onmouseleave)

    this.$popup.addEventListener('opened', () => {
      this._initClickOutside()
    })
    this.$popup.addEventListener('closed', () => {
      this._destroyClickOutside()
    })
  }

  get open() {
    return this.$popup.open
  }

  set open(value) {
    this.$popup.open = value
  }

  override render() {
    this.$popup.innerHTML = `<div style="padding:15px;font-size:14px;">${this.content}</div>`
  }

  override connectedCallback() {
    super.connectedCallback()
    document.body.appendChild(this.$popup)
    this.render()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    document.body.removeChild(this.$popup)
    this._destroyClickOutside()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (BlocksPopup.observedAttributes.includes(attrName)) {
      this.$popup.setAttribute(attrName, newValue)
    }
    this.render()
  }

  _initClickOutside() {
    if (!this._clearClickOutside) {
      this._clearClickOutside = onClickOutside(
        [this, this.$popup],
        () => (this.open = false)
      )
    }
  }

  _destroyClickOutside() {
    if (this._clearClickOutside) {
      this._clearClickOutside()
      this._clearClickOutside = undefined
    }
  }
}
