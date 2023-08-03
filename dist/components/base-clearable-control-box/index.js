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
import '../close-button/index.js';
import { attr } from '../../decorators/attr/index.js';
import { clearTemplate } from './template.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './style.js';
import { unmount } from '../../common/mount.js';
import { BlControlBox } from '../base-control-box/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
export let BlClearableControlBox = (() => {
    let _classDecorators = [defineClass({
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _clearable_decorators;
    let _clearable_initializers = [];
    let _$clear_decorators;
    let _$clear_initializers = [];
    var BlClearableControlBox = class extends BlControlBox {
        static {
            _clearable_decorators = [attr('boolean')];
            _$clear_decorators = [shadowRef('[part="clear"]', false)];
            __esDecorate(this, null, _clearable_decorators, { kind: "accessor", name: "clearable", static: false, private: false, access: { has: obj => "clearable" in obj, get: obj => obj.clearable, set: (obj, value) => { obj.clearable = value; } } }, _clearable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$clear_decorators, { kind: "accessor", name: "$clear", static: false, private: false, access: { has: obj => "$clear" in obj, get: obj => obj.$clear, set: (obj, value) => { obj.$clear = value; } } }, _$clear_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlClearableControlBox = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #clearable_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _clearable_initializers, void 0));
        get clearable() { return this.#clearable_accessor_storage; }
        set clearable(value) { this.#clearable_accessor_storage = value; }
        #$clear_accessor_storage = __runInitializers(this, _$clear_initializers, void 0);
        get $clear() { return this.#$clear_accessor_storage; }
        set $clear(value) { this.#$clear_accessor_storage = value; }
        constructor() {
            super();
            this.#setupClearableFeature();
            this._disabledFeature.withTarget(() => [this, this.$clear]);
        }
        _emptyFeature = SetupEmpty.setup({
            component: this,
            predicate() {
                return true;
            },
            target() {
                return this.$layout;
            },
            init() {
                const render = () => {
                    queueMicrotask(() => {
                        this._emptyFeature.update();
                    });
                };
                this.hook.onConnected(() => {
                    this.addEventListener('click-clear', render);
                });
                this.hook.onDisconnected(() => {
                    this.removeEventListener('click-clear', render);
                });
            },
        });
        #setupClearableFeature() {
            const render = () => {
                this.$layout.classList.toggle('with-clear', this.clearable);
                if (this.clearable) {
                    if (!this.$clear) {
                        const onClickClear = (e) => {
                            const target = e.target;
                            if (this.$clear && this.$clear.contains(target)) {
                                dispatchEvent(this, e.type === 'mousedown' ? 'mousedown-clear' : 'click-clear');
                                return;
                            }
                        };
                        const $clearButton = clearTemplate();
                        $clearButton.addEventListener('mousedown', onClickClear);
                        $clearButton.addEventListener('click', onClickClear);
                        this.$layout.append($clearButton);
                    }
                }
                else {
                    if (this.$clear) {
                        unmount(this.$clear);
                    }
                }
            };
            this.hook.onRender(render);
            this.hook.onConnected(render);
            this.hook.onAttributeChangedDep('clearable', render);
        }
        appendContent($el) {
            const $last = this.$suffix ?? this.$clear;
            if ($last) {
                this.$layout.insertBefore($el, $last);
            }
            else {
                this.$layout.appendChild($el);
            }
            return $el;
        }
        _renderSuffixIcon() {
            super._renderSuffixIcon();
            if (this.$clear) {
                this.$layout.appendChild(this.$clear);
            }
        }
    };
    return BlClearableControlBox = _classThis;
})();
