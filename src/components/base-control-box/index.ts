import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js'
import { dispatchEvent } from '../../common/event.js'
import { Control } from '../base-control/index.js'
import { ComponentEventListener, ComponentEventMap } from '../Component.js'
import {
  loadingTemplate,
  prefixTemplate,
  styleTemplate,
  suffixTemplate,
} from './template.js'
import {
  append,
  mountAfter,
  mountBefore,
  prepend,
  unmount,
} from '../../common/mount.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'

export interface ControlBoxEventMap extends ComponentEventMap {
  'click-prefix-icon': CustomEvent
  'click-suffix-icon': CustomEvent
}

export interface ControlBox extends Control {
  _ref: {
    $layout: HTMLDivElement
    $prefix?: HTMLElement
    $suffix?: HTMLElement
    $loading?: HTMLElement
  }

  addEventListener<K extends keyof ControlBoxEventMap>(
    type: K,
    listener: ComponentEventListener<ControlBoxEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof ControlBoxEventMap>(
    type: K,
    listener: ComponentEventListener<ControlBoxEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass
export class ControlBox extends Control {
  @attr('boolean') accessor loading!: boolean

  @attr('string') accessor prefixIcon!: string | null

  @attr('string') accessor suffixIcon!: string | null

  constructor() {
    super()

    this._appendStyle(styleTemplate())

    this._ref.$layout.addEventListener('click', e => {
      const target = e.target as HTMLElement
      if (this._ref.$prefix && this._ref.$prefix.contains(target)) {
        dispatchEvent(this, 'click-prefix-icon')
        return
      }
      if (this._ref.$suffix && this._ref.$suffix.contains(target)) {
        dispatchEvent(this, 'click-suffix-icon')
        return
      }
    })
  }

  override _appendContent<T extends HTMLElement | DocumentFragment>($el: T) {
    const $suffix = this._ref.$suffix
    if ($suffix) {
      mountBefore($el, $suffix)
    } else {
      append($el, this._ref.$layout)
    }
    return $el
  }

  _renderLoading() {
    this._ref.$layout.classList.toggle('with-loading', this.loading)
    if (this.loading) {
      if (!this._ref.$loading) {
        const $loading = (this._ref.$loading = loadingTemplate())
        $loading.appendChild(getRegisteredSvgIcon('loading')!)
        prepend($loading, this._ref.$layout)
      }
    } else {
      if (this._ref.$loading) {
        unmount(this._ref.$loading)
        this._ref.$loading = undefined
      }
    }
  }

  _renderPrefixIcon() {
    const $prefixIcon = this.prefixIcon
      ? getRegisteredSvgIcon(this.prefixIcon) ?? parseSvg(this.prefixIcon)
      : null

    this._ref.$layout.classList.toggle('with-prefix', !!$prefixIcon)
    if ($prefixIcon) {
      const $prefix = (this._ref.$prefix =
        this._ref.$prefix ?? prefixTemplate())
      $prefix.innerHTML = ''
      $prefix.appendChild($prefixIcon)

      if (this._ref.$loading) {
        mountAfter($prefix, this._ref.$loading)
      } else {
        prepend($prefix, this._ref.$layout)
      }
    } else {
      if (this._ref.$prefix) {
        unmount(this._ref.$prefix)
        this._ref.$prefix = undefined
      }
    }
  }

  _renderSuffixIcon() {
    const $suffixIcon = this.suffixIcon
      ? getRegisteredSvgIcon(this.suffixIcon) ?? parseSvg(this.suffixIcon)
      : null

    this._ref.$layout.classList.toggle('with-suffix', !!$suffixIcon)
    if ($suffixIcon) {
      const $suffix = (this._ref.$suffix =
        this._ref.$suffix ?? suffixTemplate())
      $suffix.innerHTML = ''
      $suffix.appendChild($suffixIcon)
      append($suffix, this._ref.$layout)
    } else {
      if (this._ref.$suffix) {
        unmount(this._ref.$suffix)
        this._ref.$suffix = undefined
      }
    }
  }

  override render() {
    super.render()
    this._renderDisabled()
    this._renderPrefixIcon()
    this._renderSuffixIcon()
    this._renderLoading()
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    switch (attrName) {
      case 'disabled': {
        this._renderDisabled()
        break
      }

      case 'loading': {
        this._renderLoading()
        break
      }

      case 'prefix-icon': {
        this._renderPrefixIcon()
        break
      }

      case 'suffix-icon': {
        this._renderSuffixIcon()
        break
      }

      default: {
        break
      }
    }
  }
}
