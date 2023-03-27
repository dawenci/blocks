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
import '../button/index.js';
import '../popup/index.js';
import { attr } from '../../decorators/attr.js';
import { boolSetter } from '../../common/property.js';
import { compile } from '../../common/dateFormat.js';
import { computed } from '../../common/reactive.js';
import { contentTemplate, popupTemplate } from './template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { fromAttr } from '../component/reactive.js';
import { makeDate, makeDateFrom } from '../../common/date.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { padLeft } from '../../common/utils.js';
import { style } from './style.js';
import { BlocksDate } from '../date/index.js';
import { BlocksInput } from '../input/index.js';
import { PopupOrigin } from '../popup/index.js';
import { BlocksTime } from '../time/index.js';
import { ClearableControlBox } from '../base-clearable-control-box/index.js';
export let BlocksDateTimeRangePicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-datetime-range-picker',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _placeholderFrom_decorators;
    let _placeholderFrom_initializers = [];
    let _placeholderTo_decorators;
    let _placeholderTo_initializers = [];
    let _$content_decorators;
    let _$content_initializers = [];
    let _$fromDate_decorators;
    let _$fromDate_initializers = [];
    let _$toDate_decorators;
    let _$toDate_initializers = [];
    let _format_decorators;
    let _format_initializers = [];
    var BlocksDateTimeRangePicker = class extends ClearableControlBox {
        static {
            _placeholderFrom_decorators = [attr('string')];
            _placeholderTo_decorators = [attr('string')];
            _$content_decorators = [shadowRef('#content')];
            _$fromDate_decorators = [shadowRef('[part="from"]')];
            _$toDate_decorators = [shadowRef('[part="to"]')];
            _format_decorators = [attr('string', { defaults: 'YYYY-MM-DD HH:mm:ss' })];
            __esDecorate(this, null, _placeholderFrom_decorators, { kind: "accessor", name: "placeholderFrom", static: false, private: false, access: { has: obj => "placeholderFrom" in obj, get: obj => obj.placeholderFrom, set: (obj, value) => { obj.placeholderFrom = value; } } }, _placeholderFrom_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholderTo_decorators, { kind: "accessor", name: "placeholderTo", static: false, private: false, access: { has: obj => "placeholderTo" in obj, get: obj => obj.placeholderTo, set: (obj, value) => { obj.placeholderTo = value; } } }, _placeholderTo_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$content_decorators, { kind: "accessor", name: "$content", static: false, private: false, access: { has: obj => "$content" in obj, get: obj => obj.$content, set: (obj, value) => { obj.$content = value; } } }, _$content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$fromDate_decorators, { kind: "accessor", name: "$fromDate", static: false, private: false, access: { has: obj => "$fromDate" in obj, get: obj => obj.$fromDate, set: (obj, value) => { obj.$fromDate = value; } } }, _$fromDate_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$toDate_decorators, { kind: "accessor", name: "$toDate", static: false, private: false, access: { has: obj => "$toDate" in obj, get: obj => obj.$toDate, set: (obj, value) => { obj.$toDate = value; } } }, _$toDate_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDateTimeRangePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #placeholderFrom_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _placeholderFrom_initializers, '选择日期时间'));
        get placeholderFrom() { return this.#placeholderFrom_accessor_storage; }
        set placeholderFrom(value) { this.#placeholderFrom_accessor_storage = value; }
        #placeholderTo_accessor_storage = __runInitializers(this, _placeholderTo_initializers, '选择日期时间');
        get placeholderTo() { return this.#placeholderTo_accessor_storage; }
        set placeholderTo(value) { this.#placeholderTo_accessor_storage = value; }
        #$content_accessor_storage = __runInitializers(this, _$content_initializers, void 0);
        get $content() { return this.#$content_accessor_storage; }
        set $content(value) { this.#$content_accessor_storage = value; }
        #$fromDate_accessor_storage = __runInitializers(this, _$fromDate_initializers, void 0);
        get $fromDate() { return this.#$fromDate_accessor_storage; }
        set $fromDate(value) { this.#$fromDate_accessor_storage = value; }
        #$toDate_accessor_storage = __runInitializers(this, _$toDate_initializers, void 0);
        get $toDate() { return this.#$toDate_accessor_storage; }
        set $toDate(value) { this.#$toDate_accessor_storage = value; }
        #format_accessor_storage = __runInitializers(this, _format_initializers, void 0);
        get format() { return this.#format_accessor_storage; }
        set format(value) { this.#format_accessor_storage = value; }
        #formatter = computed(format => compile(format), [fromAttr(this, 'format')]);
        #valueFrom = null;
        #valueTo = null;
        #prevValueFrom = null;
        #prevValueTo = null;
        #activeInput = null;
        #clearClickOutside;
        constructor() {
            super();
            this.appendContent(contentTemplate());
            const $fromDate = this.$fromDate;
            const $toDate = this.$toDate;
            const $popup = popupTemplate();
            const $date = $popup.querySelector('bl-date');
            const $time = $popup.querySelector('bl-time');
            const $timeValue = $popup.querySelector('#time-value');
            this.$popup = $popup;
            this.$date = $date;
            this.$time = $time;
            this.$timeValue = $timeValue;
            this.$confirm = $popup.querySelector('bl-button');
            $popup.anchorElement = () => this;
            const inputs = [$fromDate, $toDate];
            const onfocus = (e) => {
                if (this.disabled)
                    return;
                const $target = e.target;
                const $input = inputs.find($input => $input.contains($target)) ?? null;
                if (!$popup.open) {
                    $popup.open = true;
                }
                this.#switchActiveInput($input);
            };
            inputs.forEach($input => {
                $input.addEventListener('focus', onfocus);
            });
            const stage = (newValue) => {
                this.activeValue = newValue;
            };
            const discard = () => {
                this.#switchActiveInput(null);
                this.#valueFrom = this.#prevValueFrom;
                this.#valueTo = this.#prevValueTo;
                this.#prevValueFrom = this.#prevValueTo = null;
                this.#renderResult();
                $date.selected = [];
            };
            const commit = () => {
                if (this.#isFromActive()) {
                    if (!this.#valueFrom) {
                        this.#valueTo = null;
                    }
                    else if (!this.#valueTo) {
                        this.#switchActiveInput($toDate);
                        return;
                    }
                }
                if (this.#isToActive()) {
                    if (!this.#valueTo) {
                        this.#valueFrom = null;
                    }
                    else if (!this.#valueFrom) {
                        this.#switchActiveInput($fromDate);
                        return;
                    }
                }
                this.#prevValueFrom = this.#prevValueTo = null;
                dispatchEvent(this, 'change', {
                    detail: {
                        value: this.#valueFrom && this.#valueTo ? [this.#valueFrom, this.#valueTo] : null,
                    },
                });
                this.$popup.open = false;
            };
            $date.addEventListener('change', e => {
                if ($date.selectedCount) {
                    const date = $date.selected[0];
                    const newValue = copyDate(this.activeValue ?? today());
                    newValue.setFullYear(date.getFullYear());
                    newValue.setMonth(date.getMonth());
                    newValue.setDate(date.getDate());
                    stage(newValue);
                    this.#renderResult();
                    if (!$time.value) {
                        this.#updateTimePanel(newValue);
                    }
                }
                else {
                    stage(null);
                    this.#renderResult();
                    if ($time.value) {
                        this.#updateTimePanel(null);
                    }
                }
            });
            $time.addEventListener('change', e => {
                const { hour, minute, second } = e.detail;
                if (hour !== null && minute !== null && second !== null) {
                    let newValue;
                    if (this.activeValue) {
                        newValue = copyDate(this.activeValue);
                    }
                    else {
                        newValue = copyDate(this.#valueFrom ?? this.#valueTo ?? today());
                    }
                    newValue.setHours(hour);
                    newValue.setMinutes(minute);
                    newValue.setSeconds(second);
                    stage(newValue);
                    this.#renderResult();
                    if (!$date.selectedCount) {
                        this.#updateDatePanel(newValue);
                    }
                }
                else {
                    stage(null);
                    this.#renderResult();
                    if ($date.selectedCount) {
                        this.#updateDatePanel(null);
                    }
                }
            });
            const renderTimePanelTitle = () => {
                if ($time.hour == null) {
                    $timeValue.textContent = '';
                }
                else {
                    const h = padLeft('0', 2, String($time.hour));
                    const m = padLeft('0', 2, String($time.minute));
                    const s = padLeft('0', 2, String($time.second));
                    $timeValue.textContent = `${h}:${m}:${s}`;
                }
            };
            $time.addEventListener('change', renderTimePanelTitle);
            $popup.addEventListener('open-changed', () => {
                boolSetter('popup-open')(this, $popup.open);
            });
            $popup.addEventListener('opened', () => {
                this.#prevValueFrom = this.#valueFrom ?? null;
                this.#prevValueTo = this.#valueTo ?? null;
                const value = this.activeValue;
                this.#updateDatePanel(value);
                this.#updateTimePanel(value);
                this.#updateLayout();
                this.#setupClickOutside();
                dispatchEvent(this, 'opened');
            });
            $popup.addEventListener('closed', () => {
                if (!this.#valueFrom || !this.#valueTo) {
                    discard();
                }
                this.#switchActiveInput(null);
                this.#destroyClickOutside();
                dispatchEvent(this, 'closed');
            });
            this.$confirm.onclick = () => {
                commit();
            };
            this.addEventListener('click-clear', () => {
                this.#valueFrom = this.#valueTo = null;
                this.#switchActiveInput(null);
                dispatchEvent(this, 'change', {
                    detail: { value: null },
                });
                this.render();
            });
            this.onConnected(() => {
                if (!this.suffixIcon) {
                    this.suffixIcon = 'time';
                }
                document.body.appendChild(this.$popup);
                this.#setDisabledMethods();
                this.render();
            });
            this.onDisconnected(() => {
                document.body.removeChild(this.$popup);
                this.#destroyClickOutside();
            });
            this.onAttributeChanged((name, _, val) => {
                if (BlocksDate.observedAttributes.includes(name) && name !== 'mode') {
                    this.$date.setAttribute(name, val);
                }
                this.render();
            });
        }
        #disabledDate;
        get disabledDate() {
            return this.#disabledDate;
        }
        set disabledDate(value) {
            this.#disabledDate = value;
        }
        #disabledHour;
        get disabledHour() {
            return this.#disabledHour;
        }
        set disabledHour(value) {
            this.#disabledHour = value;
        }
        #disabledMinute;
        get disabledMinute() {
            return this.#disabledMinute;
        }
        set disabledMinute(value) {
            this.#disabledMinute = value;
        }
        #disabledSecond;
        get disabledSecond() {
            return this.#disabledSecond;
        }
        set disabledSecond(value) {
            this.#disabledSecond = value;
        }
        get activeValue() {
            if (this.#isFromActive()) {
                return this.#valueFrom;
            }
            else {
                return this.#valueTo;
            }
        }
        set activeValue(value) {
            const isFromActive = this.#isFromActive();
            if (isFromActive) {
                this.#valueFrom = value;
            }
            else {
                this.#valueTo = value;
            }
            if (this.#valueFrom && this.#valueTo && this.#valueFrom?.getTime() > this.#valueTo.getTime()) {
                if (isFromActive) {
                    this.#valueTo.setTime(this.#valueFrom.getTime());
                }
                else {
                    this.#valueFrom.setTime(this.#valueTo.getTime());
                }
            }
        }
        get value() {
            if (this.#valueFrom && this.#valueTo) {
                return [this.#valueFrom, this.#valueTo];
            }
            else {
                return null;
            }
        }
        set value(value) {
            if (value == null) {
                this.#valueFrom = this.#valueTo = null;
                this.#switchActiveInput(null);
                dispatchEvent(this, 'change', {
                    detail: { value: null },
                });
                if (this.$popup.open) {
                    this.#updateDatePanel(null);
                    this.#updateTimePanel(null);
                }
                this.render();
            }
            else {
                const [from, to] = value;
                this.#valueFrom = from;
                this.#valueTo = to;
                if (this.$popup.open) {
                    const date = this.#isFromActive() ? from : to;
                    this.#updateDatePanel(date);
                    this.#updateTimePanel(date);
                }
                dispatchEvent(this, 'change', {
                    detail: { value },
                });
                this.render();
            }
        }
        #isFromActive() {
            return this.#activeInput === this.$fromDate;
        }
        #isToActive() {
            return this.#activeInput === this.$toDate;
        }
        #switchActiveInput($input) {
            const { $fromDate, $toDate } = this;
            const inputs = [$fromDate, $toDate];
            this.#activeInput = $input;
            if ($input == null) {
                inputs.forEach($input => $input.classList.remove('active'));
                return;
            }
            const isFrom = this.#isFromActive();
            $fromDate.classList.toggle('active', isFrom);
            $toDate.classList.toggle('active', !isFrom);
            this.$popup.origin = isFrom ? PopupOrigin.TopStart : PopupOrigin.TopEnd;
            const value = this.activeValue;
            this.#updateDatePanel(value);
            this.#updateTimePanel(value);
        }
        #updateDatePanel(date) {
            this.$date.selected = date === null ? [] : [date];
        }
        #updateTimePanel(date) {
            const { $time } = this;
            if (!date) {
                $time.hour = $time.minute = $time.second = null;
                return;
            }
            $time.hour = date.getHours();
            $time.minute = date.getMinutes();
            $time.second = date.getSeconds();
        }
        #setDisabledMethods() {
            this.$date.disabledDate = (data, ctx) => {
                if (this.disabledDate && this.disabledDate(data, ctx)) {
                    return true;
                }
                if (this.#isFromActive()) {
                    if (!this.#valueTo)
                        return false;
                    const to = makeDateFrom('day', this.#valueTo);
                    const from = makeDate({
                        year: data.year,
                        monthIndex: data.month,
                        day: data.date,
                    });
                    return from.getTime() > to.getTime();
                }
                else {
                    if (!this.#valueFrom)
                        return false;
                    const from = makeDateFrom('day', this.#valueFrom);
                    const to = makeDate({
                        year: data.year,
                        monthIndex: data.month,
                        day: data.date,
                    });
                    return to.getTime() < from.getTime();
                }
                return false;
            };
            this.$time.disabledHour = (data, ctx) => {
                if (this.disabledHour && this.disabledHour(data, ctx)) {
                    return true;
                }
                return false;
            };
            this.$time.disabledMinute = (data, ctx) => {
                if (this.disabledMinute && this.disabledMinute(data, ctx)) {
                    return true;
                }
                return false;
            };
            this.$time.disabledSecond = (data, ctx) => {
                if (this.disabledSecond && this.disabledSecond(data, ctx)) {
                    return true;
                }
                return false;
            };
        }
        #setupClickOutside() {
            if (!this.#clearClickOutside) {
                this.#clearClickOutside = onClickOutside([this, this.$popup], () => {
                    if (this.$popup.open) {
                        this.$popup.open = false;
                    }
                });
            }
        }
        #destroyClickOutside() {
            if (this.#clearClickOutside) {
                this.#clearClickOutside();
                this.#clearClickOutside = undefined;
            }
        }
        #renderResult() {
            this.$fromDate.value = this.#valueFrom ? this.#formatter.content(this.#valueFrom) : '';
            this.$toDate.value = this.#valueTo ? this.#formatter.content(this.#valueTo) : '';
        }
        #renderPlaceholder() {
            this.$fromDate.placeholder = this.placeholderFrom ?? '选择日期时间';
            this.$toDate.placeholder = this.placeholderTo ?? '选择日期时间';
        }
        render() {
            super.render();
            this.#renderResult();
            this.#renderPlaceholder();
        }
        #updateLayout() {
            this.$time.style.height = this.$date.$content.offsetHeight + 'px';
            this.$timeValue.style.height = this.$date.offsetHeight - this.$date.$content.offsetHeight - 1 + 'px';
        }
        static get observedAttributes() {
            return BlocksInput.observedAttributes
                .concat(BlocksDate.observedAttributes)
                .concat(BlocksTime.observedAttributes)
                .concat(['range', 'placeholder-from', 'placeholder-to']);
        }
    };
    return BlocksDateTimeRangePicker = _classThis;
})();
function copyDate(date) {
    const copy = new Date();
    copy.setTime(date.getTime());
    return copy;
}
function today() {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}
