import '../loading/index.js'
import '../icon/index.js'
import { disabledSetter } from '../../common/propertyAccessor.js'
import { onWheel } from '../../common/onWheel.js'
import { forEach } from '../../common/utils.js'
import { contentTemplate, styleTemplate } from './template.js'
import { Component, ComponentEventListener } from '../Component.js'
import {
  WithOpenTransition,
  WithOpenTransitionEventMap,
} from '../with-open-transition/index.js'
import { applyMixins } from '../../common/applyMixins.js'
import { withOpenTransitionStyleTemplate } from '../with-open-transition/template.js'
import { customElement } from '../../decorators/customElement.js'

type ImageTransformStates = Map<
  HTMLImageElement,
  { scale: number; rotate: number }
>

export type BlocksImageViewerEventMap = WithOpenTransitionEventMap

export interface BlocksImageViewer extends Component, WithOpenTransition {
  _ref: {
    $slot: HTMLSlotElement
    $mask: HTMLElement
    $layout: HTMLElement
    $toolbar: HTMLElement
    $thumbnails: HTMLElement
    $content: HTMLElement
    $active: HTMLImageElement
    $prev: HTMLButtonElement
    $next: HTMLButtonElement
    $closeButton: HTMLButtonElement
    $rotateLeftButton: HTMLButtonElement
    $rotateRightButton: HTMLButtonElement
    $zoomInButton: HTMLButtonElement
    $zoomOutButton: HTMLButtonElement
  }

  imgMap: ImageTransformStates

  addEventListener<K extends keyof BlocksImageViewerEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksImageViewerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlocksImageViewerEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksImageViewerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@customElement('bl-image-viewer')
export class BlocksImageViewer extends Component {
  static override get observedAttributes() {
    return super.observedAttributes.concat([])
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    const $style = styleTemplate()
    const $layout = contentTemplate()

    this.appendShadowChildren([
      withOpenTransitionStyleTemplate(),
      $style,
      $layout,
    ])

    const $slot = $layout.querySelector('slot')!
    const $mask = $layout.querySelector('#mask') as HTMLElement
    const $toolbar = $layout.querySelector('#toolbar') as HTMLElement
    const $thumbnails = $layout.querySelector('#thumbnails') as HTMLElement
    const $content = $layout.querySelector('#content') as HTMLElement
    const $active = $layout.querySelector('#active') as HTMLImageElement
    const $prev = $layout.querySelector('#prev') as HTMLButtonElement
    const $next = $layout.querySelector('#next') as HTMLButtonElement
    const $closeButton = $layout.querySelector('#close') as HTMLButtonElement
    const $rotateLeftButton = $layout.querySelector(
      '#rotate-left'
    ) as HTMLButtonElement
    const $rotateRightButton = $layout.querySelector(
      '#rotate-right'
    ) as HTMLButtonElement
    const $zoomInButton = $layout.querySelector('#zoom-in') as HTMLButtonElement
    const $zoomOutButton = $layout.querySelector(
      '#zoom-out'
    ) as HTMLButtonElement

    this._ref = {
      $slot,
      $mask,
      $layout,
      $toolbar,
      $thumbnails,
      $content,
      $active,
      $prev,
      $next,
      $closeButton,
      $rotateLeftButton,
      $rotateRightButton,
      $zoomInButton,
      $zoomOutButton,
    }

    this.imgMap = new Map()

    const onSlotChange = () => {
      const imgs = $slot
        .assignedElements()
        .filter(el => el.nodeName === 'IMG') as HTMLImageElement[]

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
    $slot.addEventListener('slotchange', onSlotChange)
    onSlotChange()

    $prev.onclick = () => {
      this.prev()
    }

    $next.onclick = () => {
      this.next()
    }

    $rotateLeftButton.onclick = () => {
      this.rotateLeft()
    }

    $rotateRightButton.onclick = () => {
      this.rotateRight()
    }

    $zoomInButton.onclick = () => {
      this.zoomIn()
    }

    $zoomOutButton.onclick = () => {
      this.zoomOut()
    }

    $closeButton.onclick = () => {
      this.open = false
    }

    $mask.onclick = () => {
      this.open = false
    }

    onWheel(this, (e, data) => {
      if (data.spinY > 0) {
        this.zoomOut()
      } else {
        this.zoomIn()
      }
    })

    this.addEventListener('opened', () => {
      $layout.focus()
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
    if (attrName === 'open') {
      this._onOpenAttributeChange()
    }
    this.render()
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
    if (
      this.imgs.length &&
      this.activeImg !== this.imgs[this.imgs.length - 1]
    ) {
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
    this._renderCurrent()
    this._renderNavButton()
    this._renderToolbar()
  }

  _renderCurrent() {
    if (this.activeImg) {
      const { $active } = this._ref
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
    const { $prev, $next } = this._ref
    const display = this.imgs.length > 1 ? 'block' : 'none'
    $prev.style.display = $next.style.display = display

    disabledSetter($prev, !!this.activeImg && this.activeImg === this.imgs[0])
    disabledSetter(
      $next,
      !!this.activeImg && this.activeImg === this.imgs[this.imgs.length - 1]
    )
  }

  _renderToolbar() {
    if (!this.activeImg) {
      const buttons = this._ref.$toolbar.querySelectorAll(
        '.button'
      ) as unknown as HTMLButtonElement[]
      forEach(buttons, $button => {
        disabledSetter($button, true)
      })
      return
    }

    const buttons = this._ref.$toolbar.querySelectorAll(
      '.button'
    ) as unknown as HTMLButtonElement[]

    forEach(buttons, $button => {
      disabledSetter($button, false)
    })
    const { scale } = this.imgMap.get(this.activeImg)!
    disabledSetter(this._ref.$zoomOutButton, scale === 0.2)
  }
}

applyMixins(BlocksImageViewer, [WithOpenTransition])
