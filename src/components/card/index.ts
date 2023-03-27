import type { EnumAttrs, NullableEnumAttr } from '../../decorators/attr.js'
import { attr, attrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'
import { SetupEmpty } from '../setup-empty/index.js'

type EmptyMap<T extends Component> = Record<'$coverSlot' | '$headerSlot' | '$bodySlot' | '$footerSlot', SetupEmpty<T>>

@defineClass({
  customElement: 'bl-card',
  styles: [style],
})
export class BlocksCard extends Component {
  @attr('enum', { enumValues: ['hover', 'always'] as const })
  accessor shadow!: NullableEnumAttr<['hover', 'always']>

  @attrs.size accessor size!: EnumAttrs['size']

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement
  @shadowRef('[part="cover"]') accessor $cover!: HTMLElement
  @shadowRef('[part="header"]') accessor $header!: HTMLElement
  @shadowRef('[part="body"]') accessor $body!: HTMLElement
  @shadowRef('[part="footer"]') accessor $footer!: HTMLElement
  @shadowRef('[part="cover-slot"]') accessor $coverSlot!: HTMLSlotElement
  @shadowRef('[part="header-slot"]') accessor $headerSlot!: HTMLSlotElement
  @shadowRef('[part="body-slot"]') accessor $bodySlot!: HTMLSlotElement
  @shadowRef('[part="footer-slot"]') accessor $footerSlot!: HTMLSlotElement

  _emptyFeature!: EmptyMap<this>

  constructor() {
    super()

    this.appendShadowChild(template())
    this.#setupEmpty()
  }

  #setupEmpty() {
    this._emptyFeature = Object.create(null)
    ;(['$cover', '$header', '$body', '$footer'] as const).forEach(name => {
      const slotName = (name + 'Slot') as ConcatStr<typeof name, 'Slot'>
      this._emptyFeature[slotName] = SetupEmpty.setup({
        component: this,
        predicate: () => {
          const $nodes = this[slotName].assignedNodes()
          for (let i = 0; i < $nodes.length; ++i) {
            if ($nodes[i].nodeType === 1) return false
            if ($nodes[i].nodeType === 3 && $nodes[i].nodeValue?.trim()) return false
          }
          return true
        },
        target: () => this[name],
        init: () => {
          const onSlotChange = () => this._emptyFeature[slotName].update()
          this.onConnected(() => {
            this[slotName].addEventListener('slotchange', onSlotChange)
          })
          this.onDisconnected(() => {
            this[slotName].removeEventListener('slotchange', onSlotChange)
          })
        },
      })
    })
  }
}
