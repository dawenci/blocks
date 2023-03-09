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
import { ClearableControlBox } from '../base-clearable-control-box/index.js';
import { domRef } from '../../decorators/domRef.js';
export let BlocksResult = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-result',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _$content_decorators;
    let _$content_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlocksResult = class extends ClearableControlBox {
        static {
            _size_decorators = [attrs.size];
            _placeholder_decorators = [attr('string')];
            _$content_decorators = [domRef('#content')];
            _$slot_decorators = [domRef('slot')];
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } } }, _placeholder_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$content_decorators, { kind: "accessor", name: "$content", static: false, private: false, access: { has: obj => "$content" in obj, get: obj => obj.$content, set: (obj, value) => { obj.$content = value; } } }, _$content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksResult = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #size_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _size_initializers, void 0));
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #placeholder_accessor_storage = __runInitializers(this, _placeholder_initializers, void 0);
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #$content_accessor_storage = __runInitializers(this, _$content_initializers, void 0);
        get $content() { return this.#$content_accessor_storage; }
        set $content(value) { this.#$content_accessor_storage = value; }
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        constructor() {
            super();
            const $content = document.createElement('div');
            $content.id = 'content';
            $content.appendChild(document.createElement('slot'));
            this._appendContent($content);
        }
    };
    return BlocksResult = _classThis;
})();
