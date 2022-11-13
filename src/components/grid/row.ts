import {
  boolGetter,
  boolSetter,
  enumGetter,
  enumSetter,
  intGetter,
  intSetter,
} from '../../common/property.js'
import { Component } from '../Component.js'
import { BlocksColumn } from './column.js'
import { template } from './row-template.js'

type DomRef = {
  $slot: HTMLSlotElement
}

export class BlocksRow extends Component {
  ref: DomRef

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))
    this.ref = {
      $slot: shadowRoot.querySelector('slot')!,
    }
  }

  get align() {
    return enumGetter('align', ['top', 'middle', 'bottom'])(this)
  }

  set align(value) {
    enumSetter('align', ['top', 'middle', 'bottom'])(this, value)
  }

  get gutter() {
    return intGetter('gutter')(this) ?? 0
  }

  set gutter(value) {
    intSetter('gutter')(this, value)
  }

  get justify() {
    return enumGetter('justify', [
      'start',
      'end',
      'center',
      'space-around',
      'space-between',
    ])(this)
  }

  set justify(value) {
    enumSetter('justify', [
      'start',
      'end',
      'center',
      'space-around',
      'space-between',
    ])(this, value)
  }

  get wrap() {
    return boolGetter('wrap')(this)
  }

  set wrap(value) {
    boolSetter('wrap')(this, value)
  }

  override connectedCallback() {
    super.connectedCallback()
    this._renderGutter()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'gutter') {
      this._renderGutter()
    }
  }

  _renderGutter() {
    const cols = this.ref.$slot.assignedElements() as BlocksColumn[]

    if (this.gutter) {
      const half = this.gutter / 2
      this.style.marginLeft = -half + 'px'
      this.style.marginRight = -half + 'px'
      cols.forEach($col => {
        $col.style.paddingLeft = half + 'px'
        $col.style.paddingRight = half + 'px'
      })
    } else {
      this.style.marginLeft = ''
      this.style.marginRight = ''
      cols.forEach($col => {
        $col.style.paddingLeft = ''
        $col.style.paddingRight = ''
      })
    }
  }

  static override get observedAttributes() {
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
}

if (!customElements.get('bl-row')) {
  customElements.define('bl-row', BlocksRow)
}
