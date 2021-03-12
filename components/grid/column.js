import { intRangeGetter, intRangeSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  display: block;
  position: relative;
}
:host,
:host([span="24"]) {
  flex: 0 0 100%;
  max-width: 100%;
}
:host([span="23"]) {
  flex: 0 0 95.83333333%;
  max-width: 95.83333333%;
}
:host([span="22"]) {
  flex: 0 0 91.66666666%;
  max-width: 91.66666666%;
}
:host([span="21"]) {
  flex: 0 0 87.5%;
  max-width: 87.5%;
}
:host([span="20"]) {
  flex: 0 0 83.33333333%;
  max-width: 83.33333333%;
}
:host([span="19"]) {
  flex: 0 0 79.16666666%;
  max-width: 79.16666666%;
}
:host([span="18"]) {
  flex: 0 0 75%;
  max-width: 75%;
}
:host([span="17"]) {
  flex: 0 0 70.83333333%;
  max-width: 70.83333333%;
}
:host([span="16"]) {
  flex: 0 0 66.66666666%;
  max-width: 66.66666666%;
}
:host([span="15"]) {
  flex: 0 0 62.5%;
  max-width: 62.5%;
}
:host([span="14"]) {
  flex: 0 0 58.333333333%;
  max-width: 58.333333333%;
}
:host([span="13"]) {
  flex: 0 0 54.16666666%;
  max-width: 54.16666666%;
}
:host([span="12"]) {
  flex: 0 0 50%;
  max-width: 50%;
}
:host([span="11"]) {
  flex: 0 0 45.83333333%;
  max-width: 45.83333333%;
}
:host([span="10"]) {
  flex: 0 0 41.66666666%;
  max-width: 41.66666666%;
}
:host([span="9"]) {
  flex: 0 0 37.5%;
  max-width: 37.5%;
}
:host([span="8"]) {
  flex: 0 0 33.33333333%;
  max-width: 33.33333333%;
}
:host([span="7"]) {
  flex: 0 0 29.16666666%;
  max-width: 29.16666666%;
}
:host([span="6"]) {
  flex: 0 0 25%;
  max-width: 25%;
}
:host([span="5"]) {
  flex: 0 0 20.83333333%;
  max-width: 20.83333333%;
}
:host([span="4"]) {
  flex: 0 0 16.66666666%;
  max-width: 16.66666666%;
}
:host([span="3"]) {
  flex: 0 0 12.5%;
  max-width: 12.5%;
}
:host([span="2"]) {
  flex: 0 0 8.33333333%;
  max-width: 8.33333333%;
}
:host([span="1"]) {
  flex: 0 0 4.16666666%;
  max-width: 4.16666666%;
}


:host([offset="23"]) {
  margin-left: 95.83333333%;
}
:host([offset="22"]) {
  margin-left: 91.66666666%;
}
:host([offset="21"]) {
  margin-left: 87.5%;
}
:host([offset="20"]) {
  margin-left: 83.33333333%;
}
:host([offset="19"]) {
  margin-left: 79.16666666%;
}
:host([offset="18"]) {
  margin-left: 75%;
}
:host([offset="17"]) {
  margin-left: 70.83333333%;
}
:host([offset="16"]) {
  margin-left: 66.66666666%;
}
:host([offset="15"]) {
  margin-left: 62.5%;
}
:host([offset="14"]) {
  margin-left: 58.333333333%;
}
:host([offset="13"]) {
  margin-left: 54.16666666%;
}
:host([offset="12"]) {
  margin-left: 50%;
}
:host([offset="11"]) {
  margin-left: 45.83333333%;
}
:host([offset="10"]) {
  margin-left: 41.66666666%;
}
:host([offset="9"]) {
  margin-left: 37.5%;
}
:host([offset="8"]) {
  margin-left: 33.33333333%;
}
:host([offset="7"]) {
  margin-left: 29.16666666%;
}
:host([offset="6"]) {
  margin-left: 25%;
}
:host([offset="5"]) {
  margin-left: 20.83333333%;
}
:host([offset="4"]) {
  margin-left: 16.66666666%;
}
:host([offset="3"]) {
  margin-left: 12.5%;
}
:host([offset="2"]) {
  margin-left: 8.33333333%;
}
:host([offset="1"]) {
  margin-left: 4.16666666%;
}


