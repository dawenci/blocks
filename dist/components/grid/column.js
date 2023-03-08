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
import { template } from './column-template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
export let BlocksColumn = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-col',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _pull_decorators;
    let _pull_initializers = [];
    let _push_decorators;
    let _push_initializers = [];
    let _span_decorators;
    let _span_initializers = [];
    let _offset_decorators;
    let _offset_initializers = [];
    var BlocksColumn = class extends Component {
        static {
            _pull_decorators = [attr('intRange', { min: 1, max: 23 })];
            _push_decorators = [attr('intRange', { min: 1, max: 23 })];
            _span_decorators = [attr('intRange', { min: 1, max: 24 })];
            _offset_decorators = [attr('intRange', { min: 1, max: 23 })];
            __esDecorate(this, null, _pull_decorators, { kind: "accessor", name: "pull", static: false, private: false, access: { has: obj => "pull" in obj, get: obj => obj.pull, set: (obj, value) => { obj.pull = value; } } }, _pull_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _push_decorators, { kind: "accessor", name: "push", static: false, private: false, access: { has: obj => "push" in obj, get: obj => obj.push, set: (obj, value) => { obj.push = value; } } }, _push_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _span_decorators, { kind: "accessor", name: "span", static: false, private: false, access: { has: obj => "span" in obj, get: obj => obj.span, set: (obj, value) => { obj.span = value; } } }, _span_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _offset_decorators, { kind: "accessor", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, get: obj => obj.offset, set: (obj, value) => { obj.offset = value; } } }, _offset_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksColumn = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [
                'offset',
                'pull',
                'push',
                'span',
            ];
        }
        #pull_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _pull_initializers, void 0));
        get pull() { return this.#pull_accessor_storage; }
        set pull(value) { this.#pull_accessor_storage = value; }
        #push_accessor_storage = __runInitializers(this, _push_initializers, void 0);
        get push() { return this.#push_accessor_storage; }
        set push(value) { this.#push_accessor_storage = value; }
        #span_accessor_storage = __runInitializers(this, _span_initializers, void 0);
        get span() { return this.#span_accessor_storage; }
        set span(value) { this.#span_accessor_storage = value; }
        #offset_accessor_storage = __runInitializers(this, _offset_initializers, void 0);
        get offset() { return this.#offset_accessor_storage; }
        set offset(value) { this.#offset_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template().content.cloneNode(true));
            this._ref = { $slot: shadowRoot.querySelector('slot') };
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
    };
    return BlocksColumn = _classThis;
})();
