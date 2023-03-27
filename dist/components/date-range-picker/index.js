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
import '../pair-result/index.js';
import { attr } from '../../decorators/attr.js';
import { compile } from '../../common/dateFormat.js';
import { computed } from '../../common/reactive.js';
import { connectPairSelectable } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { fromAttr } from '../component/reactive.js';
import { makeDate, makeDateFrom } from '../../common/date.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { popupTemplate, resultTemplate } from './template.js';
import { style } from './style.js';
import { BlocksDate } from '../date/index.js';
import { BlocksPairResult } from '../pair-result/index.js';
import { BlocksPopup, PopupOrigin } from '../popup/index.js';
import { Control } from '../base-control/index.js';
export let BlocksDateRangePicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-date-range-picker',
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
    let _format_decorators;
    let _format_initializers = [];
    let _open_decorators;
    let _open_initializers = [];
    let _$result_decorators;
    let _$result_initializers = [];
    var BlocksDateRangePicker = class extends Control {
        static {
            _placeholderFrom_decorators = [attr('string')];
            _placeholderTo_decorators = [attr('string')];
            _format_decorators = [attr('string', { defaults: 'YYYY-MM-DD' })];
            _open_decorators = [attr('boolean')];
            _$result_decorators = [shadowRef('bl-pair-result')];
            __esDecorate(this, null, _placeholderFrom_decorators, { kind: "accessor", name: "placeholderFrom", static: false, private: false, access: { has: obj => "placeholderFrom" in obj, get: obj => obj.placeholderFrom, set: (obj, value) => { obj.placeholderFrom = value; } } }, _placeholderFrom_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholderTo_decorators, { kind: "accessor", name: "placeholderTo", static: false, private: false, access: { has: obj => "placeholderTo" in obj, get: obj => obj.placeholderTo, set: (obj, value) => { obj.placeholderTo = value; } } }, _placeholderTo_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDateRangePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...BlocksPopup.observedAttributes, ...BlocksDate.observedAttributes, ...BlocksPairResult.observedAttributes];
        }
        static get disableEventTypes() {
            return ['focus', 'click', 'touchstart', 'keydown'];
        }
        #placeholderFrom_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _placeholderFrom_initializers, '开始日期'));
        get placeholderFrom() { return this.#placeholderFrom_accessor_storage; }
        set placeholderFrom(value) { this.#placeholderFrom_accessor_storage = value; }
        #placeholderTo_accessor_storage = __runInitializers(this, _placeholderTo_initializers, '结束日期');
        get placeholderTo() { return this.#placeholderTo_accessor_storage; }
        set placeholderTo(value) { this.#placeholderTo_accessor_storage = value; }
        #format_accessor_storage = __runInitializers(this, _format_initializers, void 0);
        get format() { return this.#format_accessor_storage; }
        set format(value) { this.#format_accessor_storage = value; }
        #open_accessor_storage = __runInitializers(this, _open_initializers, void 0);
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #$result_accessor_storage = __runInitializers(this, _$result_initializers, void 0);
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        #formatter = computed(format => compile(format), [fromAttr(this, 'format')]);
        #valueFrom = null;
        #valueTo = null;
        #prevValueFrom = null;
        #prevValueTo = null;
        constructor() {
            super();
            this.appendShadowChild(resultTemplate());
            this._disabledFeature.withTarget(() => [this, this.$result]);
            this._tabIndexFeature.withTabIndex(-1);
            this.#setupPopup();
            this.#setupResult();
            this.#setupDateProxy();
        }
        #prevValue;
        get value() {
            return this.$date.selected[0];
        }
        set value(value) {
            this.$date.selected = value === null ? [] : [value];
        }
        #disabledDate;
        get disabledDate() {
            return this.#disabledDate;
        }
        set disabledDate(value) {
            this.#disabledDate = value;
        }
        #dateProxy = document.createElement('div');
        #clearConnectResult;
        connectResult() {
            this.disconnectResult();
            this.#clearConnectResult = connectPairSelectable(this.$result, this.#dateProxy);
        }
        disconnectResult() {
            if (this.#clearConnectResult) {
                this.#clearConnectResult();
                this.#clearConnectResult = undefined;
            }
        }
        #setupDateProxy() {
            const proxyDateChange = (e) => {
                const selected = e.detail.value[0] ?? null;
                let value;
                if (selected) {
                    value = [
                        this.$result.active === 'first' ? selected : this.$result.firstSelected,
                        this.$result.active === 'second' ? selected : this.$result.secondSelected,
                    ];
                }
                else {
                    value = [null, null];
                }
                dispatchEvent(this.#dateProxy, 'pair-select-list:change', { detail: { value } });
            };
            this.$date.addEventListener('select-list:change', proxyDateChange);
            this.#dateProxy.clearSelected = () => {
                this.$date.clearSelected();
            };
        }
        #setupResult() {
            {
                const discard = () => {
                    if (!this.#valueFrom || !this.#valueTo) {
                        this.#valueFrom = this.#prevValueFrom;
                        this.#valueTo = this.#prevValueTo;
                        this.#renderResult();
                        this.$result.firstSelected = this.$result.secondSelected = null;
                        this.$result.active = null;
                    }
                };
                this.onConnected(() => {
                    this.$popup.addEventListener('closed', discard);
                });
                this.onDisconnected(() => {
                    this.$popup.removeEventListener('closed', discard);
                });
            }
            {
                this.onAttributeChanged((name, _, newValue) => {
                    if (name === 'palceholder-from') {
                        this.$result.placeholderFirst = this.placeholderFrom;
                    }
                    else if (name === 'placeholder-to') {
                        this.$result.placeholderSecond = this.placeholderTo;
                    }
                    else if (BlocksPairResult.observedAttributes.includes(name)) {
                        this.$result.setAttribute(name, newValue);
                    }
                });
            }
            const onActive = () => {
                if (this.$result.active === 'first') {
                    this.disconnectResult();
                    this.$popup.origin = PopupOrigin.TopStart;
                    this.$date.selected = this.#valueFrom === null ? [] : [this.#valueFrom];
                    if (this.#valueFrom) {
                        this.$date.showValue(this.#valueFrom);
                    }
                    this.$date.render();
                    this.connectResult();
                    this.open = true;
                }
                else if (this.$result.active === 'second') {
                    this.disconnectResult();
                    this.$popup.origin = PopupOrigin.TopEnd;
                    this.$date.selected = this.#valueTo === null ? [] : [this.#valueTo];
                    if (this.#valueTo) {
                        this.$date.showValue(this.#valueTo);
                    }
                    this.$date.render();
                    this.connectResult();
                    this.open = true;
                }
                else {
                    this.open = false;
                }
            };
            this.onConnected(() => {
                this.$result.addEventListener('active', onActive);
            });
            this.onDisconnected(() => {
                this.$result.removeEventListener('active', onActive);
            });
            this.onDisconnected(this.disconnectResult);
            {
                const onOpened = () => {
                    if (this.$result.active === null) {
                        this.$result.active = 'first';
                    }
                };
                this.onConnected(() => {
                    this.$popup.addEventListener('opened', onOpened);
                });
                this.onDisconnected(() => {
                    this.$popup.removeEventListener('opened', onOpened);
                });
            }
            const onFirstChange = (e) => {
                this.#valueFrom = e.detail.value?.value ?? null;
            };
            const onSecondChange = (e) => {
                this.#valueTo = e.detail.value?.value ?? null;
            };
            const onCommit = () => {
                this.open = false;
            };
            this.onConnected(() => {
                this.$result.addEventListener('change-first', onFirstChange);
                this.$result.addEventListener('change-second', onSecondChange);
                this.$result.addEventListener('change', onCommit);
            });
            this.onDisconnected(() => {
                this.$result.removeEventListener('change-first', onFirstChange);
                this.$result.removeEventListener('change-second', onSecondChange);
                this.$result.removeEventListener('change', onCommit);
            });
            this.onConnected(this.render);
            this.onAttributeChanged(this.render);
        }
        #renderResult() {
            this.$result.render();
        }
        #isFromActive() {
            return this.$result.active === 'first';
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$date = this.$popup.querySelector('bl-date');
            this.$popup.anchorElement = () => this.$result;
            this.onDisconnected(() => {
                if (document.body.contains(this.$popup)) {
                    document.body.removeChild(this.$popup);
                }
            });
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
                this.$popup.addEventListener('opened', () => {
                    dispatchEvent(this, 'opened');
                });
                this.$popup.addEventListener('closed', () => {
                    dispatchEvent(this, 'closed');
                });
            }
            this.onAttributeChanged((attrName, _, newValue) => {
                if (BlocksPopup.observedAttributes.includes(attrName)) {
                    if (attrName === 'open') {
                        if (this.open && !document.body.contains(this.$popup)) {
                            document.body.appendChild(this.$popup);
                        }
                        this.$popup.open = this.open;
                    }
                    else {
                        this.$popup.setAttribute(attrName, newValue);
                    }
                }
            });
            this.$popup.addEventListener('opened', () => {
                this.#prevValueFrom = this.#valueFrom ?? null;
                this.#prevValueTo = this.#valueTo ?? null;
            });
            this.#setupDate();
        }
        #setupDate() {
            this.$date.disabledDate = (data, ctx) => {
                if (this.disabledDate) {
                    return this.disabledDate(data, ctx);
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
            };
            this.onAttributeChanged((attrName, _, newValue) => {
                if (BlocksDate.observedAttributes.includes(attrName)) {
                    if (attrName !== 'mode') {
                        this.$date.setAttribute(attrName, newValue);
                    }
                }
            });
        }
    };
    return BlocksDateRangePicker = _classThis;
})();
