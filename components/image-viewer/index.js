import '../loading/index.js'
import '../icon/index.js'
import { definePrivate } from '../../common/definePrivate.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { __fg_placeholder, __height_base, __transition_duration } from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'
import { makeMessages } from '../../i18n/makeMessages.js'
import { disabledSetter } from '../../common/propertyAccessor.js'

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
  z-index: 10;
}
::slotted(*) {
  display: none;
}

#layout {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
}
#content {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
#active {
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  transition: transform var(--transition-duration, ${__transition_duration});
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
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
}

.toolbar-button {
  overflow: hidden;
  width: 18px;
  height: 18px;
  margin: 0 12px;
  padding: 0;
  border: none;
  background: none;
}
.toolbar-button:focus {
  outline: none;
}
.toolbar-button bl-icon {
  fill: #fff;
  width: 100%;
  height: 100%;
  opacity: .7;
}
.toolbar-button:hover bl-icon {
  opacity: 1;
}
.toolbar-button[disabled] bl-icon {
  opacity: .2;
}

#prev,
#next {
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(0,0,0,.1);
  cursor: pointer;
}
#prev::before,
#next::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 10px;
  height: 10px;
  border-top: 1px solid #fff;
  border-right: 1px solid #fff;
  opacity: .3;
}
#prev {
  left: 12px;
}
#next {
  right: 12px;
}
#prev::before {
  left: 18px;
  transform: rotate(-135deg);
}
#next::before {
  right: 18px;
  transform: rotate(45deg);
}
#prev:hover::before,
#next:hover::before {
  opacity: .8;
}

#prev[disabled]::before,
#next[disabled]::before,
#prev[disabled]:hover::before,
#next[disabled]:hover::before {
  opacity: .3;
  cursor: default;
}

`

const template = document.createElement('template')
template.innerHTML = `
<div id="layout">
  <div id="content">
    <img id="active" />
  <div>
  <div id="thumbnails"></div>
  <div id="toolbar">
    <button class="toolbar-button" id="rotate-left"><bl-icon value="rotate-left"></bl-icon></button>
    <button class="toolbar-button" id="rotate-right"><bl-icon value="rotate-right"></bl-icon></button>
    <button class="toolbar-button" id="zoom-out"><bl-icon value="zoom-out"></bl-icon></button>
    <button class="toolbar-button" id="zoom-in"><bl-icon value="zoom-in"></bl-icon></button>
    <button class="toolbar-button" id="close"><bl-icon value="cross"></bl-icon></button>
  </div>
  <div id="prev"></div>
  <div id="next"></div>
  <slot></slot>
</div>
`


class BlocksImageViewer extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  get imgs() {
    return this._imgs ?? []
  }

  set imgs(value) {
    this._imgs = value ?? []
    this.render()
  }

  get activeImg() {
    return this._activeImg ?? this.imgs?.[0]
  }

  set activeImg(value) {
    this._activeImg = value
    this._renderCurrent()
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(cssTemplate.cloneNode(true))
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$slot = shadowRoot.querySelector('slot')
    this.$content = shadowRoot.getElementById('content')
    this.$thumbnails = shadowRoot.getElementById('thumbnails')
    this.$active = shadowRoot.getElementById('active')
    this.$prev = shadowRoot.getElementById('prev')
    this.$next = shadowRoot.getElementById('next')
    this.$closeButton = shadowRoot.getElementById('close')
    this.$rotateLeftButton = shadowRoot.getElementById('rotate-left')
    this.$rotateRightButton = shadowRoot.getElementById('rotate-right')
    this.$zoomInButton = shadowRoot.getElementById('zoom-in')
    this.$zoomOutButton = shadowRoot.getElementById('zoom-out')

    this.imgMap = new Map()

    this.$slot.addEventListener('slotchange', e => {
      const imgs = this.$slot.assignedElements().filter(el => el.nodeName === 'IMG')
      const newMap = new Map()
      imgs.forEach($img => {
        if (this.imgMap.has($img)) {
          newMap.set($img, this.imgMap.get($img))
        }
        else {
          newMap.set($img, {
            scale: 1,
            rotate: 0,
          })
        }
      })
      this.imgMap = newMap
      this.imgs = imgs
    })

    this.$prev.onclick = e => {
      if (this.imgs.length && this.activeImg !== this.imgs[0]) {
        const index = this.imgs.indexOf(this.activeImg)
        this.activeImg = this.imgs[index - 1]

        disabledSetter(this.$next, false)
        if (index === 1) {
          disabledSetter(this.$prev, true)
        }
      }
    }
    this.$next.onclick = e => {
      if (this.imgs.length && this.activeImg !== this.imgs[this.imgs.length - 1]) {
        const index = this.imgs.indexOf(this.activeImg)
        this.activeImg = this.imgs[index + 1]

        disabledSetter(this.$prev, false)
        if (index === this.imgs.length - 2) {
          disabledSetter(this.$next, true)
        }        
      }
    }

    this.$rotateLeftButton.onclick = e => {
      if (!this.activeImg) return
      this.imgMap.get(this.activeImg).rotate -= 90
      this._renderCurrent()
    }

    this.$rotateRightButton.onclick = e => {
      if (!this.activeImg) return
      this.imgMap.get(this.activeImg).rotate += 90
      this._renderCurrent()
    }

    this.$zoomInButton.onclick = e => {
      if (!this.activeImg) return
      this.imgMap.get(this.activeImg).scale += 1
      this._renderCurrent()
    }

    this.$zoomOutButton.onclick = e => {
      if (!this.activeImg) return
      if (this.imgMap.get(this.activeImg).scale > 1) {
        this.imgMap.get(this.activeImg).scale -= 1
      }
      this._renderCurrent()
    }

    this.$closeButton.onclick = e => {
      
    }
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
  }

  render() {
    this._renderNavButton()
    this._renderCurrent()
  }

  _renderCurrent() {
    if (this.activeImg) {
      const { scale, rotate } = this.imgMap.get(this.activeImg)
      this.$active.src = this.activeImg.src
      this.$active.style.transform = `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`
    }
  }

  _renderNavButton() {
    const display = this.imgs.length > 1 ? 'block' : 'none'
    this.$prev.style.display = this.$next.style.display = display

    disabledSetter(this.$prev, !!this.activeImg && this.activeImg === this.imgs[0])
    disabledSetter(this.$next, !!this.activeImg && this.activeImg === this.imgs[this.imgs.length - 1])
  }
}

if (!customElements.get('bl-image-viewer')) {
  customElements.define('bl-image-viewer', BlocksImageViewer)
}
