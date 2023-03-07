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
import { selectedSetter } from '../../common/propertyAccessor.js';
import { Component } from '../Component.js';
import { template } from './option-template.js';
import { customElement } from '../../decorators/customElement.js';
import { attr } from '../../decorators/attr.js';
export let BlocksOption = (() => {
    let _classDecorators = [customElement('bl-option')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _label_decorators;
    let _label_initializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _selected_decorators;
    let _selected_initializers = [];
    var BlocksOption = class extends Component {
        static {
            _value_decorators = [attr('string')];
            _label_decorators = [attr('string', {
                    defaults: (self) => {
                        return self.textContent || String(self.value);
                    },
                })];
            _disabled_decorators = [attr('boolean')];
            _selected_decorators = [attr('boolean')];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _label_decorators, { kind: "accessor", name: "label", static: false, private: false, access: { has: obj => "label" in obj, get: obj => obj.label, set: (obj, value) => { obj.label = value; } } }, _label_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _selected_decorators, { kind: "accessor", name: "selected", static: false, private: false, access: { has: obj => "selected" in obj, get: obj => obj.selected, set: (obj, value) => { obj.selected = value; } } }, _selected_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksOption = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return ['value', 'disabled', 'selected', 'label'];
        }
        #silentFlag = (__runInitializers(this, _instanceExtraInitializers), void 0);
        #value_accessor_storage = __runInitializers(this, _value_initializers, void 0);
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #label_accessor_storage = __runInitializers(this, _label_initializers, void 0);
        get label() { return this.#label_accessor_storage; }
        set label(value) { this.#label_accessor_storage = value; }
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, void 0);
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #selected_accessor_storage = __runInitializers(this, _selected_initializers, void 0);
        get selected() { return this.#selected_accessor_storage; }
        set selected(value) { this.#selected_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            const fragment = template().content.cloneNode(true);
            shadowRoot.appendChild(fragment);
        }
        silentSelected(value) {
            this.#silentFlag = true;
            selectedSetter(this, value);
            this.#silentFlag = false;
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'selected' && newValue !== oldValue) {
                const eventType = newValue === null ? 'deselect' : 'select';
                if (!this.#silentFlag) {
                    this.dispatchEvent(new CustomEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        composed: true,
                    }));
                }
            }
            this.render();
        }
    };
    return BlocksOption = _classThis;
})();
