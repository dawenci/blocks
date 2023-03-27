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
import { attr, attrs } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { getElementTarget } from '../../common/getElementTarget.js';
import { style } from './style.js';
import { template } from './template.js';
import { Component } from '../component/Component.js';
const types = ['primary', 'danger', 'warning', 'success'];
export let BlocksTag = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-tag',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _round_decorators;
    let _round_initializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _closeable_decorators;
    let _closeable_initializers = [];
    let _outline_decorators;
    let _outline_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    var BlocksTag = class extends Component {
        static {
            _round_decorators = [attr('boolean')];
            _type_decorators = [attr('enum', { enumValues: types })];
            _closeable_decorators = [attr('boolean')];
            _outline_decorators = [attr('boolean')];
            _size_decorators = [attrs.size];
            _$layout_decorators = [shadowRef('#layout')];
            __esDecorate(this, null, _round_decorators, { kind: "accessor", name: "round", static: false, private: false, access: { has: obj => "round" in obj, get: obj => obj.round, set: (obj, value) => { obj.round = value; } } }, _round_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } } }, _type_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeable_decorators, { kind: "accessor", name: "closeable", static: false, private: false, access: { has: obj => "closeable" in obj, get: obj => obj.closeable, set: (obj, value) => { obj.closeable = value; } } }, _closeable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _outline_decorators, { kind: "accessor", name: "outline", static: false, private: false, access: { has: obj => "outline" in obj, get: obj => obj.outline, set: (obj, value) => { obj.outline = value; } } }, _outline_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksTag = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #round_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _round_initializers, void 0));
        get round() { return this.#round_accessor_storage; }
        set round(value) { this.#round_accessor_storage = value; }
        #type_accessor_storage = __runInitializers(this, _type_initializers, void 0);
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        #closeable_accessor_storage = __runInitializers(this, _closeable_initializers, void 0);
        get closeable() { return this.#closeable_accessor_storage; }
        set closeable(value) { this.#closeable_accessor_storage = value; }
        #outline_accessor_storage = __runInitializers(this, _outline_initializers, void 0);
        get outline() { return this.#outline_accessor_storage; }
        set outline(value) { this.#outline_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template());
            const onClick = (e) => {
                if (getElementTarget(e)?.id === 'close') {
                    dispatchEvent(this, 'close');
                }
            };
            this.onConnected(() => {
                this.$layout.addEventListener('click', onClick);
            });
            this.onDisconnected(() => {
                this.$layout.removeEventListener('click', onClick);
            });
            this.onConnected(this.render);
            this.onAttributeChanged(this.render);
        }
        render() {
            super.render();
            if (this.closeable) {
                if (!this.shadowRoot.getElementById('close')) {
                    const button = this.$layout.appendChild(document.createElement('button'));
                    button.id = 'close';
                }
            }
            else {
                const button = this.shadowRoot.getElementById('close');
                if (button) {
                    button.parentElement.removeChild(button);
                }
            }
        }
    };
    return BlocksTag = _classThis;
})();
