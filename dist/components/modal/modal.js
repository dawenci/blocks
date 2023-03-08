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
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
import { BlocksDialog } from '../dialog/index.js';
import { strGetter, strSetter } from '../../common/property.js';
import { cancelButtonTemplate, confirmButtonTemplate } from './template.js';
import { append, prepend, unmount } from '../../common/mount.js';
export let BlocksModal = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-modal',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _withConfirm_decorators;
    let _withConfirm_initializers = [];
    let _withCancel_decorators;
    let _withCancel_initializers = [];
    let _rich_decorators;
    let _rich_initializers = [];
    let _confirmText_decorators;
    let _confirmText_initializers = [];
    let _cancelText_decorators;
    let _cancelText_initializers = [];
    let _content_decorators;
    let _content_initializers = [];
    var BlocksModal = class extends BlocksDialog {
        static {
            _withConfirm_decorators = [attr('boolean')];
            _withCancel_decorators = [attr('boolean')];
            _rich_decorators = [attr('boolean')];
            _confirmText_decorators = [attr('string')];
            _cancelText_decorators = [attr('string')];
            _content_decorators = [attr('string')];
            __esDecorate(this, null, _withConfirm_decorators, { kind: "accessor", name: "withConfirm", static: false, private: false, access: { has: obj => "withConfirm" in obj, get: obj => obj.withConfirm, set: (obj, value) => { obj.withConfirm = value; } } }, _withConfirm_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _withCancel_decorators, { kind: "accessor", name: "withCancel", static: false, private: false, access: { has: obj => "withCancel" in obj, get: obj => obj.withCancel, set: (obj, value) => { obj.withCancel = value; } } }, _withCancel_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _rich_decorators, { kind: "accessor", name: "rich", static: false, private: false, access: { has: obj => "rich" in obj, get: obj => obj.rich, set: (obj, value) => { obj.rich = value; } } }, _rich_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _confirmText_decorators, { kind: "accessor", name: "confirmText", static: false, private: false, access: { has: obj => "confirmText" in obj, get: obj => obj.confirmText, set: (obj, value) => { obj.confirmText = value; } } }, _confirmText_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelText_decorators, { kind: "accessor", name: "cancelText", static: false, private: false, access: { has: obj => "cancelText" in obj, get: obj => obj.cancelText, set: (obj, value) => { obj.cancelText = value; } } }, _cancelText_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _content_decorators, { kind: "accessor", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } } }, _content_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksModal = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #promise = (__runInitializers(this, _instanceExtraInitializers), void 0);
        #resolve;
        #reject;
        static get observedAttributes() {
            return super.observedAttributes.concat(['resolve-value', 'reject-value']);
        }
        #withConfirm_accessor_storage = __runInitializers(this, _withConfirm_initializers, void 0);
        get withConfirm() { return this.#withConfirm_accessor_storage; }
        set withConfirm(value) { this.#withConfirm_accessor_storage = value; }
        #withCancel_accessor_storage = __runInitializers(this, _withCancel_initializers, void 0);
        get withCancel() { return this.#withCancel_accessor_storage; }
        set withCancel(value) { this.#withCancel_accessor_storage = value; }
        #rich_accessor_storage = __runInitializers(this, _rich_initializers, void 0);
        get rich() { return this.#rich_accessor_storage; }
        set rich(value) { this.#rich_accessor_storage = value; }
        #confirmText_accessor_storage = __runInitializers(this, _confirmText_initializers, void 0);
        get confirmText() { return this.#confirmText_accessor_storage; }
        set confirmText(value) { this.#confirmText_accessor_storage = value; }
        #cancelText_accessor_storage = __runInitializers(this, _cancelText_initializers, void 0);
        get cancelText() { return this.#cancelText_accessor_storage; }
        set cancelText(value) { this.#cancelText_accessor_storage = value; }
        #content_accessor_storage = __runInitializers(this, _content_initializers, void 0);
        get content() { return this.#content_accessor_storage; }
        set content(value) { this.#content_accessor_storage = value; }
        constructor() {
            super();
            this.addEventListener('keydown', e => {
                if (e.target === this && this.withConfirm) {
                    if (e.key === 'Enter') {
                        this.confirm();
                    }
                    else if (e.key === 'Escape' && this.withCancel) {
                        this.cancel();
                    }
                }
            });
        }
        #resolveValue;
        get resolveValue() {
            return this.#resolveValue ?? strGetter('resolve-value')(this);
        }
        set resolveValue(value) {
            if (typeof value === 'function') {
                this.#resolveValue = value;
            }
            else {
                strSetter('resolve-value')(this, value);
            }
        }
        #rejectValue;
        get rejectValue() {
            return this.#rejectValue ?? strGetter('reject-value')(this);
        }
        set rejectValue(value) {
            if (typeof value === 'function') {
                this.#rejectValue = value;
            }
            else {
                strSetter('reject-value')(this, value);
            }
        }
        get promise() {
            return this.#promise;
        }
        cancel() {
            const cancelValue = typeof this.rejectValue === 'function'
                ? this.rejectValue()
                : this.rejectValue ?? new Error('cancel');
            if (this.onCancel) {
                this.onCancel(cancelValue);
            }
            if (this.#reject) {
                this.#reject(cancelValue);
            }
            this.open = false;
        }
        confirm() {
            const confirmValue = typeof this.resolveValue === 'function'
                ? this.resolveValue()
                : this.resolveValue ?? '';
            if (this.onConfirm) {
                this.onConfirm(confirmValue);
            }
            if (this.#resolve) {
                this.#resolve(confirmValue);
            }
            this.open = false;
        }
        _renderContent() {
            if (this.content) {
                if (!this._ref.$content) {
                    this._ref.$content = document.createElement('div');
                    this._ref.$content.style.cssText = `min-width:200px;padding:20px 0;`;
                    this.appendChild(this._ref.$content);
                }
                else {
                    this._ref.$content.innerHTML = '';
                }
                if (this.rich) {
                    const node = document.createElement('div');
                    node.innerHTML = this.content;
                    this._ref.$content.appendChild(node);
                }
                else {
                    this._ref.$content.appendChild(document.createTextNode(this.content));
                }
            }
            else {
                if (this._ref.$content) {
                    unmount(this._ref.$content);
                    this._ref.$content = undefined;
                }
            }
        }
        _renderCancel() {
            if (this.withCancel) {
                if (!this._ref.$cancelButton) {
                    this._ref.$cancelButton = cancelButtonTemplate();
                    this._ref.$cancelButton.textContent = this.cancelText ?? '取消';
                    prepend(this._ref.$cancelButton, this);
                    this._ref.$cancelButton.onclick = this.cancel.bind(this);
                }
            }
            else {
                if (this._ref.$cancelButton) {
                    unmount(this._ref.$cancelButton);
                    this._ref.$cancelButton = undefined;
                }
            }
        }
        _renderConfirm() {
            if (this.withConfirm) {
                if (!this._ref.$confirmButton) {
                    this._ref.$confirmButton = confirmButtonTemplate();
                    this._ref.$confirmButton.textContent = this.confirmText ?? '确定';
                    append(this._ref.$confirmButton, this);
                    this._ref.$confirmButton.onclick = this.confirm.bind(this);
                }
            }
            else {
                if (this._ref.$confirmButton) {
                    unmount(this._ref.$confirmButton);
                    this._ref.$confirmButton = undefined;
                }
            }
        }
        render() {
            super.render();
            this._renderContent();
            this._renderCancel();
            this._renderConfirm();
        }
        connectedCallback() {
            super.connectedCallback();
            this.mask = true;
            this.capturefocus = true;
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'open') {
                if (this.open) {
                    this.#promise = new Promise((resolve, reject) => {
                        this.#resolve = resolve;
                        this.#reject = reject;
                    });
                    this.#promise.catch(() => {
                    });
                }
                else {
                    this.#promise = undefined;
                    this.#resolve = undefined;
                    this.#reject = undefined;
                }
            }
            this.render();
        }
    };
    return BlocksModal = _classThis;
})();
