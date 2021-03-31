import VList, { VirtualItem } from '../vlist/index.js'
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
  __fg_base,
} from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'

const TEMPLATE_CSS = `
<style>
:host {
  --item-height: var(--height-base, ${__height_base});

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


#scrollable {
  box-sizing: border-box;
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

#list-size {
  box-sizing: border-box;
  width: 100%;
}
#list {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
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
.item.selected .suffix:after {
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
  background-color: ${rgbaFromHex(__color_primary, .1)};
}

</style>
`
const TMEPLATE_HTML = `
<bl-scrollable id="scrollable">
  <div id="list-size"></div>
  <div id="list"></div>  
</bl-scrollable>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TMEPLATE_HTML

const itemTemplate = document.createElement('template')
itemTemplate.innerHTML = `
<div class="item">
  <div class="prefix"></div>
  <div class="label"></div>
  <div class="suffix"></div>
</div>
`

class BlocksList extends VList {
  static get observedAttributes() {
    return super.observedAttributes.concat(['border', 'disabled', 'disabled-field', 'id-field', 'label-field', 'selectable', 'stripe'])
  }

  constructor() {
    super()
    const shadowRoot = this.shadowRoot
    shadowRoot.appendChild(template.content.cloneNode(true))
    // this.$scrollable = shadowRoot.getElementById('scrollable')
    // this.$listSize = shadowRoot.getElementById('list-size')
    // this.$list = shadowRoot.getElementById('list')

    // this._$pool = []

    // definePrivate(this, '_data', [])
    definePrivate(this, '_selected', [])

    this.$list.onclick = e => {
      if (this.disabled) return

      let $item = e.target
      if ($item === this.$list) return
      while ($item !== this.$list) {
        if ($item.classList.contains('item')) { break }
        $item = $item.parentElement
      }
      if ($item.hasAttribute('disabled')) return

      dispatchEvent(this, 'click-item', { detail: { id: $item.dataset.id } })

      if (this.selectable) {
        this._selectItem($item)
      } 
    }

    // this.$scrollable.onscroll = this.render.bind(this)
  }

  // get data() {
  //   return this._data
  // }

  // set data(value) {
  //   this._data = Array.isArray(value) ? value : []
  //   this.render()
  // }

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

  get selectable() {
    return enumGetter('selectable', [null, 'single', 'multiple'])(this)
  }

  set selectable(value) {
    enumSetter('selectable', [null, 'single', 'multiple'])(this, value)
  }

  get selected() {
    return this.multiple ? this._selected : this._selected[0]
  }

  set selected(ids) {
    this._selected = this.multiple ? Array.isArray(ids) ? ids : [ids] : [ids]
    this.render()
    dispatchEvent(this, 'change', { detail: { value: this.multiple ? this._selected : this._selected[0] } })
  }

  get single() {
    return this.selectable === 'single'
  }

  get multiple() {
    return this.selectable === 'multiple'
  }

  itemRender($item, vitem) {
    const id = vitem.data[this.idField] ?? ''
    const label = vitem.data[this.labelField] ?? ''
    const isDisabled = vitem.data[this.disabledField] ?? false
    $item.classList.add('item')
    $item.dataset.id = id
    $item.innerHTML = `<div class="prefix"></div><div class="label"></div><div class="suffix"></div>`
    $item.children[1].innerHTML = label

    const selectedMap = Object.create(null)
    forEach(this._selected, id => {
      selectedMap[id] = true
    })

    if (isDisabled) {
      $item.setAttribute('disabled', '')
    }
    else {
      $item.removeAttribute('disabled')
    }
    if (selectedMap[id]) {
      $item.classList.add('selected')
    }
    else {
      $item.classList.remove('selected')
    }
  }

  _selectItem($item) {
    if (this.multiple) {
      $item.classList.toggle('selected')
      this._selected.push($item.dataset.id)
    }
    else {
      forEach(this.$list.children, $child => {
        if ($child !== $item) {
          $child.classList.remove('selected')
        }
        else {
          $child.classList.add('selected')
        }
      })
      this._selected = [$item.dataset.id]
    }
    dispatchEvent(this, 'change', { detail: { value: this.multiple ? this._selected : this._selected[0] } })
  }

  connectedCallback() {
    super.connectedCallback()
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue)
    // 从多选改成单选，保留最后一个选择的值
    if (name === 'selectable') {
      if (!this.multiple && this._selected.length) {
        this._selected = [this._selected[this._selected.length - 1]]
      }
    }
  }
}

if (!customElements.get('bl-list')) {
  customElements.define('bl-list', BlocksList)
}
