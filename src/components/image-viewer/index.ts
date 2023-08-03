import type { BlComponentEventListener } from '../component/Component.js'
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js'
import '../icon/index.js'
import '../loading/index.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { disabledSetter } from '../../common/propertyAccessor.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { forEach } from '../../common/utils.js'
import { onWheel } from '../../common/onWheel.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlControl } from '../base-control/index.js'
import { WithOpenTransition } from '../with-open-transition/index.js'

type ImageTransformStates = Map<HTMLImageElement, { scale: number; rotate: number }>

export type BlImageViewerEventMap = WithOpenTransitionEventMap

export interface BlImageViewer extends BlControl, WithOpenTransition {
  imgMap: ImageTransformStates

  addEventListener<K extends keyof BlImageViewerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlImageViewerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlImageViewerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlImageViewerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// TODO: thumbnails
@defineClass({
  customElement: 'bl-image-viewer',
  mixins: [WithOpenTransition],
  styles: [style],
})
export class BlImageViewer extends BlControl {
  @attr('boolean') accessor closeOnClickMask!: boolean
  @attr('boolean') accessor closeOnPressEscape!: boolean

  @shadowRef('#layout') accessor $layout!: HTMLElement
  @shadowRef('slot') accessor $slot!: HTMLSlotElement
  @shadowRef('#mask') accessor $mask!: HTMLElement
  @shadowRef('#toolbar') accessor $toolbar!: HTMLElement
  @shadowRef('#thumbnails') accessor $thumbnails!: HTMLElement
  @shadowRef('#content') accessor $content!: HTMLElement
  @shadowRef('#active') accessor $active!: HTMLImageElement
  @shadowRef('#prev') accessor $prev!: HTMLButtonElement
  @shadowRef('#next') accessor $next!: HTMLButtonElement
  @shadowRef('#close') accessor $closeButton!: HTMLButtonElement
  @shadowRef('#rotate-left') accessor $rotateLeftButton!: HTMLButtonElement
  @shadowRef('#rotate-right') accessor $rotateRightButton!: HTMLButtonElement
  @shadowRef('#zoom-in') accessor $zoomInButton!: HTMLButtonElement
  @shadowRef('#zoom-out') accessor $zoomOutButton!: HTMLButtonElement

  constructor() {
    super()

    this.appendShadowChild(template())
    this._tabIndexFeature.withTabIndex(0)

    this.imgMap = new Map()

    this.#setupContent()
    this.#setupEvents()

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  #setupContent() {
    const onSlotChange = () => {
      const imgs = this.$slot.assignedElements().filter(el => el.nodeName === 'IMG') as HTMLImageElement[]

      const newMap: ImageTransformStates = new Map()
      imgs.forEach($img => {
        if (this.imgMap.has($img)) {
          newMap.set($img, this.imgMap.get($img)!)
        } else {
          newMap.set($img, {
            scale: 1,
            rotate: 0,
          })
        }
      })
      this.imgMap = newMap
      this.imgs = imgs
    }
    this.$slot.addEventListener('slotchange', onSlotChange)
  }

  #setupEvents() {
    this.$prev.onclick = () => {
      this.prev()
    }

    this.$next.onclick = () => {
      this.next()
    }

    this.$rotateLeftButton.onclick = () => {
      this.rotateLeft()
    }

    this.$rotateRightButton.onclick = () => {
      this.rotateRight()
    }

    this.$zoomInButton.onclick = () => {
      this.zoomIn()
    }

    this.$zoomOutButton.onclick = () => {
      this.zoomOut()
    }

    this.$closeButton.onclick = () => {
      this.open = false
    }

    this.$mask.onclick = () => {
      if (this.closeOnClickMask) this.open = false
    }

    onWheel(this, (e, data) => {
      if (data.spinY > 0) {
        this.zoomOut()
      } else {
        this.zoomIn()
      }
    })

    this.addEventListener('opened', () => {
      this.$layout.focus()
    })

    this.addEventListener('keydown', e => {
      switch (e.key) {
        case 'Escape': {
          if (this.closeOnPressEscape) this.open = false
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

  _imgs?: HTMLImageElement[]
  get imgs() {
    return this._imgs ?? []
  }

  set imgs(value) {
    this._imgs = value ?? []
    this.render()
  }

  _activeImg?: HTMLImageElement
  get activeImg() {
    return this._activeImg ?? this.imgs?.[0]
  }

  set activeImg(value) {
    this._activeImg = value
    this._renderCurrent()
  }

  zoomIn() {
    if (!this.activeImg) return

    const obj = this.imgMap.get(this.activeImg)!
    if (obj.scale >= 1) {
      obj.scale += 1
    } else if (obj.scale < 1) {
      obj.scale += 0.2
    }

    this._renderCurrent()
    this._renderToolbar()
  }

  zoomOut() {
    if (!this.activeImg) return

    const obj = this.imgMap.get(this.activeImg)!
    if (obj.scale > 1) {
      obj.scale -= 1
    } else if (obj.scale <= 1 && obj.scale >= 0.4) {
      obj.scale -= 0.2
    }

    this._renderCurrent()
    this._renderToolbar()
  }

  rotateRight() {
    if (!this.activeImg) return
    this.imgMap.get(this.activeImg)!.rotate += 90
    this._renderCurrent()
  }

  rotateLeft() {
    if (!this.activeImg) return
    this.imgMap.get(this.activeImg)!.rotate -= 90
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

  override render() {
    super.render()
    this._renderCurrent()
    this._renderNavButton()
    this._renderToolbar()
  }

  _renderCurrent() {
    if (this.activeImg) {
      const { $active } = this
      if ($active.src !== this.activeImg.src) {
        $active.style.opacity = '0'
        $active.src = this.activeImg.src
        $active.onload = () => {
          $active.style.opacity = ''
          const { scale, rotate } = this.imgMap.get(this.activeImg)!
          $active.style.transform = `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`
        }
      } else {
        const { scale, rotate } = this.imgMap.get(this.activeImg)!
        $active.style.transform = `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`
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
      const buttons = this.$toolbar.querySelectorAll('.button') as unknown as HTMLButtonElement[]
      forEach(buttons, $button => {
        disabledSetter($button, true)
      })
      return
    }

    const buttons = this.$toolbar.querySelectorAll('.button') as unknown as HTMLButtonElement[]

    forEach(buttons, $button => {
      disabledSetter($button, false)
    })
    const { scale } = this.imgMap.get(this.activeImg)!
    disabledSetter(this.$zoomOutButton, scale === 0.2)
  }
}
