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
import '../color/index.js';
import '../select-result/index.js';
import { attr } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { intGetter, intSetter } from '../../common/property.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { popupTemplate, resultTemplate } from './template.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './style.js';
import { BlPopup } from '../popup/index.js';
import { BlColor } from '../color/index.js';
import { Color } from '../color/Color.js';
import { BlControl } from '../base-control/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { PROXY_POPUP_ACCESSORS, PROXY_POPUP_ACCESSORS_KEBAB, PROXY_RESULT_ACCESSORS, PROXY_RESULT_ACCESSORS_KEBAB, } from '../../common/constants.js';
export let BlColorPicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-color-picker',
            styles: [style],
            proxyAccessors: [
                { klass: BlPopup, names: PROXY_POPUP_ACCESSORS },
                { klass: BlSelectResult, names: PROXY_RESULT_ACCESSORS },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _formatString_decorators;
    let _formatString_initializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _open_decorators;
    let _open_initializers = [];
    let _clearable_decorators;
    let _clearable_initializers = [];
    let _$result_decorators;
    let _$result_initializers = [];
    var BlColorPicker = class extends BlControl {
        static {
            _formatString_decorators = [attr('string', { defaults: 'rgba' })];
            _value_decorators = [attr('int', {
                    defaults: Color.RED.value,
                    get(self) {
                        return intGetter('value')(self);
                    },
                    set(self, value) {
                        intSetter('value')(self, value);
                        if (!self.defaultColor) {
                            self.defaultColor = self.value;
                        }
                    },
                })];
            _open_decorators = [attr('boolean')];
            _clearable_decorators = [attr('boolean')];
            _$result_decorators = [shadowRef('bl-select-result')];
            __esDecorate(this, null, _formatString_decorators, { kind: "accessor", name: "formatString", static: false, private: false, access: { has: obj => "formatString" in obj, get: obj => obj.formatString, set: (obj, value) => { obj.formatString = value; } } }, _formatString_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _clearable_decorators, { kind: "accessor", name: "clearable", static: false, private: false, access: { has: obj => "clearable" in obj, get: obj => obj.clearable, set: (obj, value) => { obj.clearable = value; } } }, _clearable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlColorPicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...BlColor.observedAttributes, ...PROXY_POPUP_ACCESSORS_KEBAB, ...PROXY_RESULT_ACCESSORS_KEBAB];
        }
        #formatString_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _formatString_initializers, void 0));
        get formatString() { return this.#formatString_accessor_storage; }
        set formatString(value) { this.#formatString_accessor_storage = value; }
        #value_accessor_storage = __runInitializers(this, _value_initializers, void 0);
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #open_accessor_storage = __runInitializers(this, _open_initializers, void 0);
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #clearable_accessor_storage = __runInitializers(this, _clearable_initializers, void 0);
        get clearable() { return this.#clearable_accessor_storage; }
        set clearable(value) { this.#clearable_accessor_storage = value; }
        #$result_accessor_storage = __runInitializers(this, _$result_initializers, void 0);
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        get $arrowWrapper() {
            return this.$result.$suffix;
        }
        constructor() {
            super();
            this.appendShadowChild(resultTemplate());
            this._disabledFeature.withTarget(() => [this, this.$result]);
            this._tabIndexFeature
                .withTabIndex(0)
                .withDisabledPredicate(() => this.disabled)
                .withTarget(() => [this.$result]);
            this.#setupPopup();
            this.#setupResult();
            this.#setupAria();
            this.defaultColor = this.value;
        }
        get hex() {
            return this.$color.hex;
        }
        set hex(value) {
            this.$color.hex = value;
        }
        get hsl() {
            return this.$color.hsl;
        }
        set hsl(value) {
            this.$color.hsl = value;
        }
        get hsla() {
            return this.$color.hsla;
        }
        set hsla(value) {
            this.$color.hsla = value;
        }
        get hsv() {
            return this.$color.hsv;
        }
        set hsv(value) {
            this.$color.hsv = value;
        }
        get hsva() {
            return this.$color.hsva;
        }
        set hsva(value) {
            this.$color.hsva = value;
        }
        get rgb() {
            return this.$color.rgb;
        }
        set rgb(value) {
            this.$color.rgb = value;
        }
        get rgba() {
            return this.$color.rgba;
        }
        set rgba(value) {
            this.$color.rgba = value;
        }
        format(fmt) {
            return this.$color.format(fmt);
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$color = this.$popup.querySelector('bl-color');
            this.$popup.anchorElement = () => this.$result;
            this.hook.onAttributeChangedDeps(PROXY_POPUP_ACCESSORS_KEBAB, (name, _, newValue) => {
                if (name === 'open') {
                    if (this.open && !document.body.contains(this.$popup)) {
                        document.body.appendChild(this.$popup);
                    }
                    this.$popup.open = this.open;
                }
                else {
                    this.$popup.setAttribute(name, newValue);
                }
            });
            let clear;
            const setupClickOutside = () => {
                if (!clear) {
                    clear = onClickOutside([this, this.$color], () => {
                        if (this.open)
                            this.open = false;
                    });
                }
            };
            const destroyClickOutside = () => {
                if (clear) {
                    clear();
                    clear = undefined;
                }
            };
            const onColorChange = () => {
                this.value = this.$color.value;
                const payload = { detail: this.$color.value };
                dispatchEvent(this, 'bl:color-picker:change', payload);
                dispatchEvent(this, 'change', payload);
            };
            this.hook.onConnected(() => {
                this.$color.addEventListener('bl:color:change', onColorChange);
                this.$popup.addEventListener('opened', setupClickOutside);
                this.$popup.addEventListener('closed', destroyClickOutside);
            });
            this.hook.onDisconnected(() => {
                document.body.removeChild(this.$popup);
                this.$color.removeEventListener('bl:color:change', onColorChange);
                this.$popup.removeEventListener('opened', setupClickOutside);
                this.$popup.removeEventListener('closed', destroyClickOutside);
                destroyClickOutside();
            });
            this.hook.onAttributeChangedDep('value', (name, old, val) => {
                if (old !== val) {
                    this.$color.setAttribute('value', val);
                }
            });
        }
        #setupResult() {
            const update = () => {
                const hsla = this.$color.hsla;
                if (hsla) {
                    this.$result.$layout.style.backgroundColor = `hsla(${hsla[0]},${hsla[1] * 100}%,${hsla[2] * 100}%,${hsla[3]})`;
                    let lightness = hsla[2] * 100;
                    if (hsla[0] > 50 && hsla[0] < 195) {
                        lightness = lightness > 40 ? 0 : 100;
                    }
                    else {
                        lightness = lightness > 50 ? 10 : 90;
                    }
                    this.$result.data = [
                        {
                            value: this.$color.value,
                            label: this.format(this.formatString),
                        },
                    ];
                    const fg = `hsla(${hsla[0]},${50}%,${lightness}%,1)`;
                    this.$result.style.color = fg;
                    this.$arrowWrapper.style.fill = fg;
                    if (this.$result.$clear) {
                        this.$result.$clear.style.setProperty('--fg', fg);
                        this.$result.$clear.style.setProperty('--fg-hover', fg);
                        this.$result.$clear.style.setProperty('--fg-active', fg);
                    }
                }
            };
            this.hook.onRender(update);
            this.hook.onConnected(update);
            this.hook.onAttributeChangedDeps(['value', 'size'], update);
            const onResultTrigger = () => {
                this.open = true;
                this.$color.render();
            };
            this.hook.onConnected(() => {
                this.$result.onfocus = this.$result.onclick = onResultTrigger;
            });
            this.hook.onDisconnected(() => {
                this.$result.onfocus = this.$result.onclick = null;
            });
            const renderDropdownArrow = () => {
                this.$result.classList.toggle('dropdown', this.open);
            };
            this.hook.onConnected(renderDropdownArrow);
            this.hook.onDisconnected(renderDropdownArrow);
            this.hook.onAttributeChangedDep('open', renderDropdownArrow);
            this.hook.onAttributeChangedDeps(PROXY_RESULT_ACCESSORS_KEBAB, (name, _, newValue) => {
                this.$result.setAttribute(name, newValue);
            });
            const onClear = () => {
                if (this.defaultColor) {
                    this.value = this.defaultColor;
                }
                dispatchEvent(this, 'select-result:clear');
            };
            this.hook.onConnected(() => {
                this.addEventListener('click-clear', onClear);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('click-clear', onClear);
            });
        }
        #setupAria() {
            this.hook.onConnected(() => {
                this.setAttribute('aria-haspopup', 'true');
            });
        }
    };
    return BlColorPicker = _classThis;
})();
