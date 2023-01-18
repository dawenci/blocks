import '../button/index.js';
import '../icon/index.js';
import { boolGetter, boolSetter, strGetter, strSetter, } from '../../common/property.js';
import { dispatchEvent } from '../../common/event.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js';
import { onDragMove } from '../../common/onDragMove.js';
import { windowStyleTemplate, windowTemplate } from './template.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
import { applyMixins } from '../../common/applyMixins.js';
import { withOpenTransitionStyleTemplate } from '../with-open-transition/template.js';
const capturefocusGetter = boolGetter('capturefocus');
const capturefocusSetter = boolSetter('capturefocus');
class BlocksWindow extends Control {
    static get role() {
        return 'window';
    }
    #prevFocus;
    #onResize;
    static get observedAttributes() {
        return super.observedAttributes.concat([
            'actions',
            'capturefocus',
            'dark',
            'icon',
            'maximized',
            'minimized',
            'name',
            'open',
        ]);
    }
    constructor() {
        super();
        this._appendStyle(withOpenTransitionStyleTemplate());
        this._appendStyle(windowStyleTemplate());
        const shadowRoot = this.shadowRoot;
        shadowRoot.appendChild(windowTemplate());
        const $header = shadowRoot.getElementById('header');
        const $body = shadowRoot.getElementById('body');
        const $content = shadowRoot.getElementById('content');
        const $statusBar = shadowRoot.getElementById('status-bar');
        const $statusBarSlot = shadowRoot.querySelector('[name=status-bar]');
        const $actions = shadowRoot.getElementById('actions');
        const $closeButton = shadowRoot.getElementById('close');
        const $maximizeButton = shadowRoot.getElementById('maximize');
        const $minimizeButton = shadowRoot.getElementById('minimize');
        const $icon = shadowRoot.getElementById('icon');
        const $name = shadowRoot.getElementById('name');
        Object.assign(this._ref, {
            $header,
            $body,
            $content,
            $statusBar,
            $statusBarSlot,
            $actions,
            $closeButton,
            $maximizeButton,
            $minimizeButton,
            $icon,
            $name,
        });
        sizeObserve(this, detail => {
            if (typeof this.#onResize === 'function') {
                this.#onResize(detail);
            }
            dispatchEvent(this, 'bl:resize', { detail });
        });
        $closeButton.onclick = () => {
            this.open = false;
        };
        $maximizeButton.onclick = () => {
            this.maximized = !this.maximized;
        };
        $minimizeButton.onclick = () => {
            this.minimized = !this.minimized;
        };
        $header.ondblclick = () => {
            this.maximized = !this.maximized;
        };
        this.addEventListener('opened', () => {
            this.#focus();
        });
        this.addEventListener('closed', () => {
            this.#blur();
        });
        $content.addEventListener('slotchange', () => {
            this.render();
        });
        const updateSlot = () => {
            $body.classList.toggle('has-status-bar', !!$statusBarSlot.assignedNodes().length);
        };
        updateSlot();
        $statusBarSlot.addEventListener('slotchange', () => {
            updateSlot();
        });
        if (this.capturefocus) {
            this.#captureFocus();
        }
        this.#initMoveEvents();
        this.#initResizeEvents();
    }
    get actions() {
        return strGetter('actions')(this) ?? 'minimize,maximize,close';
    }
    set actions(value) {
        if (value !== null && typeof value !== 'string')
            return;
        let newValue = String(value);
        if (typeof value === 'string') {
            newValue =
                value
                    .split(',')
                    .filter(action => ['minimize', 'maximize', 'close'].includes(action.trim()))
                    .join(',') || null;
        }
        strSetter('actions')(this, newValue);
    }
    get capturefocus() {
        return capturefocusGetter(this);
    }
    set capturefocus(value) {
        capturefocusSetter(this, value);
    }
    get icon() {
        return strGetter('icon')(this);
    }
    set icon(value) {
        strSetter('icon')(this, value);
    }
    get maximized() {
        return boolGetter('maximized')(this);
    }
    set maximized(value) {
        boolSetter('maximized')(this, value);
    }
    get minimized() {
        return boolGetter('minimized')(this);
    }
    set minimized(value) {
        boolSetter('minimized')(this, value);
    }
    get name() {
        return strGetter('name')(this);
    }
    set name(value) {
        strSetter('name')(this, value);
    }
    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('tabindex', '-1');
        if (this.parentElement !== document.body) {
            document.body.appendChild(this);
        }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'actions') {
            this.#renderActions();
        }
        if (attrName === 'capturefocus') {
            if (this.capturefocus) {
                this.#captureFocus();
            }
            else {
                this.#stopCaptureFocus();
            }
        }
        if (attrName === 'icon') {
            this.#renderIcon();
        }
        if (attrName === 'maximized') {
            if (this.maximized) {
                doTransitionEnter(this, 'maximized', () => {
                });
            }
            else {
                doTransitionLeave(this, 'maximized', () => {
                });
            }
        }
        if (attrName === 'name') {
            this.#renderName();
        }
        if (attrName == 'open') {
            this._onOpenAttributeChange();
            this.#updateVisible();
        }
    }
    #initMoveEvents() {
        let startLeft;
        let startTop;
        onDragMove(this._ref.$header, {
            onStart: ({ stop }) => {
                if (this.maximized)
                    return stop();
                const style = getComputedStyle(this);
                startLeft = parseFloat(style.left);
                startTop = parseFloat(style.top);
            },
            onMove: ({ offset }) => {
                this.style.left = startLeft + offset.x + 'px';
                this.style.top = startTop + offset.y + 'px';
            },
        });
    }
    #initResizeEvents() {
        let startLeft;
        let startTop;
        let startWidth;
        let startHeight;
        let startMouseX;
        let startMouseY;
        let currentLeft;
        let currentTop;
        let currentWidth;
        let currentHeight;
        let updateFn;
        const callAll = (...fns) => (...args) => fns.forEach((fn) => fn(...args));
        const resizeTop = (x, y) => {
            const offset = y - startMouseY;
            const newTop = startTop + offset;
            const newHeight = startHeight - offset;
            if (newTop < 0 || newHeight < this._ref.$header.offsetHeight)
                return;
            currentTop = newTop;
            currentHeight = newHeight;
            this.style.top = newTop + 'px';
            this.style.height = newHeight + 'px';
        };
        const resizeBottom = (x, y) => {
            const offset = y - startMouseY;
            const newHeight = startHeight + offset;
            if (newHeight < this._ref.$header.offsetHeight)
                return;
            currentHeight = newHeight;
            this.style.height = newHeight + 'px';
        };
        const resizeLeft = (x, _y) => {
            const offset = x - startMouseX;
            const newLeft = startLeft + offset;
            const newWidth = startWidth - offset;
            if (newLeft < 0 || newWidth < 200)
                return;
            currentLeft = newLeft;
            currentWidth = newWidth;
            this.style.left = newLeft + 'px';
            this.style.width = newWidth + 'px';
        };
        const resizeRight = (x, _y) => {
            const offset = x - startMouseX;
            const newWidth = startWidth + offset;
            if (newWidth < 200)
                return;
            currentWidth = newWidth;
            this.style.width = newWidth + 'px';
        };
        onDragMove(this._ref.$layout, {
            onStart: ({ stop, start, $target }) => {
                if (this.maximized || this.minimized)
                    return stop();
                if ($target.tagName !== 'B')
                    return stop();
                const style = getComputedStyle(this);
                currentLeft = startLeft = parseFloat(style.left);
                currentTop = startTop = parseFloat(style.top);
                currentWidth = startWidth = parseFloat(style.width);
                currentHeight = startHeight = parseFloat(style.height);
                startMouseX = start.pageX;
                startMouseY = start.pageY;
                switch ($target.id) {
                    case 'resize-top': {
                        updateFn = resizeTop;
                        break;
                    }
                    case 'resize-right': {
                        updateFn = resizeRight;
                        break;
                    }
                    case 'resize-bottom': {
                        updateFn = resizeBottom;
                        break;
                    }
                    case 'resize-left': {
                        updateFn = resizeLeft;
                        break;
                    }
                    case 'resize-top-left': {
                        updateFn = callAll(resizeTop, resizeLeft);
                        break;
                    }
                    case 'resize-top-right': {
                        updateFn = callAll(resizeTop, resizeRight);
                        break;
                    }
                    case 'resize-bottom-right': {
                        updateFn = callAll(resizeBottom, resizeRight);
                        break;
                    }
                    case 'resize-bottom-left': {
                        updateFn = callAll(resizeBottom, resizeLeft);
                        break;
                    }
                }
            },
            onMove: ({ current }) => {
                if (current.pageY > window.innerHeight ||
                    current.pageX > window.innerWidth)
                    return;
                updateFn(current.pageX, current.pageY);
            },
        });
    }
    #renderName() {
        this._ref.$name.title = this._ref.$name.textContent = this.name ?? '';
    }
    #renderActions() {
        this._ref.$minimizeButton.style.display = this.actions.includes('minimize')
            ? ''
            : 'none';
        this._ref.$maximizeButton.style.display = this.actions.includes('maximize')
            ? ''
            : 'none';
        this._ref.$closeButton.style.display = this.actions.includes('close')
            ? ''
            : 'none';
    }
    #renderIcon() {
        if (this._ref.$icon?.childElementCount) {
            const $icon = this._ref.$icon.firstElementChild;
            if ($icon.dataset.name === this.icon)
                return;
        }
        const $icon = getRegisteredSvgIcon(this.icon ?? '');
        if ($icon) {
            ;
            $icon.dataset.name = this.icon;
            this._ref.$icon.innerHTML = '';
            this._ref.$icon.appendChild($icon);
        }
        else {
            this._ref.$icon.innerHTML = '';
        }
    }
    #captureFocus() {
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
                this._ref.$lastFocusable?.focus();
            }
        };
        this._ref.$lastFocusable.onkeydown = e => {
            if (e.key === 'Tab' && !e.shiftKey) {
                this._ref.$firstFocusable?.focus();
            }
        };
    }
    #stopCaptureFocus() {
        if (this._ref.$firstFocusable && this._ref.$firstFocusable.parentElement) {
            this._ref.$layout.removeChild(this._ref.$firstFocusable);
        }
        if (this._ref.$firstFocusable && this._ref.$lastFocusable?.parentElement) {
            this._ref.$layout.removeChild(this._ref.$lastFocusable);
        }
    }
    #updateVisible() {
        if (this.open) {
            if (!this.style.left) {
                this.style.left =
                    (document.body.clientWidth - this.offsetWidth) / 2 + 'px';
            }
            if (!this.style.top) {
                this.style.top =
                    (document.body.clientHeight - this.offsetHeight) / 2 + 'px';
            }
        }
    }
    #focus() {
        if (!this.#prevFocus) {
            this.#prevFocus = document.activeElement;
        }
        this.focus();
    }
    #blur() {
        this.blur();
        if (this.#prevFocus) {
            this.#prevFocus?.focus();
            this.#prevFocus = undefined;
        }
    }
    addEventListener(type, listener, options) {
        return super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        return super.removeEventListener(type, listener, options);
    }
}
applyMixins(BlocksWindow, [WithOpenTransition]);
if (!customElements.get('bl-window')) {
    customElements.define('bl-window', BlocksWindow);
}
export { BlocksWindow };
