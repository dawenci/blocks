import BlocksPopup from '../popup/index.js';
import '../list/index.js';
import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import { boolGetter, boolSetter } from '../../common/property.js'
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
  __transition_duration,
} from '../../theme/var.js'

const cssTemplate = document.createElement('template')
cssTemplate.innerHTML = `
<style>
::slotted(bl-list) {
  width: 200px;
  height: 240px;
  font-size: 14px;
}
</style>
`

const template = document.createElement('template')
template.innerHTML = `
<bl-list></bl-list>
`

const LIST_ATTRS = ['border', 'disabled-field', 'id-field', 'label-field', 'multiple', 'stripe']

export default class BlocksPopupList extends BlocksPopup {
  static get observedAttributes() {
    return super.observedAttributes.concat(LIST_ATTRS)
  }

  constructor() {
    super()
    this.shadowRoot.appendChild(cssTemplate.content.cloneNode(true))
    const fragment = template.content.cloneNode(true)
    this.$list = fragment.querySelector('bl-list')
    this.origin = this.getAttribute('origin') ?? 'top-start'
    this.appendChild(this.$list)
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
  }

  render() {
    super.render()
  }

  connectedCallback() {
    super.connectedCallback()
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (BlocksPopup.observedAttributes.includes(attrName)) {
      super.attributeChangedCallback(attrName, oldValue, newValue)
    }
    if (LIST_ATTRS.includes(attrName)) {
      this.$list.setAttribute(attrName, newValue)
    }
  }
}

if (!customElements.get('bl-popup-list')) {
  customElements.define('bl-popup-list', BlocksPopupList)
}
