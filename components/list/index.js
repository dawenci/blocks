import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach, makeRgbaColor } from '../../common/utils.js'
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
} from '../theme/var.js'
import { dispatchEvent } from '../../common/event.js'

const TEMPLATE_CSS = `
<style>
::-webkit-scrollbar {
  background: transparent;
  background: rgba(0, 0, 0, .075);
}
::-webkit-scrollbar:vertical {
  width: 6px;
  height: 100%;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  border: 1px solid rgba(255, 255, 255, .3);
  background: rgba(0, 0, 0, .2);
}
::-webkit-scrollbar-corner {
  background: transparent;
}
* {
  scrollbar-width: thin;
}

:host {
  display: block;
  box-sizing: border-box;
  font-family: var(--font-family, ${__font_family});
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
  contain: content;
  font-size: 14px;
}

#layout {
  box-sizing: border-box;
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

#list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}
.item:nth-child(even) {
  background-color: rgba(0,0,0,.04);
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
  background-color: ${makeRgbaColor(__color_primary, .1)};
}

</style>
`
const TMEPLATE_HTML = `
<div id="layout">
  <div id="list"></div>
</div>
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

class BlocksList extends HTMLElement {
  static get observedAttributes() {
    return ['id-field', 'label-field', 'multiple']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$list = shadowRoot.getElementById('list')

    definePrivate(this, '_data', [])
    definePrivate(this, '_selected', [])

    this.$list.onclick = e => {
      let $item = e.target
      if ($item === this.$list) return
      while ($item !== this.$list) {
        if ($item.classList.contains('item')) { break }
        $item = $item.parentElement
      }
      this._selectItem($item)
    }
  }

  get data() {
    return this._data
  }

  set data(value) {
    this._data = Array.isArray(value) ? value : []
    this.render()
  }

  get selected() {
    return this.multiple ? this._selected : this._selected[0]
  }

  set selected(ids) {
    this._selected = this.multiple ? Array.isArray(ids) ? ids : [ids] : [ids]
    this.render()
    dispatchEvent(this, 'change', { detail: { value: this.multiple ? this._selected : this._selected[0] } })
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

  get multiple() {
    return boolGetter('multiple')(this)
  }

  set multiple(value) {
    boolSetter('multiple')(this, value)
  }

  render() {
    // 确保节点数量
    let items = this.$list.children
    let count = items.length - this.data.length
    if (count < 0) {
      count *= -1
      while (count--) {
        this.$list.appendChild(itemTemplate.content.cloneNode(true))
      }
    }
    else if (count > 0) {
      while (count--) {
        this.$list.removeChild(this.$list.lastElementChild)
      }
    }

    const selectedMap = Object.create(null)
    forEach(this._selected, id => {
      selectedMap[id] = true
    })
    const { idField: idField, labelField } = this
    forEach(this.$list.children, (item, index) => {
      const data = this.data[index] ?? {}
      const id = data[idField] ?? ''
      const label = data[labelField] ?? ''

      item.dataset.id = id
      item.children[1].innerHTML = label

      if (selectedMap[id]) {
        item.classList.add('selected')
      }
      else {
        item.classList.remove('selected')
      }
    })
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
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // 从多选改成单选，保留最后一个选择的值
    if (name === 'multiple') {
      if (!this.multiple && this._selected.length) {
        this._selected = [this._selected[this._selected.length - 1]]
      }
    }

    this.render()
  }
}

if (!customElements.get('blocks-list')) {
  customElements.define('blocks-list', BlocksList)
}
