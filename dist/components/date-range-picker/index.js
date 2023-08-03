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
import { attr } from '../../decorators/attr/index.js';
import { compile } from '../../common/dateFormat.js';
import { computed, reactive, subscribe } from '../../common/reactive.js';
import { connectPairSelectable, connectSelectable, makeIPairSelectableProxy } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { fromAttr } from '../component/reactive.js';
import { makeDate, makeDateFrom } from '../../common/date.js';
import { popupTemplate, resultTemplate } from './template.js';
import { style } from './style.js';
import { unmount } from '../../common/mount.js';
import { BlDate, dateEquals } from '../date/index.js';
import { BlPairResult } from '../pair-result/index.js';
import { BlPopup, PopupOrigin } from '../popup/index.js';
import { BlControl } from '../base-control/index.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export let BlDateRangePicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-date-range-picker',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _placeholderFirst_decorators;
    let _placeholderFirst_initializers = [];
    let _placeholderSecond_decorators;
    let _placeholderSecond_initializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _open_decorators;
    let _open_initializers = [];
    let _$result_decorators;
    let _$result_initializers = [];
    var BlDateRangePicker = class extends BlControl {
        static {
            _placeholderFirst_decorators = [attr('string')];
            _placeholderSecond_decorators = [attr('string')];
            _format_decorators = [attr('string', { defaults: 'YYYY-MM-DD' })];
            _open_decorators = [attr('boolean')];
            _$result_decorators = [shadowRef('bl-pair-result')];
            __esDecorate(this, null, _placeholderFirst_decorators, { kind: "accessor", name: "placeholderFirst", static: false, private: false, access: { has: obj => "placeholderFirst" in obj, get: obj => obj.placeholderFirst, set: (obj, value) => { obj.placeholderFirst = value; } } }, _placeholderFirst_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholderSecond_decorators, { kind: "accessor", name: "placeholderSecond", static: false, private: false, access: { has: obj => "placeholderSecond" in obj, get: obj => obj.placeholderSecond, set: (obj, value) => { obj.placeholderSecond = value; } } }, _placeholderSecond_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlDateRangePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...BlPopup.observedAttributes, ...BlDate.observedAttributes, ...BlPairResult.observedAttributes];
        }
        #placeholderFirst_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _placeholderFirst_initializers, '开始日期'));
        get placeholderFirst() { return this.#placeholderFirst_accessor_storage; }
        set placeholderFirst(value) { this.#placeholderFirst_accessor_storage = value; }
        #placeholderSecond_accessor_storage = __runInitializers(this, _placeholderSecond_initializers, '结束日期');
        get placeholderSecond() { return this.#placeholderSecond_accessor_storage; }
        set placeholderSecond(value) { this.#placeholderSecond_accessor_storage = value; }
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
        #firstModel = reactive(null, dateEquals);
        #secondModel = reactive(null, dateEquals);
        constructor() {
            super();
            this.appendShadowChild(resultTemplate());
            this._disabledFeature.withTarget(() => [this, this.$result]);
            this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex(0);
            this.#setupPopup();
            this.#setupResult();
            this.#setupDateProxy();
            this.#setupAria();
        }
        get value() {
            return [this.#firstModel.content, this.#secondModel.content];
        }
        set value(value) {
            const first = value?.[0] ?? null;
            const second = value?.[0] ?? null;
            this.#firstModel.content = first;
            this.#secondModel.content = second;
        }
        #disabledDate;
        get disabledDate() {
            return this.#disabledDate;
        }
        set disabledDate(value) {
            this.#disabledDate = value;
        }
        _clickOutside = SetupClickOutside.setup({
            component: this,
            target() {
                return [this, this.$popup];
            },
            update() {
                if (this.$result.active !== null) {
                    this.$result.active = null;
                }
            },
            init() {
                this.hook.onAttributeChangedDep('open', () => {
                    if (this.open) {
                        this._clickOutside.bind();
                    }
                    else {
                        this._clickOutside.unbind();
                    }
                });
            },
        });
        #isFirstActive() {
            return this.$result.active === 'first';
        }
        #isSecondActive() {
            return this.$result.active === 'second';
        }
        #setupDateProxy() {
            const $proxy = makeIPairSelectableProxy();
            connectSelectable($proxy, this.$date);
            connectPairSelectable(this.$result, $proxy);
            $proxy.acceptSelected = selected => {
                if (this.#isFirstActive()) {
                    const firstDate = selected[0]?.value;
                    const secondDate = this.#secondModel.content;
                    if (firstDate && secondDate && firstDate.getTime() > secondDate.getTime()) {
                        firstDate.setTime(secondDate.getTime());
                    }
                    this.#firstModel.content = firstDate;
                }
                else if (this.#isSecondActive()) {
                    const firstDate = this.#firstModel.content;
                    const secondDate = selected[0]?.value;
                    if (firstDate && secondDate && firstDate.getTime() > secondDate.getTime()) {
                        secondDate.setTime(firstDate.getTime());
                    }
                    this.#secondModel.content = selected[0]?.value;
                }
            };
            $proxy.clearSelected = () => {
                this.#firstModel.content = this.#secondModel.content = null;
                this.open = false;
                this.blur();
            };
            subscribe(this.#firstModel, model => {
                if (this.#isFirstActive()) {
                    this.$date.selected = model ? [model] : [];
                    if (model)
                        this.$date.showValue(model);
                }
                const first = model == null ? null : { value: model, label: this.#formatter.content(model) };
                const second = this.#secondModel.content == null
                    ? null
                    : { value: this.#secondModel.content, label: this.#formatter.content(this.#secondModel.content) };
                const selected = [first, second];
                dispatchEvent($proxy, 'pair-select-list:change', { detail: { value: selected } });
                dispatchEvent(this, 'change', { detail: { value: this.value } });
            });
            subscribe(this.#secondModel, model => {
                if (this.#isSecondActive()) {
                    this.$date.selected = model ? [model] : [];
                    if (model)
                        this.$date.showValue(model);
                }
                const first = this.#firstModel.content == null
                    ? null
                    : { value: this.#firstModel.content, label: this.#formatter.content(this.#firstModel.content) };
                const second = model == null ? null : { value: model, label: this.#formatter.content(model) };
                const selected = [first, second];
                dispatchEvent($proxy, 'pair-select-list:change', { detail: { value: selected } });
                dispatchEvent(this, 'change', { detail: { value: this.value } });
            });
        }
        #setupResult() {
            {
                this.hook.onAttributeChanged((name, _, newValue) => {
                    if (name === 'palceholder-from') {
                        this.$result.placeholderFirst = this.placeholderFirst;
                    }
                    else if (name === 'placeholder-second') {
                        this.$result.placeholderSecond = this.placeholderSecond;
                    }
                    else if (BlPairResult.observedAttributes.includes(name)) {
                        this.$result.setAttribute(name, newValue);
                    }
                });
                this.hook.onConnected(() => {
                    this.$result.placeholderFirst = this.placeholderFirst;
                    this.$result.placeholderSecond = this.placeholderSecond;
                });
            }
            const onActiveChange = () => {
                if (this.$result.active === 'first') {
                    this.$result.withBlSilent(() => {
                        this.$date.withBlSilent(() => {
                            this.$popup.origin = PopupOrigin.TopStart;
                            this.$date.selected = this.#firstModel.content ? [this.#firstModel.content] : [];
                            this.$date.render();
                            this.open = true;
                        });
                    });
                }
                else if (this.$result.active === 'second') {
                    this.$result.withBlSilent(() => {
                        this.$date.withBlSilent(() => {
                            this.$popup.origin = PopupOrigin.TopEnd;
                            this.$date.selected = this.#secondModel.content ? [this.#secondModel.content] : [];
                            this.$date.render();
                            this.open = true;
                        });
                    });
                }
                else {
                    this.$date.withBlSilent(() => {
                        if (!this.#firstModel.content || !this.#secondModel.content) {
                            this.#firstModel.content = this.#secondModel.content = null;
                        }
                        this.$date.render();
                        this.open = false;
                    });
                }
            };
            this.hook.onConnected(() => {
                this.$result.addEventListener('active', onActiveChange);
            });
            this.hook.onDisconnected(() => {
                this.$result.removeEventListener('active', onActiveChange);
            });
            {
                const onOpened = () => {
                    if (this.$result.active === null) {
                        this.$result.active = 'first';
                    }
                };
                const onClosed = () => {
                    if (this.$result.active !== null) {
                        this.$result.active = null;
                    }
                };
                this.hook.onConnected(() => {
                    this.$popup.addEventListener('opened', onOpened);
                    this.$popup.addEventListener('closed', onClosed);
                });
                this.hook.onDisconnected(() => {
                    this.$popup.removeEventListener('opened', onOpened);
                    this.$popup.removeEventListener('closed', onClosed);
                });
            }
            this.hook.onConnected(this.render);
            this.hook.onAttributeChanged(this.render);
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$date = this.$popup.querySelector('bl-date');
            this.$popup.anchorElement = () => this.$result;
            this.hook.onDisconnected(() => {
                unmount(this.$popup);
            });
            {
                this.proxyEvent(this.$popup, 'opened');
                this.proxyEvent(this.$popup, 'closed');
            }
            this.hook.onAttributeChanged((name, _, newValue) => {
                if (BlPopup.observedAttributes.includes(name)) {
                    if (name === 'open') {
                        if (this.open && !document.body.contains(this.$popup)) {
                            document.body.appendChild(this.$popup);
                        }
                        this.$popup.open = this.open;
                    }
                    else {
                        this.$popup.setAttribute(name, newValue);
                    }
                }
            });
            this.#setupDate();
        }
        #setupDate() {
            this.hook.onAttributeChanged((name, _, newValue) => {
                if (BlDate.observedAttributes.includes(name)) {
                    if (name !== 'mode') {
                        this.$date.setAttribute(name, newValue);
                    }
                }
            });
            this.#setupDisabledDate();
        }
        #setupDisabledDate() {
            this.$date.disabledDate = (data, ctx) => {
                if (this.disabledDate) {
                    return this.disabledDate(data, ctx);
                }
                if (this.#isFirstActive()) {
                    if (!this.$result.secondSelected)
                        return false;
                    const to = makeDateFrom('day', this.$result.secondSelected.value);
                    const from = makeDate({
                        year: data.year,
                        monthIndex: data.month,
                        day: data.date,
                    });
                    return from.getTime() > to.getTime();
                }
                else if (this.#isSecondActive()) {
                    if (!this.$result.firstSelected)
                        return false;
                    const from = makeDateFrom('day', this.$result.firstSelected.value);
                    const to = makeDate({
                        year: data.year,
                        monthIndex: data.month,
                        day: data.date,
                    });
                    return to.getTime() < from.getTime();
                }
                else {
                    return false;
                }
            };
        }
        #setupAria() {
            this.hook.onConnected(() => {
                this.setAttribute('aria-haspopup', 'true');
            });
        }
    };
    return BlDateRangePicker = _classThis;
})();
