import { setDisabled, setRole, setTabindex } from '../core/accessibility.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { forEach } from '../core/utils.js'
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
  display: inline-block;
  box-sizing: border-box;
  font-family: ${$fontFamily};
  text-align: center;
  transition: color ${$transitionDuration}, border-color ${$transitionDuration};
  all: initial;
  contain: content;
}

#layout {
  position: relative;
  width: 100%;
  height: 100%;
}

#list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}
`
const TMEPLATE_HTML = `
<div id="layout">
  <div id="list"></div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TMEPLATE_HTML

class BlocksList extends HTMLElement {
  static get observedAttributes() {
    return ['disabled']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$list = shadowRoot.getElementById('list')
    debugger
  }

  get data() {
    return this._data ?? []
  }

  set data(value) {
    this._data = Array.isArray(value) ? value : []
    this.render()
  }

  render() {
    // 确保节点数量
    let items = this.$list.children
    let count = items.length - this.data.length
    if (count < 0) {
      count *= -1
      while (count--) {
        this.$list.appendChild(document.createElement('div')).className = 'item'
      }
    }
    else if (count > 0) {
      while (count--) {
        this.$list.removeChild(this.$list.lastElementChild)
      }
    }
    forEach(this.$list.children, (item, index) => {
      const data = this.data[index] ?? {}
      const label = data.label ?? ''
      const value = data.id ?? ''
      item.innerHTML = label
      item.dataset.id = value
    })
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
