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
import '../loading/index.js';
import { attr } from '../../decorators/attr/index.js';
import { compile } from '../../common/dateFormat.js';
import { computed, reactive, subscribe } from '../../common/reactive.js';
import { copyDate, today } from '../../common/date.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { enumGetter, enumSetter } from '../../common/property.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { fromAttr } from '../component/reactive.js';
import { style } from './style.js';
import { template } from './template.js';
import { BlControl } from '../base-control/index.js';
import { BlDate } from '../date/index.js';
import { BlTime } from '../time/index.js';
import { Depth } from '../date/type.js';
import * as Helpers from '../date/helpers.js';
export const dateTimeEquals = (a, b) => {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    return a.getTime() === b.getTime();
};
export let BlDateTime = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-datetime',
            styles: [style],
            attachShadow: {
                mode: 'open',
                delegatesFocus: true,
            },
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _timeFormat_decorators;
    let _timeFormat_initializers = [];
    let _minDepth_decorators;
    let _minDepth_initializers = [];
    let _startDepth_decorators;
    let _startDepth_initializers = [];
    let _startWeekOn_decorators;
    let _startWeekOn_initializers = [];
    let _$date_decorators;
    let _$date_initializers = [];
    let _$time_decorators;
    let _$time_initializers = [];
    let _$timeValue_decorators;
    let _$timeValue_initializers = [];
    var BlDateTime = class extends BlControl {
        static {
            _format_decorators = [attr('string', { defaults: 'YYYY-MM-DD HH:mm:ss' })];
            _timeFormat_decorators = [attr('string', { defaults: 'HH:mm:ss' })];
            _minDepth_decorators = [attr('string', {
                    get(self) {
                        const value = enumGetter('min-depth', Helpers.Depths)(self) ?? Depth.Century;
                        return Helpers.normalizeMinDepth(value, Depth.Month);
                    },
                    set(self, value) {
                        if (Helpers.Depths.includes(value)) {
                            enumSetter('min-depth', Helpers.Depths)(self, Helpers.normalizeMinDepth(value, Depth.Month));
                        }
                    },
                })];
            _startDepth_decorators = [attr('string', {
                    get(self) {
                        const value = enumGetter('start-depth', Helpers.Depths)(self) ?? Depth.Month;
                        return Helpers.normalizeActiveDepth(value, self.minDepth, Depth.Month);
                    },
                    set(self, value) {
                        if (Helpers.Depths.includes(value)) {
                            enumSetter('start-depth', Helpers.Depths)(self, Helpers.normalizeActiveDepth(value, self.minDepth, Depth.Month));
                        }
                    },
                })];
            _startWeekOn_decorators = [attr('string', {
                    get(self) {
                        const value = enumGetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(self) ?? '1';
                        return Number(value);
                    },
                    set(self, value) {
                        enumSetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(self, String(value));
                    },
                })];
            _$date_decorators = [shadowRef('[part="date"]')];
            _$time_decorators = [shadowRef('[part="time"]')];
            _$timeValue_decorators = [shadowRef('[part="time-value"]')];
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _timeFormat_decorators, { kind: "accessor", name: "timeFormat", static: false, private: false, access: { has: obj => "timeFormat" in obj, get: obj => obj.timeFormat, set: (obj, value) => { obj.timeFormat = value; } } }, _timeFormat_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _minDepth_decorators, { kind: "accessor", name: "minDepth", static: false, private: false, access: { has: obj => "minDepth" in obj, get: obj => obj.minDepth, set: (obj, value) => { obj.minDepth = value; } } }, _minDepth_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _startDepth_decorators, { kind: "accessor", name: "startDepth", static: false, private: false, access: { has: obj => "startDepth" in obj, get: obj => obj.startDepth, set: (obj, value) => { obj.startDepth = value; } } }, _startDepth_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _startWeekOn_decorators, { kind: "accessor", name: "startWeekOn", static: false, private: false, access: { has: obj => "startWeekOn" in obj, get: obj => obj.startWeekOn, set: (obj, value) => { obj.startWeekOn = value; } } }, _startWeekOn_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$date_decorators, { kind: "accessor", name: "$date", static: false, private: false, access: { has: obj => "$date" in obj, get: obj => obj.$date, set: (obj, value) => { obj.$date = value; } } }, _$date_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$time_decorators, { kind: "accessor", name: "$time", static: false, private: false, access: { has: obj => "$time" in obj, get: obj => obj.$time, set: (obj, value) => { obj.$time = value; } } }, _$time_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$timeValue_decorators, { kind: "accessor", name: "$timeValue", static: false, private: false, access: { has: obj => "$timeValue" in obj, get: obj => obj.$timeValue, set: (obj, value) => { obj.$timeValue = value; } } }, _$timeValue_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlDateTime = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...BlDate.observedAttributes, ...BlTime.observedAttributes];
        }
        #format_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _format_initializers, void 0));
        get format() { return this.#format_accessor_storage; }
        set format(value) { this.#format_accessor_storage = value; }
        #timeFormat_accessor_storage = __runInitializers(this, _timeFormat_initializers, void 0);
        get timeFormat() { return this.#timeFormat_accessor_storage; }
        set timeFormat(value) { this.#timeFormat_accessor_storage = value; }
        #minDepth_accessor_storage = __runInitializers(this, _minDepth_initializers, void 0);
        get minDepth() { return this.#minDepth_accessor_storage; }
        set minDepth(value) { this.#minDepth_accessor_storage = value; }
        #startDepth_accessor_storage = __runInitializers(this, _startDepth_initializers, void 0);
        get startDepth() { return this.#startDepth_accessor_storage; }
        set startDepth(value) { this.#startDepth_accessor_storage = value; }
        #startWeekOn_accessor_storage = __runInitializers(this, _startWeekOn_initializers, void 0);
        get startWeekOn() { return this.#startWeekOn_accessor_storage; }
        set startWeekOn(value) { this.#startWeekOn_accessor_storage = value; }
        #$date_accessor_storage = __runInitializers(this, _$date_initializers, void 0);
        get $date() { return this.#$date_accessor_storage; }
        set $date(value) { this.#$date_accessor_storage = value; }
        #$time_accessor_storage = __runInitializers(this, _$time_initializers, void 0);
        get $time() { return this.#$time_accessor_storage; }
        set $time(value) { this.#$time_accessor_storage = value; }
        #$timeValue_accessor_storage = __runInitializers(this, _$timeValue_initializers, void 0);
        get $timeValue() { return this.#$timeValue_accessor_storage; }
        set $timeValue(value) { this.#$timeValue_accessor_storage = value; }
        formatter = computed(format => compile(format), [fromAttr(this, 'format')]);
        timeFormatter = computed(format => compile(format), [fromAttr(this, 'timeFormat')]);
        #model = reactive(null, dateTimeEquals);
        constructor() {
            super();
            this.appendShadowChild(template());
            this._tabIndexFeature.withTabIndex(null);
            this.#setupDate();
            this.#setupTime();
            this.#setupValue();
        }
        get selected() {
            return this.#model.content;
        }
        set selected(date) {
            this.#model.content = date;
        }
        get disabledDate() {
            return this.$date.disabledDate;
        }
        set disabledDate(value) {
            this.$date.disabledDate = value;
        }
        get disabledTime() {
            return this.$time.disabledTime;
        }
        set disabledTime(value) {
            this.$time.disabledTime = value;
        }
        defaultDate() {
            return today();
        }
        clearSelected() {
            this.#model.content = null;
            dispatchEvent(this, 'select-list:after-clear');
        }
        deselect(selected) {
            const date = selected.value;
            if (dateTimeEquals(date, this.#model.content)) {
                this.#model.content = null;
            }
        }
        dateTimeEquals(a, b) {
            return dateTimeEquals(a, b);
        }
        showValue(date) {
            return this.$date.showValue(date);
        }
        scrollToActive() {
            this.$time.scrollToActive();
        }
        #setupDate() {
            this.$date.dateEquals = dateTimeEquals;
            this.$date.activeDepth = this.startDepth;
            this.hook.onAttributeChangedDeps(BlDate.observedAttributes, (name, oldValue, newValue) => {
                if (name === 'depth')
                    return;
                if (name === 'mode')
                    return;
                this.$date.setAttribute(name, newValue);
            });
            this.hook.onRender(() => {
                this.$date.render();
            });
        }
        #setupTime() {
            this.hook.onAttributeChangedDeps(BlTime.observedAttributes, (name, oldValue, newValue) => {
                this.$time.setAttribute(name, newValue);
            });
            this.hook.onRender(() => {
                this.$time.render();
            });
        }
        #setupValue() {
            subscribe(this.#model, model => {
                if (model) {
                    this.$timeValue.textContent = this.timeFormatter.content(model);
                }
                else {
                    this.$timeValue.textContent = '';
                }
                this.$time.value = model
                    ? { hour: model.getUTCHours(), minute: model.getUTCMinutes(), second: model.getUTCSeconds() }
                    : null;
                this.$date.selected = model ? [model] : [];
                if (model) {
                    this.$date.showValue(model);
                }
                const selected = model ? [{ value: model, label: this.formatter.content(model) }] : [];
                dispatchEvent(this, 'select-list:change', { detail: { value: selected } });
                dispatchEvent(this, 'change', { detail: { value: model } });
            });
            this.$date.addEventListener('select-list:change', e => {
                e.stopImmediatePropagation();
            });
            this.$time.addEventListener('select-list:change', e => {
                e.stopImmediatePropagation();
            });
            this.$date.addEventListener('change', e => {
                e.stopImmediatePropagation();
                const date = e.detail.selected[0] ? copyDate(e.detail.selected[0]) : null;
                if (date == null) {
                    this.#model.content = null;
                    return;
                }
                if (this.$time.value == null) {
                    const model = this.$time.firstEnableModel();
                    if (model == null) {
                        this.#model.content = null;
                        return;
                    }
                    date.setUTCHours(model.hour);
                    date.setUTCMinutes(model.minute);
                    date.setUTCSeconds(model.second);
                }
                else {
                    date.setUTCHours(this.$time.hour);
                    date.setUTCMinutes(this.$time.minute);
                    date.setUTCSeconds(this.$time.second);
                }
                this.#model.content = date;
            });
            this.$time.addEventListener('change', e => {
                e.stopImmediatePropagation();
                const timeModel = e.detail.value;
                if (timeModel == null) {
                    this.#model.content = null;
                    return;
                }
                const date = copyDate(this.#model.content ?? this.defaultDate());
                date.setUTCHours(timeModel.hour);
                date.setUTCMinutes(timeModel.minute);
                date.setUTCSeconds(timeModel.second);
                this.#model.content = date;
            });
        }
    };
    return BlDateTime = _classThis;
})();
