import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}

:host([justify="start"]) {
  justify-content: flex-start;
}
:host([justify="end"]) {
  justify-content: flex-end;
}
:host([justify="center"]) {
  justify-content: center;
}
:host([justify="space-around"]) {
  justify-content: space-around;
}
:host([justify="space-between"]) {
  justify-content: space-between;
}

:host([align="top"]) {
  align-items: flex-start;
}
:host([align="middle"]) {
  align-items: center;
}
:host([align="bottom"]) {
  align-items: flex-end;
}

:host([wrap]) {
  flex-wrap: wrap;
}
</style>`

const TEMPLATE_HTML = `<slot></slot>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksRow extends HTMLElement {
  static get observedAttributes() {
    return [
      // 子元素垂直对齐方式
      'align',
      // 栅格之间的间隙尺寸
      'gutter',
      // 水平排列方式
      'justify',
      // 是否允许换行
      'wrap',
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$slot = shadowRoot.querySelector('slot')
  }

  get align() {
    return enumGetter('align', ['top', 'middle', 'bottom'])(this)
  }

  set align(value) {
    enumSetter('align', ['top', 'middle', 'bottom'])(this, value)
  }

  get gutter() {
    return intGetter('gutter', 0)(this)
  }

  set gutter(value) {
    intSetter('gutter')(this, value)
  }

  get justify() {
    return enumGetter('justify', ['start', 'end', 'center', 'space-around', 'space-between'])(this)
  }

  set justify(value) {
    enumSetter('justify', ['start', 'end', 'center', 'space-around', 'space-between'])(this, value)
  }

  get wrap() {
    return boolGetter('wrap')(this)
  }

  set wrap(value) {
    boolSetter('wrap')(this, value)
  }

  render() {
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    this._renderGutter()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'gutter') {
      this._renderGutter()
    }
  }

  _renderGutter() {
    if (this.gutter) {
      const half = this.gutter / 2
      this.style.marginLeft = -half + 'px'
      this.style.marginRight = -half + 'px'
      this.$slot.assignedElements().forEach($col => {
        $col.style.paddingLeft = half + 'px'
        $col.style.paddingRight = half + 'px'
      })
    }
    else {
      this.style.marginLeft = ''
      this.style.marginRight = ''
      this.$slot.assignedElements().forEach($col => {
        $col.style.paddingLeft = ''
        $col.style.paddingRight = ''
      })
    }
  }  
}

if (!customElements.get('bl-row')) {
  customElements.define('bl-row', BlocksRow)
}
