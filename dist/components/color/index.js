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
import { attr } from '../../decorators/attr.js';
import { onDragMove } from '../../common/onDragMove.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { round } from '../../common/utils.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { style } from './style.js';
import { template } from './template.js';
import { Color } from './Color.js';
import { Component } from '../component/Component.js';
import { reactive, subscribe, unsubscribe } from '../../common/reactive.js';
const POINT_SIZE = 12;
export let BlocksColor = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-color',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$hsv_decorators;
    let _$hsv_initializers = [];
    let _$result_decorators;
    let _$result_initializers = [];
    let _$hueBar_decorators;
    let _$hueBar_initializers = [];
    let _$alphaBar_decorators;
    let _$alphaBar_initializers = [];
    let _$hsvHue_decorators;
    let _$hsvHue_initializers = [];
    let _$hsvButton_decorators;
    let _$hsvButton_initializers = [];
    let _$hueButton_decorators;
    let _$hueButton_initializers = [];
    let _$alphaButton_decorators;
    let _$alphaButton_initializers = [];
    let _$alphaBarBg_decorators;
    let _$alphaBarBg_initializers = [];
    let _$resultBg_decorators;
    let _$resultBg_initializers = [];
    let _$modeContent_decorators;
    let _$modeContent_initializers = [];
    let _$modeSwitch_decorators;
    let _$modeSwitch_initializers = [];
    var BlocksColor = class extends Component {
        static {
            _value_decorators = [attr('int', { defaults: Color.RED.value })];
            _mode_decorators = [attr('enum', { enumValues: ['hex', 'rgb', 'hsl', 'hsv'] })];
            _$layout_decorators = [shadowRef('#layout')];
            _$hsv_decorators = [shadowRef('#hsv-picker')];
            _$result_decorators = [shadowRef('#result')];
            _$hueBar_decorators = [shadowRef('#hue-bar')];
            _$alphaBar_decorators = [shadowRef('#alpha-bar')];
            _$hsvHue_decorators = [shadowRef('#hsv-picker .hue')];
            _$hsvButton_decorators = [shadowRef('#hsv-picker button')];
            _$hueButton_decorators = [shadowRef('#hue-bar button')];
            _$alphaButton_decorators = [shadowRef('#alpha-bar button')];
            _$alphaBarBg_decorators = [shadowRef('#alpha-bar .bg')];
            _$resultBg_decorators = [shadowRef('#result .bg')];
            _$modeContent_decorators = [shadowRef('#mode-content')];
            _$modeSwitch_decorators = [shadowRef('#mode-switch')];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _mode_decorators, { kind: "accessor", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } } }, _mode_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$hsv_decorators, { kind: "accessor", name: "$hsv", static: false, private: false, access: { has: obj => "$hsv" in obj, get: obj => obj.$hsv, set: (obj, value) => { obj.$hsv = value; } } }, _$hsv_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$hueBar_decorators, { kind: "accessor", name: "$hueBar", static: false, private: false, access: { has: obj => "$hueBar" in obj, get: obj => obj.$hueBar, set: (obj, value) => { obj.$hueBar = value; } } }, _$hueBar_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$alphaBar_decorators, { kind: "accessor", name: "$alphaBar", static: false, private: false, access: { has: obj => "$alphaBar" in obj, get: obj => obj.$alphaBar, set: (obj, value) => { obj.$alphaBar = value; } } }, _$alphaBar_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$hsvHue_decorators, { kind: "accessor", name: "$hsvHue", static: false, private: false, access: { has: obj => "$hsvHue" in obj, get: obj => obj.$hsvHue, set: (obj, value) => { obj.$hsvHue = value; } } }, _$hsvHue_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$hsvButton_decorators, { kind: "accessor", name: "$hsvButton", static: false, private: false, access: { has: obj => "$hsvButton" in obj, get: obj => obj.$hsvButton, set: (obj, value) => { obj.$hsvButton = value; } } }, _$hsvButton_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$hueButton_decorators, { kind: "accessor", name: "$hueButton", static: false, private: false, access: { has: obj => "$hueButton" in obj, get: obj => obj.$hueButton, set: (obj, value) => { obj.$hueButton = value; } } }, _$hueButton_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$alphaButton_decorators, { kind: "accessor", name: "$alphaButton", static: false, private: false, access: { has: obj => "$alphaButton" in obj, get: obj => obj.$alphaButton, set: (obj, value) => { obj.$alphaButton = value; } } }, _$alphaButton_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$alphaBarBg_decorators, { kind: "accessor", name: "$alphaBarBg", static: false, private: false, access: { has: obj => "$alphaBarBg" in obj, get: obj => obj.$alphaBarBg, set: (obj, value) => { obj.$alphaBarBg = value; } } }, _$alphaBarBg_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$resultBg_decorators, { kind: "accessor", name: "$resultBg", static: false, private: false, access: { has: obj => "$resultBg" in obj, get: obj => obj.$resultBg, set: (obj, value) => { obj.$resultBg = value; } } }, _$resultBg_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$modeContent_decorators, { kind: "accessor", name: "$modeContent", static: false, private: false, access: { has: obj => "$modeContent" in obj, get: obj => obj.$modeContent, set: (obj, value) => { obj.$modeContent = value; } } }, _$modeContent_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$modeSwitch_decorators, { kind: "accessor", name: "$modeSwitch", static: false, private: false, access: { has: obj => "$modeSwitch" in obj, get: obj => obj.$modeSwitch, set: (obj, value) => { obj.$modeSwitch = value; } } }, _$modeSwitch_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksColor = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #value_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _value_initializers, void 0));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #mode_accessor_storage = __runInitializers(this, _mode_initializers, 'hex');
        get mode() { return this.#mode_accessor_storage; }
        set mode(value) { this.#mode_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$hsv_accessor_storage = __runInitializers(this, _$hsv_initializers, void 0);
        get $hsv() { return this.#$hsv_accessor_storage; }
        set $hsv(value) { this.#$hsv_accessor_storage = value; }
        #$result_accessor_storage = __runInitializers(this, _$result_initializers, void 0);
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        #$hueBar_accessor_storage = __runInitializers(this, _$hueBar_initializers, void 0);
        get $hueBar() { return this.#$hueBar_accessor_storage; }
        set $hueBar(value) { this.#$hueBar_accessor_storage = value; }
        #$alphaBar_accessor_storage = __runInitializers(this, _$alphaBar_initializers, void 0);
        get $alphaBar() { return this.#$alphaBar_accessor_storage; }
        set $alphaBar(value) { this.#$alphaBar_accessor_storage = value; }
        #$hsvHue_accessor_storage = __runInitializers(this, _$hsvHue_initializers, void 0);
        get $hsvHue() { return this.#$hsvHue_accessor_storage; }
        set $hsvHue(value) { this.#$hsvHue_accessor_storage = value; }
        #$hsvButton_accessor_storage = __runInitializers(this, _$hsvButton_initializers, void 0);
        get $hsvButton() { return this.#$hsvButton_accessor_storage; }
        set $hsvButton(value) { this.#$hsvButton_accessor_storage = value; }
        #$hueButton_accessor_storage = __runInitializers(this, _$hueButton_initializers, void 0);
        get $hueButton() { return this.#$hueButton_accessor_storage; }
        set $hueButton(value) { this.#$hueButton_accessor_storage = value; }
        #$alphaButton_accessor_storage = __runInitializers(this, _$alphaButton_initializers, void 0);
        get $alphaButton() { return this.#$alphaButton_accessor_storage; }
        set $alphaButton(value) { this.#$alphaButton_accessor_storage = value; }
        #$alphaBarBg_accessor_storage = __runInitializers(this, _$alphaBarBg_initializers, void 0);
        get $alphaBarBg() { return this.#$alphaBarBg_accessor_storage; }
        set $alphaBarBg(value) { this.#$alphaBarBg_accessor_storage = value; }
        #$resultBg_accessor_storage = __runInitializers(this, _$resultBg_initializers, void 0);
        get $resultBg() { return this.#$resultBg_accessor_storage; }
        set $resultBg(value) { this.#$resultBg_accessor_storage = value; }
        #$modeContent_accessor_storage = __runInitializers(this, _$modeContent_initializers, void 0);
        get $modeContent() { return this.#$modeContent_accessor_storage; }
        set $modeContent(value) { this.#$modeContent_accessor_storage = value; }
        #$modeSwitch_accessor_storage = __runInitializers(this, _$modeSwitch_initializers, void 0);
        get $modeSwitch() { return this.#$modeSwitch_accessor_storage; }
        set $modeSwitch(value) { this.#$modeSwitch_accessor_storage = value; }
        #h;
        #s;
        #v;
        #alpha;
        constructor() {
            super();
            this.appendShadowChild(template());
            const initColor = new Color(this.value);
            const initHsv = initColor.toHsv();
            this.#h = reactive(initHsv[0]);
            this.#s = reactive(initHsv[1]);
            this.#v = reactive(initHsv[2]);
            this.#alpha = reactive(initColor.alpha);
            this.#setupBg();
            this.#setupControls();
            this.#setupInputs();
            this.#setupInputEvents();
            this.#setupValueAttr();
        }
        #dragging = false;
        #preventRenderControlByDataChange = false;
        #preventRenderInputByDataChange = false;
        get color() {
            return Color.fromHsv(this.#h.content, this.#s.content, this.#v.content, this.#alpha.content);
        }
        get hex() {
            return this.color.toString('hex');
        }
        set hex(value) {
            this.setColor(Color.fromHex(value));
        }
        get rgb() {
            return this.color.toRgb();
        }
        set rgb([r, g, b]) {
            this.setColor(Color.fromRgb(r, g, b, this.#alpha.content));
        }
        get rgba() {
            return this.color.toRgba();
        }
        set rgba([r, g, b, a]) {
            this.setColor(Color.fromRgb(r, g, b, a));
        }
        get hsl() {
            return this.color.toHsl();
        }
        set hsl([hl, sl, l]) {
            this.setColor(Color.fromHsl(hl, sl, l, this.#alpha.content));
        }
        get hsla() {
            return this.color.toHsla();
        }
        set hsla([hl, sl, l, a]) {
            this.setColor(Color.fromHsl(hl, sl, l, a));
        }
        get hsv() {
            return [this.#h.content, this.#s.content, this.#v.content];
        }
        set hsv([h, s, v]) {
            this.setColor(Color.fromHsv(h, s, v, this.#alpha.content));
        }
        get hsva() {
            return [this.#h.content, this.#s.content, this.#v.content, this.#alpha.content];
        }
        set hsva([h, s, v, a]) {
            this.setColor(Color.fromHsv(h, s, v, a));
        }
        setColor(color) {
            const [hue, saturation, value] = color.toHsv();
            const alpha = color.alpha;
            let shouldRender = false;
            if (saturation === 0) {
                shouldRender = true;
                this.#h.content = this.#calcHueByControlPoint();
            }
            if (this.#h.content === hue &&
                this.#s.content == saturation &&
                this.#v.content === value &&
                this.#alpha.content === alpha) {
                if (shouldRender) {
                    this.render();
                    return true;
                }
                return false;
            }
            this.#h.content = hue;
            this.#s.content = saturation;
            this.#v.content = value;
            this.#alpha.content = alpha;
            const payload = { detail: { value: this.value } };
            dispatchEvent(this, 'bl:color:change', payload);
            dispatchEvent(this, 'change', payload);
            this.render();
            return true;
        }
        format(fmt) {
            return this.color.toString(fmt);
        }
        #setupControls() {
            const renderHue = () => {
                if (this.#preventRenderControlByDataChange)
                    return;
                const hueBarWidth = this.$hueBar.clientWidth - POINT_SIZE;
                const hueX = (this.#h.content / 360) * hueBarWidth;
                this.$hueButton.style.left = hueX + 'px';
            };
            const renderSaturation = () => {
                if (this.#preventRenderControlByDataChange)
                    return;
                const width = this.$hsv.clientWidth - POINT_SIZE;
                const x = this.#s.content * width;
                this.$hsvButton.style.left = x + 'px';
            };
            const renderValue = () => {
                if (this.#preventRenderControlByDataChange)
                    return;
                const height = this.$hsv.clientHeight - POINT_SIZE;
                const y = height - this.#v.content * height;
                this.$hsvButton.style.top = y + 'px';
            };
            const renderAlpha = () => {
                if (this.#preventRenderControlByDataChange)
                    return;
                const alphaBarWidth = this.$alphaBar.clientWidth - POINT_SIZE;
                const alphaX = this.#alpha.content * alphaBarWidth;
                this.$alphaButton.style.left = alphaX + 'px';
            };
            this.onConnected(() => {
                subscribe(this.#h, renderHue);
                subscribe(this.#s, renderSaturation);
                subscribe(this.#v, renderValue);
                subscribe(this.#alpha, renderAlpha);
            });
            this.onDisconnected(() => {
                unsubscribe(this.#h, renderHue);
                unsubscribe(this.#s, renderSaturation);
                unsubscribe(this.#v, renderValue);
                unsubscribe(this.#alpha, renderAlpha);
            });
            const render = () => {
                renderHue();
                renderSaturation();
                renderValue();
                renderAlpha();
            };
            this.onRender(render);
            this.onConnected(render);
            let clear;
            this.onConnected(() => {
                clear = sizeObserve(this.$layout, render);
            });
            this.onDisconnected(() => {
                if (clear)
                    clear();
            });
            const updateState = () => {
                const hue = this.#calcHueByControlPoint();
                const saturation = this.#calcSaturationByControlPoint();
                const value = this.#calcValueByControlPoint();
                const alpha = this.#calcAlphaByControlPoint();
                return this.setColor(Color.fromHsv(hue, saturation, value, alpha));
            };
            const update = () => {
                this.#preventRenderControlByDataChange = true;
                updateState();
                this.#preventRenderControlByDataChange = false;
            };
            this.#dragging = false;
            this.#preventRenderControlByDataChange = false;
            let $activePoint = null;
            let wrapWidth = null;
            let wrapHeight = null;
            let positionStart = null;
            const onStart = ({ start, $target }) => {
                this.#dragging = true;
                const $wrap = [this.$hueBar, this.$alphaBar, this.$hsv].find($wrap => $wrap.contains($target));
                $activePoint = $wrap.querySelector('button');
                const rect = $wrap.getBoundingClientRect();
                wrapWidth = rect.width;
                wrapHeight = rect.height;
                let x = start.clientX - rect.x - 6;
                let y = start.clientY - rect.y - 6;
                if (x < 0)
                    x = 0;
                if (y < 0)
                    y = 0;
                if (x > wrapWidth - POINT_SIZE)
                    x = wrapWidth - POINT_SIZE;
                if (y > wrapHeight - POINT_SIZE)
                    y = wrapHeight - POINT_SIZE;
                positionStart = { x, y };
                $activePoint.style.left = x + 'px';
                $activePoint.style.top = y + 'px';
                update();
            };
            const onMove = ({ offset, preventDefault }) => {
                preventDefault();
                let x = positionStart.x + offset.x;
                let y = positionStart.y + offset.y;
                if (x < 0)
                    x = 0;
                if (y < 0)
                    y = 0;
                if (x > wrapWidth - POINT_SIZE)
                    x = wrapWidth - POINT_SIZE;
                if (y > wrapHeight - POINT_SIZE)
                    y = wrapHeight - POINT_SIZE;
                $activePoint.style.left = x + 'px';
                $activePoint.style.top = y + 'px';
                update();
            };
            const onEnd = () => {
                update();
                positionStart = null;
                wrapWidth = null;
                wrapHeight = null;
                this.#dragging = false;
            };
            const options = {
                onStart,
                onMove,
                onEnd,
            };
            onDragMove(this.$hueBar, options);
            onDragMove(this.$alphaBar, options);
            onDragMove(this.$hsv, options);
        }
        #setupBg() {
            const renderHsvBg = () => {
                const h = this.#h.content;
                const bgColor = `hsl(${h}, 100%, 50%)`;
                const bgImage = `linear-gradient(to right, transparent, ${bgColor})`;
                this.$hsvHue.style.backgroundColor = bgColor;
                this.$alphaBarBg.style.backgroundImage = bgImage;
            };
            const renderResultBg = () => {
                const h = this.#h.content;
                const [, s, l, a] = this.hsla;
                this.$resultBg.style.backgroundColor = `hsla(${h},${s * 100}%,${l * 100}%,${a})`;
            };
            this.onConnected(() => {
                subscribe(this.#h, renderHsvBg);
                subscribe(this.#h, renderResultBg);
                subscribe(this.#s, renderResultBg);
                subscribe(this.#v, renderResultBg);
                subscribe(this.#alpha, renderResultBg);
            });
            this.onDisconnected(() => {
                unsubscribe(this.#h, renderHsvBg);
                unsubscribe(this.#h, renderResultBg);
                unsubscribe(this.#s, renderResultBg);
                unsubscribe(this.#v, renderResultBg);
                unsubscribe(this.#alpha, renderResultBg);
            });
            const render = () => {
                renderHsvBg();
                renderResultBg();
            };
            this.onRender(render);
            this.onConnected(render);
        }
        #setupInputs() {
            const renderHex = () => {
                if (this.#preventRenderInputByDataChange)
                    return;
                const children = Array.prototype.slice.call(this.$modeContent.children);
                const spans = children.map($el => $el.querySelector('span'));
                children.forEach(($el, index) => ($el.style.display = index === 0 ? '' : 'none'));
                children[0].querySelector('input').value = this.hex;
                spans[0].textContent = 'HEX';
            };
            const renderRgb = () => {
                if (this.#preventRenderInputByDataChange)
                    return;
                const children = Array.prototype.slice.call(this.$modeContent.children);
                const inputs = children.map($el => $el.querySelector('input'));
                const spans = children.map($el => $el.querySelector('span'));
                const rgba = this.rgba;
                children.forEach($el => ($el.style.display = ''));
                inputs[0].value = rgba[0];
                inputs[1].value = rgba[1];
                inputs[2].value = rgba[2];
                inputs[3].value = round(this.#alpha.content, 2);
                spans[0].textContent = 'R';
                spans[1].textContent = 'G';
                spans[2].textContent = 'B';
                spans[3].textContent = 'A';
            };
            const renderHsv = () => {
                if (this.#preventRenderInputByDataChange)
                    return;
                const children = Array.prototype.slice.call(this.$modeContent.children);
                const inputs = children.map($el => $el.querySelector('input'));
                const spans = children.map($el => $el.querySelector('span'));
                const hsv = this.hsv;
                children.forEach($el => ($el.style.display = ''));
                inputs[0].value = Math.round(hsv[0] % 360);
                inputs[1].value = Math.round(hsv[1] * 100) + '%';
                inputs[2].value = Math.round(hsv[2] * 100) + '%';
                inputs[3].value = round(this.#alpha.content, 2);
                spans[0].textContent = 'H';
                spans[1].textContent = 'S';
                spans[2].textContent = 'V';
                spans[3].textContent = 'A';
            };
            const renderHsl = () => {
                if (this.#preventRenderInputByDataChange)
                    return;
                const children = Array.prototype.slice.call(this.$modeContent.children);
                const inputs = children.map($el => $el.querySelector('input'));
                const spans = children.map($el => $el.querySelector('span'));
                const hsla = this.hsla;
                children.forEach($el => ($el.style.display = ''));
                inputs[0].value = Math.round(hsla[0] % 360);
                inputs[1].value = Math.round(hsla[1] * 100) + '%';
                inputs[2].value = Math.round(hsla[2] * 100) + '%';
                inputs[3].value = round(this.#alpha.content, 2);
                spans[0].textContent = 'H';
                spans[1].textContent = 'S';
                spans[2].textContent = 'L';
                spans[3].textContent = 'A';
            };
            const render = () => {
                switch (this.mode) {
                    case 'hex':
                        return renderHex();
                    case 'rgb':
                        return renderRgb();
                    case 'hsv':
                        return renderHsv();
                    case 'hsl':
                        return renderHsl();
                }
            };
            this.onConnected(() => {
                subscribe(this.#h, render);
                subscribe(this.#s, render);
                subscribe(this.#v, render);
                subscribe(this.#alpha, render);
            });
            this.onDisconnected(() => {
                unsubscribe(this.#h, render);
                unsubscribe(this.#s, render);
                unsubscribe(this.#v, render);
                unsubscribe(this.#alpha, render);
            });
            this.onRender(render);
            this.onConnected(render);
            const onClick = () => {
                const modes = ['hex', 'rgb', 'hsl', 'hsv'];
                const mode = modes[(modes.indexOf(this.mode) + 1) % 4];
                this.mode = mode;
            };
            this.onConnected(() => {
                this.$modeSwitch.onclick = onClick;
            });
            this.onDisconnected(() => {
                this.$modeSwitch.onclick = null;
            });
            this.onAttributeChangedDep('mode', render);
        }
        #setupInputEvents() {
            const onHexChange = () => {
                const $input = this.$modeContent.querySelector('input');
                const value = $input.value || '';
                if (/^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) {
                    this.#preventRenderInputByDataChange = true;
                    this.value = Color.fromHex(value).value;
                    console.log(Color.fromHex(value).toString('hex'));
                    this.#preventRenderInputByDataChange = false;
                }
            };
            const onRgbChange = () => {
                const values = Array.prototype.map.call(this.$modeContent.querySelectorAll('input'), $input => Number($input.value));
                if (values.every(n => n >= 0 && n <= 255)) {
                    this.#preventRenderInputByDataChange = true;
                    this.rgba = values;
                    this.#preventRenderInputByDataChange = false;
                }
            };
            const onHsvChange = () => {
                const values = Array.prototype.map.call(this.$modeContent.querySelectorAll('input'), $input => parseFloat($input.value));
                if (values[0] < 0 || values[0] > 360)
                    return;
                if (values[1] < 0 || values[1] > 100)
                    return;
                if (values[2] < 0 || values[2] > 100)
                    return;
                if (values[3] < 0 || values[3] > 1)
                    return;
                this.#preventRenderInputByDataChange = true;
                this.hsva = [values[0], values[1] / 100, values[2] / 100, values[3]];
                this.#preventRenderInputByDataChange = false;
            };
            const onHslChange = () => {
                const values = Array.prototype.map.call(this.$modeContent.querySelectorAll('input'), $input => parseFloat($input.value));
                if (values[0] < 0 || values[0] > 360)
                    return;
                if (values[1] < 0 || values[1] > 100)
                    return;
                if (values[2] < 0 || values[2] > 100)
                    return;
                if (values[3] < 0 || values[3] > 1)
                    return;
                this.#preventRenderInputByDataChange = true;
                this.hsla = [values[0], values[1] / 100, values[2] / 100, values[3]];
                this.#preventRenderInputByDataChange = false;
            };
            const onChange = () => {
                switch (this.mode) {
                    case 'hex':
                        onHexChange();
                        return;
                    case 'rgb':
                        onRgbChange();
                        return;
                    case 'hsv':
                        onHsvChange();
                        return;
                    case 'hsl':
                        onHslChange();
                        return;
                }
            };
            this.onConnected(() => {
                this.$modeContent.onchange = onChange;
            });
            this.onDisconnected(() => {
                this.$modeContent.onchange = null;
            });
        }
        #calcHueByControlPoint() {
            const hueBarWidth = this.$hueBar.clientWidth - POINT_SIZE;
            const hueX = parseInt(getComputedStyle(this.$hueButton).left, 10) || 0;
            const hue = Math.floor(360 * (hueX / hueBarWidth));
            return hue;
        }
        #calcAlphaByControlPoint() {
            const alphaBarWidth = this.$alphaBar.clientWidth - POINT_SIZE;
            const alphaX = parseInt(getComputedStyle(this.$alphaButton).left, 10) || 0;
            const alpha = alphaX / alphaBarWidth;
            return alpha;
        }
        #calcSaturationByControlPoint() {
            const width = this.$hsv.clientWidth - POINT_SIZE;
            const x = parseInt(getComputedStyle(this.$hsvButton).left, 10) || 0;
            const saturation = Math.floor(100 * (x / width)) / 100;
            return saturation;
        }
        #calcValueByControlPoint() {
            const height = this.$hsv.clientHeight - POINT_SIZE;
            const y = parseInt(getComputedStyle(this.$hsvButton).top, 10) || 0;
            const value = 1 - Math.floor(100 * (y / height)) / 100;
            return value;
        }
        #setupValueAttr() {
            this.onAttributeChangedDep('value', () => {
                const newColor = new Color(this.value);
                this.setColor(newColor);
            });
        }
    };
    return BlocksColor = _classThis;
})();
