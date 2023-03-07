var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { forEach } from '../../common/utils.js';
import { Component } from '../Component.js';
import { styleTemplate, contentTemplate, itemTemplate, } from './menu-group-template.js';
import { customElement } from '../../decorators/customElement.js';
import { attr } from '../../decorators/attr.js';
export let BlocksPopupMenuGroup = (() => {
    let _classDecorators = [customElement('bl-popup-menu-group')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _titleText_decorators;
    let _titleText_initializers = [];
    var BlocksPopupMenuGroup = class extends Component {
        static {
            _titleText_decorators = [attr('string')];
            __esDecorate(this, null, _titleText_decorators, { kind: "accessor", name: "titleText", static: false, private: false, access: { has: obj => "titleText" in obj, get: obj => obj.titleText, set: (obj, value) => { obj.titleText = value; } } }, _titleText_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksPopupMenuGroup = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return ['title-text'];
        }
        _data = (__runInitializers(this, _instanceExtraInitializers), void 0);
        $head;
        $body;
        #titleText_accessor_storage = __runInitializers(this, _titleText_initializers, '');
        get titleText() { return this.#titleText_accessor_storage; }
        set titleText(value) { this.#titleText_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(styleTemplate());
            shadowRoot.appendChild(contentTemplate());
            this.$head = shadowRoot.getElementById('head');
            this.$body = shadowRoot.getElementById('body');
        }
        #hostMenu;
        get $hostMenu() {
            return this.#hostMenu;
        }
        set $hostMenu($menu) {
            this.#hostMenu = $menu;
        }
        get data() {
            return this._data ?? {};
        }
        set data(value) {
            this._data = value;
            this.render();
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            this.render();
        }
        render() {
            const data = this.data;
            if (data.title) {
                this.$head.textContent = data.title;
                this.$head.style.display = 'block';
            }
            else {
                this.$head.style.display = 'none';
            }
            const bodyFragment = document.createDocumentFragment();
            (this.data.data ?? []).forEach(item => {
                if (!item.label && item.data) {
                    console.warn('Nested grouping is not supported.');
                    return;
                }
                const $item = itemTemplate();
                $item.$hostMenu = this.$hostMenu;
                bodyFragment.appendChild($item);
                $item.data = item;
            });
            this.$body.innerHTML = '';
            this.$body.appendChild(bodyFragment);
        }
        clearActive() {
            const children = this.$body.children;
            forEach(children, child => {
                if (child.clearActive)
                    child.clearActive();
            });
        }
    };
    return BlocksPopupMenuGroup = _classThis;
})();
