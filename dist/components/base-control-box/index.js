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
import { append, mountAfter, mountBefore, prepend, unmount } from '../../common/mount.js';
import { attr } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js';
import { loadingTemplate, prefixTemplate, suffixTemplate, template } from './template.js';
import { style } from './style.js';
import { BlControl } from '../base-control/index.js';
export let BlControlBox = (() => {
    let _classDecorators = [defineClass({
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _loading_decorators;
    let _loading_initializers = [];
    let _prefixIcon_decorators;
    let _prefixIcon_initializers = [];
    let _suffixIcon_decorators;
    let _suffixIcon_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$loading_decorators;
    let _$loading_initializers = [];
    let _$prefix_decorators;
    let _$prefix_initializers = [];
    let _$suffix_decorators;
    let _$suffix_initializers = [];
    var BlControlBox = class extends BlControl {
        static {
            _loading_decorators = [attr('boolean')];
            _prefixIcon_decorators = [attr('string')];
            _suffixIcon_decorators = [attr('string')];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            _$loading_decorators = [shadowRef('[part="loading"]', false)];
            _$prefix_decorators = [shadowRef('[part="prefix"]', false)];
            _$suffix_decorators = [shadowRef('[part="suffix"]', false)];
            __esDecorate(this, null, _loading_decorators, { kind: "accessor", name: "loading", static: false, private: false, access: { has: obj => "loading" in obj, get: obj => obj.loading, set: (obj, value) => { obj.loading = value; } } }, _loading_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _prefixIcon_decorators, { kind: "accessor", name: "prefixIcon", static: false, private: false, access: { has: obj => "prefixIcon" in obj, get: obj => obj.prefixIcon, set: (obj, value) => { obj.prefixIcon = value; } } }, _prefixIcon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _suffixIcon_decorators, { kind: "accessor", name: "suffixIcon", static: false, private: false, access: { has: obj => "suffixIcon" in obj, get: obj => obj.suffixIcon, set: (obj, value) => { obj.suffixIcon = value; } } }, _suffixIcon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$loading_decorators, { kind: "accessor", name: "$loading", static: false, private: false, access: { has: obj => "$loading" in obj, get: obj => obj.$loading, set: (obj, value) => { obj.$loading = value; } } }, _$loading_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$prefix_decorators, { kind: "accessor", name: "$prefix", static: false, private: false, access: { has: obj => "$prefix" in obj, get: obj => obj.$prefix, set: (obj, value) => { obj.$prefix = value; } } }, _$prefix_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$suffix_decorators, { kind: "accessor", name: "$suffix", static: false, private: false, access: { has: obj => "$suffix" in obj, get: obj => obj.$suffix, set: (obj, value) => { obj.$suffix = value; } } }, _$suffix_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlControlBox = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #loading_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _loading_initializers, void 0));
        get loading() { return this.#loading_accessor_storage; }
        set loading(value) { this.#loading_accessor_storage = value; }
        #prefixIcon_accessor_storage = __runInitializers(this, _prefixIcon_initializers, void 0);
        get prefixIcon() { return this.#prefixIcon_accessor_storage; }
        set prefixIcon(value) { this.#prefixIcon_accessor_storage = value; }
        #suffixIcon_accessor_storage = __runInitializers(this, _suffixIcon_initializers, void 0);
        get suffixIcon() { return this.#suffixIcon_accessor_storage; }
        set suffixIcon(value) { this.#suffixIcon_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$loading_accessor_storage = __runInitializers(this, _$loading_initializers, void 0);
        get $loading() { return this.#$loading_accessor_storage; }
        set $loading(value) { this.#$loading_accessor_storage = value; }
        #$prefix_accessor_storage = __runInitializers(this, _$prefix_initializers, void 0);
        get $prefix() { return this.#$prefix_accessor_storage; }
        set $prefix(value) { this.#$prefix_accessor_storage = value; }
        #$suffix_accessor_storage = __runInitializers(this, _$suffix_initializers, void 0);
        get $suffix() { return this.#$suffix_accessor_storage; }
        set $suffix(value) { this.#$suffix_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this.#setupLoadingFeature();
            this.#setupPrefixIconFeature();
            this.#setupSuffixIconFeature();
            this._tabIndexFeature.withTarget(() => [this.$layout]);
            this._disabledFeature.withPredicate(() => this.disabled);
        }
        appendContent($el) {
            const $suffix = this.$suffix;
            if ($suffix) {
                mountBefore($el, $suffix);
            }
            else {
                append($el, this.$layout);
            }
            return $el;
        }
        #setupLoadingFeature() {
            this.hook.onConnected(this._renderLoading);
            this.hook.onAttributeChangedDep('loading', this._renderLoading);
            this.hook.onRender(this._renderLoading);
        }
        _renderLoading() {
            this.$layout.classList.toggle('with-loading', this.loading);
            if (this.loading) {
                if (!this.$loading) {
                    const $loading = loadingTemplate();
                    $loading.appendChild(getRegisteredSvgIcon('loading'));
                    prepend($loading, this.$layout);
                }
            }
            else {
                if (this.$loading) {
                    unmount(this.$loading);
                }
            }
        }
        #setupPrefixIconFeature() {
            const onClick = (e) => {
                const target = e.target;
                if (this.$prefix && this.$prefix.contains(target)) {
                    dispatchEvent(this, 'click-prefix-icon');
                    return;
                }
            };
            this.hook.onConnected(() => {
                this._renderPrefixIcon();
                this.$layout.addEventListener('click', onClick);
            });
            this.hook.onDisconnected(() => {
                this.$layout.removeEventListener('click', onClick);
            });
            this.hook.onAttributeChangedDep('prefix-icon', this._renderPrefixIcon);
            this.hook.onRender(this._renderPrefixIcon);
        }
        _renderPrefixIcon() {
            const $prefixIcon = this.prefixIcon ? getRegisteredSvgIcon(this.prefixIcon) ?? parseSvg(this.prefixIcon) : null;
            this.$layout.classList.toggle('with-prefix', !!$prefixIcon);
            if ($prefixIcon) {
                const $prefix = this.$prefix ?? prefixTemplate();
                $prefix.innerHTML = '';
                $prefix.appendChild($prefixIcon);
                if (this.$loading) {
                    mountAfter($prefix, this.$loading);
                }
                else {
                    prepend($prefix, this.$layout);
                }
            }
            else {
                if (this.$prefix) {
                    unmount(this.$prefix);
                }
            }
        }
        #setupSuffixIconFeature() {
            const onClick = (e) => {
                const target = e.target;
                if (this.$suffix && this.$suffix.contains(target)) {
                    dispatchEvent(this, 'click-suffix-icon');
                    return;
                }
            };
            this.hook.onConnected(() => {
                this._renderSuffixIcon();
                this.$layout.addEventListener('click', onClick);
            });
            this.hook.onDisconnected(() => {
                this.$layout.removeEventListener('click', onClick);
            });
            this.hook.onAttributeChangedDep('suffix-icon', this._renderSuffixIcon);
            this.hook.onRender(this._renderSuffixIcon);
        }
        _renderSuffixIcon() {
            const $suffixIcon = this.suffixIcon ? getRegisteredSvgIcon(this.suffixIcon) ?? parseSvg(this.suffixIcon) : null;
            this.$layout.classList.toggle('with-suffix', !!$suffixIcon);
            if ($suffixIcon) {
                const $suffix = this.$suffix ?? suffixTemplate();
                $suffix.innerHTML = '';
                $suffix.appendChild($suffixIcon);
                append($suffix, this.$layout);
            }
            else {
                if (this.$suffix) {
                    unmount(this.$suffix);
                }
            }
        }
    };
    return BlControlBox = _classThis;
})();
