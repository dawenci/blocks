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
import { ControlBox } from '../base-control-box/index.js';
import { clearTemplate, styleTemplate } from './template.js';
import { dispatchEvent } from '../../common/event.js';
import { unmount } from '../../common/mount.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
export let ClearableControlBox = (() => {
    let _classDecorators = [defineClass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _clearable_decorators;
    let _clearable_initializers = [];
    var ClearableControlBox = class extends ControlBox {
        static {
            _clearable_decorators = [attr('boolean')];
            __esDecorate(this, null, _clearable_decorators, { kind: "accessor", name: "clearable", static: false, private: false, access: { has: obj => "clearable" in obj, get: obj => obj.clearable, set: (obj, value) => { obj.clearable = value; } } }, _clearable_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            ClearableControlBox = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #clearable_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _clearable_initializers, void 0));
        get clearable() { return this.#clearable_accessor_storage; }
        set clearable(value) { this.#clearable_accessor_storage = value; }
        constructor() {
            super();
            this._appendStyle(styleTemplate());
            this._ref.$layout.addEventListener('click', e => {
                const target = e.target;
                if (this._ref.$clear && this._ref.$clear.contains(target)) {
                    dispatchEvent(this, 'click-clear');
                    this._renderEmpty();
                    return;
                }
            });
        }
        _isEmpty() {
            return true;
        }
        _appendContent($el) {
            const $target = this._ref.$suffix ?? this._ref.$clear;
            if ($target) {
                this._ref.$layout.insertBefore($el, $target);
            }
            else {
                this._ref.$layout.appendChild($el);
            }
            return $el;
        }
        _renderSuffixIcon() {
            super._renderSuffixIcon();
            if (this._ref.$clear) {
                this._ref.$layout.appendChild(this._ref.$clear);
            }
        }
        _renderEmpty() {
            this._ref.$layout.classList.toggle('empty', this._isEmpty());
        }
        _renderClearable() {
            this._ref.$layout.classList.toggle('with-clear', this.clearable);
            if (this.clearable) {
                if (!this._ref.$clear) {
                    const $clearButton = (this._ref.$clear = clearTemplate());
                    this._ref.$layout.append($clearButton);
                }
            }
            else {
                if (this._ref.$clear) {
                    unmount(this._ref.$clear);
                    this._ref.$clear = undefined;
                }
            }
        }
        render() {
            super.render();
            this._renderEmpty();
            this._renderClearable();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'clearable') {
                this._renderClearable();
            }
        }
    };
    return ClearableControlBox = _classThis;
})();
