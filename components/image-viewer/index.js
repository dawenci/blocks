import '../loading/index.js'
import '../icon/index.js'
import { definePrivate } from '../../common/definePrivate.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { __fg_placeholder, __height_base, __transition_duration } from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'
import { makeMessages } from '../../i18n/makeMessages.js'

const getMessage = makeMessages('image-viewer', {
})

const cssTemplate = document.createElement('style')
cssTemplate.textContent = `
:host {
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,.5);
}
#layout {
  width: 100%;
  height: 100%;
  position: relative;
}
#content {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
#toolbar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: auto;
  left: 0;
  width: 100%;
  height: 44px;
  background: rgba(0,0,0,.1);
}
#prev,
#next {
  position: absolute;
  top: 0;
  bottom: 0;
}
`

const template = document.createElement('template')
template.innerHTML = `
<div id="layout">
  <div id="content"><div>
  <div id="toolbar"></div>
  <div id="prev"></div>
  <div id="next"></div>
</div>
`


class BlocksImageViewer extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(cssTemplate.cloneNode(true))
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$layout = shadowRoot.getElementById('layout')
    this.$img = shadowRoot.getElementById('img')

    definePrivate(this, '_status', 'init')

    this.$img.onload = () => {
      if (this._status === 'loading') {
        this._status = 'loaded'
        this._renderSuccess()
        dispatchEvent(this, 'loaded')
      }
    }

    this.$img.onerror = () => {
      if (this._status === 'loading') {
        this._status = 'error'
        this._renderFail()
        dispatchEvent(this, 'error')
      }
    }
  }

  get alt() {
    return this.getAttribute('alt')
  }

  set alt(value) {
    this.setAttribute('alt', value)
  }

  get fallback() {
    return this.getAttribute('fallback')
  }

  set fallback(value) {
    this.setAttribute('fallback', value)
  }

  get manual() {
    return boolGetter('manual')(this)
  }

  set manual(value) {
    boolSetter('manual')(this, value)
  }

  get placeholder() {
    return this.getAttribute('placeholder')
  }

  get fit() {
    return enumGetter('fit', [null, 'none', 'fill', 'contain', 'cover', 'scale-down'])(this)
  }

  set fit(value) {
    enumSetter('fit', [null, 'none', 'fill', 'contain', 'cover', 'scale-down'])(this, value)
  }

  set placeholder(value) {
    this.setAttribute('placeholder', value)
  }

  get src() {
    return this.getAttribute('src')
  }

  set src(value) {
    this.setAttribute('src', value)
  }

  _renderLoading() {
    this.$img.style.opacity = '0'
    this._removeFallback()

    if (!this.$placeholder) {
      this.$placeholder = this.$layout.appendChild(placeholderTemplate.content.cloneNode(true).querySelector('#placeholder'))
      this.$placeholder.querySelector('.placeholderText').textContent = getMessage('placeholderText')
      if (this.placeholder) {
        this.$placeholder.querySelector('img').src = this.placeholder
      }
    }
  }

  _renderFail() {
    this.$img.style.opacity = '0'
    this._removePlaceholder()

    if (!this.$fallback) {
      this.$fallback = this.$layout.appendChild(fallbackTemplate.content.cloneNode(true).querySelector('#fallback'))
      this.$fallback.querySelector('.fallbackText').textContent = getMessage('fallbackText')
      if (this.fallback) {
        this.$fallback.querySelector('img').src = this.fallback
      }
    }
  }

  _renderSuccess() {
    this.$img.style.opacity = '1'
    this._removePlaceholder()
    this._removeFallback()

    if (this.fit) {
      this.$img.style.objectFit = this.fit
    }
  }

  _removePlaceholder() {
    if (this.$placeholder) {
      this.$layout.removeChild(this.$placeholder)
      this.$placeholder = null
    }
  }

  _removeFallback() {
    if (this.$fallback) {
      this.$layout.removeChild(this.$fallback)
      this.$fallback = null
    }
  }

  _reset() {
    this._status = 'init'
    this.$img.style.display = 'none'
    this.$img.style.opacity = '0'
    this.$img.src = ''
    this.$img.style.display = ''
    this._removePlaceholder()
    this._removeFallback()
  }

  render() {
    if (this.$img.getAttribute('alt') !== this.alt) {
      this.$img.setAttribute('alt', this.alt)
    }

    switch (this._status) {
      case 'loading': return this._renderLoading()
      case 'error': return this._renderFail()
      case 'loaded': return this._renderSuccess()
    }
  }

  load() {
    if (this._status === 'loading' || (this.$img.getAttribute('src') === this.src && this._status === 'loaded')) {
      return
    }
    this._status = 'loading'
    this.$img.src = this.src
    this._renderLoading()
    dispatchEvent(this, 'loading')
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
    if (!this.manual) {
      this.load()
    }
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'src') {
      if (!this.manual) {
        this.load()
      }
      else {
        this._reset()
      }
    }
    else {
      this.render()
    }
  }
}

if (!customElements.get('bl-image-viewer')) {
  customElements.define('bl-image-viewer', BlocksImageViewer)
}
