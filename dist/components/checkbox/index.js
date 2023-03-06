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
import { dispatchEvent } from '../../common/event.js';
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js';
import { Control } from '../base-control/index.js';
import { checkboxTemplate, labelTemplate } from './template.js';
import { style } from './style.js';
import { customElement } from '../../decorators/customElement.js';
import { applyStyle } from '../../decorators/style.js';
import { attr } from '../../decorators/attr.js';
export let BlocksCheckbox = (() => {
    let _classDecorators = [customElement('bl-checkbox'), applyStyle(style)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _checked_decorators;
    let _checked_initializers = [];
    let _indeterminate_decorators;
    let _indeterminate_initializers = [];
    var BlocksCheckbox = class extends Control {
        static {
            _name_decorators = [attr('string')];
            _checked_decorators = [attr('boolean')];
            _indeterminate_decorators = [attr('boolean')];
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _checked_decorators, { kind: "accessor", name: "checked", static: false, private: false, access: { has: obj => "checked" in obj, get: obj => obj.checked, set: (obj, value) => { obj.checked = value; } } }, _checked_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _indeterminate_decorators, { kind: "accessor", name: "indeterminate", static: false, private: false, access: { has: obj => "indeterminate" in obj, get: obj => obj.indeterminate, set: (obj, value) => { obj.indeterminate = value; } } }, _indeterminate_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksCheckbox = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'checkbox';
        }
        #name_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _name_initializers, void 0));
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #checked_accessor_storage = __runInitializers(this, _checked_initializers, void 0);
        get checked() { return this.#checked_accessor_storage; }
        set checked(value) { this.#checked_accessor_storage = value; }
        #indeterminate_accessor_storage = __runInitializers(this, _indeterminate_initializers, void 0);
        get indeterminate() { return this.#indeterminate_accessor_storage; }
        set indeterminate(value) { this.#indeterminate_accessor_storage = value; }
        constructor() {
            super();
            const $checkbox = this._ref.$layout.appendChild(checkboxTemplate());
            const $label = this._ref.$layout.appendChild(labelTemplate());
            const $slot = $label.querySelector('slot');
            this._ref.$checkbox = $checkbox;
            this._ref.$label = $label;
            this._ref.$slot = $slot;
            const toggleEmptyClass = () => {
                $label.classList.toggle('empty', !$slot.assignedNodes().length);
            };
            toggleEmptyClass();
            $slot.addEventListener('slotchange', toggleEmptyClass);
            captureEventWhenEnable(this, 'click', () => {
                this.indeterminate = false;
                this.checked = !this.checked;
            });
            captureEventWhenEnable(this, 'keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.checked = !this.checked;
                    e.preventDefault();
                }
            });
        }
        _renderIndeterminate() {
            const checkbox = this.shadowRoot.querySelector('#checkbox');
            if (this.indeterminate) {
                checkbox.setAttribute('indeterminate', '');
            }
            else {
                checkbox.removeAttribute('indeterminate');
            }
        }
        connectedCallback() {
            super.connectedCallback();
            this.internalTabIndex = '0';
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'indeterminate') {
                if (this.indeterminate) {
                    this.checked = false;
                }
                this._renderIndeterminate();
            }
            if (attrName === 'checked') {
                if (this.checked) {
                    this.indeterminate = false;
                }
                const payload = { detail: { checked: this.checked } };
                dispatchEvent(this, 'bl:checkbox:change', payload);
                dispatchEvent(this, 'change', payload);
            }
        }
    };
    return BlocksCheckbox = _classThis;
})();
