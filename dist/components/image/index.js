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
import '../loading/index.js';
import '../icon/index.js';
import { attr } from '../../decorators/attr/index.js';
import { contentTemplate, fallbackTemplate, placeholderTemplate } from './template.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { makeMessages } from '../../i18n/makeMessages.js';
import { strGetter, strSetter } from '../../common/property.js';
import { style } from './style.js';
import { BlComponent } from '../component/Component.js';
const getMessage = makeMessages('image', {
    placeholderText: '加载中',
    fallbackText: '加载失败',
});
export let BlImage = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-image',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _alt_decorators;
    let _alt_initializers = [];
    let _fallback_decorators;
    let _fallback_initializers = [];
    let _manual_decorators;
    let _manual_initializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _src_decorators;
    let _src_initializers = [];
    let _fit_decorators;
    let _fit_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$img_decorators;
    let _$img_initializers = [];
    let _$placeholder_decorators;
    let _$placeholder_initializers = [];
    let _$fallback_decorators;
    let _$fallback_initializers = [];
    var BlImage = class extends BlComponent {
        static {
            _alt_decorators = [attr('string')];
            _fallback_decorators = [attr('string')];
            _manual_decorators = [attr('boolean')];
            _placeholder_decorators = [attr('string')];
            _src_decorators = [attr('string')];
            _fit_decorators = [attr('enum', {
                    enumValues: ['none', 'fill', 'contain', 'cover', 'scale-down'],
                })];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            _$img_decorators = [shadowRef('[part="img"]')];
            _$placeholder_decorators = [shadowRef('[part="placeholder"]', false)];
            _$fallback_decorators = [shadowRef('[part="fallback"]', false)];
            __esDecorate(this, null, _alt_decorators, { kind: "accessor", name: "alt", static: false, private: false, access: { has: obj => "alt" in obj, get: obj => obj.alt, set: (obj, value) => { obj.alt = value; } } }, _alt_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _fallback_decorators, { kind: "accessor", name: "fallback", static: false, private: false, access: { has: obj => "fallback" in obj, get: obj => obj.fallback, set: (obj, value) => { obj.fallback = value; } } }, _fallback_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _manual_decorators, { kind: "accessor", name: "manual", static: false, private: false, access: { has: obj => "manual" in obj, get: obj => obj.manual, set: (obj, value) => { obj.manual = value; } } }, _manual_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } } }, _placeholder_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _src_decorators, { kind: "accessor", name: "src", static: false, private: false, access: { has: obj => "src" in obj, get: obj => obj.src, set: (obj, value) => { obj.src = value; } } }, _src_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _fit_decorators, { kind: "accessor", name: "fit", static: false, private: false, access: { has: obj => "fit" in obj, get: obj => obj.fit, set: (obj, value) => { obj.fit = value; } } }, _fit_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$img_decorators, { kind: "accessor", name: "$img", static: false, private: false, access: { has: obj => "$img" in obj, get: obj => obj.$img, set: (obj, value) => { obj.$img = value; } } }, _$img_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$placeholder_decorators, { kind: "accessor", name: "$placeholder", static: false, private: false, access: { has: obj => "$placeholder" in obj, get: obj => obj.$placeholder, set: (obj, value) => { obj.$placeholder = value; } } }, _$placeholder_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$fallback_decorators, { kind: "accessor", name: "$fallback", static: false, private: false, access: { has: obj => "$fallback" in obj, get: obj => obj.$fallback, set: (obj, value) => { obj.$fallback = value; } } }, _$fallback_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlImage = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'img';
        }
        #alt_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _alt_initializers, void 0));
        get alt() { return this.#alt_accessor_storage; }
        set alt(value) { this.#alt_accessor_storage = value; }
        #fallback_accessor_storage = __runInitializers(this, _fallback_initializers, void 0);
        get fallback() { return this.#fallback_accessor_storage; }
        set fallback(value) { this.#fallback_accessor_storage = value; }
        #manual_accessor_storage = __runInitializers(this, _manual_initializers, void 0);
        get manual() { return this.#manual_accessor_storage; }
        set manual(value) { this.#manual_accessor_storage = value; }
        #placeholder_accessor_storage = __runInitializers(this, _placeholder_initializers, void 0);
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #src_accessor_storage = __runInitializers(this, _src_initializers, void 0);
        get src() { return this.#src_accessor_storage; }
        set src(value) { this.#src_accessor_storage = value; }
        #fit_accessor_storage = __runInitializers(this, _fit_initializers, void 0);
        get fit() { return this.#fit_accessor_storage; }
        set fit(value) { this.#fit_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$img_accessor_storage = __runInitializers(this, _$img_initializers, void 0);
        get $img() { return this.#$img_accessor_storage; }
        set $img(value) { this.#$img_accessor_storage = value; }
        #$placeholder_accessor_storage = __runInitializers(this, _$placeholder_initializers, void 0);
        get $placeholder() { return this.#$placeholder_accessor_storage; }
        set $placeholder(value) { this.#$placeholder_accessor_storage = value; }
        #$fallback_accessor_storage = __runInitializers(this, _$fallback_initializers, void 0);
        get $fallback() { return this.#$fallback_accessor_storage; }
        set $fallback(value) { this.#$fallback_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(contentTemplate());
            this.#setupLoad();
            this.hook.onConnected(this.render);
            this.hook.onAttributeChanged(this.render);
        }
        #setupLoad() {
            this._status = 'init';
            const onLoad = () => {
                if (this._status === 'loading') {
                    this._status = 'loaded';
                    this._renderSuccess();
                    dispatchEvent(this, 'loaded');
                }
            };
            const onError = () => {
                if (this._status === 'loading') {
                    this._status = 'error';
                    this._renderFail();
                    dispatchEvent(this, 'error');
                }
            };
            this.hook.onConnected(() => {
                this.$img.addEventListener('load', onLoad);
                this.$img.addEventListener('error', onError);
                if (!this.manual) {
                    this.load();
                }
            });
            this.hook.onDisconnected(() => {
                this.$img.removeEventListener('load', onLoad);
                this.$img.removeEventListener('error', onError);
            });
            this.hook.onAttributeChangedDep('src', () => {
                if (!this.manual) {
                    this.load();
                }
                else {
                    this._reset();
                }
            });
        }
        _renderLoading() {
            const { $layout, $img } = this;
            $img.style.opacity = '0';
            this._removeFallback();
            if (!this.$placeholder) {
                const $placeholder = $layout.appendChild(placeholderTemplate());
                $placeholder.querySelector('.placeholderText').textContent = getMessage('placeholderText');
                if (this.placeholder) {
                    $placeholder.querySelector('img').src = this.placeholder;
                }
            }
        }
        _renderFail() {
            const { $layout, $img } = this;
            $img.style.opacity = '0';
            this._removePlaceholder();
            if (!this.$fallback) {
                const $fallback = $layout.appendChild(fallbackTemplate());
                $fallback.querySelector('.fallbackText').textContent = getMessage('fallbackText');
                if (this.fallback) {
                    $fallback.querySelector('img').src = this.fallback;
                }
            }
        }
        _renderSuccess() {
            this.$img.style.opacity = '1';
            this._removePlaceholder();
            this._removeFallback();
            if (this.fit) {
                this.$img.style.objectFit = this.fit;
            }
        }
        _removePlaceholder() {
            if (this.$placeholder) {
                this.$layout.removeChild(this.$placeholder);
            }
        }
        _removeFallback() {
            if (this.$fallback) {
                this.$layout.removeChild(this.$fallback);
            }
        }
        _reset() {
            const { $img } = this;
            this._status = 'init';
            $img.style.display = 'none';
            $img.style.opacity = '0';
            $img.src = '';
            $img.style.display = '';
            this._removePlaceholder();
            this._removeFallback();
        }
        render() {
            super.render();
            if (this.$img.getAttribute('alt') !== this.alt) {
                strSetter('alt')(this.$img, this.alt);
            }
            switch (this._status) {
                case 'loading':
                    return this._renderLoading();
                case 'error':
                    return this._renderFail();
                case 'loaded':
                    return this._renderSuccess();
            }
        }
        load() {
            if (this._status === 'loading' || (strGetter('alt')(this.$img) === this.src && this._status === 'loaded')) {
                return;
            }
            this._status = 'loading';
            this.$img.src = this.src;
            this._renderLoading();
            dispatchEvent(this, 'loading');
        }
    };
    return BlImage = _classThis;
})();
