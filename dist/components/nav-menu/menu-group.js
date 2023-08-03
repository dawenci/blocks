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
import './menu-item.js';
import { attr } from '../../decorators/attr/index.js';
import { contentTemplate, itemTemplate } from './menu-group.template.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { forEach } from '../../common/utils.js';
import { style } from './menu-group.style.js';
import { BlComponent } from '../component/Component.js';
export let BlNavMenuGroup = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-nav-menu-group',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _titleText_decorators;
    let _titleText_initializers = [];
    let _horizontal_decorators;
    let _horizontal_initializers = [];
    let _collapse_decorators;
    let _collapse_initializers = [];
    let _inline_decorators;
    let _inline_initializers = [];
    let _$head_decorators;
    let _$head_initializers = [];
    let _$body_decorators;
    let _$body_initializers = [];
    var BlNavMenuGroup = class extends BlComponent {
        static {
            _titleText_decorators = [attr('string')];
            _horizontal_decorators = [attr('boolean')];
            _collapse_decorators = [attr('boolean')];
            _inline_decorators = [attr('boolean')];
            _$head_decorators = [shadowRef('#head')];
            _$body_decorators = [shadowRef('#body')];
            __esDecorate(this, null, _titleText_decorators, { kind: "accessor", name: "titleText", static: false, private: false, access: { has: obj => "titleText" in obj, get: obj => obj.titleText, set: (obj, value) => { obj.titleText = value; } } }, _titleText_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _horizontal_decorators, { kind: "accessor", name: "horizontal", static: false, private: false, access: { has: obj => "horizontal" in obj, get: obj => obj.horizontal, set: (obj, value) => { obj.horizontal = value; } } }, _horizontal_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _collapse_decorators, { kind: "accessor", name: "collapse", static: false, private: false, access: { has: obj => "collapse" in obj, get: obj => obj.collapse, set: (obj, value) => { obj.collapse = value; } } }, _collapse_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _inline_decorators, { kind: "accessor", name: "inline", static: false, private: false, access: { has: obj => "inline" in obj, get: obj => obj.inline, set: (obj, value) => { obj.inline = value; } } }, _inline_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$head_decorators, { kind: "accessor", name: "$head", static: false, private: false, access: { has: obj => "$head" in obj, get: obj => obj.$head, set: (obj, value) => { obj.$head = value; } } }, _$head_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$body_decorators, { kind: "accessor", name: "$body", static: false, private: false, access: { has: obj => "$body" in obj, get: obj => obj.$body, set: (obj, value) => { obj.$body = value; } } }, _$body_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlNavMenuGroup = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'group';
        }
        #titleText_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _titleText_initializers, ''));
        get titleText() { return this.#titleText_accessor_storage; }
        set titleText(value) { this.#titleText_accessor_storage = value; }
        #horizontal_accessor_storage = __runInitializers(this, _horizontal_initializers, void 0);
        get horizontal() { return this.#horizontal_accessor_storage; }
        set horizontal(value) { this.#horizontal_accessor_storage = value; }
        #collapse_accessor_storage = __runInitializers(this, _collapse_initializers, void 0);
        get collapse() { return this.#collapse_accessor_storage; }
        set collapse(value) { this.#collapse_accessor_storage = value; }
        #inline_accessor_storage = __runInitializers(this, _inline_initializers, void 0);
        get inline() { return this.#inline_accessor_storage; }
        set inline(value) { this.#inline_accessor_storage = value; }
        #$head_accessor_storage = __runInitializers(this, _$head_initializers, void 0);
        get $head() { return this.#$head_accessor_storage; }
        set $head(value) { this.#$head_accessor_storage = value; }
        #$body_accessor_storage = __runInitializers(this, _$body_initializers, void 0);
        get $body() { return this.#$body_accessor_storage; }
        set $body(value) { this.#$body_accessor_storage = value; }
        _data;
        constructor() {
            super();
            this.appendShadowChild(contentTemplate());
            this.hook.onConnected(this.render);
            this.hook.onAttributeChanged(this.render);
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
        render() {
            super.render();
            const data = this.data;
            if (data.title) {
                this.$head.textContent = data.title;
                this.$head.style.display = 'block';
            }
            else {
                this.$head.style.display = 'none';
            }
            const hostContext = this.horizontal
                ? 'horizontal'
                : this.inline
                    ? 'inline'
                    : this.collapse
                        ? 'collapse'
                        : 'vertical';
            const bodyFragment = document.createDocumentFragment();
            (this.data.data ?? []).forEach((item) => {
                if (!item.label && item.data)
                    return;
                const $item = itemTemplate();
                $item.setAttribute('host-context', hostContext);
                $item.$hostMenu = this.$hostMenu;
                bodyFragment.appendChild($item);
                $item.data = item;
            });
            this.$body.innerHTML = '';
            this.$body.appendChild(bodyFragment);
        }
        clearActive() {
            forEach(this.$body.children, (child) => {
                if (child.clearActive)
                    child.clearActive();
            });
        }
    };
    return BlNavMenuGroup = _classThis;
})();
