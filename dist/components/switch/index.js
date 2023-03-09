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
import { attr, attrs } from '../../decorators/attr.js';
import { style } from './style.js';
import { Control } from '../base-control/index.js';
import { dispatchEvent } from '../../common/event.js';
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js';
export let BlocksSwitch = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-switch',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _checked_decorators;
    let _checked_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    var BlocksSwitch = class extends Control {
        static {
            _checked_decorators = [attr('boolean')];
            _size_decorators = [attrs.size];
            __esDecorate(this, null, _checked_decorators, { kind: "accessor", name: "checked", static: false, private: false, access: { has: obj => "checked" in obj, get: obj => obj.checked, set: (obj, value) => { obj.checked = value; } } }, _checked_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksSwitch = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'switch';
        }
        #checked_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _checked_initializers, void 0));
        get checked() { return this.#checked_accessor_storage; }
        set checked(value) { this.#checked_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        constructor() {
            super();
            captureEventWhenEnable(this, 'click', () => {
                this.checked = !this.checked;
            });
            captureEventWhenEnable(this, 'keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.checked = !this.checked;
                }
            });
        }
        connectedCallback() {
            super.connectedCallback();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'checked') {
                dispatchEvent(this, 'change', { detail: { value: this.checked } });
            }
        }
    };
    return BlocksSwitch = _classThis;
})();
