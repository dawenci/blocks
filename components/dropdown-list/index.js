import '../popup/index.js'
import '../list/index.js'
import '../button/index.js'
import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach, makeRgbaColor } from '../../common/utils.js'
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

const template = document.createElement('template')
template.innerHTML = `<slot id="slot"></slot>`

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = '<blocks-popup></blocks-popup>'

const listTemplate = document.createElement('template')
listTemplate.innerHTML = '<blocks-list></blocks-list>'

const POPUP_ATTRS = [
  'open',
  'origin',
  'anchor',
  'inset',
  'append-to-body',
  'arrow',
  'autoflip',
  'autofocus',
  'restorefocus',
  'capturefocus',
  'dark',
  'id-field',
  'label-field',
  'multiple',
  'trigger-mode'
]
const LIST_ATTRS = ['id-field', 'label-field', 'multiple']

const triggerModeGetter = enumGetter('trigger-mode', ['hover', 'click'])
const triggerModeSetter = enumSetter('trigger-mode', ['hover', 'click'])

export default class BlocksDropDownList extends HTMLElement {
  static get observedAttributes() {
    return POPUP_ATTRS.concat(LIST_ATTRS)
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$slot = this.shadowRoot.getElementById('slot')
    this.$popup = popupTemplate.content.cloneNode(true).querySelector('blocks-popup')
    this.$popup.anchor = () => this.$slot.assignedElements()?.[0] ?? this
    this.$popup.origin = 'top-start'
    this.$list = this.$popup.appendChild(listTemplate.content.cloneNode(true).querySelector('blocks-list'))
    this.$list.style.cssText="width:200px;height:250px;"

    forEach(this.attributes, (attr) => {
      if (POPUP_ATTRS.includes(attr.name)) {
        this.$popup.setAttribute(attr.name, attr.value)
      }
      if (LIST_ATTRS.includes(attr.name)) {
        this.$list.setAttribute(attr.name, attr.value)
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
        this.$confirm = this.$popup.appendChild(document.createElement('blocks-button'))
        this.$confirm.block = true
        this.$confirm.size = 'small'
        this.$confirm.style.cssText = 'margin:5px;'
        this.$confirm.innerText = window?.blocksUI?.messages?.confirm ?? '确定'
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
    this._clearClick = onClickOutside([this, this.$popup], () => (this.open = false))
  }

  disconnectedCallback() {
    document.body.removeChild(this.$popup)
    this._clearClick()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (POPUP_ATTRS.includes(name)) {
      this.$popup.setAttribute(name, newValue)
    }
    if (LIST_ATTRS.includes(name)) {
      this.$list.setAttribute(name, newValue)
    }
    this.render()
  }
}

if (!customElements.get('blocks-dropdown-list')) {
  customElements.define('blocks-dropdown-list', BlocksDropDownList)
}
