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
import '../icon/index.js';
import '../input/index.js';
import { attr } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { resultTemplate, popupTemplate } from './template.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { style } from './style.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksColor } from '../color/index.js';
import { Color } from '../color/Color.js';
import { Control } from '../base-control/index.js';
export let BlocksColorPicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-color-picker',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _open_decorators;
    let _open_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$icon_decorators;
    let _$icon_initializers = [];
    var BlocksColorPicker = class extends Control {
        static {
            _value_decorators = [attr('int', { defaults: Color.RED.value })];
            _open_decorators = [attr('boolean')];
            _$layout_decorators = [shadowRef('#layout')];
            _$icon_decorators = [shadowRef('#layout bl-icon')];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$icon_decorators, { kind: "accessor", name: "$icon", static: false, private: false, access: { has: obj => "$icon" in obj, get: obj => obj.$icon, set: (obj, value) => { obj.$icon = value; } } }, _$icon_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksColorPicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...BlocksColor.observedAttributes, ...BlocksPopup.observedAttributes];
        }
        static get disableEventTypes() {
            return ['click'];
        }
        #value_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _value_initializers, void 0));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #open_accessor_storage = __runInitializers(this, _open_initializers, void 0);
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$icon_accessor_storage = __runInitializers(this, _$icon_initializers, void 0);
        get $icon() { return this.#$icon_accessor_storage; }
        set $icon(value) { this.#$icon_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(resultTemplate());
            this._tabIndexFeature.withTabIndex(0);
            this.#setupPopup();
            this.#setupResult();
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
        render() {
            super.render();
            const hsla = this.$color.hsla;
            if (hsla) {
                this.$layout.style.backgroundColor = `hsla(${hsla[0]},${hsla[1] * 100}%,${hsla[2] * 100}%,${hsla[3]})`;
                let lightness = hsla[2] * 100;
                if (hsla[0] > 50 && hsla[0] < 195) {
                    lightness = lightness > 40 ? 0 : 100;
                }
                else {
                    lightness = lightness > 50 ? 10 : 90;
                }
                ;
                this.$icon.fill = `hsla(${hsla[0]},${50}%,${lightness}%,1)`;
            }
        }
        format(fmt) {
            return this.$color.format(fmt);
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$color = this.$popup.querySelector('bl-color');
            this.$popup.anchorElement = () => this.$layout;
            this.onAttributeChangedDeps(BlocksPopup.observedAttributes, (name, _, newValue) => {
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
                this.render();
                const payload = { detail: this.$color.value };
                dispatchEvent(this, 'bl:color-picker:change', payload);
                dispatchEvent(this, 'change', payload);
            };
            this.onConnected(() => {
                this.$color.addEventListener('bl:color:change', onColorChange);
                this.$popup.addEventListener('opened', setupClickOutside);
                this.$popup.addEventListener('closed', destroyClickOutside);
            });
            this.onDisconnected(() => {
                document.body.removeChild(this.$popup);
                this.$color.removeEventListener('bl:color:change', onColorChange);
                this.$popup.removeEventListener('opened', setupClickOutside);
                this.$popup.removeEventListener('closed', destroyClickOutside);
                destroyClickOutside();
            });
            this.onAttributeChangedDep('value', (name, old, val) => {
                if (old !== val) {
                    this.$color.setAttribute('value', val);
                }
            });
            this.onConnected(this.render);
            this.onAttributeChanged(this.render);
        }
        #setupResult() {
            const onResultTrigger = () => {
                this.open = true;
                this.$color.render();
            };
            this.onConnected(() => {
                this.$layout.onfocus = this.$layout.onclick = onResultTrigger;
            });
            this.onDisconnected(() => {
                this.$layout.onfocus = this.$layout.onclick = null;
            });
            const renderDropdownArrow = () => {
                this.$layout.classList.toggle('dropdown', this.open);
            };
            this.onConnected(renderDropdownArrow);
            this.onDisconnected(renderDropdownArrow);
            this.onAttributeChangedDep('open', renderDropdownArrow);
        }
    };
    return BlocksColorPicker = _classThis;
})();
