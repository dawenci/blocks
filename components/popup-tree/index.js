import BlocksTree from '../tree/index.js';
import BlocksPopup from '../popup/index.js';
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
bl-tree {
  width: 200px;
  height: 240px;
  font-size: 14px;
}
`

// events
const CLICK_ITEM = 'click-item'
const CHANGE = 'change'

const ATTRS = BlocksPopup.observedAttributes.concat(BlocksTree.observedAttributes)

export default class BlocksPopupTree extends BlocksPopup {
  static get observedAttributes() {
    return ATTRS
  }

  get data() {
    return this.$tree.data
  }

  set data(value) {
    this.$tree.data = value
  }

  get selected() {
    return this.$tree.selected
  }

  set selected(ids) {
    this.$tree.selected = ids
  }

  get idField() {
    return this.$tree.idField
  }

  set idField(value) {
    this.$tree.idField = value
  }

  get labelField() {
    return this.$tree.labelField
  }

  set labelField(value) {
    this.$tree.labelField = value
  }

  get multiple() {
    return this.$tree.multiple
  }

  set multiple(value) {
    this.$tree.multiple = value
  }  

  constructor() {
    super()
    this.shadowRoot.insertBefore(cssTemplate.cloneNode(true), this.$layout)
    this.$tree = this.$layout.insertBefore(document.createElement('bl-tree'), this.$slot)
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
    if (BlocksTree.observedAttributes.includes(attrName)) {
      this.$tree.setAttribute(attrName, newValue)
    }
    if (attrName === 'open') {
      if (this.open) this.$tree.redraw()
    }
  }
}

if (!customElements.get('bl-popup-tree')) {
  customElements.define('bl-popup-tree', BlocksPopupTree)
}
