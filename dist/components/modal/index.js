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
import '../button/index.js';
import '../dialog/index.js';
import '../input/index.js';
import { append, prepend, unmount } from '../../common/mount.js';
import { attr } from '../../decorators/attr.js';
import { cancelButtonTemplate, confirmButtonTemplate, contentTemplate } from './template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { strGetter, strSetter } from '../../common/property.js';
import { style } from './style.js';
import { BlocksDialog } from '../dialog/index.js';
export let BlocksModal = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-modal',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _withConfirm_decorators;
    let _withConfirm_initializers = [];
    let _withCancel_decorators;
    let _withCancel_initializers = [];
    let _confirmText_decorators;
    let _confirmText_initializers = [];
    let _cancelText_decorators;
    let _cancelText_initializers = [];
    let _rich_decorators;
    let _rich_initializers = [];
    let _content_decorators;
    let _content_initializers = [];
    var BlocksModal = class extends BlocksDialog {
        static {
            _withConfirm_decorators = [attr('boolean')];
            _withCancel_decorators = [attr('boolean')];
            _confirmText_decorators = [attr('string')];
            _cancelText_decorators = [attr('string')];
            _rich_decorators = [attr('boolean')];
            _content_decorators = [attr('string')];
            __esDecorate(this, null, _withConfirm_decorators, { kind: "accessor", name: "withConfirm", static: false, private: false, access: { has: obj => "withConfirm" in obj, get: obj => obj.withConfirm, set: (obj, value) => { obj.withConfirm = value; } } }, _withConfirm_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _withCancel_decorators, { kind: "accessor", name: "withCancel", static: false, private: false, access: { has: obj => "withCancel" in obj, get: obj => obj.withCancel, set: (obj, value) => { obj.withCancel = value; } } }, _withCancel_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _confirmText_decorators, { kind: "accessor", name: "confirmText", static: false, private: false, access: { has: obj => "confirmText" in obj, get: obj => obj.confirmText, set: (obj, value) => { obj.confirmText = value; } } }, _confirmText_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _cancelText_decorators, { kind: "accessor", name: "cancelText", static: false, private: false, access: { has: obj => "cancelText" in obj, get: obj => obj.cancelText, set: (obj, value) => { obj.cancelText = value; } } }, _cancelText_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _rich_decorators, { kind: "accessor", name: "rich", static: false, private: false, access: { has: obj => "rich" in obj, get: obj => obj.rich, set: (obj, value) => { obj.rich = value; } } }, _rich_initializers, _instanceExtraInitializers);
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
        #confirmText_accessor_storage = __runInitializers(this, _confirmText_initializers, void 0);
        get confirmText() { return this.#confirmText_accessor_storage; }
        set confirmText(value) { this.#confirmText_accessor_storage = value; }
        #cancelText_accessor_storage = __runInitializers(this, _cancelText_initializers, void 0);
        get cancelText() { return this.#cancelText_accessor_storage; }
        set cancelText(value) { this.#cancelText_accessor_storage = value; }
        #rich_accessor_storage = __runInitializers(this, _rich_initializers, void 0);
        get rich() { return this.#rich_accessor_storage; }
        set rich(value) { this.#rich_accessor_storage = value; }
        #content_accessor_storage = __runInitializers(this, _content_initializers, void 0);
        get content() { return this.#content_accessor_storage; }
        set content(value) { this.#content_accessor_storage = value; }
        get $confirm() {
            return this.querySelectorHost('[part="confirm-button"]');
        }
        get $cancel() {
            return this.querySelectorHost('[part="cancel-button"]');
        }
        get $content() {
            return this.querySelectorHost('[part="content"]');
        }
        constructor() {
            super();
            this.#setupDialog();
            this.#setupConfirm();
            this.#setupCancel();
            this.#setupContent();
            this.#setupKeymap();
            this.#setupPromise();
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
            if (!this.open)
                return;
            const cancelValue = typeof this.rejectValue === 'function' ? this.rejectValue() : this.rejectValue ?? new Error('cancel');
            let maybePromise;
            if (typeof this.onCancel === 'function') {
                maybePromise = this.onCancel(cancelValue);
            }
            if (maybePromise instanceof Promise) {
                if (this.$cancel) {
                    this.$cancel.loading = true;
                }
                maybePromise
                    .then(() => {
                    if (this.#reject) {
                        this.#reject(cancelValue);
                    }
                    this.open = false;
                })
                    .finally(() => {
                    if (this.$cancel)
                        this.$cancel.loading = false;
                });
            }
            else {
                if (this.#reject) {
                    this.#reject(cancelValue);
                }
                this.open = false;
            }
        }
        confirm() {
            if (!this.open)
                return;
            const confirmValue = typeof this.resolveValue === 'function' ? this.resolveValue() : this.resolveValue ?? '';
            let maybePromise;
            if (typeof this.onConfirm === 'function') {
                maybePromise = this.onConfirm(confirmValue);
            }
            if (maybePromise instanceof Promise) {
                if (this.$confirm) {
                    this.$confirm.loading = true;
                }
                maybePromise
                    .then(() => {
                    if (this.#resolve) {
                        this.#resolve(confirmValue);
                    }
                    this.open = false;
                })
                    .finally(() => {
                    if (this.$confirm)
                        this.$confirm.loading = false;
                });
            }
            else {
                if (this.#resolve) {
                    this.#resolve(confirmValue);
                }
                this.open = false;
            }
        }
        #setupDialog() {
            this.onConnected(() => {
                this.autofocus = true;
                this.capturefocus = true;
                this.mask = true;
            });
        }
        #setupConfirm() {
            const update = () => {
                if (this.withConfirm) {
                    if (!this.$confirm) {
                        const $confirmButton = confirmButtonTemplate();
                        $confirmButton.textContent = this.confirmText ?? '确定';
                        $confirmButton.onclick = this.confirm.bind(this);
                        append($confirmButton, this);
                    }
                }
                else {
                    if (this.$confirm) {
                        unmount(this.$confirm);
                    }
                }
            };
            this.onRender(update);
            this.onConnected(update);
            this.onAttributeChangedDeps(['with-confirm', 'confirm-text'], update);
        }
        #setupCancel() {
            const update = () => {
                if (this.withCancel) {
                    if (!this.$cancel) {
                        const $cancelButton = cancelButtonTemplate();
                        $cancelButton.textContent = this.cancelText ?? '取消';
                        $cancelButton.onclick = this.cancel.bind(this);
                        prepend($cancelButton, this);
                    }
                }
                else {
                    if (this.$cancel) {
                        unmount(this.$cancel);
                    }
                }
            };
            this.onRender(update);
            this.onConnected(update);
            this.onAttributeChangedDeps(['with-cancel', 'cancel-text'], update);
        }
        #setupContent() {
            const update = () => {
                if (this.content) {
                    if (!this.$content) {
                        const $content = contentTemplate();
                        append($content, this);
                    }
                    else {
                        this.$content.innerHTML = '';
                    }
                    if (this.rich) {
                        const $rich = document.createElement('div');
                        $rich.innerHTML = this.content;
                        append($rich, this.$content);
                    }
                    else {
                        append(document.createTextNode(this.content), this.$content);
                    }
                }
                else {
                    if (this.$content) {
                        unmount(this.$content);
                    }
                }
            };
            this.onRender(update);
            this.onConnected(update);
            this.onAttributeChangedDeps(['content', 'rich'], update);
        }
        #setupKeymap() {
            const onKeydown = (e) => {
                if (e.target === this && this.withConfirm) {
                    if (e.key === 'Enter') {
                        this.confirm();
                    }
                    else if (e.key === 'Escape' && this.withCancel) {
                        this.cancel();
                    }
                }
            };
            this.onConnected(() => {
                this.addEventListener('keydown', onKeydown);
            });
            this.onDisconnected(() => {
                this.removeEventListener('keydown', onKeydown);
            });
        }
        #setupPromise() {
            this.onAttributeChangedDep('open', () => {
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
            });
        }
    };
    return BlocksModal = _classThis;
})();
