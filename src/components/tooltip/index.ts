import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { forEach } from '../../common/utils.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlPopup } from '../popup/index.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-tooltip',
  styles: [style],
})
export class BlTooltip extends BlComponent {
  static override get role() {
    return 'tooltip'
  }

  static override get observedAttributes() {
    return BlPopup.observedAttributes
  }

  @attr('string') accessor content = ''

  @attr('int') accessor openDelay = 200

  @attr('int') accessor closeDelay = 200

  @attr('enum', { enumValues: ['hover', 'click', 'manual'] })
  accessor triggerMode: OneOf<['hover', 'click', 'manual']> = 'hover'

  @shadowRef('#slot') accessor $slot!: HTMLSlotElement
  $popup!: BlPopup

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())

    this.#setupPopup()
    this.#setupShowHide()

    this.hook.onConnected(() => {
      document.body.appendChild(this.$popup)
      this.render()
    })

    this.hook.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })

    this.hook.onAttributeChanged(this.render)
  }

  get open() {
    return this.$popup.open
  }

  set open(value) {
    this.$popup.open = value
  }

  #anchorElement?: () => Element
  get anchorElement() {
    return this.#anchorElement ?? (() => this.$slot.assignedElements()?.[0] ?? this)
  }
  set anchorElement(value: (() => Element) | undefined) {
    this.#anchorElement = value
  }

  override render() {
    super.render()
    this.$popup.innerHTML = `<div style="padding:15px;font-size:14px;">${this.content}</div>`
  }

  #setupPopup() {
    this.$popup = document.createElement('bl-popup')

    this.$popup.anchorElement = this.anchorElement
    this.$popup.setAttribute('arrow', '8')
    this.$popup.setAttribute('append-to-body', '')
    this.$popup.setAttribute('origin', 'bottom-center')
    forEach(this.attributes, attr => {
      if (BlPopup.observedAttributes.includes(attr.name)) {
        this.$popup.setAttribute(attr.name, attr.value)
      }
    })
    this.hook.onAttributeChangedDeps(BlPopup.observedAttributes, (name, _, val) => {
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

    this.hook.onDisconnected(() => {
      _destroyClickOutside()
    })
  }
}
