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
import { Component } from '../Component.js';
import { template } from './template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
const status = ['success', 'error', 'warning'];
export let BlocksProgress = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-progress',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _percentage_decorators;
    let _percentage_initializers = [];
    var BlocksProgress = class extends Component {
        static {
            _value_decorators = [attr('number')];
            _status_decorators = [attr('enum', { enumValues: status })];
            _percentage_decorators = [attr('boolean')];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _status_decorators, { kind: "accessor", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } } }, _status_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _percentage_decorators, { kind: "accessor", name: "percentage", static: false, private: false, access: { has: obj => "percentage" in obj, get: obj => obj.percentage, set: (obj, value) => { obj.percentage = value; } } }, _percentage_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksProgress = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return ['value', 'status', 'percentage'];
        }
        #value_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _value_initializers, void 0));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #status_accessor_storage = __runInitializers(this, _status_initializers, void 0);
        get status() { return this.#status_accessor_storage; }
        set status(value) { this.#status_accessor_storage = value; }
        #percentage_accessor_storage = __runInitializers(this, _percentage_initializers, void 0);
        get percentage() { return this.#percentage_accessor_storage; }
        set percentage(value) { this.#percentage_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template().content.cloneNode(true));
            const $progress = shadowRoot.querySelector('#progress');
            const $value = shadowRoot.querySelector('#value');
            this._ref = {
                $progress,
                $value,
            };
        }
        render() {
            this._ref.$progress.style.width = `${this.value}%`;
            if (this.percentage) {
                this._ref.$value.style.display = 'block';
                this._ref.$value.textContent = `${this.value}%`;
            }
            else {
                this._ref.$value.style.display = 'none';
            }
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            this.render();
        }
    };
    return BlocksProgress = _classThis;
})();
