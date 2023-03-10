var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import '../button/index.js';
import '../icon/index.js';
import { strGetter, strSetter } from '../../common/property.js';
import { dispatchEvent } from '../../common/event.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js';
import { onDragMove } from '../../common/onDragMove.js';
import { windowStyleTemplate, windowTemplate } from './template.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
import { withOpenTransitionStyleTemplate } from '../with-open-transition/template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
export let BlocksWindow = (() => {
    let _classDecorators = [defineClass({
            mixins: [WithOpenTransition],
            customElement: 'bl-window',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _capturefocus_decorators;
    let _capturefocus_initializers = [];
    let _maximized_decorators;
    let _maximized_initializers = [];
    let _minimized_decorators;
    let _minimized_initializers = [];
    let _icon_decorators;
    let _icon_initializers = [];
    let _name_decorators;
    let _name_initializers = [];
    var BlocksWindow = class extends Control {
        static {
            _capturefocus_decorators = [attr('boolean')];
            _maximized_decorators = [attr('boolean')];
            _minimized_decorators = [attr('boolean')];
            _icon_decorators = [attr('string')];
            _name_decorators = [attr('string')];
            __esDecorate(this, null, _capturefocus_decorators, { kind: "accessor", name: "capturefocus", static: false, private: false, access: { has: obj => "capturefocus" in obj, get: obj => obj.capturefocus, set: (obj, value) => { obj.capturefocus = value; } } }, _capturefocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _maximized_decorators, { kind: "accessor", name: "maximized", static: false, private: false, access: { has: obj => "maximized" in obj, get: obj => obj.maximized, set: (obj, value) => { obj.maximized = value; } } }, _maximized_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _minimized_decorators, { kind: "accessor", name: "minimized", static: false, private: false, access: { has: obj => "minimized" in obj, get: obj => obj.minimized, set: (obj, value) => { obj.minimized = value; } } }, _minimized_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _icon_decorators, { kind: "accessor", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, get: obj => obj.icon, set: (obj, value) => { obj.icon = value; } } }, _icon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksWindow = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'window';
        }
        static get observedAttributes() {
            return super.observedAttributes.concat([
                'actions',
            ]);
        }
        #capturefocus_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _capturefocus_initializers, void 0));
        get capturefocus() { return this.#capturefocus_accessor_storage; }
        set capturefocus(value) { this.#capturefocus_accessor_storage = value; }
        #maximized_accessor_storage = __runInitializers(this, _maximized_initializers, void 0);
        get maximized() { return this.#maximized_accessor_storage; }
        set maximized(value) { this.#maximized_accessor_storage = value; }
        #minimized_accessor_storage = __runInitializers(this, _minimized_initializers, void 0);
        get minimized() { return this.#minimized_accessor_storage; }
        set minimized(value) { this.#minimized_accessor_storage = value; }
        #icon_accessor_storage = __runInitializers(this, _icon_initializers, void 0);
        get icon() { return this.#icon_accessor_storage; }
        set icon(value) { this.#icon_accessor_storage = value; }
        #name_accessor_storage = __runInitializers(this, _name_initializers, void 0);
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
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
        #prevFocus;
        #onResize;
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
    };
    return BlocksWindow = _classThis;
})();
