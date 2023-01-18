import '../button/index.js';
import '../modal-mask/index.js';
import { boolGetter, boolSetter, strGetter } from '../../common/property.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { onDragMove } from '../../common/onDragMove.js';
import { dialogStyleTemplate, dialogTemplate } from './template.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
import { applyMixins } from '../../common/applyMixins.js';
import { Control } from '../base-control/index.js';
import { withOpenTransitionStyleTemplate } from '../with-open-transition/template.js';
class BlocksDialog extends Control {
    static get role() {
        return 'dialog';
    }
    removeAfterClose = false;
    constructor() {
        super();
        this._appendStyle(withOpenTransitionStyleTemplate());
        this._appendStyle(dialogStyleTemplate());
        this._ref.$layout.appendChild(dialogTemplate());
        const $mask = document.createElement('bl-modal-mask');
        this._ref.$mask = $mask;
        const _refocus = () => {
            this.focus();
            this.removeEventListener('blur', _refocus);
        };
        $mask.addEventListener('mousedown', () => {
            this.focus();
            this.addEventListener('blur', _refocus);
        });
        $mask.addEventListener('mouseup', () => {
            this.removeEventListener('blur', _refocus);
        });
        this.addEventListener('opened', () => {
            this._focus();
        });
        this.addEventListener('closed', () => {
            this._blur();
            if (this.removeAfterClose) {
                this.parentElement && this.parentElement.removeChild(this);
            }
        });
        this._ref.$layout.addEventListener('slotchange', () => {
            this.render();
        });
        if (this.capturefocus) {
            this._captureFocus();
        }
    }
    get mask() {
        return boolGetter('mask')(this);
    }
    set mask(value) {
        boolSetter('mask')(this, value);
    }
    get titleText() {
        return strGetter('title')(this) ?? '';
    }
    set titleText(value) {
        this.setAttribute('title', value);
        this._renderHeader();
    }
    get closeable() {
        return boolGetter('closeable')(this);
    }
    set closeable(value) {
        boolSetter('closeable')(this, value);
    }
    get capturefocus() {
        return boolGetter('capturefocus')(this);
    }
    set capturefocus(value) {
        boolSetter('capturefocus')(this, value);
    }
    get appendToBody() {
        return boolGetter('append-to-body')(this);
    }
    set appendToBody(value) {
        boolSetter('append-to-body')(this, value);
    }
    render() {
        super.render();
        this._renderHeader();
        this._renderFooter();
        this._renderClose();
    }
    _captureFocus() {
        this._ref.$firstFocusable =
            this._ref.$layout.querySelector('#first') ||
                this._ref.$layout.insertBefore(document.createElement('button'), this._ref.$layout.firstChild);
        this._ref.$lastFocusable =
            this._ref.$layout.querySelector('#last') ||
                this._ref.$layout.appendChild(document.createElement('button'));
        this._ref.$firstFocusable.id = 'first';
        this._ref.$lastFocusable.id = 'last';
        this._ref.$firstFocusable.onkeydown = e => {
            if (e.key === 'Tab' && e.shiftKey) {
                this._ref.$lastFocusable?.focus?.();
            }
        };
        this._ref.$lastFocusable.onkeydown = e => {
            if (e.key === 'Tab' && !e.shiftKey) {
                this._ref.$firstFocusable?.focus?.();
            }
        };
    }
    _stopCaptureFocus() {
        if (this._ref.$firstFocusable?.parentElement) {
            this._ref.$layout.removeChild(this._ref.$firstFocusable);
        }
        if (this._ref.$lastFocusable?.parentElement) {
            this._ref.$layout.removeChild(this._ref.$lastFocusable);
        }
    }
    _updateVisible() {
        if (this.open) {
            if (!this.style.left) {
                this.style.left =
                    (document.body.clientWidth - this.offsetWidth) / 2 + 'px';
            }
            if (!this.style.top) {
                this.style.top =
                    (document.body.clientHeight - this.offsetHeight) / 2 + 'px';
            }
            if (this._ref.$mask) {
                this._ref.$mask.open = true;
            }
        }
        else {
            if (this._ref.$mask) {
                this._ref.$mask.open = false;
            }
        }
    }
    _renderClose() {
        if (this.closeable) {
            if (!this._ref.$close) {
                this._ref.$close = document.createElement('button');
                this._ref.$close.id = 'close';
                this._ref.$close.appendChild(getRegisteredSvgIcon('cross'));
                this._ref.$close.onclick = () => {
                    this.open = false;
                };
                if (this._ref.$lastFocusable) {
                    this._ref.$layout.insertBefore(this._ref.$close, this._ref.$lastFocusable);
                }
                else {
                    this._ref.$layout.appendChild(this._ref.$close);
                }
            }
        }
        else {
            if (this._ref.$close) {
                this._ref.$close.parentElement.removeChild(this._ref.$close);
                this._ref.$close = undefined;
            }
        }
    }
    _renderHeader() {
        if (this.querySelectorHost('[slot="header"]')) {
            this._ref.$layout.classList.remove('no-header');
        }
        else if (this.titleText) {
            this._ref.$layout.classList.remove('no-header');
            const $title = this.querySelectorShadow('h1');
            $title.innerText = this.titleText;
        }
        else {
            this._ref.$layout.classList.add('no-header');
        }
    }
    _renderFooter() {
        if (this.querySelector('[slot="footer"]')) {
            this._ref.$layout.classList.remove('no-footer');
        }
        else {
            this._ref.$layout.classList.add('no-footer');
        }
    }
    #prevFocus;
    _focus() {
        if (!this.#prevFocus) {
            this.#prevFocus = document.activeElement;
        }
        this.focus();
    }
    _blur() {
        this.blur();
        if (this.#prevFocus) {
            ;
            this.#prevFocus?.focus?.();
            this.#prevFocus = undefined;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('tabindex', '-1');
        if (this.parentElement !== document.body) {
            document.body.appendChild(this);
        }
        if (this.mask) {
            this.parentElement?.insertBefore?.(this._ref.$mask, this);
        }
        this._renderHeader();
        this._renderFooter();
        this._initDragEvents();
    }
    _initDragEvents() {
        let startX;
        let startY;
        const isHeader = (target) => {
            if (this._ref.$layout.querySelector('header').contains(target)) {
                return true;
            }
            if (this.contains(target)) {
                let el = target;
                while (el && el !== this) {
                    if (el.slot === 'header')
                        return true;
                    el = el.parentElement;
                }
            }
            return false;
        };
        onDragMove(this._ref.$layout, {
            onStart: ({ $target, stop }) => {
                if (!isHeader($target))
                    return stop();
                const marginLeft = parseFloat(window.getComputedStyle(this).marginLeft || '0');
                const marginTop = parseFloat(window.getComputedStyle(this).marginTop || '0');
                startX = this.offsetLeft - marginLeft;
                startY = this.offsetTop - marginTop;
            },
            onMove: ({ offset }) => {
                this.style.left = startX + offset.x + 'px';
                this.style.top = startY + offset.y + 'px';
            },
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._ref.$mask && this._ref.$mask.parentElement) {
            this._ref.$mask.parentElement.removeChild(this._ref.$mask);
        }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName == 'open' && this.shadowRoot) {
            this._onOpenAttributeChange();
            this._updateVisible();
        }
        if (attrName === 'mask') {
            if (this.mask) {
                this.parentElement?.insertBefore?.(this._ref.$mask, this);
            }
            else if (this._ref.$mask.parentElement) {
                this._ref.$mask.parentElement.removeChild(this._ref.$mask);
            }
        }
        if (attrName === 'capturefocus') {
            if (this.capturefocus) {
                this._captureFocus();
            }
            else {
                this._stopCaptureFocus();
            }
        }
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([
            'open',
            'title',
            'closeable',
            'capturefocus',
            'mask',
            'dark',
        ]);
    }
}
applyMixins(BlocksDialog, [WithOpenTransition]);
if (!customElements.get('bl-dialog')) {
    customElements.define('bl-dialog', BlocksDialog);
}
export { BlocksDialog };
