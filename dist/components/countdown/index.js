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
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { padLeft } from '../../common/utils.js';
import { style } from './style.js';
import { template } from './template.js';
import { Component } from '../component/Component.js';
export let BlocksCountdown = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-countdown',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    var BlocksCountdown = class extends Component {
        static {
            _value_decorators = [attr('number', { defaults: () => Date.now() })];
            _format_decorators = [attr('string')];
            _$layout_decorators = [shadowRef('#layout')];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksCountdown = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #value_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _value_initializers, void 0));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #format_accessor_storage = __runInitializers(this, _format_initializers, 'H:mm:ss');
        get format() { return this.#format_accessor_storage; }
        set format(value) { this.#format_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this.onConnected(() => {
                this.run();
            });
            this.onDisconnected(() => {
                this.stop();
            });
            this.onAttributeChanged(name => {
                if (name === 'value') {
                    this.run();
                }
                else {
                    this.render();
                }
            });
        }
        #getOffsetByFormat() {
            const { format } = this;
            return format.includes('SSS')
                ? 0
                : format.includes('s')
                    ? 999
                    : format.includes('m')
                        ? 59999
                        : format.includes('H')
                            ? 3599999
                            : format.includes('D')
                                ? 86399999
                                : 0;
        }
        render() {
            super.render();
            const { format, value: deadline } = this;
            let day = 0;
            let hour = 0;
            let minute = 0;
            let second = 0;
            let millisecond = deadline - Date.now() + this.#getOffsetByFormat();
            if (millisecond >= 0) {
                if (format.includes('D')) {
                    day = Math.floor(millisecond / 86400000);
                    millisecond %= 86400000;
                }
                if (format.includes('H')) {
                    hour = Math.floor(millisecond / 3600000);
                    millisecond %= 3600000;
                }
                if (format.includes('m')) {
                    minute = Math.floor(millisecond / 60000);
                    millisecond %= 60000;
                }
                if (format.includes('s')) {
                    second = Math.floor(millisecond / 1000);
                    millisecond %= 1000;
                }
            }
            else {
                millisecond = 0;
            }
            patchDom(this.$layout, tokenize(this.format), {
                day,
                hour,
                minute,
                second,
                millisecond,
            });
        }
        #running = false;
        #rAFId;
        #timerId;
        run() {
            if (this.value - Date.now() <= 0) {
                return;
            }
            const tick = () => {
                if (this.value - Date.now() <= 0) {
                    this.render();
                    requestAnimationFrame(() => {
                        dispatchEvent(this, 'finish');
                    });
                    this.stop();
                }
                else {
                    this.#rAFId = requestAnimationFrame(() => {
                        this.render();
                        tick();
                    });
                }
            };
            if (!this.#running) {
                dispatchEvent(this, 'start');
                this.#running = true;
                tick();
                this.#timerId = setTimeout(tick, this.value - Date.now());
            }
        }
        stop() {
            this.#running = false;
            if (this.#rAFId) {
                this.render();
                requestAnimationFrame(() => {
                    dispatchEvent(this, 'stop');
                });
                cancelAnimationFrame(this.#rAFId);
                this.#rAFId = undefined;
                clearTimeout(this.#timerId);
                this.#timerId = undefined;
            }
        }
    };
    return BlocksCountdown = _classThis;
})();
function patchDom(dom, tokens, vars) {
    if (dom.textContent === tokens.map(token => token.payload).join(''))
        return;
    const children = dom.children;
    if (children.length > tokens.length) {
        let len = children.length - tokens.length;
        while (len--) {
            dom.removeChild(dom.lastElementChild);
        }
    }
    tokens.forEach((token, index) => {
        const { type, payload } = token;
        let text;
        switch (type) {
            case 'day':
            case 'hour':
            case 'minute':
            case 'second': {
                const value = String(vars[type]) ?? '';
                text = payload.length === 2 ? padLeft('0', 2, value) : value;
                break;
            }
            case 'millisecond': {
                const value = String(vars[type]) ?? '';
                text = padLeft('0', 3, value);
                break;
            }
            default:
                text = payload;
                break;
        }
        const el = children[index] ?? dom.appendChild(document.createElement('span'));
        el.setAttribute('part', type);
        el.textContent = text;
    });
}
function tokenize(str) {
    const tokens = [];
    const len = str.length;
    let pos = 0;
    let text = '';
    const pushText = () => {
        if (text) {
            tokens.push({ type: 'text', payload: text });
            text = '';
        }
    };
    function eatVar(type, payload) {
        pushText();
        tokens.push({ type, payload });
        pos += payload.length;
    }
    const eatText = () => {
        text += str[pos];
        pos += 1;
    };
    while (pos < len) {
        const ch = str[pos];
        const ch2 = str[pos + 1];
        if (ch === 'D') {
            eatVar('day', ch2 === 'D' ? 'DD' : 'D');
        }
        else if (ch === 'H') {
            eatVar('hour', ch2 === 'H' ? 'HH' : 'H');
        }
        else if (ch === 'm') {
            eatVar('minute', ch2 === 'm' ? 'mm' : 'm');
        }
        else if (ch === 's') {
            eatVar('second', ch2 === 's' ? 'ss' : 's');
        }
        else if (str.substr(pos, 3) === 'SSS') {
            eatVar('millisecond', 'SSS');
        }
        else {
            eatText();
        }
    }
    pushText();
    return tokens;
}
