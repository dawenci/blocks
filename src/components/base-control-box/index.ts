import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import { append, mountAfter, mountBefore, prepend, unmount } from '../../common/mount.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js'
import { loadingTemplate, prefixTemplate, suffixTemplate, template } from './template.js'
import { style } from './style.js'
import { BlControl } from '../base-control/index.js'

export interface BlControlBoxEventMap extends BlComponentEventMap {
  'click-prefix-icon': CustomEvent
  'click-suffix-icon': CustomEvent
}

export interface BlControlBox extends BlControl {
  addEventListener<K extends keyof BlControlBoxEventMap>(
    type: K,
    listener: BlComponentEventListener<BlControlBoxEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlControlBoxEventMap>(
    type: K,
    listener: BlComponentEventListener<BlControlBoxEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

/**
 * 控件基础盒子类
 * 提供 loading、左右两侧 icon 功能
 */
@defineClass({
  styles: [style],
})
export class BlControlBox extends BlControl {
  @attr('boolean') accessor loading!: boolean

  @attr('string') accessor prefixIcon!: string | null

  @attr('string') accessor suffixIcon!: string | null

  @shadowRef('[part="layout"]') accessor $layout!: HTMLDivElement
  @shadowRef('[part="loading"]', false) accessor $loading!: HTMLSpanElement
  @shadowRef('[part="prefix"]', false) accessor $prefix!: HTMLSpanElement
  @shadowRef('[part="suffix"]', false) accessor $suffix!: HTMLSpanElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupLoadingFeature()
    this.#setupPrefixIconFeature()
    this.#setupSuffixIconFeature()

    this._tabIndexFeature.withTarget(() => [this.$layout])
    this._disabledFeature.withPredicate(() => this.disabled)
  }

  appendContent<T extends HTMLElement | DocumentFragment>($el: T) {
    const $suffix = this.$suffix
    if ($suffix) {
      mountBefore($el, $suffix)
    } else {
      append($el, this.$layout)
    }
    return $el
  }

  #setupLoadingFeature() {
    this.hook.onConnected(this._renderLoading)
    this.hook.onAttributeChangedDep('loading', this._renderLoading)
    this.hook.onRender(this._renderLoading)
  }
  _renderLoading() {
    this.$layout.classList.toggle('with-loading', this.loading)
    if (this.loading) {
      if (!this.$loading) {
        const $loading = loadingTemplate()
        $loading.appendChild(getRegisteredSvgIcon('loading')!)
        prepend($loading, this.$layout)
      }
    } else {
      if (this.$loading) {
        unmount(this.$loading)
      }
    }
  }

  #setupPrefixIconFeature() {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (this.$prefix && this.$prefix.contains(target)) {
        dispatchEvent(this, 'click-prefix-icon')
        return
      }
    }
    this.hook.onConnected(() => {
      this._renderPrefixIcon()
      this.$layout.addEventListener('click', onClick)
    })
    this.hook.onDisconnected(() => {
      this.$layout.removeEventListener('click', onClick)
    })
    this.hook.onAttributeChangedDep('prefix-icon', this._renderPrefixIcon)
    this.hook.onRender(this._renderPrefixIcon)
  }
  _renderPrefixIcon() {
    // TODO: 渲染优化，仅需要时才重新渲染
    const $prefixIcon = this.prefixIcon ? getRegisteredSvgIcon(this.prefixIcon) ?? parseSvg(this.prefixIcon) : null

    this.$layout.classList.toggle('with-prefix', !!$prefixIcon)
    if ($prefixIcon) {
      const $prefix = this.$prefix ?? prefixTemplate()
      $prefix.innerHTML = ''
      $prefix.appendChild($prefixIcon)

      if (this.$loading) {
        mountAfter($prefix, this.$loading)
      } else {
        prepend($prefix, this.$layout)
      }
    } else {
      if (this.$prefix) {
        unmount(this.$prefix)
      }
    }
  }

  #setupSuffixIconFeature() {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (this.$suffix && this.$suffix.contains(target)) {
        dispatchEvent(this, 'click-suffix-icon')
        return
      }
    }
    this.hook.onConnected(() => {
      this._renderSuffixIcon()
      this.$layout.addEventListener('click', onClick)
    })
    this.hook.onDisconnected(() => {
      this.$layout.removeEventListener('click', onClick)
    })
    this.hook.onAttributeChangedDep('suffix-icon', this._renderSuffixIcon)
    this.hook.onRender(this._renderSuffixIcon)
  }
  _renderSuffixIcon() {
    // TODO: 渲染优化，仅需要时才重新渲染
    const $suffixIcon = this.suffixIcon ? getRegisteredSvgIcon(this.suffixIcon) ?? parseSvg(this.suffixIcon) : null

    this.$layout.classList.toggle('with-suffix', !!$suffixIcon)
    if ($suffixIcon) {
      const $suffix = this.$suffix ?? suffixTemplate()
      $suffix.innerHTML = ''
      $suffix.appendChild($suffixIcon)
      append($suffix, this.$layout)
    } else {
      if (this.$suffix) {
        unmount(this.$suffix)
      }
    }
  }
}
