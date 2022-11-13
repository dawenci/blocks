import { BlocksPopup } from '../popup/index.js'
import {
  enumGetter,
  enumSetter,
  intGetter,
  intSetter,
} from '../../common/property.js'
import { forEach } from '../../common/utils.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { Component } from '../Component.js'
import { template } from './template.js'

const ATTRS = ['trigger-mode', 'content', 'open-delay', 'close-delay']

const triggerModeGetter = enumGetter('trigger-mode', ['hover', 'click'])
const triggerModeSetter = enumSetter('trigger-mode', ['hover', 'click'])

export class BlocksTooltip extends Component {
  static override get observedAttributes() {
    return BlocksPopup.observedAttributes.concat(ATTRS)
  }

  private $slot: HTMLSlotElement
  private $popup: BlocksPopup
  private _enterTimer?: number
  private _leaveTimer?: number
  private _clearClickOutside?: () => void

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
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

  get content() {
    return this.getAttribute('content') ?? ''
  }

  set content(value) {
    this.setAttribute('content', value)
  }

  get openDelay() {
    return intGetter('open-delay')(this) ?? 200
  }

  set openDelay(value) {
    intSetter('open-delay')(this, value)
  }

  get closeDelay() {
    return intGetter('close-delay')(this) ?? 200
  }

  set closeDelay(value) {
    intSetter('close-delay')(this, value)
  }

  get open() {
    return this.$popup.open
  }

  set open(value) {
    this.$popup.open = value
  }

  get triggerMode() {
    return triggerModeGetter(this) ?? 'hover'
  }

  set triggerMode(value) {
    triggerModeSetter(this, value)
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

if (!customElements.get('bl-tooltip')) {
  customElements.define('bl-tooltip', BlocksTooltip)
}
