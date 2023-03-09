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
import '../scrollable/index.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr, attrs } from '../../decorators/attr.js';
import { dispatchEvent } from '../../common/event.js';
import { scrollTo } from '../../common/scrollTo.js';
import { find, forEach, range } from '../../common/utils.js';
import { Component, } from '../Component.js';
import { template } from './template.js';
import { style } from './style.js';
const mutableAttrs = ['hour', 'minute', 'second', 'size'];
export let BlocksTime = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-time',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _hour_decorators;
    let _hour_initializers = [];
    let _minute_decorators;
    let _minute_initializers = [];
    let _second_decorators;
    let _second_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    var BlocksTime = class extends Component {
        static {
            _hour_decorators = [attr('intRange', { min: 0, max: 23 })];
            _minute_decorators = [attr('intRange', { min: 0, max: 59 })];
            _second_decorators = [attr('intRange', { min: 0, max: 59 })];
            _size_decorators = [attrs.size];
            __esDecorate(this, null, _hour_decorators, { kind: "accessor", name: "hour", static: false, private: false, access: { has: obj => "hour" in obj, get: obj => obj.hour, set: (obj, value) => { obj.hour = value; } } }, _hour_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _minute_decorators, { kind: "accessor", name: "minute", static: false, private: false, access: { has: obj => "minute" in obj, get: obj => obj.minute, set: (obj, value) => { obj.minute = value; } } }, _minute_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _second_decorators, { kind: "accessor", name: "second", static: false, private: false, access: { has: obj => "second" in obj, get: obj => obj.second, set: (obj, value) => { obj.second = value; } } }, _second_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksTime = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #hour_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _hour_initializers, void 0));
        get hour() { return this.#hour_accessor_storage; }
        set hour(value) { this.#hour_accessor_storage = value; }
        #minute_accessor_storage = __runInitializers(this, _minute_initializers, void 0);
        get minute() { return this.#minute_accessor_storage; }
        set minute(value) { this.#minute_accessor_storage = value; }
        #second_accessor_storage = __runInitializers(this, _second_initializers, void 0);
        get second() { return this.#second_accessor_storage; }
        set second(value) { this.#second_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #scrollFlag;
        #batchChange;
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template());
            const $layout = shadowRoot.getElementById('layout');
            const $hours = shadowRoot.getElementById('hours');
            const $minutes = shadowRoot.getElementById('minutes');
            const $seconds = shadowRoot.getElementById('seconds');
            this._ref = {
                $layout,
                $hours,
                $minutes,
                $seconds,
            };
            const handler = (prop) => {
                return (e) => {
                    const target = e.target;
                    if (target.classList.contains('item')) {
                        if (target.classList.contains('disabled'))
                            return;
                        const value = +target.textContent;
                        if (value === this[prop]) {
                            this.scrollToActive();
                        }
                        this[prop] = value;
                    }
                };
            };
            $hours.onclick = handler('hour');
            $minutes.onclick = handler('minute');
            $seconds.onclick = handler('second');
        }
        #disabledHour;
        get disabledHour() {
            return this.#disabledHour;
        }
        set disabledHour(value) {
            this.#disabledHour = value;
            this.#renderDisabled();
        }
        #disabledMinute;
        get disabledMinute() {
            return this.#disabledMinute;
        }
        set disabledMinute(value) {
            this.#disabledMinute = value;
            this.#renderDisabled();
        }
        #disabledSecond;
        get disabledSecond() {
            return this.#disabledSecond;
        }
        set disabledSecond(value) {
            this.#disabledSecond = value;
            this.#renderDisabled();
        }
        get value() {
            if (this.hour == null || this.minute == null || this.second == null) {
                return null;
            }
            return [this.hour, this.minute, this.second];
        }
        set value(value) {
            if (value == null) {
                this.hour = this.minute = this.second = null;
                return;
            }
            this.hour = value[0];
            this.minute = value[1];
            this.second = value[2];
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            this.upgradeProperty(['disabledHour', 'disabledMinute', 'disabledSecond']);
            if (['hour', 'minute', 'second'].includes(attrName)) {
                if (newValue === null) {
                    forEach(this._ref.$layout.querySelectorAll('.active'), active => {
                        active.classList.remove('active');
                    });
                    if (attrName !== 'hour' && this.hour !== null)
                        this.hour = null;
                    if (attrName !== 'minute' && this.minute !== null)
                        this.minute = null;
                    if (attrName !== 'second' && this.second !== null)
                        this.second = null;
                    this.render();
                }
                else {
                    const $list = this._ref[`$${attrName}s`];
                    const $old = $list.querySelector('.active');
                    if ($old) {
                        $old.classList.remove('active');
                    }
                    const $new = find($list.children, $li => +$li.textContent === +newValue);
                    if ($new) {
                        $new.classList.add('active');
                    }
                    if (attrName !== 'hour' && !this.hour && this.hour !== 0)
                        this.hour = 0;
                    if (attrName !== 'minute' && !this.minute && this.minute !== 0)
                        this.minute = 0;
                    if (attrName !== 'second' && !this.second && this.second !== 0)
                        this.second = 0;
                    this.render();
                }
                this.scrollToActive();
                this.triggerChange();
            }
        }
        #renderDisabled() {
            const { $hours, $minutes, $seconds } = this._ref;
            const ctx = {
                hour: this.hour,
                minute: this.minute,
                second: this.second,
                component: this,
            };
            if (typeof this.disabledHour === 'function') {
                $hours.querySelectorAll('.item').forEach(($item, index) => {
                    $item.classList.toggle('disabled', this.disabledHour(index, ctx));
                });
            }
            if (typeof this.disabledMinute === 'function') {
                $minutes.querySelectorAll('.item').forEach(($item, index) => {
                    $item.classList.toggle('disabled', this.disabledMinute(index, ctx));
                });
            }
            if (typeof this.disabledSecond === 'function') {
                $seconds.querySelectorAll('.item').forEach(($item, index) => {
                    $item.classList.toggle('disabled', this.disabledSecond(index, ctx));
                });
            }
        }
        render() {
            const { $hours, $minutes, $seconds } = this._ref;
            if (!$hours.children.length) {
                range(0, 23).forEach(n => {
                    const $item = $hours.appendChild(document.createElement('div'));
                    $item.className = 'item';
                    $item.textContent = n < 10 ? '0' + n : String(n);
                });
                const $bot = $hours.appendChild(document.createElement('div'));
                $bot.className = 'bot';
            }
            if (!$minutes.children.length) {
                range(0, 59).forEach(n => {
                    const $item = $minutes.appendChild(document.createElement('div'));
                    $item.className = 'item';
                    $item.textContent = n < 10 ? '0' + n : String(n);
                });
                const $bot = $minutes.appendChild(document.createElement('div'));
                $bot.className = 'bot';
            }
            if (!$seconds.children.length) {
                range(0, 59).forEach(n => {
                    const $item = $seconds.appendChild(document.createElement('div'));
                    $item.className = 'item';
                    $item.textContent = n < 10 ? '0' + n : String(n);
                });
                const $bot = $seconds.appendChild(document.createElement('div'));
                $bot.className = 'bot';
            }
            this.#renderDisabled();
        }
        clear() {
            this.hour = this.minute = this.second = null;
            this.render();
        }
        _scrollToActive() {
            const { $layout, $hours, $minutes, $seconds } = this._ref;
            if (this.hour == null && this.minute == null && this.second == null) {
                forEach([$hours, $minutes, $seconds], $panel => {
                    scrollTo($panel, 0, { property: 'viewportScrollTop', duration: 0.16 });
                });
            }
            else {
                forEach($layout.querySelectorAll('.active'), $active => {
                    scrollTo($active.parentElement, $active.offsetTop, {
                        property: 'viewportScrollTop',
                        duration: 0.16,
                    });
                });
            }
        }
        scrollToActive() {
            if (!this.#scrollFlag) {
                this.#scrollFlag = Promise.resolve().then(() => {
                    this._scrollToActive();
                    this.#scrollFlag = undefined;
                });
            }
        }
        triggerChange() {
            if (!this.#batchChange) {
                this.#batchChange = Promise.resolve().then(() => {
                    const detail = {
                        hour: this.hour,
                        minute: this.minute,
                        second: this.second,
                    };
                    dispatchEvent(this, 'change', { detail });
                    this.#batchChange = undefined;
                });
            }
        }
    };
    return BlocksTime = _classThis;
})();
