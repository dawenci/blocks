import '../popup/index.js';
import '../list/index.js';
import { setDisabled, setRole, setTabindex } from '../core/accessibility.js'
import { boolGetter, boolSetter } from '../core/property.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { forEach, makeRgbaColor } from '../core/utils.js'
import {
  $fontFamily,
  $colorPrimary,
  $colorPrimaryLight,
  $colorPrimaryDark,
  $colorDisabled,
  $borderColorBase,
  $borderColorDisabled,
  $backgroundColorDisabled,
  $transitionDuration,
} from '../theme/var.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: block;
  box-sizing: border-box;
  font-family: ${$fontFamily};
  text-align: center;
  transition: color ${$transitionDuration}, border-color ${$transitionDuration};
  contain: content;
  font-size: 14px;
}
</style>
`

const TMEPLATE_HTML = `
<blocks-popup append-to-body>
  <blocks-list id="list" style="width:200px;height:400px;"></blocks-list>
</blocks-popup>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TMEPLATE_HTML

class BlocksDropDownList extends HTMLElement {
  static get observedAttributes() {
    return ['id-field', 'label-field', 'multiple', 'open']
  }

  constructor() {
    super()
    const fragment = template.content.cloneNode(true)
    this.$popup = fragment.querySelector('blocks-popup')
    this.$list = fragment.getElementById('list')   
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(fragment)
  }

  get open() {
    return this.$popup.open
  }

  set open(value) {
    this.$popup.open = value
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
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }
}

if (!customElements.get('blocks-dropdown-list')) {
  customElements.define('blocks-dropdown-list', BlocksDropDownList)
}
