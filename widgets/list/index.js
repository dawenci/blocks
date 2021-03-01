import { setDisabled, setRole, setTabindex } from '../core/accessibility.js'
import { boolGetter, boolSetter } from '../core/property.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { forEach, makeRgbaColor } from '../core/utils.js'
import { definePrivate } from '../core/definePrivate.js'
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
  font-family: ${$fontFamily};
  transition: color ${$transitionDuration}, border-color ${$transitionDuration};
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
  border-color: ${$colorPrimary};
  border-left-width: 1px;
  border-bottom-width: 1px;
  transform: rotate(-45deg);
}
.item:hover {
  background-color: ${makeRgbaColor($colorPrimary, .1)};
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
    return this._selected
  }

  set selected(ids) {
    this._selected = Array.isArray(ids) ? ids : []
    this.render()
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
    forEach(this.selected, id => {
      this.selectedMap[id] = true
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
    }
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

if (!customElements.get('blocks-list')) {
  customElements.define('blocks-list', BlocksList)
}
