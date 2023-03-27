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
import { shadowRef } from '../../decorators/shadowRef.js';
import { style } from './style.js';
import { template } from './template.js';
import { Component } from '../component/Component.js';
import { SetupEmpty } from '../setup-empty/index.js';
export let BlocksCard = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-card',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _shadow_decorators;
    let _shadow_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$cover_decorators;
    let _$cover_initializers = [];
    let _$header_decorators;
    let _$header_initializers = [];
    let _$body_decorators;
    let _$body_initializers = [];
    let _$footer_decorators;
    let _$footer_initializers = [];
    let _$coverSlot_decorators;
    let _$coverSlot_initializers = [];
    let _$headerSlot_decorators;
    let _$headerSlot_initializers = [];
    let _$bodySlot_decorators;
    let _$bodySlot_initializers = [];
    let _$footerSlot_decorators;
    let _$footerSlot_initializers = [];
    var BlocksCard = class extends Component {
        static {
            _shadow_decorators = [attr('enum', { enumValues: ['hover', 'always'] })];
            _size_decorators = [attrs.size];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            _$cover_decorators = [shadowRef('[part="cover"]')];
            _$header_decorators = [shadowRef('[part="header"]')];
            _$body_decorators = [shadowRef('[part="body"]')];
            _$footer_decorators = [shadowRef('[part="footer"]')];
            _$coverSlot_decorators = [shadowRef('[part="cover-slot"]')];
            _$headerSlot_decorators = [shadowRef('[part="header-slot"]')];
            _$bodySlot_decorators = [shadowRef('[part="body-slot"]')];
            _$footerSlot_decorators = [shadowRef('[part="footer-slot"]')];
            __esDecorate(this, null, _shadow_decorators, { kind: "accessor", name: "shadow", static: false, private: false, access: { has: obj => "shadow" in obj, get: obj => obj.shadow, set: (obj, value) => { obj.shadow = value; } } }, _shadow_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$cover_decorators, { kind: "accessor", name: "$cover", static: false, private: false, access: { has: obj => "$cover" in obj, get: obj => obj.$cover, set: (obj, value) => { obj.$cover = value; } } }, _$cover_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$header_decorators, { kind: "accessor", name: "$header", static: false, private: false, access: { has: obj => "$header" in obj, get: obj => obj.$header, set: (obj, value) => { obj.$header = value; } } }, _$header_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$body_decorators, { kind: "accessor", name: "$body", static: false, private: false, access: { has: obj => "$body" in obj, get: obj => obj.$body, set: (obj, value) => { obj.$body = value; } } }, _$body_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$footer_decorators, { kind: "accessor", name: "$footer", static: false, private: false, access: { has: obj => "$footer" in obj, get: obj => obj.$footer, set: (obj, value) => { obj.$footer = value; } } }, _$footer_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$coverSlot_decorators, { kind: "accessor", name: "$coverSlot", static: false, private: false, access: { has: obj => "$coverSlot" in obj, get: obj => obj.$coverSlot, set: (obj, value) => { obj.$coverSlot = value; } } }, _$coverSlot_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$headerSlot_decorators, { kind: "accessor", name: "$headerSlot", static: false, private: false, access: { has: obj => "$headerSlot" in obj, get: obj => obj.$headerSlot, set: (obj, value) => { obj.$headerSlot = value; } } }, _$headerSlot_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$bodySlot_decorators, { kind: "accessor", name: "$bodySlot", static: false, private: false, access: { has: obj => "$bodySlot" in obj, get: obj => obj.$bodySlot, set: (obj, value) => { obj.$bodySlot = value; } } }, _$bodySlot_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$footerSlot_decorators, { kind: "accessor", name: "$footerSlot", static: false, private: false, access: { has: obj => "$footerSlot" in obj, get: obj => obj.$footerSlot, set: (obj, value) => { obj.$footerSlot = value; } } }, _$footerSlot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksCard = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #shadow_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _shadow_initializers, void 0));
        get shadow() { return this.#shadow_accessor_storage; }
        set shadow(value) { this.#shadow_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$cover_accessor_storage = __runInitializers(this, _$cover_initializers, void 0);
        get $cover() { return this.#$cover_accessor_storage; }
        set $cover(value) { this.#$cover_accessor_storage = value; }
        #$header_accessor_storage = __runInitializers(this, _$header_initializers, void 0);
        get $header() { return this.#$header_accessor_storage; }
        set $header(value) { this.#$header_accessor_storage = value; }
        #$body_accessor_storage = __runInitializers(this, _$body_initializers, void 0);
        get $body() { return this.#$body_accessor_storage; }
        set $body(value) { this.#$body_accessor_storage = value; }
        #$footer_accessor_storage = __runInitializers(this, _$footer_initializers, void 0);
        get $footer() { return this.#$footer_accessor_storage; }
        set $footer(value) { this.#$footer_accessor_storage = value; }
        #$coverSlot_accessor_storage = __runInitializers(this, _$coverSlot_initializers, void 0);
        get $coverSlot() { return this.#$coverSlot_accessor_storage; }
        set $coverSlot(value) { this.#$coverSlot_accessor_storage = value; }
        #$headerSlot_accessor_storage = __runInitializers(this, _$headerSlot_initializers, void 0);
        get $headerSlot() { return this.#$headerSlot_accessor_storage; }
        set $headerSlot(value) { this.#$headerSlot_accessor_storage = value; }
        #$bodySlot_accessor_storage = __runInitializers(this, _$bodySlot_initializers, void 0);
        get $bodySlot() { return this.#$bodySlot_accessor_storage; }
        set $bodySlot(value) { this.#$bodySlot_accessor_storage = value; }
        #$footerSlot_accessor_storage = __runInitializers(this, _$footerSlot_initializers, void 0);
        get $footerSlot() { return this.#$footerSlot_accessor_storage; }
        set $footerSlot(value) { this.#$footerSlot_accessor_storage = value; }
        _emptyFeature;
        constructor() {
            super();
            this.appendShadowChild(template());
            this.#setupEmpty();
        }
        #setupEmpty() {
            this._emptyFeature = Object.create(null);
            ['$cover', '$header', '$body', '$footer'].forEach(name => {
                const slotName = (name + 'Slot');
                this._emptyFeature[slotName] = SetupEmpty.setup({
                    component: this,
                    predicate: () => {
                        const $nodes = this[slotName].assignedNodes();
                        for (let i = 0; i < $nodes.length; ++i) {
                            if ($nodes[i].nodeType === 1)
                                return false;
                            if ($nodes[i].nodeType === 3 && $nodes[i].nodeValue?.trim())
                                return false;
                        }
                        return true;
                    },
                    target: () => this[name],
                    init: () => {
                        const onSlotChange = () => this._emptyFeature[slotName].update();
                        this.onConnected(() => {
                            this[slotName].addEventListener('slotchange', onSlotChange);
                        });
                        this.onDisconnected(() => {
                            this[slotName].removeEventListener('slotchange', onSlotChange);
                        });
                    },
                });
            });
        }
    };
    return BlocksCard = _classThis;
})();
