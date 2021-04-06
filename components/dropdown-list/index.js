import '../button/index.js'
import BlocksPopupList from '../popup-list/index.js'

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
} from '../../theme/var.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { makeMessages } from '../../i18n/makeMessages.js'
import { dispatchEvent } from '../../common/event.js'

const getMessage = makeMessages('dropdown-list', {
  confirm: '确定'
})

const template = document.createElement('template')
template.innerHTML = `<slot id="slot"></slot>`

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = '<bl-popup-list></bl-popup-list>'

const listTemplate = document.createElement('template')
listTemplate.innerHTML = '<bl-list selectable="single"></bl-list>'

const triggerModeGetter = enumGetter('trigger-mode', ['hover', 'click'])
const triggerModeSetter = enumSetter('trigger-mode', ['hover', 'click'])

const ATTRS = BlocksPopupList.observedAttributes.concat(['trigger-mode'])

export default class BlocksDropDownList extends HTMLElement {
  static get observedAttributes() {
    return ATTRS
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$slot = this.shadowRoot.getElementById('slot')

    this.$popup = document.createElement('bl-popup-list')
    this.$popup.anchor = () => this.$slot.assignedElements()?.[0] ?? this

    forEach(this.attributes, (attr) => {
      if (BlocksPopupList.observedAttributes.includes(attr.name)) {
        this.$popup.setAttribute(attr.name, attr.value)
      }
    })

    this.addEventListener('click', (e) => {
      clearTimeout(this._timer)
      this.open = true
    })

    const onenter = () => {
      if (this.triggerMode === 'hover') {
        clearTimeout(this._timer)
        this.open = true
      }
    }

    const onleave = () => {
      if (this.triggerMode === 'hover') {
        clearTimeout(this._timer)
        this._timer = setTimeout(() => {
          this.open = false
        }, 200)
      }
    }

    this.addEventListener('mouseenter', onenter)
    this.$popup.addEventListener('mouseenter', onenter)
    this.addEventListener('mouseleave', onleave)
    this.$popup.addEventListener('mouseleave', onleave)

    this.$popup.addEventListener('opened', () => {
      this._initClickOutside()
      this.$popup.$list.redraw()
    })

    this.$popup.addEventListener('closed', () => {
      this._destroyClickOutside()
    })

    this.$popup.addEventListener('click-item', event => {
      dispatchEvent(this, 'click-item', { detail: { id: event.detail.id } })
    })
    
    this.$popup.addEventListener('change', event => {
      const $trigger = this.$slot.assignedElements()?.[0]
      if ($trigger && $trigger.acceptValue) {
        if (this.$list.multiple) {
          const value = this.$popup.checkedData
          $trigger.acceptValue(value.map(item => ({ value: this.$list.internalKeyMethod(item), label: this.$list.internalLabelMethod(item) })))
          this.labelField
        }
        else {
          const value = this.$popup.checkedData[0] ?? {}
          $trigger.acceptValue({
            value: this.$list.internalKeyMethod(value),
            label: this.$list.internalLabelMethod(value),
          })
        }
      }

      dispatchEvent(this, 'change', { detail: event.detail })
    })    
  }

  get $list() {
    return this.$popup.$list
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

  get data() {
    return this.$list.data
  }

  set data(value) {
    this.$list.data = value
  }

  get selected() {
    return this.$list.selected
  }

  set selected(ids) {
    this.$list.selected = ids
  }

  get idField() {
    return this.$list.idField
  }

  set idField(value) {
    this.$list.idField = value
  }

  get labelField() {
    return this.$list.labelField
  }

  set labelField(value) {
    this.$list.labelField = value
  }

  get multiple() {
    return this.$list.multiple
  }

  set multiple(value) {
    this.$list.multiple = value
    this.render()
  }

  render() {
    if (this.multiple) {
      if (!this.$confirm) {
        this.$confirm = this.$popup.appendChild(document.createElement('bl-button'))
        this.$confirm.block = true
        this.$confirm.size = 'small'
        this.$confirm.style.cssText = 'margin:5px;'
        this.$confirm.innerText = getMessage('confirm')
        this.$confirm.onclick = () => this.open = false
      }
    }
    else {
      if (this.$confirm) {
        this.$popup.removeChild(this.$confirm)
        this.$confirm = null
      }
    }
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

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (BlocksPopupList.observedAttributes.includes(attrName)) {
      this.$popup.setAttribute(attrName, newValue)
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

if (!customElements.get('bl-dropdown-list')) {
  customElements.define('bl-dropdown-list', BlocksDropDownList)
}
