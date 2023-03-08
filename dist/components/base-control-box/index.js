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
import { style } from './style.js';
import { dispatchEvent } from '../../common/event.js';
import { Control } from '../base-control/index.js';
import { loadingTemplate, prefixTemplate, suffixTemplate } from './template.js';
import { append, mountAfter, mountBefore, prepend, unmount, } from '../../common/mount.js';
import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js';
export let ControlBox = (() => {
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
    var ControlBox = class extends Control {
        static {
            _loading_decorators = [attr('boolean')];
            _prefixIcon_decorators = [attr('string')];
            _suffixIcon_decorators = [attr('string')];
            __esDecorate(this, null, _loading_decorators, { kind: "accessor", name: "loading", static: false, private: false, access: { has: obj => "loading" in obj, get: obj => obj.loading, set: (obj, value) => { obj.loading = value; } } }, _loading_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _prefixIcon_decorators, { kind: "accessor", name: "prefixIcon", static: false, private: false, access: { has: obj => "prefixIcon" in obj, get: obj => obj.prefixIcon, set: (obj, value) => { obj.prefixIcon = value; } } }, _prefixIcon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _suffixIcon_decorators, { kind: "accessor", name: "suffixIcon", static: false, private: false, access: { has: obj => "suffixIcon" in obj, get: obj => obj.suffixIcon, set: (obj, value) => { obj.suffixIcon = value; } } }, _suffixIcon_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            ControlBox = _classThis = _classDescriptor.value;
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
        constructor() {
            super();
            this._ref.$layout.addEventListener('click', e => {
                const target = e.target;
                if (this._ref.$prefix && this._ref.$prefix.contains(target)) {
                    dispatchEvent(this, 'click-prefix-icon');
                    return;
                }
                if (this._ref.$suffix && this._ref.$suffix.contains(target)) {
                    dispatchEvent(this, 'click-suffix-icon');
                    return;
                }
            });
        }
        _appendContent($el) {
            const $suffix = this._ref.$suffix;
            if ($suffix) {
                mountBefore($el, $suffix);
            }
            else {
                append($el, this._ref.$layout);
            }
            return $el;
        }
        _renderLoading() {
            this._ref.$layout.classList.toggle('with-loading', this.loading);
            if (this.loading) {
                if (!this._ref.$loading) {
                    const $loading = (this._ref.$loading = loadingTemplate());
                    $loading.appendChild(getRegisteredSvgIcon('loading'));
                    prepend($loading, this._ref.$layout);
                }
            }
            else {
                if (this._ref.$loading) {
                    unmount(this._ref.$loading);
                    this._ref.$loading = undefined;
                }
            }
        }
        _renderPrefixIcon() {
            const $prefixIcon = this.prefixIcon
                ? getRegisteredSvgIcon(this.prefixIcon) ?? parseSvg(this.prefixIcon)
                : null;
            this._ref.$layout.classList.toggle('with-prefix', !!$prefixIcon);
            if ($prefixIcon) {
                const $prefix = (this._ref.$prefix =
                    this._ref.$prefix ?? prefixTemplate());
                $prefix.innerHTML = '';
                $prefix.appendChild($prefixIcon);
                if (this._ref.$loading) {
                    mountAfter($prefix, this._ref.$loading);
                }
                else {
                    prepend($prefix, this._ref.$layout);
                }
            }
            else {
                if (this._ref.$prefix) {
                    unmount(this._ref.$prefix);
                    this._ref.$prefix = undefined;
                }
            }
        }
        _renderSuffixIcon() {
            const $suffixIcon = this.suffixIcon
                ? getRegisteredSvgIcon(this.suffixIcon) ?? parseSvg(this.suffixIcon)
                : null;
            this._ref.$layout.classList.toggle('with-suffix', !!$suffixIcon);
            if ($suffixIcon) {
                const $suffix = (this._ref.$suffix =
                    this._ref.$suffix ?? suffixTemplate());
                $suffix.innerHTML = '';
                $suffix.appendChild($suffixIcon);
                append($suffix, this._ref.$layout);
            }
            else {
                if (this._ref.$suffix) {
                    unmount(this._ref.$suffix);
                    this._ref.$suffix = undefined;
                }
            }
        }
        render() {
            super.render();
            this._renderDisabled();
            this._renderPrefixIcon();
            this._renderSuffixIcon();
            this._renderLoading();
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            switch (attrName) {
                case 'disabled': {
                    this._renderDisabled();
                    break;
                }
                case 'loading': {
                    this._renderLoading();
                    break;
                }
                case 'prefix-icon': {
                    this._renderPrefixIcon();
                    break;
                }
                case 'suffix-icon': {
                    this._renderSuffixIcon();
                    break;
                }
                default: {
                    break;
                }
            }
        }
    };
    return ControlBox = _classThis;
})();
