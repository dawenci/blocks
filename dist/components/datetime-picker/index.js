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
import { compile } from '../../common/dateFormat.js';
import { computed } from '../../common/reactive.js';
import { connectSelectable } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { fromAttr } from '../component/reactive.js';
import { inputTemplate, popupTemplate } from './template.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { padLeft } from '../../common/utils.js';
import { style } from './style.js';
import { BlocksDate } from '../date/index.js';
import { BlocksInput } from '../input/index.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksTime } from '../time/index.js';
import { Control } from '../base-control/index.js';
export let BlocksDateTimePicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-datetime-picker',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _open_decorators;
    let _open_initializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _$content_decorators;
    let _$content_initializers = [];
    let _$result_decorators;
    let _$result_initializers = [];
    let _$input_decorators;
    let _$input_initializers = [];
    var BlocksDateTimePicker = class extends Control {
        static {
            _format_decorators = [attr('string', { defaults: 'YYYY-MM-DD HH:mm:ss' })];
            _open_decorators = [attr('boolean')];
            _placeholder_decorators = [attr('string')];
            _$content_decorators = [shadowRef('#content')];
            _$result_decorators = [shadowRef('[part="result"]')];
            _$input_decorators = [shadowRef('[part="result"]')];
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } } }, _placeholder_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$content_decorators, { kind: "accessor", name: "$content", static: false, private: false, access: { has: obj => "$content" in obj, get: obj => obj.$content, set: (obj, value) => { obj.$content = value; } } }, _$content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$input_decorators, { kind: "accessor", name: "$input", static: false, private: false, access: { has: obj => "$input" in obj, get: obj => obj.$input, set: (obj, value) => { obj.$input = value; } } }, _$input_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDateTimePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [
                ...BlocksPopup.observedAttributes,
                ...BlocksDate.observedAttributes,
                ...BlocksInput.observedAttributes,
                ...BlocksTime.observedAttributes,
            ];
        }
        static get disableEventTypes() {
            return ['click', 'touchstart', 'keydown'];
        }
        #format_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _format_initializers, void 0));
        get format() { return this.#format_accessor_storage; }
        set format(value) { this.#format_accessor_storage = value; }
        #open_accessor_storage = __runInitializers(this, _open_initializers, void 0);
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #placeholder_accessor_storage = __runInitializers(this, _placeholder_initializers, '选择日期时间');
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #$content_accessor_storage = __runInitializers(this, _$content_initializers, void 0);
        get $content() { return this.#$content_accessor_storage; }
        set $content(value) { this.#$content_accessor_storage = value; }
        #$result_accessor_storage = __runInitializers(this, _$result_initializers, void 0);
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        #$input_accessor_storage = __runInitializers(this, _$input_initializers, void 0);
        get $input() { return this.#$input_accessor_storage; }
        set $input(value) { this.#$input_accessor_storage = value; }
        #value = null;
        #formatter = computed(format => compile(format), [fromAttr(this, 'format')]);
        constructor() {
            super();
            this.appendShadowChild(inputTemplate());
            this._tabIndexFeature.withTabIndex(0);
            this.#setupPopup();
            this.#setupResult();
            connectSelectable(this.$input, this);
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
        get value() {
            return this.#value;
        }
        set value(value) {
            this.#value = value;
            if (this.open) {
                this.$date.selected = value === null ? [] : [value];
                this.#updateTimePanel(value);
                this.#renderResult();
            }
            dispatchEvent(this, 'change', {
                detail: { value },
            });
        }
        #notifyDateChange(value) {
            if (value === null) {
                dispatchEvent(this, 'select-list:change', { detail: { value: [] } });
            }
            else {
                const selected = [
                    {
                        label: this.#formatter.content(value),
                        value,
                    },
                ];
                dispatchEvent(this, 'select-list:change', { detail: { value: selected } });
            }
            dispatchEvent(this, 'change', {
                detail: { value: this.#value },
            });
        }
        clearSelected() {
            console.log('clear selected');
            this.#value = null;
            this.$date.selected = [];
            this.#updateTimePanel(null);
            this.#renderResult();
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$date = this.$popup.querySelector('bl-date');
            this.$time = this.$popup.querySelector('bl-time');
            this.$timeValue = this.$popup.querySelector('#time-value');
            this.$confirmButton = this.$popup.querySelector('bl-button');
            this.$popup.anchorElement = () => this;
            this.$input.onfocus = this.$input.onclick = () => {
                this.open = true;
            };
            {
                let clear;
                const eventStart = () => {
                    if (!clear) {
                        clear = onClickOutside([this, this.$popup], () => {
                            if (this.open) {
                                this.$date.clearUncompleteRange();
                                this.open = false;
                            }
                        });
                    }
                };
                const eventStop = () => {
                    if (clear) {
                        clear();
                        clear = undefined;
                    }
                };
                this.onConnected(() => {
                    this.$popup.addEventListener('opened', eventStart);
                    this.$popup.addEventListener('closed', eventStop);
                });
                this.onDisconnected(() => {
                    this.$popup.removeEventListener('opened', eventStart);
                    this.$popup.removeEventListener('closed', eventStop);
                });
                this.onDisconnected(eventStop);
            }
            {
                const onOpened = () => {
                    dispatchEvent(this, 'opened');
                };
                const onClosed = () => {
                    dispatchEvent(this, 'closed');
                };
                this.onConnected(() => {
                    this.$popup.addEventListener('opened', onOpened);
                    this.$popup.addEventListener('closed', onClosed);
                });
                this.onDisconnected(() => {
                    this.$popup.removeEventListener('opened', onOpened);
                    this.$popup.removeEventListener('closed', onClosed);
                });
            }
            this.onConnected(() => {
                document.body.appendChild(this.$popup);
            });
            this.onDisconnected(() => {
                document.body.removeChild(this.$popup);
            });
            this.onAttributeChanged((attrName, _, newValue) => {
                if (BlocksPopup.observedAttributes.includes(attrName)) {
                    if (attrName === 'open') {
                        this.$popup.open = this.open;
                    }
                    else {
                        this.$popup.setAttribute(attrName, newValue);
                    }
                }
            });
            this.#setupDateTime();
        }
        #setupDateTime() {
            this.$popup.addEventListener('opened', () => {
                this.$date.selected = this.#value === null ? [] : [this.#value];
                this.#updateTimePanel(this.#value);
                this.$time.style.height = this.$date.$content.offsetHeight + 'px';
                this.$timeValue.style.height = this.$date.offsetHeight - this.$date.$content.offsetHeight - 1 + 'px';
            });
            this.$confirmButton.onclick = () => {
                this.open = false;
            };
            const joinDateTime = (defaultDate = null) => {
                let date = (this.$date.selected[0] ?? defaultDate);
                if (date == null)
                    return null;
                date = copyDate(date);
                date.setHours(this.$time.hour ?? 0);
                date.setMinutes(this.$time.minute ?? 0);
                date.setSeconds(this.$time.second ?? 0);
                return date;
            };
            this.$date.addEventListener('select-list:change', () => {
                const date = joinDateTime();
                this.#value = date;
                this.#updateTimePanel(date);
                this.#renderResult();
                this.#notifyDateChange(date);
            });
            this.$time.addEventListener('change', () => {
                const date = joinDateTime(this.$time.hour || this.$time.minute || this.$time.second ? today() : null);
                this.#value = date;
                this.$date.selected = date === null ? [] : [date];
                this.#renderResult();
                this.#notifyDateChange(date);
            });
            const renderTimePanelTitle = () => {
                if (this.$time.hour == null) {
                    this.$timeValue.textContent = '';
                }
                else {
                    const h = padLeft('0', 2, String(this.$time.hour ?? 0));
                    const m = padLeft('0', 2, String(this.$time.minute ?? 0));
                    const s = padLeft('0', 2, String(this.$time.second ?? 0));
                    this.$timeValue.textContent = `${h}:${m}:${s}`;
                }
            };
            this.$time.addEventListener('change', renderTimePanelTitle);
            this.$date.addEventListener('change', renderTimePanelTitle);
            this.onRender(renderTimePanelTitle);
            this.onConnected(() => {
                this.#setDisabledMethods();
            });
            this.onAttributeChanged((attrName, _, newValue) => {
                if (BlocksDate.observedAttributes.includes(attrName)) {
                    this.$date.setAttribute(attrName, newValue);
                }
            });
            this.onAttributeChanged((attrName, _, newValue) => {
                if (BlocksTime.observedAttributes.includes(attrName)) {
                    this.$time.setAttribute(attrName, newValue);
                }
            });
        }
        #setupResult() {
            this.onConnected(() => {
                if (this.$input.placeholder == null) {
                    this.$input.placeholder = '请选择日期';
                }
                if (!this.$input.suffixIcon) {
                    this.$input.suffixIcon = 'time';
                }
            });
            this.onAttributeChanged((attrName, _, newValue) => {
                if (BlocksInput.observedAttributes.includes(attrName)) {
                    if (attrName === 'value') {
                        this.$input.value = newValue;
                    }
                    else {
                        this.$input.setAttribute(attrName, newValue);
                    }
                }
            });
            this.onConnected(this.render);
            this.onAttributeChanged(this.render);
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
        #renderResult() {
            this.$input.value = this.#value ? this.#formatter.content(this.#value) : '';
        }
        #renderPlaceholder() {
            this.$input.placeholder = this.placeholder ?? '选择日期时间';
        }
        render() {
            super.render();
            this.#renderResult();
            this.#renderPlaceholder();
        }
    };
    return BlocksDateTimePicker = _classThis;
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
