import { BlocksList } from '../list/index.js';
import { BlocksPopup } from '../popup/index.js';
import { upgradeProperty } from '../../common/upgradeProperty.js'
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
import { dispatchEvent } from '../../common/event.js';

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
bl-list {
  width: 200px;
  height: 240px;
  font-size: 14px;
}
`

// events
const CLICK_ITEM = 'click-item'
const CHANGE = 'change'

const ATTRS = BlocksPopup.observedAttributes.concat(BlocksList.observedAttributes)

export class BlocksPopupList extends BlocksPopup {
  static get observedAttributes() {
    return ATTRS
  }

  get data() {
    return this.$list.data
  }

  set data(value) {
    this.$list.data = value
  }

  get checked() {
    return this.$list.checked
  }

  set checked(ids) {
    this.$list.checked = ids
  }

  get checkedData() {
    return this.$list.checkedData
  }

  set checkedData(value) {
    this.$list.checkedData = value
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

  constructor() {
    super()
    this.shadowRoot.insertBefore(cssTemplate.cloneNode(true), this.$layout)
    this.$list = this.$layout.insertBefore(document.createElement('bl-list'), this.$slot)
  }

  connectedCallback() {
    super.connectedCallback()
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    if (!this.hasAttribute('origin')) {
      this.origin = 'top-start'
    }
    this.render()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (BlocksPopup.observedAttributes.includes(attrName)) {
      super.attributeChangedCallback(attrName, oldValue, newValue)
    }
    if (BlocksList.observedAttributes.includes(attrName)) {
      this.$list.setAttribute(attrName, newValue)
    }
    if (attrName === 'open') {
      if (this.open) this.$list.redraw()
    }
  }
}

if (!customElements.get('bl-popup-list')) {
  customElements.define('bl-popup-list', BlocksPopupList)
}
