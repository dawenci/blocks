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
import { attr } from '../../decorators/attr.js';
import { domRef } from '../../decorators/domRef.js';
import { style } from './style.js';
import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js';
import { Component } from '../Component.js';
import { template } from './template.js';
export let BlocksIcon = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-icon',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _fill_decorators;
    let _fill_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    var BlocksIcon = class extends Component {
        static {
            _value_decorators = [attr('string')];
            _fill_decorators = [attr('string')];
            _$layout_decorators = [domRef('#layout')];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _fill_decorators, { kind: "accessor", name: "fill", static: false, private: false, access: { has: obj => "fill" in obj, get: obj => obj.fill, set: (obj, value) => { obj.fill = value; } } }, _fill_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksIcon = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #value_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _value_initializers, void 0));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #fill_accessor_storage = __runInitializers(this, _fill_initializers, void 0);
        get fill() { return this.#fill_accessor_storage; }
        set fill(value) { this.#fill_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        constructor() {
            super();
            this.shadowRoot.appendChild(template());
        }
        render() {
            const { $layout } = this;
            if ($layout.firstElementChild) {
                $layout.removeChild($layout.firstElementChild);
            }
            const attrs = {};
            if (this.fill) {
                attrs.fill = this.fill;
            }
            const icon = getRegisteredSvgIcon(this.value ?? '', attrs) ??
                parseSvg(this.value ?? '', attrs);
            if (icon) {
                $layout.appendChild(icon);
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
    return BlocksIcon = _classThis;
})();
