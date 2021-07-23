import '../loading/index.js'
import '../icon/index.js'
import { definePrivate } from '../../common/definePrivate.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { __fg_placeholder, __height_base, __transition_duration } from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'
import { makeMessages } from '../../i18n/makeMessages.js'

const getMessage = makeMessages('image', {
  placeholderText: '加载中',
  fallbackText: '加载失败',
})

const template = document.createElement('template')
template.innerHTML = `<style>
:host {
  overflow: hidden;
  display: inline-block;
  box-sizing: border-box;
  min-width: calc(var(--height-base, ${__height_base}) * 2);
  min-height: calc(var(--height-base, ${__height_base}) * 2);
}
#layout {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
}
#img {
  position: relative;
  overflow: hidden;
  display: block;
  width: 100%;
  height: 100%;
  transition: opacity var(--transition-duration, ${__transition_duration});
}

#placeholder,
#fallback {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  pointer-events: none;
}

#placeholder img,
#fallback img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}

#placeholder .default,
#fallback .default {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

#placeholder .custom,
#fallback .custom {
  width: 100%;
  height: 100%;
}

:host([placeholder]) #placeholder .default,
:host([fallback]) #fallback .default {
  display: none;
}

:host(:not([placeholder])) #placeholder .custom,
:host(:not([fallback])) #fallback .custom {
  display: none;
}

#placeholder bl-loading,
#fallback bl-icon {
  position: relative;
  margin: 0;
  width: var(--height-base, ${__height_base});
  height: var(--height-base, ${__height_base});
  fill: #aaa;
}

.placeholderText,
.fallbackText {
  margin-top: 5px;
  font-size: 12px;
  color: var(--fg-placeholder, ${__fg_placeholder});
}
</style>

<div id="layout">
  <img id="img" style="opacity:0;" />
</div>
`

const placeholderTemplate = document.createElement('template')
placeholderTemplate.innerHTML = `
<div id="placeholder">
  <div class="default">
    <bl-loading></bl-loading>
    <div class="placeholderText"></div>  
  </div>
  <div class="custom"><img></div>
</div>
`

const fallbackTemplate = document.createElement('template')
fallbackTemplate.innerHTML = `
<div id="fallback">
  <div class="default">
    <bl-icon value="file-image"></bl-icon>
    <div class="fallbackText"></div>
  </div>
  <div class="custom"><img></div>
</div>
`

export class BlocksImage extends HTMLElement {
  static get observedAttributes() {
    return ['alt', 'fallback', 'fit', 'manual', 'placeholder', 'src']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
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

if (!customElements.get('bl-image')) {
  customElements.define('bl-image', BlocksImage)
}
