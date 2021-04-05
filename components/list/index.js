import VList from '../vlist/index.js'
import '../scrollable/index.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach } from '../../common/utils.js'
import { rgbaFromHex } from '../../common/color.js'
import { definePrivate } from '../../common/definePrivate.js'
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
  __height_base,
  __border_color_light,
  __fg_base
} from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
  display: block;
  box-sizing: border-box;
  font-family: var(--font-family, ${__font_family});
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
  contain: content;
  font-size: 14px;
  color: var(--fg-base, ${__fg_base});
}
:host([disabled]) {
  color: var(--fg-disabled, ${__fg_disabled});
}

.item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  height: var(--item-height);
}
:host([disabled]) .item,
.item[disabled] {
  cursor: not-allowed;
  color: var(--fg-disabled, ${__fg_disabled});
}

:host([stripe]) .item:nth-child(even) {
  background-color: rgba(0,0,0,.025);
}

:host([border]) .item:before,
:host([border]) .item:after {
  position: absolute;
  top: auto;
  right: 0;
  bottom: auto;
  left: 0;
  display: block;
  content: '';
  height: 1px;
  background: rgba(0,0,0,.05);
  transform: scale(1, 0.5);
}
:host([border]) .item:before {
  top: -0.5px;
}
:host([border]) .item:after {
  bottom: -0.5px;
}
:host([border]) .item:first-child:before,
:host([border]) .item:last-child:after {
  display: none;
}

.label {
  flex: 1 1 auto;
  padding: 4px;
}
.prefix:empty+.label {
  padding-left: 12px;
}
.prefix {
  flex: 0 0 auto;
}
.suffix {
  flex: 0 0 24px;
}
.item.checked .suffix:after {
  position: relative;
  display: block;
  content: '';
  width: 8px;
  height: 5px;
  margin: auto;
  border-width: 0;
  border-style: solid;
  border-color: var(--color-primary, ${__color_primary});
  border-left-width: 1px;
  border-bottom-width: 1px;
  transform: rotate(-45deg);
}
.item:hover {
  background-color: ${rgbaFromHex(__color_primary, 0.1)};
}

</style>
`

const itemTemplate = document.createElement('template')
itemTemplate.innerHTML = `
<div class="item">
  <div class="prefix"></div>
  <div class="label"></div>
  <div class="suffix"></div>
</div>
`

export default class BlocksList extends VList {
  static get observedAttributes() {
    return super.observedAttributes.concat([
      'border',
      'disabled',
      'disabled-field',
      'id-field',
      'label-field',
      'checkable',
      'stripe'
    ])
  }

  get disabled() {
    return boolGetter('disabled')(this)
  }

  set disabled(value) {
    boolSetter('disabled')(this, value)
  }

  get disabledField() {
    return this.getAttribute('disabled-field') ?? 'disabled'
  }

  set disabledField(value) {
    this.setAttribute('disabled-field', value)
  }

  get idField() {
    return this.getAttribute('id-field') || 'id'
  }

  set idField(value) {
    this.setAttribute('id-field', value)
  }

  get labelField() {
    return this.getAttribute('label-field') || 'label'
  }

  set labelField(value) {
    this.setAttribute('label-field', value)
  }

  get checkable() {
    return enumGetter('checkable', [null, 'single', 'multiple'])(this)
  }

  set checkable(value) {
    enumSetter('checkable', [null, 'single', 'multiple'])(this, value)
  }

  get checkedData() {
    return [...this._checkedSet].map(vitem => vitem.data)
  }

  set checkedData(value) {
    this._checkedSet = new Set(value.map(data => this.virtualDataMap[this.keyMethod(data)]).filter(vitem => !!vitem))
  }

  get checked() {
    return this.multiple ? this.checkedData.map(vitem => vitem.virtualKey) : this.checkedData[0]?.virtualKey
  }

  set checked(ids) {
    const list = this.multiple ? (Array.isArray(ids) ? ids : [ids]) : [ids]
    this._checkedSet = new Set(list.map(id => this.getVirtualItemByKey(id)).filter(vitem => !!vitem))
    this.render()
    dispatchEvent(this, 'change')
  }

  get single() {
    return this.checkable === 'single'
  }

  get multiple() {
    return this.checkable === 'multiple'
  }

  constructor() {
    super()
    const shadowRoot = this.shadowRoot
    shadowRoot.insertBefore(template.content.cloneNode(true), this.$viewport)

    definePrivate(this, '_checkedSet', new Set())

    this.$list.onclick = (e) => {
      if (this.disabled) return

      let $item = e.target
      if ($item === this.$list) return
      while ($item !== this.$list) {
        if ($item.classList.contains('item')) {
          break
        }
        $item = $item.parentElement
      }
      if ($item.hasAttribute('disabled')) return

      dispatchEvent(this, 'click-item', { detail: { id: $item.dataset.id, data: this.getVirtualItemByKey($item.dataset.id)?.data } })

      if (this.checkable) {
        this._selectItem($item)
      }
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue)
    // 从多选改成单选，保留最后一个选择的值
    if (name === 'checkable') {
      if (!this.multiple && this._checkedSet.size) {
        this._checkedSet = new Set([...this._checkedSet][this._checkedSet.size - 1])
      }
    }
  }

  keyMethod(data) {
    return data[this.idField]
  }

  itemRender($item, vitem) {
    const id = vitem.data[this.idField] ?? ''
    const label = vitem.data[this.labelField] ?? ''
    const isDisabled = vitem.data[this.disabledField] ?? false
    $item.classList.add('item')
    $item.dataset.id = id
    $item.innerHTML = `<div class="prefix"></div><div class="label"></div><div class="suffix"></div>`
    $item.children[1].innerHTML = label

    if (isDisabled) {
      $item.setAttribute('disabled', '')
    } else {
      $item.removeAttribute('disabled')
    }
    if (this._checkedSet.has(vitem)) {
      $item.classList.add('checked')
    } else {
      $item.classList.remove('checked')
    }
  }

  _selectItem($item) {
    const vitem = this.virtualDataMap[$item.dataset.id]
    if (this.multiple) {
      $item.classList.toggle('checked')
      this._checkedSet[this._checkedSet.has(vitem) ? 'delete' : 'add'](vitem)
    } else {
      forEach(this.$list.children, ($child) => {
        if ($child !== $item) {
          $child.classList.remove('checked')
        } else {
          $child.classList.add('checked')
        }
      })
      this._checkedSet = new Set([vitem])
    }

    dispatchEvent(this, 'change')
  }  
}

if (!customElements.get('bl-list')) {
  customElements.define('bl-list', BlocksList)
}
