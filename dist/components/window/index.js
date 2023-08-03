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
import { attr } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { onDragMove } from '../../common/onDragMove.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { strGetter, strSetter } from '../../common/property.js';
import { style } from './style.js';
import { windowTemplate } from './template.js';
import { BlComponent } from '../component/Component.js';
import { SetupFocusCapture } from '../setup-focus-capture/index.js';
import { WithOpenTransition } from '../with-open-transition/index.js';
export let BlWindow = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-window',
            styles: [style],
            mixins: [WithOpenTransition],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _capturefocus_decorators;
    let _capturefocus_initializers = [];
    let _restorefocus_decorators;
    let _restorefocus_initializers = [];
    let _maximized_decorators;
    let _maximized_initializers = [];
    let _minimized_decorators;
    let _minimized_initializers = [];
    let _icon_decorators;
    let _icon_initializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _actions_decorators;
    let _actions_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    var BlWindow = class extends BlComponent {
        static {
            _capturefocus_decorators = [attr('boolean')];
            _restorefocus_decorators = [attr('boolean')];
            _maximized_decorators = [attr('boolean')];
            _minimized_decorators = [attr('boolean')];
            _icon_decorators = [attr('string')];
            _name_decorators = [attr('string')];
            _actions_decorators = [attr('string', {
                    get(self) {
                        return strGetter('actions')(self) ?? 'minimize,maximize,close';
                    },
                    set(self, value) {
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
                        strSetter('actions')(self, newValue);
                    },
                })];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            __esDecorate(this, null, _capturefocus_decorators, { kind: "accessor", name: "capturefocus", static: false, private: false, access: { has: obj => "capturefocus" in obj, get: obj => obj.capturefocus, set: (obj, value) => { obj.capturefocus = value; } } }, _capturefocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _restorefocus_decorators, { kind: "accessor", name: "restorefocus", static: false, private: false, access: { has: obj => "restorefocus" in obj, get: obj => obj.restorefocus, set: (obj, value) => { obj.restorefocus = value; } } }, _restorefocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _maximized_decorators, { kind: "accessor", name: "maximized", static: false, private: false, access: { has: obj => "maximized" in obj, get: obj => obj.maximized, set: (obj, value) => { obj.maximized = value; } } }, _maximized_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _minimized_decorators, { kind: "accessor", name: "minimized", static: false, private: false, access: { has: obj => "minimized" in obj, get: obj => obj.minimized, set: (obj, value) => { obj.minimized = value; } } }, _minimized_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _icon_decorators, { kind: "accessor", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, get: obj => obj.icon, set: (obj, value) => { obj.icon = value; } } }, _icon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _actions_decorators, { kind: "accessor", name: "actions", static: false, private: false, access: { has: obj => "actions" in obj, get: obj => obj.actions, set: (obj, value) => { obj.actions = value; } } }, _actions_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlWindow = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #capturefocus_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _capturefocus_initializers, void 0));
        get capturefocus() { return this.#capturefocus_accessor_storage; }
        set capturefocus(value) { this.#capturefocus_accessor_storage = value; }
        #restorefocus_accessor_storage = __runInitializers(this, _restorefocus_initializers, void 0);
        get restorefocus() { return this.#restorefocus_accessor_storage; }
        set restorefocus(value) { this.#restorefocus_accessor_storage = value; }
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
        #actions_accessor_storage = __runInitializers(this, _actions_initializers, void 0);
        get actions() { return this.#actions_accessor_storage; }
        set actions(value) { this.#actions_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #onResize;
        constructor() {
            super();
            this.appendShadowChild(windowTemplate());
            const shadowRoot = this.shadowRoot;
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
            Object.assign(this, {
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
            this.#setupVisible();
            this.#setupZoom();
            this.#setupFocus();
            this.#setupMoveEvents();
            this.#setupResizeEvents();
            this.hook.onConnected(() => {
                this.setAttribute('tabindex', '-1');
                if (this.parentElement !== document.body) {
                    document.body.appendChild(this);
                }
            });
            this.hook.onAttributeChanged((attrName) => {
                if (attrName === 'actions') {
                    this.#renderActions();
                }
                if (attrName === 'icon') {
                    this.#renderIcon();
                }
                if (attrName === 'name') {
                    this.#renderName();
                }
            });
        }
        #setupVisible() {
            const updateVisible = () => {
                if (this.open) {
                    if (!this.style.left) {
                        this.style.left = (document.body.clientWidth - this.offsetWidth) / 2 + 'px';
                    }
                    if (!this.style.top) {
                        this.style.top = (document.body.clientHeight - this.offsetHeight) / 2 + 'px';
                    }
                }
            };
            this.hook.onAttributeChangedDep('open', () => {
                updateVisible();
            });
        }
        #setupZoom() {
            this.hook.onAttributeChangedDep('maximized', () => {
                if (this.maximized) {
                    doTransitionEnter(this, 'maximized', () => {
                    });
                }
                else {
                    doTransitionLeave(this, 'maximized', () => {
                    });
                }
            });
        }
        #setupFocus() {
            let $prevFocus;
            const _focus = () => {
                if (this.restorefocus && !$prevFocus) {
                    $prevFocus = document.activeElement;
                }
                if (this.capturefocus && this._focusCapture.$firstFocusable) {
                    this._focusCapture.$firstFocusable.focus();
                }
                else {
                    this.focus();
                }
            };
            const _blur = () => {
                if (this._focusCapture.$firstFocusable)
                    this._focusCapture.$firstFocusable.blur();
                this.blur();
                if ($prevFocus) {
                    if (this.restorefocus && typeof $prevFocus.focus === 'function') {
                        $prevFocus.focus();
                    }
                    $prevFocus = null;
                }
            };
            const onOpened = () => _focus();
            const onClosed = () => _blur();
            this.hook.onConnected(() => {
                this.addEventListener('opened', onOpened);
                this.addEventListener('closed', onClosed);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('opened', onOpened);
                this.removeEventListener('closed', onClosed);
            });
        }
        _focusCapture = SetupFocusCapture.setup({
            component: this,
            predicate: () => this.open,
            container: () => this.$layout,
            init: () => {
                this.hook.onConnected(() => {
                    if (this.capturefocus)
                        this._focusCapture.start();
                });
                this.hook.onAttributeChangedDep('capturefocus', () => {
                    if (this.capturefocus) {
                        this._focusCapture.start();
                    }
                    else {
                        this._focusCapture.stop();
                    }
                });
            },
        });
        #setupMoveEvents() {
            let startLeft;
            let startTop;
            let clear;
            this.hook.onConnected(() => {
                clear = onDragMove(this.$header, {
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
            });
            this.hook.onDisconnected(() => {
                clear();
            });
        }
        #setupResizeEvents() {
            let startLeft;
            let startTop;
            let startWidth;
            let startHeight;
            let startMouseX;
            let startMouseY;
            let updateFn;
            let currentLeft;
            let currentTop;
            let currentWidth;
            let currentHeight;
            const callAll = (...fns) => (...args) => fns.forEach((fn) => fn(...args));
            const resizeTop = (_x, y) => {
                const offset = y - startMouseY;
                const newTop = startTop + offset;
                const newHeight = startHeight - offset;
                if (newTop < 0 || newHeight < this.$header.offsetHeight)
                    return;
                currentTop = newTop;
                currentHeight = newHeight;
                this.style.top = newTop + 'px';
                this.style.height = newHeight + 'px';
            };
            const resizeBottom = (_x, y) => {
                const offset = y - startMouseY;
                const newHeight = startHeight + offset;
                if (newHeight < this.$header.offsetHeight)
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
            let clear;
            this.hook.onConnected(() => {
                clear = onDragMove(this.$layout, {
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
                        if (current.pageY > window.innerHeight || current.pageX > window.innerWidth)
                            return;
                        updateFn(current.pageX, current.pageY);
                    },
                });
            });
            this.hook.onDisconnected(() => {
                clear();
            });
        }
        #renderName() {
            this.$name.title = this.$name.textContent = this.name ?? '';
        }
        #renderActions() {
            this.$minimizeButton.style.display = this.actions.includes('minimize') ? '' : 'none';
            this.$maximizeButton.style.display = this.actions.includes('maximize') ? '' : 'none';
            this.$closeButton.style.display = this.actions.includes('close') ? '' : 'none';
        }
        #renderIcon() {
            if (this.$icon?.childElementCount) {
                const $icon = this.$icon.firstElementChild;
                if ($icon.dataset.name === this.icon)
                    return;
            }
            const $icon = getRegisteredSvgIcon(this.icon ?? '');
            if ($icon) {
                ;
                $icon.dataset.name = this.icon;
                this.$icon.innerHTML = '';
                this.$icon.appendChild($icon);
            }
            else {
                this.$icon.innerHTML = '';
            }
        }
    };
    return BlWindow = _classThis;
})();
