import { getRegisteredSvgIcon } from '../../icon/store.js'
import { forEach } from '../../common/utils.js'
import { enumGetter, enumSetter } from '../../common/property.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'

const halfValueGetter = enumGetter('value', [
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '4.5',
  '5',
])
const halfValueSetter = enumSetter('value', [
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '4.5',
  '5',
])
const valueGetter = enumGetter('value', ['1', '2', '3', '4', '5'])
const valueSetter = enumSetter('value', ['1', '2', '3', '4', '5'])

const $STAR_ICON = getRegisteredSvgIcon('star')!

export interface BlocksRate extends Component {
  ref: {
    $layout: HTMLElement
  }
}

@customElement('bl-rate')
export class BlocksRate extends Component {
  static override get observedAttributes() {
    return [
      // model 值
      'value',
      // 允许选择半颗星
      'half',
      // 允许 toggle 高亮
      'clearable',
      // 结果模式，可以百分比高亮星星
      'result-mode',
    ]
  }

  _hoverValue?: number

  @attr('boolean') accessor clearable!: boolean

  @attr('boolean') accessor half!: boolean

  @attr('boolean') accessor resultMode!: boolean

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))

    const $layout = shadowRoot.getElementById('layout') as HTMLElement

    this.ref = { $layout }

    forEach(
      $layout.children as unknown as HTMLButtonElement[],
      ($button, index) => {
        $button.onmouseover = e => {
          if (this.resultMode) return

          if (!this.half) {
            this._hoverValue = index + 1
          } else {
            let el = e.target as HTMLElement
            while (!el.classList.contains('star')) {
              el = el.parentElement!
            }
            this._hoverValue = index + (el.classList.contains('part') ? 0.5 : 1)
          }
          this.updateSelect()
        }

        $button.onclick = e => {
          if (this.resultMode) return
          if (!this.half) {
            this.value = index + 1
          } else {
            let el = e.target as HTMLElement
            while (!el.classList.contains('star')) {
              el = el.parentElement!
            }
            this.value = index + (el.classList.contains('part') ? 0.5 : 1)
          }
          this.updateSelect()
        }
      }
    )

    $layout.onmouseleave = e => {
      this._hoverValue = undefined
      this.updateSelect()
    }
  }

  get value() {
    const value = this.resultMode
      ? this.getAttribute('value')
      : this.half
      ? halfValueGetter(this)
      : valueGetter(this)
    if (value == null) return null
    return +value as 1 | 2 | 3 | 4 | 5
  }

  set value(value: any) {
    if (this.resultMode) {
      this.setAttribute('value', value)
    }
    if (this.half) {
      halfValueSetter(this, '' + value)
    } else {
      valueSetter(this, '' + value)
    }
  }

  updateSelect() {
    if (this.resultMode) {
      const value = this.value ?? 0
      let acc = 0
      forEach(
        this.ref.$layout.children as unknown as HTMLButtonElement[],
        $button => {
          if (value - acc >= 1) {
            $button.className = 'selected'
            acc += 1
          } else if (value - acc > 0) {
            $button.className = 'partially-selected'
            const n = value - acc
            ;($button.querySelector('.part') as HTMLElement).style.width = `${
              n * 100
            }%`
            acc += n
          } else {
            $button.className = ''
          }
        }
      )
      return
    }

    const value = +(this._hoverValue ?? this.value ?? 0)
    let acc = 0
    forEach(
      this.ref.$layout.children as unknown as HTMLButtonElement[],
      $button => {
        if (value - acc >= 1) {
          $button.className = 'selected'
          acc += 1
        } else if (value - acc === 0.5) {
          $button.className = 'partially-selected'
          ;($button.querySelector('.part') as HTMLElement).style.width = ''
          acc += 0.5
        } else {
          $button.className = ''
        }
      }
    )
  }

  override render() {
    const star = document.createElement('span')
    star.className = 'star'
    star.appendChild($STAR_ICON.cloneNode(true))
    forEach(
      this.ref.$layout.children as unknown as HTMLButtonElement[],
      $button => {
        if ($button.children.length !== 2) {
          $button.innerHTML = ''
          $button.appendChild(star.cloneNode(true))
          $button
            .appendChild(star.cloneNode(true) as HTMLElement)
            .classList.add('part')
        }
      }
    )
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
    this.updateSelect()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this.render()
    this.updateSelect()
  }
}
