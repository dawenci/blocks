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
import { defineClass } from '../../decorators/defineClass.js';
import { mixins } from '../../decorators/mixins.js';
import { attr } from '../../decorators/attr.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
import { Component } from '../Component.js';
export let BlocksTransitionOpenZoom = (() => {
    let _classDecorators = [defineClass, mixins([WithOpenTransition])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _open_decorators;
    let _open_initializers = [];
    var BlocksTransitionOpenZoom = class extends Component {
        static {
            _open_decorators = [attr('boolean')];
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksTransitionOpenZoom = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #open_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _open_initializers, void 0));
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        connectedCallback() {
            super.connectedCallback();
            if (this.open) {
                this._onOpenAttributeChange();
            }
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName == 'open') {
                this._onOpenAttributeChange();
            }
        }
    };
    return BlocksTransitionOpenZoom = _classThis;
})();
