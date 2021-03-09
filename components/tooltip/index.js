import BlocksPopup from '../popup/index.js'
import { enumGetter, enumSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach } from '../../common/utils.js'
import {
  __font_family,
  __color_primary,
  __color_primary_light,
  __color_primary_dark,
  __fg_disabled,
  __border_color_base,
  __border_color_disabled,
  __bg_disabled,
  __transition_duration
} from '../theme/var.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { dispatchEvent } from '../../common/event.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
  display: inline-block;
}
</style>
<slot id="slot"></slot>
<span style="display:none;"><slot name="content"></slot></span>
`

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = '<bl-popup></bl-popup>'

const ATTRS = [
  'trigger-mode',
  'content',
]

const triggerModeGetter = enumGetter('trigger-mode', ['hover', 'click'])
const triggerModeSetter = enumSetter('trigger-mode', ['hover', 'click'])

export default class BlocksTooltip extends HTMLElement {
  static get observedAttributes() {
    return BlocksPopup.observedAttributes.concat(ATTRS)
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$slot = this.shadowRoot.getElementById('slot')

    this.$popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup')
    this.$popup.anchor = () => this.$slot.assignedElements()?.[0] ?? this
    this.$popup.setAttribute('arrow', '')
    this.$popup.setAttribute('append-to-body', '')
    this.$popup.setAttribute('origin', 'bottom-center')
    forEach(this.attributes, (attr) => {
      if (BlocksPopup.observedAttributes.includes(attr.name)) {
        this.$popup.setAttribute(attr.name, attr.value)
      }
    })

    this.addEventListener('click', (e) => {
      clearTimeout(this._timer)
      this.open = true
    })

    const onmouseenter = () => {
      if (this.triggerMode === 'hover') {
        clearTimeout(this._timer)
        this.open = true
      }
    }

    const onmouseleave = () => {
      if (this.triggerMode === 'hover') {
        clearTimeout(this._timer)
        this._timer = setTimeout(() => {
          this.open = false
        }, 200)
      }
    }

    this.addEventListener('mouseenter', onmouseenter)
    this.$popup.addEventListener('mouseenter', onmouseenter)
    this.addEventListener('mouseleave', onmouseleave)
    this.$popup.addEventListener('mouseleave', onmouseleave)

    this.$popup.addEventListener('open', () => {
      this._initClickOutside()
    })
    this.$popup.addEventListener('close', () => {
      this._destroyClickOutside()
    })
  }

  get content() {
    return this.getAttribute('content') ?? ''
  }

  set content(value) {
    this.setAttribute('content', value)
  }

  get open() {
    return this.$popup.open
  }

  set open(value) {
    this.$popup.open = value
  }

  get triggerMode() {
    return triggerModeGetter(this)
  }

  set triggerMode(value) {
    triggerModeSetter(this, value)
  }

  render() {
    this.$popup.innerHTML = `<div style="padding:15px;font-size:14px;">${this.content}</div>`
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach((attr) => {
      upgradeProperty(this, attr)
    })
    document.body.appendChild(this.$popup)
    this.render()
  }

  disconnectedCallback() {
    document.body.removeChild(this.$popup)
    this._destroyClickOutside()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (BlocksPopup.observedAttributes.includes(name)) {
      this.$popup.setAttribute(name, newValue)
    }
    this.render()
  }

  _initClickOutside() {
    if (!this._clearClickOutside) {
      this._clearClickOutside = onClickOutside([this, this.$popup], () => (this.open = false))
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
