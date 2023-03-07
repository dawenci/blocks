var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import '../popup/index.js';
import { dispatchEvent } from '../../common/event.js';
import { getRegisteredSvgIcon } from '../../icon/index.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { __color_warning } from '../../theme/var-light.js';
import { customElement } from '../../decorators/customElement.js';
import { attr } from '../../decorators/attr.js';
const POPUP_ATTRS = ['open', 'origin'];
const CONFIRM_ATTRS = ['message', 'icon'];
export let BlocksPopupConfirm = (() => {
    let _classDecorators = [customElement('bl-popup-confirm')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _icon_decorators;
    let _icon_initializers = [];
    let _message_decorators;
    let _message_initializers = [];
    var BlocksPopupConfirm = class extends Component {
        static {
            _icon_decorators = [attr('string')];
            _message_decorators = [attr('string')];
            __esDecorate(this, null, _icon_decorators, { kind: "accessor", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, get: obj => obj.icon, set: (obj, value) => { obj.icon = value; } } }, _icon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _message_decorators, { kind: "accessor", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } } }, _message_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksPopupConfirm = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        $popup = (__runInitializers(this, _instanceExtraInitializers), void 0);
        $message;
        $confirm;
        $cancel;
        confirm;
        cancel;
        static get observedAttributes() {
            return POPUP_ATTRS.concat(CONFIRM_ATTRS);
        }
        #icon_accessor_storage = __runInitializers(this, _icon_initializers, '');
        get icon() { return this.#icon_accessor_storage; }
        set icon(value) { this.#icon_accessor_storage = value; }
        #message_accessor_storage = __runInitializers(this, _message_initializers, '');
        get message() { return this.#message_accessor_storage; }
        set message(value) { this.#message_accessor_storage = value; }
        constructor() {
            super();
            const { comTemplate, popupTemplate } = template();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(comTemplate.content.cloneNode(true));
            const popupFragment = popupTemplate.content.cloneNode(true);
            this.$popup = popupFragment.querySelector('bl-popup');
            this.$message = popupFragment.querySelector('.message');
            this.$cancel = popupFragment.querySelector('.cancel');
            this.$confirm = popupFragment.querySelector('.confirm');
            this.$popup.anchor = this;
            this.$popup.arrow = true;
            this.$popup.origin = this.origin || 'top-center';
            this.$popup.style.padding = '15px;';
            this.onclick = () => {
                this.open = true;
            };
            this.$cancel.addEventListener('click', () => {
                this._cancel();
            });
            this.$confirm.addEventListener('click', () => {
                this._confirm();
            });
        }
        get origin() {
            return this.$popup.origin;
        }
        set origin(value) {
            this.$popup.origin = value;
        }
        get open() {
            return this.$popup.open;
        }
        set open(value) {
            this.$popup.open = value;
        }
        _confirm() {
            let maybePromise;
            if (typeof this.confirm === 'function') {
                maybePromise = this.confirm();
            }
            dispatchEvent(this, 'confirm');
            if (maybePromise instanceof Promise) {
                this.$confirm.loading = true;
                this.$cancel.disabled = true;
                maybePromise
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
            }
        }
        _cancel() {
            let maybePromise;
            if (typeof this.cancel === 'function') {
                maybePromise = this.cancel();
            }
            dispatchEvent(this, 'cancel');
            if (maybePromise instanceof Promise) {
                maybePromise.then(() => (this.open = false));
            }
            else {
                this.open = false;
            }
        }
        renderIcon() {
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
            this.$message.innerHTML = '';
            this.renderIcon();
            const $content = document.createElement('div');
            $content.textContent = this.message;
            this.$message.appendChild($content);
        }
        connectedCallback() {
            super.connectedCallback();
            document.body.appendChild(this.$popup);
            this.render();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.$popup.parentElement) {
                this.$popup.parentElement.removeChild(this.$popup);
            }
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (POPUP_ATTRS.includes(attrName)) {
                this.$popup.setAttribute(attrName, newValue);
            }
            if (attrName === 'message') {
                this.render();
            }
        }
    };
    return BlocksPopupConfirm = _classThis;
})();
