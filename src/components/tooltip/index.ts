import type { EnumAttr } from '../../decorators/attr.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { forEach } from '../../common/utils.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlocksPopup } from '../popup/index.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-tooltip',
  styles: [style],
})
export class BlocksTooltip extends Component {
  static override get observedAttributes() {
    return BlocksPopup.observedAttributes
  }

  @attr('string') accessor content = ''

  @attr('int') accessor openDelay = 200

  @attr('int') accessor closeDelay = 200

  @attr('enum', { enumValues: ['hover', 'click'] })
  accessor triggerMode: EnumAttr<['hover', 'click']> = 'hover'

  @shadowRef('#slot') accessor $slot!: HTMLSlotElement
  $popup!: BlocksPopup

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())

    this.#setupPopup()
    this.#setupShowHide()

    this.onConnected(() => {
      document.body.appendChild(this.$popup)
      this.render()
    })

    this.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })

    this.onAttributeChanged(this.render)
  }

  get open() {
    return this.$popup.open
  }

  set open(value) {
    this.$popup.open = value
  }

  override render() {
    super.render()
    this.$popup.innerHTML = `<div style="padding:15px;font-size:14px;">${this.content}</div>`
  }

  #setupPopup() {
    this.$popup = document.createElement('bl-popup')

    this.$popup.anchorElement = () => this.$slot.assignedElements()?.[0] ?? this
    this.$popup.setAttribute('arrow', '8')
    this.$popup.setAttribute('append-to-body', '')
    this.$popup.setAttribute('origin', 'bottom-center')
    forEach(this.attributes, attr => {
      if (BlocksPopup.observedAttributes.includes(attr.name)) {
        this.$popup.setAttribute(attr.name, attr.value)
      }
    })
    this.onAttributeChangedDeps(BlocksPopup.observedAttributes, (name, _, val) => {
      this.$popup.setAttribute(name, val as string)
    })
  }

  #setupShowHide() {
    let _enterTimer: ReturnType<typeof setTimeout>
    let _leaveTimer: ReturnType<typeof setTimeout>
    let _clearClickOutside: (() => void) | undefined

    this.addEventListener('click', e => {
      clearTimeout(_leaveTimer)
      this.open = true
    })

    const onmouseenter = () => {
      if (this.triggerMode === 'hover') {
        clearTimeout(_leaveTimer)
        clearTimeout(_enterTimer)
        _enterTimer = setTimeout(() => {
          this.open = true
        }, this.openDelay ?? 0)
      }
    }

    const onmouseleave = () => {
      if (this.triggerMode === 'hover') {
        clearTimeout(_enterTimer)
        clearTimeout(_leaveTimer)
        _leaveTimer = setTimeout(() => {
          this.open = false
        }, this.closeDelay ?? 0)
      }
    }

    this.addEventListener('mouseenter', onmouseenter)
    this.$popup.addEventListener('mouseenter', onmouseenter)
    this.addEventListener('mouseleave', onmouseleave)
    this.$popup.addEventListener('mouseleave', onmouseleave)

    const _initClickOutside = () => {
      if (!_clearClickOutside) {
        _clearClickOutside = onClickOutside([this, this.$popup], () => (this.open = false))
      }
    }

    const _destroyClickOutside = () => {
      if (_clearClickOutside) {
        _clearClickOutside()
        _clearClickOutside = undefined
      }
    }

    this.$popup.addEventListener('opened', () => {
      _initClickOutside()
    })
    this.$popup.addEventListener('closed', () => {
      _destroyClickOutside()
    })

    this.onDisconnected(() => {
      _destroyClickOutside()
    })
  }
}
