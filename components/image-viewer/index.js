import '../loading/index.js'
import '../icon/index.js'
import { BlocksTransitionOpenZoom } from '../transition-open-zoom/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __fg_placeholder, __height_base, __transition_duration } from '../../theme/var.js'
import { makeMessages } from '../../i18n/makeMessages.js'
import { disabledSetter } from '../../common/propertyAccessor.js'
import { onWheel } from '../../common/onWheel.js'
import { forEach } from '../../common/utils.js'

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
#mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,.5);
}
#active {
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  transition: transform var(--transition-duration, ${__transition_duration});
}

.button {
  overflow: hidden;
  position: relative;
  width: 44px;
  height: 44px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.button:focus {
  outline: none;
}

.button[disabled] {
  cursor: default;
}

.button bl-icon {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 20px;
  height: 20px;
  margin: auto;
  fill: #fff;
  opacity: .7;
  cursor: pointer;
}

.button:hover bl-icon {
  opacity: 1;
}

.button[disabled] bl-icon {
  opacity: .2;
  cursor: default;
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

#prev,
#next {
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  border-radius: 50%;
  background-color: rgba(0,0,0,.1);
  cursor: pointer;
}
#prev {
  left: 12px;
}
#next {
  right: 12px;
}
`

const template = document.createElement('template')
template.innerHTML = `
<div id="layout" tabindex="0">
  <div id="content">
    <div id="mask"></div>
    <img id="active" />
  </div>
  <div id="thumbnails"></div>
  <div id="toolbar">
    <button class="button" id="rotate-left"><bl-icon value="rotate-left"></bl-icon></button>
    <button class="button" id="rotate-right"><bl-icon value="rotate-right"></bl-icon></button>
    <button class="button" id="zoom-out"><bl-icon value="zoom-out"></bl-icon></button>
    <button class="button" id="zoom-in"><bl-icon value="zoom-in"></bl-icon></button>
    <button class="button" id="close"><bl-icon value="cross"></bl-icon></button>
  </div>
  <button class="button" id="prev"><bl-icon value="left"></bl-icon></button>
  <button class="button" id="next"><bl-icon value="right"></bl-icon></button>
  <slot></slot>
</div>
`

export class BlocksImageViewer extends BlocksTransitionOpenZoom {
  static get observedAttributes() {
    return super.observedAttributes.concat([])
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
    const shadowRoot = this.shadowRoot
    shadowRoot.appendChild(cssTemplate.cloneNode(true))
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$slot = shadowRoot.querySelector('slot')
    this.$mask = shadowRoot.getElementById('mask')
    this.$layout = shadowRoot.getElementById('layout')
    this.$toolbar = shadowRoot.getElementById('toolbar')
    this.$thumbnails = shadowRoot.getElementById('thumbnails')
    this.$content = shadowRoot.getElementById('content')
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
      this.prev()
    }

    this.$next.onclick = e => {
      this.next()
    }

    this.$rotateLeftButton.onclick = e => {
      this.rotateLeft()
    }

    this.$rotateRightButton.onclick = e => {
      this.rotateRight()
    }

    this.$zoomInButton.onclick = e => {
      this.zoomIn()
    }

    this.$zoomOutButton.onclick = e => {
      this.zoomOut()
    }

    this.$closeButton.onclick = e => {
      this.open = false
    }

    this.$mask.onclick = e => {
      this.open = false
    }

    onWheel(this, (e, data) => {
      if (data.spinY > 0) {
        this.zoomOut()
      }
      else {
        this.zoomIn()
      }
    })

    this.addEventListener('opened', e => {
      this.$layout.focus()
    })

    this.addEventListener('keydown', e => {
      switch (e.key) {
        case 'Escape': {
          this.open = false
          break
        }
        case 'ArrowLeft': {
          this.prev()
          break
        }
        case 'ArrowRight': {
          this.next()
          break
        }
        case 'ArrowUp': {
          this.zoomIn()
          break
        }
        case 'ArrowDown': {
          this.zoomOut()
          break
        }
      }
    })
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
  }

  adoptedCallback() {
    super.adoptedCallback()
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal)
    this.render()
  }

  zoomIn() {
    if (!this.activeImg) return

    const obj = this.imgMap.get(this.activeImg)
    if (obj.scale >= 1) {
      obj.scale += 1
    }
    else if (obj.scale < 1) {
      obj.scale += 0.2
    }

    this._renderCurrent()
    this._renderToolbar()
  }

  zoomOut() {
    if (!this.activeImg) return

    const obj = this.imgMap.get(this.activeImg)
    if (obj.scale > 1) {
      obj.scale -= 1
    }
    else if (obj.scale <= 1 && obj.scale >= 0.4) {
      obj.scale -= 0.2
    }

    this._renderCurrent()
    this._renderToolbar()
  }

  rotateRight() {
    if (!this.activeImg) return
    this.imgMap.get(this.activeImg).rotate += 90
    this._renderCurrent()
  }

  rotateLeft() {
    if (!this.activeImg) return
    this.imgMap.get(this.activeImg).rotate -= 90
    this._renderCurrent()
  }

  next() {
    if (this.imgs.length && this.activeImg !== this.imgs[this.imgs.length - 1]) {
      const index = this.imgs.indexOf(this.activeImg)
      this.activeImg = this.imgs[index + 1]
    }
    this._renderNavButton()
    this._renderToolbar()
  }

  prev() {
    if (this.imgs.length && this.activeImg !== this.imgs[0]) {
      const index = this.imgs.indexOf(this.activeImg)
      this.activeImg = this.imgs[index - 1]
    }
    this._renderNavButton()
    this._renderToolbar()
  }

  render() {
    this._renderCurrent()
    this._renderNavButton()
    this._renderToolbar()
  }

  _renderCurrent() {
    if (this.activeImg) {
      if (this.$active.src !== this.activeImg.src) {
        this.$active.style.opacity = '0'
        this.$active.src = this.activeImg.src
        this.$active.onload = () => {
          this.$active.style.opacity = ''
          const { scale, rotate } = this.imgMap.get(this.activeImg)
          this.$active.style.transform = `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`
        }
      }
      else {
        const { scale, rotate } = this.imgMap.get(this.activeImg)
        this.$active.style.transform = `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`
      }
    }
  }

  _renderNavButton() {
    const display = this.imgs.length > 1 ? 'block' : 'none'
    this.$prev.style.display = this.$next.style.display = display

    disabledSetter(this.$prev, !!this.activeImg && this.activeImg === this.imgs[0])
    disabledSetter(this.$next, !!this.activeImg && this.activeImg === this.imgs[this.imgs.length - 1])
  }

  _renderToolbar() {
    if (!this.activeImg) {
      forEach(this.$toolbar.querySelectorAll('.button'), $button => {
        disabledSetter($button, true)
      })
      return
    }

    forEach(this.$toolbar.querySelectorAll('.button'), $button => {
      disabledSetter($button, false)
    })
    const { scale } = this.imgMap.get(this.activeImg)
    disabledSetter(this.$zoomOutButton, scale === 0.2)
  }
}

if (!customElements.get('bl-image-viewer')) {
  customElements.define('bl-image-viewer', BlocksImageViewer)
}