:host([pull="23"]) {
  right: 95.83333333%;
}
:host([pull="22"]) {
  right: 91.66666666%;
}
:host([pull="21"]) {
  right: 87.5%;
}
:host([pull="20"]) {
  right: 83.33333333%;
}
:host([pull="19"]) {
  right: 79.16666666%;
}
:host([pull="18"]) {
  right: 75%;
}
:host([pull="17"]) {
  right: 70.83333333%;
}
:host([pull="16"]) {
  right: 66.66666666%;
}
:host([pull="15"]) {
  right: 62.5%;
}
:host([pull="14"]) {
  right: 58.333333333%;
}
:host([pull="13"]) {
  right: 54.16666666%;
}
:host([pull="12"]) {
  right: 50%;
}
:host([pull="11"]) {
  right: 45.83333333%;
}
:host([pull="10"]) {
  right: 41.66666666%;
}
:host([pull="9"]) {
  right: 37.5%;
}
:host([pull="8"]) {
  right: 33.33333333%;
}
:host([pull="7"]) {
  right: 29.16666666%;
}
:host([pull="6"]) {
  right: 25%;
}
:host([pull="5"]) {
  right: 20.83333333%;
}
:host([pull="4"]) {
  right: 16.66666666%;
}
:host([pull="3"]) {
  right: 12.5%;
}
:host([pull="2"]) {
  right: 8.33333333%;
}
:host([pull="1"]) {
  right: 4.16666666%;
}


:host([push="23"]) {
  left: 95.83333333%;
}
:host([push="22"]) {
  left: 91.66666666%;
}
:host([push="21"]) {
  left: 87.5%;
}
:host([push="20"]) {
  left: 83.33333333%;
}
:host([push="19"]) {
  left: 79.16666666%;
}
:host([push="18"]) {
  left: 75%;
}
:host([push="17"]) {
  left: 70.83333333%;
}
:host([push="16"]) {
  left: 66.66666666%;
}
:host([push="15"]) {
  left: 62.5%;
}
:host([push="14"]) {
  left: 58.333333333%;
}
:host([push="13"]) {
  left: 54.16666666%;
}
:host([push="12"]) {
  left: 50%;
}
:host([push="11"]) {
  left: 45.83333333%;
}
:host([push="10"]) {
  left: 41.66666666%;
}
:host([push="9"]) {
  left: 37.5%;
}
:host([push="8"]) {
  left: 33.33333333%;
}
:host([push="7"]) {
  left: 29.16666666%;
}
:host([push="6"]) {
  left: 25%;
}
:host([push="5"]) {
  left: 20.83333333%;
}
:host([push="4"]) {
  left: 16.66666666%;
}
:host([push="3"]) {
  left: 12.5%;
}
:host([push="2"]) {
  left: 8.33333333%;
}
:host([push="1"]) {
  left: 4.16666666%;
}
</style>`

const TEMPLATE_HTML = `<slot></slot>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksColumn extends HTMLElement {
  static get observedAttributes() {
    return [
      // 左侧空出多少个栅格列
      'offset',
      // 往左移动多少个栅格列（通过 right 定位属性往左推）
      'pull',
      // 往右移动多少个栅格列（通过 left 定位属性往右推）
      'push',
      // 尺寸横跨多少个栅格列
      'span'
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
  }

  get offset() {

  }

  set offset(value) {}

  get pull() {}

  set pull(value) {}

  get push() {
    return intRangeGetter('push', )
  }

  set push(value) {

  }

  get span() {
    return intRangeGetter('span', 1, 24)(this)
  }

  set span(value) {
    intRangeSetter('span', 1, 24)(this)
  }

  render() {}

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()    
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}
}

if (!customElements.get('bl-col')) {
  customElements.define('bl-col', BlocksColumn)
}
