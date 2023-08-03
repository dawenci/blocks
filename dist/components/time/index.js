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
import { attrs } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { padLeft } from '../../common/utils.js';
import { prop } from '../../decorators/prop/index.js';
import { reactive, subscribe } from '../../common/reactive.js';
import { scrollTo } from '../../common/scrollTo.js';
import { style } from './style.js';
import { template } from './template.js';
import { BlComponent } from '../component/Component.js';
export const valueFields = ['hour', 'minute', 'second'];
export const timeEquals = (a, b) => {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    return a.hour === b.hour && a.minute === b.minute && a.second === b.second;
};
export let BlTime = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-time',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _hour_decorators;
    let _hour_initializers = [];
    let _minute_decorators;
    let _minute_initializers = [];
    let _second_decorators;
    let _second_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$hours_decorators;
    let _$hours_initializers = [];
    let _$minutes_decorators;
    let _$minutes_initializers = [];
    let _$seconds_decorators;
    let _$seconds_initializers = [];
    var BlTime = class extends BlComponent {
        static {
            _size_decorators = [attrs.size];
            _hour_decorators = [prop({
                    get(self) {
                        return self.#model.content?.hour ?? null;
                    },
                    set(self, value) {
                        self.setField(self.#model, 'hour', value);
                    },
                })];
            _minute_decorators = [prop({
                    get(self) {
                        return self.#model.content?.minute ?? null;
                    },
                    set(self, value) {
                        self.setField(self.#model, 'minute', value);
                    },
                })];
            _second_decorators = [prop({
                    get(self) {
                        return self.#model.content?.second ?? null;
                    },
                    set(self, value) {
                        self.setField(self.#model, 'second', value);
                    },
                })];
            _$layout_decorators = [shadowRef('#layout')];
            _$hours_decorators = [shadowRef('#hours')];
            _$minutes_decorators = [shadowRef('#minutes')];
            _$seconds_decorators = [shadowRef('#seconds')];
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _hour_decorators, { kind: "accessor", name: "hour", static: false, private: false, access: { has: obj => "hour" in obj, get: obj => obj.hour, set: (obj, value) => { obj.hour = value; } } }, _hour_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _minute_decorators, { kind: "accessor", name: "minute", static: false, private: false, access: { has: obj => "minute" in obj, get: obj => obj.minute, set: (obj, value) => { obj.minute = value; } } }, _minute_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _second_decorators, { kind: "accessor", name: "second", static: false, private: false, access: { has: obj => "second" in obj, get: obj => obj.second, set: (obj, value) => { obj.second = value; } } }, _second_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$hours_decorators, { kind: "accessor", name: "$hours", static: false, private: false, access: { has: obj => "$hours" in obj, get: obj => obj.$hours, set: (obj, value) => { obj.$hours = value; } } }, _$hours_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$minutes_decorators, { kind: "accessor", name: "$minutes", static: false, private: false, access: { has: obj => "$minutes" in obj, get: obj => obj.$minutes, set: (obj, value) => { obj.$minutes = value; } } }, _$minutes_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$seconds_decorators, { kind: "accessor", name: "$seconds", static: false, private: false, access: { has: obj => "$seconds" in obj, get: obj => obj.$seconds, set: (obj, value) => { obj.$seconds = value; } } }, _$seconds_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlTime = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #size_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _size_initializers, void 0));
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #hour_accessor_storage = __runInitializers(this, _hour_initializers, void 0);
        get hour() { return this.#hour_accessor_storage; }
        set hour(value) { this.#hour_accessor_storage = value; }
        #minute_accessor_storage = __runInitializers(this, _minute_initializers, void 0);
        get minute() { return this.#minute_accessor_storage; }
        set minute(value) { this.#minute_accessor_storage = value; }
        #second_accessor_storage = __runInitializers(this, _second_initializers, void 0);
        get second() { return this.#second_accessor_storage; }
        set second(value) { this.#second_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$hours_accessor_storage = __runInitializers(this, _$hours_initializers, void 0);
        get $hours() { return this.#$hours_accessor_storage; }
        set $hours(value) { this.#$hours_accessor_storage = value; }
        #$minutes_accessor_storage = __runInitializers(this, _$minutes_initializers, void 0);
        get $minutes() { return this.#$minutes_accessor_storage; }
        set $minutes(value) { this.#$minutes_accessor_storage = value; }
        #$seconds_accessor_storage = __runInitializers(this, _$seconds_initializers, void 0);
        get $seconds() { return this.#$seconds_accessor_storage; }
        set $seconds(value) { this.#$seconds_accessor_storage = value; }
        #model = reactive(null, timeEquals);
        formatter = (model) => {
            if (model == null)
                return '';
            const hour = padLeft('0', 2, String(model.hour));
            const minute = padLeft('0', 2, String(model.minute));
            const second = padLeft('0', 2, String(model.second));
            return `${hour}:${minute}:${second}`;
        };
        constructor() {
            super();
            this.appendShadowChild(template());
            this.#setupResult();
            this.#setupDisabled();
            this.hook.onConnected(() => {
                this.upgradeProperty(['disabledTime', 'disabledHour', 'disabledMinute', 'disabledSecond']);
            });
        }
        get value() {
            return this.#model.content;
        }
        set value(value) {
            this.setModel(this.#model, value);
        }
        #disabledTime;
        get disabledTime() {
            return this.#disabledTime;
        }
        set disabledTime(value) {
            this.#disabledTime = value;
            this.#updateDisabled();
        }
        isDisabled(field, value) {
            if (!this.disabledTime)
                return false;
            switch (field) {
                case 'hour':
                    return this.disabledTime(value, this.minute, this.second)[0];
                case 'minute':
                    return this.disabledTime(this.hour, value, this.second)[1];
                case 'second':
                    return this.disabledTime(this.hour, this.minute, value)[2];
            }
        }
        _getList(field) {
            return this[`$${field}s`];
        }
        firstEnableModel(fixHour, fixMinute, fixSecond) {
            if (!this.disabledTime)
                return { hour: 0, minute: 0, second: 0 };
            let startHour = 0;
            let endHour = 24;
            if (fixHour != null) {
                startHour = fixHour;
                endHour = fixHour + 1;
            }
            let startMinute = 0;
            let endMinute = 60;
            if (fixMinute != null) {
                startMinute = fixMinute;
                endMinute = fixMinute + 1;
            }
            let startSecond = 0;
            let endSecond = 60;
            if (fixSecond != null) {
                startSecond = fixSecond;
                endSecond = fixSecond + 1;
            }
            for (let hour = startHour; hour < endHour; ++hour) {
                for (let minute = startMinute; minute < endMinute; ++minute) {
                    for (let second = startSecond; second < endSecond; ++second) {
                        const [h, m, s] = this.disabledTime(hour, minute, second);
                        if (h || m || s)
                            continue;
                        return { hour, minute, second };
                    }
                }
            }
            return null;
        }
        setModel(model, value) {
            if (value) {
                if (this.disabledTime && this.disabledTime(value.hour, value.minute, value.second).some(result => result)) {
                    return;
                }
            }
            model.content = value;
        }
        setField(modelRef, field, value) {
            if (value == null) {
                modelRef.content = null;
            }
            else {
                value = value | 0;
                const max = field === 'hour' ? 24 : 60;
                if (value < 0 || value >= max)
                    return;
                if (this.isDisabled(field, value))
                    return;
                if (modelRef.content) {
                    modelRef.content = Object.assign({}, modelRef.content, { [field]: value });
                }
                else {
                    const model = field === 'hour'
                        ? this.firstEnableModel(value)
                        : field === 'minute'
                            ? this.firstEnableModel(undefined, value)
                            : this.firstEnableModel(undefined, undefined, value);
                    modelRef.content = model;
                }
            }
        }
        #setupResult() {
            const makeClickHandler = (field) => {
                return (e) => {
                    const target = e.target;
                    if (target.classList.contains('item')) {
                        if (target.classList.contains('disabled'))
                            return;
                        const value = +target.textContent;
                        if (value === this.#model.content?.[field]) {
                            this.scrollToActive();
                        }
                        else {
                            this.setField(this.#model, field, value);
                        }
                    }
                };
            };
            this.hook.onConnected(() => {
                this.$hours.onclick = makeClickHandler('hour');
                this.$minutes.onclick = makeClickHandler('minute');
                this.$seconds.onclick = makeClickHandler('second');
            });
            this.hook.onDisconnected(() => {
                this.$hours.onclick = this.$minutes.onclick = this.$seconds.onclick = null;
            });
            const updateActive = () => {
                valueFields.forEach(field => {
                    const $scrollable = this._getList(field);
                    const $old = $scrollable.querySelector('.active');
                    const value = this.#model.content?.[field] ?? null;
                    if ($old && (value == null || value !== Number($old.textContent))) {
                        $old.classList.remove('active');
                    }
                    if (value != null) {
                        $scrollable.children[Number(value)].classList.add('active');
                        this.scrollToActive();
                    }
                });
            };
            subscribe(this.#model, () => {
                this.triggerChange();
                updateActive();
            });
            this.hook.onRender(updateActive);
            valueFields.forEach(field => {
                const $scrollable = this._getList(field);
                let timer;
                $scrollable.addEventListener('bl:scroll', () => {
                    clearTimeout(timer);
                    if (this.#passiveScrolling.get($scrollable)) {
                        return;
                    }
                    this.#mouseScrolling = true;
                    const scrolled = $scrollable.viewportScrollTop;
                    const itemHeight = $scrollable.children[0].clientHeight;
                    const value = Math.trunc(scrolled / itemHeight) + (scrolled % itemHeight > 0.5 ? 1 : 0);
                    if (!this.isDisabled(field, value)) {
                        this.setField(this.#model, field, value);
                    }
                    this.#mouseScrolling = false;
                    timer = setTimeout(() => {
                        this.scrollToActive();
                    }, 160);
                });
            });
        }
        #setupDisabled() {
            this.hook.onRender(this.#updateDisabled);
        }
        #updateDisabled() {
            for (const field of valueFields) {
                this._getList(field)
                    .querySelectorAll('.item')
                    .forEach(($item, index) => {
                    $item.classList.toggle('disabled', this.isDisabled(field, index));
                });
            }
        }
        #passiveScrolling = new WeakMap();
        #cancelPassiveScroll;
        _doPassiveScroll() {
            const cancelFns = valueFields.map(field => {
                const $scrollable = this._getList(field);
                const value = this[field];
                if (value == null) {
                    this.#passiveScrolling.set($scrollable, true);
                    $scrollable.viewportScrollTop = 0;
                    requestAnimationFrame(() => {
                        this.#passiveScrolling.set($scrollable, false);
                    });
                    return () => {
                    };
                }
                else {
                    const top = $scrollable.children[value].offsetTop;
                    this.#passiveScrolling.set($scrollable, true);
                    return scrollTo($scrollable, top, {
                        property: 'viewportScrollTop',
                        duration: 0.16,
                        done: () => {
                            this.#passiveScrolling.set($scrollable, false);
                        },
                    });
                }
            });
            this.#cancelPassiveScroll = () => {
                cancelFns.forEach(fn => fn());
                this.#cancelPassiveScroll = undefined;
            };
        }
        #mouseScrolling = false;
        scrollToActive() {
            if (this.#mouseScrolling)
                return;
            if (this.#cancelPassiveScroll)
                this.#cancelPassiveScroll();
            this._doPassiveScroll();
        }
        triggerChange() {
            if (this.blSilent)
                return;
            const value = this.#model.content;
            const label = this.formatter(value);
            const selected = [{ value, label }];
            dispatchEvent(this, 'select-list:change', { detail: { value: selected } });
            dispatchEvent(this, 'change', { detail: { value } });
        }
        clearSelected() {
            this.#passiveScrolling.set(this.$hours, true);
            this.#passiveScrolling.set(this.$minutes, true);
            this.#passiveScrolling.set(this.$seconds, true);
            this.$hours.viewportScrollTop = this.$minutes.viewportScrollTop = this.$seconds.viewportScrollTop = 0;
            requestAnimationFrame(() => {
                this.#passiveScrolling.set(this.$hours, false);
                this.#passiveScrolling.set(this.$minutes, false);
                this.#passiveScrolling.set(this.$seconds, false);
            });
            if (this.hour !== null && this.minute !== null && this.second !== null) {
                this.#model.content = null;
            }
            dispatchEvent(this, 'select-list:after-clear');
        }
        deselect(selected) {
            if (timeEquals(this.#model.content, selected.value)) {
                this.#model.content = null;
            }
        }
    };
    return BlTime = _classThis;
})();
