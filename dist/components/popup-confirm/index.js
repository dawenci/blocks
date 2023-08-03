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
import '../popup/index.js';
import { __color_warning } from '../../theme/var-light.js';
import { attr } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { getRegisteredSvgIcon } from '../../icon/index.js';
import { popupTemplate, template } from './template.js';
import { style } from './style.js';
import { unmount } from '../../common/mount.js';
import { BlPopup } from '../popup/index.js';
import { BlComponent } from '../component/Component.js';
const CONFIRM_ATTRS = ['message', 'icon'];
export let BlPopupConfirm = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-popup-confirm',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _icon_decorators;
    let _icon_initializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _open_decorators;
    let _open_initializers = [];
    var BlPopupConfirm = class extends BlComponent {
        static {
            _icon_decorators = [attr('string')];
            _message_decorators = [attr('string')];
            _open_decorators = [attr('boolean')];
            __esDecorate(this, null, _icon_decorators, { kind: "accessor", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, get: obj => obj.icon, set: (obj, value) => { obj.icon = value; } } }, _icon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _message_decorators, { kind: "accessor", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } } }, _message_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlPopupConfirm = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...BlPopup.observedAttributes, ...CONFIRM_ATTRS];
        }
        #icon_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _icon_initializers, ''));
        get icon() { return this.#icon_accessor_storage; }
        set icon(value) { this.#icon_accessor_storage = value; }
        #message_accessor_storage = __runInitializers(this, _message_initializers, '');
        get message() { return this.#message_accessor_storage; }
        set message(value) { this.#message_accessor_storage = value; }
        #open_accessor_storage = __runInitializers(this, _open_initializers, void 0);
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this.#setupPopup();
            this.#setupActions();
            this.#setupTrigger();
            this.hook.onAttributeChangedDep('message', () => {
                this.render();
            });
            this.hook.onConnected(() => {
                this.render();
            });
        }
        confirm() {
            let maybePromise;
            if (typeof this.onConfirm === 'function') {
                maybePromise = this.onConfirm();
            }
            dispatchEvent(this, 'confirm');
            if (maybePromise instanceof Promise) {
                this.$confirm.loading = true;
                this.$cancel.disabled = true;
                return maybePromise
                    .then(() => {
                    this.open = false;
                })
                    .finally(() => {
                    this.$cancel.disabled = false;
                    this.$confirm.loading = false;
                });
            }
            else {
                this.open = false;
                return Promise.resolve();
            }
        }
        cancel() {
            let maybePromise;
            if (typeof this.onCancel === 'function') {
                maybePromise = this.onCancel();
            }
            dispatchEvent(this, 'cancel');
            if (maybePromise instanceof Promise) {
                this.$confirm.disabled = true;
                this.$cancel.loading = true;
                return maybePromise
                    .then(() => {
                    this.open = false;
                })
                    .finally(() => {
                    this.$confirm.disabled = false;
                    this.$cancel.loading = false;
                });
            }
            else {
                this.open = false;
                return Promise.resolve();
            }
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$popup.anchorElement = () => this;
            this.$message = this.$popup.querySelector('.message');
            this.$cancel = this.$popup.querySelector('.cancel');
            this.$confirm = this.$popup.querySelector('.confirm');
            this.hook.onDisconnected(() => {
                unmount(this.$popup);
            });
            this.hook.onAttributeChangedDeps(BlPopup.observedAttributes, (name, _, newValue) => {
                if (name === 'open') {
                    if (this.open && !document.body.contains(this.$popup)) {
                        document.body.appendChild(this.$popup);
                    }
                    this.$popup.open = this.open;
                }
                else {
                    this.$popup.setAttribute(name, newValue);
                }
            });
            this.$popup.addEventListener('opened', () => {
                this.$cancel.focus();
            });
        }
        #setupActions() {
            const onConfirm = () => {
                this.confirm();
            };
            const onCancel = () => {
                this.cancel();
            };
            this.hook.onConnected(() => {
                this.$cancel.addEventListener('click', onCancel);
                this.$confirm.addEventListener('click', onConfirm);
            });
            this.hook.onDisconnected(() => {
                this.$cancel.removeEventListener('click', onCancel);
                this.$confirm.removeEventListener('click', onConfirm);
            });
        }
        #setupTrigger() {
            const onClick = () => {
                this.open = true;
            };
            this.hook.onConnected(() => {
                this.addEventListener('click', onClick);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('click', onClick);
            });
        }
        _renderIcon() {
            if (this.icon) {
                const icon = getRegisteredSvgIcon(this.icon);
                if (icon) {
                    this.$message.style.paddingLeft = '20px';
                    icon.style.cssText = `position:absolute;top:0;left:0;width:16px;height:16px;fill:var(--bl-color-warning-base, ${__color_warning});`;
                    this.$message.appendChild(icon);
                }
            }
            else {
                this.$message.style.paddingLeft = '';
            }
        }
        render() {
            super.render();
            this.$message.innerHTML = '';
            this._renderIcon();
            const $content = document.createElement('div');
            $content.textContent = this.message;
            this.$message.appendChild($content);
        }
    };
    return BlPopupConfirm = _classThis;
})();
