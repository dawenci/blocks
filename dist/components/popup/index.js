import { boolGetter, boolSetter, enumGetter, enumSetter, strGetter, strSetter, } from '../../common/property.js';
import { popupStyleTemplate, popupTemplate } from './template.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
import { applyMixins } from '../../common/applyMixins.js';
import { withOpenTransitionStyleTemplate } from '../with-open-transition/template.js';
const ARROW_SIZE = 8;
export var PopupOrigin;
(function (PopupOrigin) {
    PopupOrigin["Center"] = "center";
    PopupOrigin["TopStart"] = "top-start";
    PopupOrigin["TopCenter"] = "top-center";
    PopupOrigin["TopEnd"] = "top-end";
    PopupOrigin["RightStart"] = "right-start";
    PopupOrigin["RightCenter"] = "right-center";
    PopupOrigin["RightEnd"] = "right-end";
    PopupOrigin["BottomEnd"] = "bottom-end";
    PopupOrigin["BottomCenter"] = "bottom-center";
    PopupOrigin["BottomStart"] = "bottom-start";
    PopupOrigin["LeftEnd"] = "left-end";
    PopupOrigin["LeftCenter"] = "left-center";
    PopupOrigin["LeftStart"] = "left-start";
})(PopupOrigin || (PopupOrigin = {}));
const insetGetter = boolGetter('inset');
const insetSetter = boolSetter('inset');
const autofocusGetter = boolGetter('autofocus');
const autofocusSetter = boolSetter('autofocus');
const capturefocusGetter = boolGetter('capturefocus');
const capturefocusSetter = boolSetter('capturefocus');
const appendToBodyGetter = boolGetter('append-to-body');
const appendToBodySetter = boolSetter('append-to-body');
const autoflipGetter = boolGetter('autoflip');
const autoflipSetter = boolSetter('autoflip');
const restorefocusGetter = boolGetter('restorefocus');
const restorefocusSetter = boolSetter('restorefocus');
const arrowGetter = boolGetter('arrow');
const arrowSetter = boolSetter('arrow');
const originGetter = enumGetter('origin', Object.values(PopupOrigin));
const originSetter = enumSetter('origin', Object.values(PopupOrigin));
export class BlocksPopup extends Control {
    static get role() {
        return 'popup';
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            'anchor',
            'append-to-body',
            'arrow',
            'autoflip',
            'autofocus',
            'capturefocus',
            'inset',
            'offset',
            'origin',
            'restorefocus',
        ]);
    }
    constructor() {
        super();
        this._appendStyle(withOpenTransitionStyleTemplate());
        this._appendStyle(popupStyleTemplate());
        this._ref.$layout.appendChild(popupTemplate());
        const shadowRoot = this.shadowRoot;
        const $arrow = shadowRoot.querySelector('#arrow');
        const $slot = shadowRoot.querySelector('slot');
        Object.assign(this._ref, {
            $arrow,
            $slot,
        });
        this.addEventListener('opened', () => {
            if (this.autofocus)
                this._focus();
            this.updatePositionAndDirection();
        });
        this.addEventListener('closed', () => {
            this._blur();
        });
        if (this.capturefocus) {
            this._captureFocus();
        }
    }
    get origin() {
        return originGetter(this) ?? PopupOrigin.Center;
    }
    set origin(value) {
        originSetter(this, value);
    }
    get inset() {
        return insetGetter(this);
    }
    set inset(value) {
        insetSetter(this, value);
    }
    #getAnchorFn;
    get anchor() {
        return this.#getAnchorFn ?? strGetter('anchor')(this);
    }
    set anchor(value) {
        if (typeof value === 'string' || value === null) {
            strSetter('anchor')(this, value);
            this.#getAnchorFn = undefined;
        }
        else {
            strSetter('anchor')(this, null);
            if (typeof value === 'function') {
                this.#getAnchorFn = value;
            }
            else if (value instanceof Node) {
                this.#getAnchorFn = () => value;
            }
        }
        this.updatePositionAndDirection();
    }
    get offset() {
        const value = strGetter('offset')(this);
        if (value)
            return JSON.parse(value);
        return [0, 0];
    }
    set offset(value) {
        strSetter('offset')(this, JSON.stringify(value));
    }
    get appendToBody() {
        return appendToBodyGetter(this);
    }
    set appendToBody(value) {
        appendToBodySetter(this, value);
    }
    get arrow() {
        return arrowGetter(this);
    }
    set arrow(value) {
        arrowSetter(this, value);
    }
    get autofocus() {
        return autofocusGetter(this);
    }
    set autofocus(value) {
        autofocusSetter(this, value);
    }
    get capturefocus() {
        return capturefocusGetter(this);
    }
    set capturefocus(value) {
        capturefocusSetter(this, value);
    }
    get autoflip() {
        return autoflipGetter(this);
    }
    set autoflip(value) {
        autoflipSetter(this, value);
    }
    get restorefocus() {
        return restorefocusGetter(this);
    }
    set restorefocus(value) {
        restorefocusSetter(this, value);
    }
    getAnchorFrame() {
        let x1;
        let x2;
        let y1;
        let y2;
        let layoutAnchor;
        const anchor = typeof this.anchor === 'function' ? this.anchor() : this.anchor;
        if (anchor === null) {
            layoutAnchor = getOffsetParent(this);
        }
        else if (anchor instanceof Element) {
            layoutAnchor = anchor;
        }
        else if (typeof anchor === 'string') {
            if (!anchor.trim()) {
                layoutAnchor = getOffsetParent(this);
            }
            else if (/\[\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\]/.test(anchor)) {
                ;
                [x1, y1, x2, y2] = JSON.parse(anchor);
            }
            else if (/\[\s*\d+\s*,\s*\d+\s*\]/.test(anchor)) {
                ;
                [x1, y1] = JSON.parse(anchor);
                x2 = x1;
                y2 = y1;
            }
            else {
                layoutAnchor = document.querySelector(anchor);
                if (layoutAnchor === null) {
                    layoutAnchor = getOffsetParent(this);
                }
            }
        }
        if (layoutAnchor) {
            const rect = layoutAnchor.getBoundingClientRect();
            y1 = Math.floor(rect.top);
            x1 = Math.floor(rect.left);
            y2 = y1 + rect.height;
            x2 = x1 + rect.width;
        }
        else {
            const { top, left } = getOffsetParent(this).getBoundingClientRect();
            x1 += left;
            x2 += left;
            y1 += top;
            y2 += top;
        }
        return { x1, y1, x2, y2 };
    }
    render() {
    }
    updatePositionAndDirection() {
        if (!this.open)
            return;
        const popup = this._ref.$layout;
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;
        const layoutParent = getOffsetParent(this);
        if (!layoutParent)
            return;
        const { scrollTop: layoutScrollTop, scrollLeft: layoutScrollLeft, scrollWidth: layoutWidth, scrollHeight: layoutHeight, } = layoutParent;
        const { top: layoutOffsetTop, left: layoutOffsetLeft } = layoutParent.getBoundingClientRect();
        const [ox, oy] = this.offset;
        const { x1, y1, x2, y2 } = this.getAnchorFrame();
        let top;
        let left;
        let shadowX;
        let shadowY;
        let originX;
        let originY;
        const verticalFlip = () => {
            shadowY = {
                top: 'bottom',
                bottom: 'top',
                center: 'center',
            }[shadowY];
            originY = {
                top: 'bottom',
                bottom: 'top',
                center: 'center',
            }[originY];
        };
        const horizontalFlip = () => {
            shadowX = {
                left: 'right',
                right: 'left',
            }[shadowX];
            originX = {
                left: 'right',
                right: 'left',
            }[originX];
        };
        const arrowSize = this.arrow ? ARROW_SIZE : 0;
        if (this.origin.startsWith('top')) {
            top = (this.inset ? y1 : y2) + arrowSize + oy;
            originY = 'top';
            shadowY = 'bottom';
            if (this.autoflip && top + popupHeight > layoutHeight) {
                const flipTop = (this.inset ? y2 : y1) - arrowSize - oy - popupHeight;
                if (flipTop > 0) {
                    top = flipTop;
                    verticalFlip();
                }
            }
        }
        else if (this.origin.startsWith('right')) {
            left = (this.inset ? x2 : x1) - arrowSize - ox - popupWidth;
            originX = 'right';
            shadowX = 'left';
            if (this.autoflip && left < 0) {
                const flipLeft = (this.inset ? x1 : x2) + arrowSize + ox;
                if (flipLeft + popupWidth < layoutWidth) {
                    left = flipLeft;
                    horizontalFlip();
                }
            }
        }
        else if (this.origin.startsWith('bottom')) {
            top = (this.inset ? y2 : y1) - arrowSize - oy - popupHeight;
            originY = 'bottom';
            shadowY = 'top';
            if (this.autoflip && top < 0) {
                const flipTop = (this.inset ? y1 : y2) + arrowSize + oy;
                if (flipTop + popupHeight < layoutHeight) {
                    top = flipTop;
                    verticalFlip();
                }
            }
        }
        else if (this.origin.startsWith('left')) {
            left = (this.inset ? x1 : x2) + arrowSize + ox;
            originX = 'left';
            shadowX = 'right';
            if (this.autoflip && left + popupWidth > layoutWidth) {
                const flipLeft = (this.inset ? x2 : x1) - arrowSize - ox - popupWidth;
                if (flipLeft > 0) {
                    left = flipLeft;
                    horizontalFlip();
                }
            }
        }
        else {
            top = y1 + (y2 - y1) / 2 - popupHeight / 2 + oy;
            left = x1 + (x2 - x1) / 2 - popupWidth / 2 + ox;
            originX = 'center';
            originY = 'center';
            shadowX = 'center';
            shadowY = 'center';
        }
        if (this._isVertical()) {
            if (this.origin.endsWith('start')) {
                left = x1 + ox;
                originX = 'left';
                shadowX = 'right';
                if (this.autoflip &&
                    left + popupWidth > layoutWidth &&
                    x2 - ox - popupWidth > 0) {
                    left = x2 - ox - popupWidth;
                    horizontalFlip();
                }
            }
            else if (this.origin.endsWith('end')) {
                left = x2 - ox - popupWidth;
                originX = 'right';
                shadowX = 'left';
                if (this.autoflip && left < 0 && x1 + ox + popupWidth < layoutWidth) {
                    left = x1 + ox;
                    horizontalFlip();
                }
            }
            else if (this.origin.endsWith('center')) {
                left = x1 + (x2 - x1) / 2 - popupWidth / 2 + ox;
                originX = 'center';
                shadowX = 'center';
            }
        }
        else if (this._isHorizontal()) {
            if (this.origin.endsWith('start')) {
                top = y1 + oy;
                originY = 'top';
                shadowY = 'bottom';
                if (this.autoflip &&
                    top + popupHeight > layoutHeight &&
                    y2 - oy - popupHeight > 0) {
                    top = y2 - oy - popupHeight;
                    verticalFlip();
                }
            }
            else if (this.origin.endsWith('end')) {
                top = y2 - oy - popupHeight;
                originY = 'bottom';
                shadowY = 'top';
                if (this.autoflip && top < 0 && y1 + oy + popupHeight < layoutHeight) {
                    top = y1 + oy + popupHeight;
                    verticalFlip();
                }
            }
            else if (this.origin.endsWith('center')) {
                top = y1 + (y2 - y1) / 2 - popupHeight / 2 + oy;
                originY = 'center';
                shadowY = 'center';
            }
        }
        this.style.top = `${top + layoutScrollTop - layoutOffsetTop}px`;
        this.style.left = `${left + layoutScrollLeft - layoutOffsetLeft}px`;
        this._setOrigin(originY, originX);
    }
    #refreshPosition;
    _initAnchorEvent() {
        if (this.#refreshPosition)
            return;
        this.#refreshPosition = () => this.open && this.anchor && this.updatePositionAndDirection();
        window.addEventListener('scroll', this.#refreshPosition, true);
        window.addEventListener('touchstart', this.#refreshPosition);
        window.addEventListener('click', this.#refreshPosition);
    }
    _destroyAnchorEvent() {
        if (!this.#refreshPosition)
            return;
        window.removeEventListener('scroll', this.#refreshPosition, true);
        window.removeEventListener('touchstart', this.#refreshPosition);
        window.removeEventListener('click', this.#refreshPosition);
        this.#refreshPosition = null;
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.appendToBody && this.parentElement !== document.body) {
            document.body.appendChild(this);
        }
        if (this.open) {
            this._onOpenAttributeChange();
            this._updateVisible();
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._destroyAnchorEvent();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        switch (attrName) {
            case 'open': {
                this._onOpenAttributeChange();
                this._updateVisible();
                break;
            }
            case 'anchor': {
                this.anchor = newValue;
                break;
            }
            case 'offset': {
                this.updatePositionAndDirection();
                break;
            }
            case 'arrow': {
                this._updateArrow();
                this.updatePositionAndDirection();
                break;
            }
            case 'append-to-body': {
                if (this.appendToBody &&
                    this.parentElement !== document.body &&
                    document.documentElement.contains(this)) {
                    document.body.appendChild(this);
                }
                this.updatePositionAndDirection();
                break;
            }
            case 'capturefocus': {
                if (this.capturefocus) {
                    this._captureFocus();
                }
                else {
                    this._stopCaptureFocus();
                }
                break;
            }
            case 'origin': {
                this._updateClass();
                this._updateArrow();
                this.updatePositionAndDirection();
                break;
            }
            default: {
                this.updatePositionAndDirection();
                break;
            }
        }
    }
    #firstFocusable;
    #lastFocusable;
    _captureFocus() {
        this.#firstFocusable =
            this._ref.$layout.querySelector('#first') ||
                this._ref.$layout.insertBefore(document.createElement('button'), this._ref.$layout.firstChild);
        this.#lastFocusable =
            this._ref.$layout.querySelector('#last') ||
                this._ref.$layout.appendChild(document.createElement('button'));
        this.#firstFocusable.id = 'first';
        this.#lastFocusable.id = 'last';
        this.#firstFocusable.onkeydown = e => {
            if (e.key === 'Tab' && e.shiftKey) {
                this.#lastFocusable?.focus?.();
            }
        };
        this.#lastFocusable.onkeydown = e => {
            if (e.key === 'Tab' && !e.shiftKey) {
                this.#firstFocusable?.focus?.();
            }
        };
    }
    _stopCaptureFocus() {
        if (this.#firstFocusable && this.#firstFocusable.parentElement) {
            this._ref.$layout.removeChild(this.#firstFocusable);
        }
        if (this.#firstFocusable && this.#lastFocusable?.parentElement) {
            this._ref.$layout.removeChild(this.#lastFocusable);
        }
    }
    _updateVisible() {
        this._updateClass();
        this._updateArrow();
        this.updatePositionAndDirection();
        if (this.open) {
            this._initAnchorEvent();
        }
        else {
            this._destroyAnchorEvent();
        }
    }
    _isHorizontal() {
        return this.origin.startsWith('left') || this.origin.startsWith('right');
    }
    _isVertical() {
        return this.origin.startsWith('top') || this.origin.startsWith('bottom');
    }
    _updateClass() {
        if (this._isHorizontal()) {
            this._ref.$layout.classList.add('horizontal');
            this._ref.$layout.classList.remove('vertical');
        }
        else if (this._isVertical()) {
            this._ref.$layout.classList.remove('horizontal');
            this._ref.$layout.classList.add('vertical');
        }
        else {
            this._ref.$layout.classList.remove('horizontal');
            this._ref.$layout.classList.remove('vertical');
        }
    }
    _updateArrow() {
        if (this.arrow) {
            this._ref.$arrow.style.display = '';
        }
        else {
            this._ref.$arrow.style.display = 'none';
        }
    }
    #prevFocus;
    _focus() {
        if (this.restorefocus && !this.#prevFocus) {
            this.#prevFocus = document.activeElement;
        }
        this.focus();
    }
    _blur() {
        this.blur();
        if (this.#prevFocus) {
            if (this.restorefocus && typeof this.#prevFocus.focus) {
                this.#prevFocus.focus();
            }
            this.#prevFocus = undefined;
        }
    }
    _setOriginClass(value) {
        ;
        [...this._ref.$layout.classList.values()].forEach(className => {
            if (className !== value && className.startsWith('origin-')) {
                this._ref.$layout.classList.remove(className);
            }
        });
        this._ref.$layout.classList.add(value);
    }
    _setOrigin(y, x) {
        this._setOriginClass(`origin-${y}-${x}`);
        this.style.transformOrigin = `${y} ${x}`;
    }
}
applyMixins(BlocksPopup, [WithOpenTransition]);
if (!customElements.get('bl-popup')) {
    customElements.define('bl-popup', BlocksPopup);
}
function getOffsetParent(popup) {
    let el = popup;
    while (el) {
        if (el.offsetParent) {
            return el.offsetParent;
        }
        el = el.parentElement;
    }
    return null;
}
