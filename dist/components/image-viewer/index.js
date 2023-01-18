import '../loading/index.js';
import '../icon/index.js';
import { disabledSetter } from '../../common/propertyAccessor.js';
import { onWheel } from '../../common/onWheel.js';
import { forEach } from '../../common/utils.js';
import { contentTemplate, styleTemplate } from './template.js';
import { Component } from '../Component.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
import { applyMixins } from '../../common/applyMixins.js';
import { withOpenTransitionStyleTemplate } from '../with-open-transition/template.js';
export class BlocksImageViewer extends Component {
    static get observedAttributes() {
        return super.observedAttributes.concat([]);
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const $style = styleTemplate();
        const $layout = contentTemplate();
        this.appendShadowChildren([
            withOpenTransitionStyleTemplate(),
            $style,
            $layout,
        ]);
        const $slot = $layout.querySelector('slot');
        const $mask = $layout.querySelector('#mask');
        const $toolbar = $layout.querySelector('#toolbar');
        const $thumbnails = $layout.querySelector('#thumbnails');
        const $content = $layout.querySelector('#content');
        const $active = $layout.querySelector('#active');
        const $prev = $layout.querySelector('#prev');
        const $next = $layout.querySelector('#next');
        const $closeButton = $layout.querySelector('#close');
        const $rotateLeftButton = $layout.querySelector('#rotate-left');
        const $rotateRightButton = $layout.querySelector('#rotate-right');
        const $zoomInButton = $layout.querySelector('#zoom-in');
        const $zoomOutButton = $layout.querySelector('#zoom-out');
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
        };
        this.imgMap = new Map();
        const onSlotChange = () => {
            const imgs = $slot
                .assignedElements()
                .filter(el => el.nodeName === 'IMG');
            console.log('slot change', imgs);
            const newMap = new Map();
            imgs.forEach($img => {
                if (this.imgMap.has($img)) {
                    newMap.set($img, this.imgMap.get($img));
                }
                else {
                    newMap.set($img, {
                        scale: 1,
                        rotate: 0,
                    });
                }
            });
            this.imgMap = newMap;
            this.imgs = imgs;
        };
        $slot.addEventListener('slotchange', onSlotChange);
        onSlotChange();
        $prev.onclick = () => {
            this.prev();
        };
        $next.onclick = () => {
            this.next();
        };
        $rotateLeftButton.onclick = () => {
            this.rotateLeft();
        };
        $rotateRightButton.onclick = () => {
            this.rotateRight();
        };
        $zoomInButton.onclick = () => {
            this.zoomIn();
        };
        $zoomOutButton.onclick = () => {
            this.zoomOut();
        };
        $closeButton.onclick = () => {
            this.open = false;
        };
        $mask.onclick = () => {
            this.open = false;
        };
        onWheel(this, (e, data) => {
            if (data.spinY > 0) {
                this.zoomOut();
            }
            else {
                this.zoomIn();
            }
        });
        this.addEventListener('opened', () => {
            $layout.focus();
        });
        this.addEventListener('keydown', e => {
            switch (e.key) {
                case 'Escape': {
                    this.open = false;
                    break;
                }
                case 'ArrowLeft': {
                    this.prev();
                    break;
                }
                case 'ArrowRight': {
                    this.next();
                    break;
                }
                case 'ArrowUp': {
                    this.zoomIn();
                    break;
                }
                case 'ArrowDown': {
                    this.zoomOut();
                    break;
                }
            }
        });
    }
    _imgs;
    get imgs() {
        return this._imgs ?? [];
    }
    set imgs(value) {
        this._imgs = value ?? [];
        this.render();
    }
    _activeImg;
    get activeImg() {
        return this._activeImg ?? this.imgs?.[0];
    }
    set activeImg(value) {
        this._activeImg = value;
        this._renderCurrent();
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'open') {
            this._onOpenAttributeChange();
        }
        this.render();
    }
    zoomIn() {
        if (!this.activeImg)
            return;
        const obj = this.imgMap.get(this.activeImg);
        if (obj.scale >= 1) {
            obj.scale += 1;
        }
        else if (obj.scale < 1) {
            obj.scale += 0.2;
        }
        this._renderCurrent();
        this._renderToolbar();
    }
    zoomOut() {
        if (!this.activeImg)
            return;
        const obj = this.imgMap.get(this.activeImg);
        if (obj.scale > 1) {
            obj.scale -= 1;
        }
        else if (obj.scale <= 1 && obj.scale >= 0.4) {
            obj.scale -= 0.2;
        }
        this._renderCurrent();
        this._renderToolbar();
    }
    rotateRight() {
        if (!this.activeImg)
            return;
        this.imgMap.get(this.activeImg).rotate += 90;
        this._renderCurrent();
    }
    rotateLeft() {
        if (!this.activeImg)
            return;
        this.imgMap.get(this.activeImg).rotate -= 90;
        this._renderCurrent();
    }
    next() {
        if (this.imgs.length &&
            this.activeImg !== this.imgs[this.imgs.length - 1]) {
            const index = this.imgs.indexOf(this.activeImg);
            this.activeImg = this.imgs[index + 1];
        }
        this._renderNavButton();
        this._renderToolbar();
    }
    prev() {
        if (this.imgs.length && this.activeImg !== this.imgs[0]) {
            const index = this.imgs.indexOf(this.activeImg);
            this.activeImg = this.imgs[index - 1];
        }
        this._renderNavButton();
        this._renderToolbar();
    }
    render() {
        this._renderCurrent();
        this._renderNavButton();
        this._renderToolbar();
    }
    _renderCurrent() {
        if (this.activeImg) {
            const { $active } = this._ref;
            if ($active.src !== this.activeImg.src) {
                $active.style.opacity = '0';
                $active.src = this.activeImg.src;
                $active.onload = () => {
                    $active.style.opacity = '';
                    const { scale, rotate } = this.imgMap.get(this.activeImg);
                    $active.style.transform = `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`;
                };
            }
            else {
                const { scale, rotate } = this.imgMap.get(this.activeImg);
                $active.style.transform = `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`;
            }
        }
    }
    _renderNavButton() {
        const { $prev, $next } = this._ref;
        const display = this.imgs.length > 1 ? 'block' : 'none';
        $prev.style.display = $next.style.display = display;
        disabledSetter($prev, !!this.activeImg && this.activeImg === this.imgs[0]);
        disabledSetter($next, !!this.activeImg && this.activeImg === this.imgs[this.imgs.length - 1]);
    }
    _renderToolbar() {
        if (!this.activeImg) {
            const buttons = this._ref.$toolbar.querySelectorAll('.button');
            forEach(buttons, $button => {
                disabledSetter($button, true);
            });
            return;
        }
        const buttons = this._ref.$toolbar.querySelectorAll('.button');
        forEach(buttons, $button => {
            disabledSetter($button, false);
        });
        const { scale } = this.imgMap.get(this.activeImg);
        disabledSetter(this._ref.$zoomOutButton, scale === 0.2);
    }
}
applyMixins(BlocksImageViewer, [WithOpenTransition]);
if (!customElements.get('bl-image-viewer')) {
    customElements.define('bl-image-viewer', BlocksImageViewer);
}
