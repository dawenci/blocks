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
import { customElement } from '../../decorators/customElement.js';
import { applyStyle } from '../../decorators/style.js';
import { attr } from '../../decorators/attr.js';
import { domRef } from '../../decorators/domRef.js';
import { style } from './item.style.js';
import { strSetter } from '../../common/property.js';
import { Component } from '../Component.js';
import { template } from './item.template.js';
export let BlocksBreadcrumbItem = (() => {
    let _classDecorators = [customElement('bl-breadcrumb-item'), applyStyle(style)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _href_decorators;
    let _href_initializers = [];
    let _$separator_decorators;
    let _$separator_initializers = [];
    let _$link_decorators;
    let _$link_initializers = [];
    var BlocksBreadcrumbItem = class extends Component {
        static {
            _href_decorators = [attr('string')];
            _$separator_decorators = [domRef('#separator')];
            _$link_decorators = [domRef('#link')];
            __esDecorate(this, null, _href_decorators, { kind: "accessor", name: "href", static: false, private: false, access: { has: obj => "href" in obj, get: obj => obj.href, set: (obj, value) => { obj.href = value; } } }, _href_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$separator_decorators, { kind: "accessor", name: "$separator", static: false, private: false, access: { has: obj => "$separator" in obj, get: obj => obj.$separator, set: (obj, value) => { obj.$separator = value; } } }, _$separator_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$link_decorators, { kind: "accessor", name: "$link", static: false, private: false, access: { has: obj => "$link" in obj, get: obj => obj.$link, set: (obj, value) => { obj.$link = value; } } }, _$link_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksBreadcrumbItem = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #href_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _href_initializers, 'javascript(void 0)'));
        get href() { return this.#href_accessor_storage; }
        set href(value) { this.#href_accessor_storage = value; }
        #$separator_accessor_storage = __runInitializers(this, _$separator_initializers, void 0);
        get $separator() { return this.#$separator_accessor_storage; }
        set $separator(value) { this.#$separator_accessor_storage = value; }
        #$link_accessor_storage = __runInitializers(this, _$link_initializers, void 0);
        get $link() { return this.#$link_accessor_storage; }
        set $link(value) { this.#$link_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template().content.cloneNode(true));
        }
        _renderSeparator(separator) {
            if (this.parentElement?.lastElementChild === this)
                return;
            this.$separator.textContent = separator;
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'href') {
                strSetter('href')(this.$link, newValue);
            }
        }
    };
    return BlocksBreadcrumbItem = _classThis;
})();
