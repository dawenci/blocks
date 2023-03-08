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
import { template } from './row-template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
export let BlocksRow = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-row',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _gutter_decorators;
    let _gutter_initializers = [];
    let _wrap_decorators;
    let _wrap_initializers = [];
    let _align_decorators;
    let _align_initializers = [];
    let _justify_decorators;
    let _justify_initializers = [];
    var BlocksRow = class extends Component {
        static {
            _gutter_decorators = [attr('int')];
            _wrap_decorators = [attr('boolean')];
            _align_decorators = [attr('enum', { enumValues: ['top', 'middle', 'bottom'] })];
            _justify_decorators = [attr('enum', {
                    enumValues: ['start', 'end', 'center', 'space-around', 'space-between'],
                })];
            __esDecorate(this, null, _gutter_decorators, { kind: "accessor", name: "gutter", static: false, private: false, access: { has: obj => "gutter" in obj, get: obj => obj.gutter, set: (obj, value) => { obj.gutter = value; } } }, _gutter_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _wrap_decorators, { kind: "accessor", name: "wrap", static: false, private: false, access: { has: obj => "wrap" in obj, get: obj => obj.wrap, set: (obj, value) => { obj.wrap = value; } } }, _wrap_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _align_decorators, { kind: "accessor", name: "align", static: false, private: false, access: { has: obj => "align" in obj, get: obj => obj.align, set: (obj, value) => { obj.align = value; } } }, _align_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _justify_decorators, { kind: "accessor", name: "justify", static: false, private: false, access: { has: obj => "justify" in obj, get: obj => obj.justify, set: (obj, value) => { obj.justify = value; } } }, _justify_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksRow = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [
                'align',
                'gutter',
                'justify',
                'wrap',
            ];
        }
        #gutter_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _gutter_initializers, 0));
        get gutter() { return this.#gutter_accessor_storage; }
        set gutter(value) { this.#gutter_accessor_storage = value; }
        #wrap_accessor_storage = __runInitializers(this, _wrap_initializers, void 0);
        get wrap() { return this.#wrap_accessor_storage; }
        set wrap(value) { this.#wrap_accessor_storage = value; }
        #align_accessor_storage = __runInitializers(this, _align_initializers, void 0);
        get align() { return this.#align_accessor_storage; }
        set align(value) { this.#align_accessor_storage = value; }
        #justify_accessor_storage = __runInitializers(this, _justify_initializers, void 0);
        get justify() { return this.#justify_accessor_storage; }
        set justify(value) { this.#justify_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template().content.cloneNode(true));
            this._ref = {
                $slot: shadowRoot.querySelector('slot'),
            };
        }
        connectedCallback() {
            super.connectedCallback();
            this._renderGutter();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'gutter') {
                this._renderGutter();
            }
        }
        _renderGutter() {
            const cols = this._ref.$slot.assignedElements();
            if (this.gutter) {
                const half = this.gutter / 2;
                this.style.marginLeft = -half + 'px';
                this.style.marginRight = -half + 'px';
                cols.forEach($col => {
                    $col.style.paddingLeft = half + 'px';
                    $col.style.paddingRight = half + 'px';
                });
            }
            else {
                this.style.marginLeft = '';
                this.style.marginRight = '';
                cols.forEach($col => {
                    $col.style.paddingLeft = '';
                    $col.style.paddingRight = '';
                });
            }
        }
    };
    return BlocksRow = _classThis;
})();
