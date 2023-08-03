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
import { makeISelectableProxy } from '../../common/connectSelectable.js';
import '../button/index.js';
import '../datetime/index.js';
import '../popup/index.js';
import '../select-result/index.js';
import { attr } from '../../decorators/attr/index.js';
import { connectSelectable } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { inputTemplate, popupTemplate } from './template.js';
import { reactive, subscribe } from '../../common/reactive.js';
import { style } from './style.js';
import { BlPopup } from '../popup/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { BlControl } from '../base-control/index.js';
import { BlDateTime, dateTimeEquals } from '../datetime/index.js';
import { PROXY_POPUP_ACCESSORS, PROXY_POPUP_ACCESSORS_KEBAB, PROXY_RESULT_ACCESSORS, PROXY_RESULT_ACCESSORS_KEBAB, } from '../../common/constants.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export let BlDateTimePicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-datetime-picker',
            styles: [style],
            proxyAccessors: [
                { klass: BlPopup, names: PROXY_POPUP_ACCESSORS },
                { klass: BlSelectResult, names: PROXY_RESULT_ACCESSORS },
            ],
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
    var BlDateTimePicker = class extends BlControl {
        static {
            _format_decorators = [attr('string', { defaults: 'YYYY-MM-DD HH:mm:ss' })];
            _open_decorators = [attr('boolean')];
            _placeholder_decorators = [attr('string')];
            _$content_decorators = [shadowRef('#content')];
            _$result_decorators = [shadowRef('[part="result"]')];
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } } }, _placeholder_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$content_decorators, { kind: "accessor", name: "$content", static: false, private: false, access: { has: obj => "$content" in obj, get: obj => obj.$content, set: (obj, value) => { obj.$content = value; } } }, _$content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlDateTimePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...PROXY_POPUP_ACCESSORS_KEBAB, ...PROXY_RESULT_ACCESSORS_KEBAB, ...BlDateTime.observedAttributes];
        }
        #format_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _format_initializers, void 0));
        get format() { return this.#format_accessor_storage; }
        set format(value) { this.#format_accessor_storage = value; }
        #open_accessor_storage = __runInitializers(this, _open_initializers, void 0);
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #placeholder_accessor_storage = __runInitializers(this, _placeholder_initializers, '请选择日期时间');
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #$content_accessor_storage = __runInitializers(this, _$content_initializers, void 0);
        get $content() { return this.#$content_accessor_storage; }
        set $content(value) { this.#$content_accessor_storage = value; }
        #$result_accessor_storage = __runInitializers(this, _$result_initializers, void 0);
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        #model = reactive(null, dateTimeEquals);
        constructor() {
            super();
            this.appendShadowChild(inputTemplate());
            this._disabledFeature.withTarget(() => [this, this.$result]);
            this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex(0);
            this.#setupPopup();
            this.#setupResult();
            this.#setupConnect();
            this.#setupAria();
        }
        get disabledDate() {
            return this.$datetime.disabledDate;
        }
        set disabledDate(value) {
            this.$datetime.disabledDate = value;
        }
        get disabledTime() {
            return this.$datetime.disabledTime;
        }
        set disabledTime(value) {
            this.$datetime.disabledTime = value;
        }
        get value() {
            return this.#model.content;
        }
        set value(value) {
            this.#model.content = value;
        }
        _clickOutside = SetupClickOutside.setup({
            component: this,
            target() {
                return [this, this.$popup];
            },
            update() {
                if (this.open) {
                    this.open = false;
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
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$datetime = this.$popup.querySelector('bl-datetime');
            this.$confirmButton = this.$popup.querySelector('bl-button');
            this.$popup.anchorElement = () => this.$result;
            let isClickClear = false;
            const onClearStart = () => {
                isClickClear = true;
            };
            const onFocus = () => {
                if (!isClickClear) {
                    this.open = true;
                }
                isClickClear = false;
            };
            const onClearEnd = () => {
                isClickClear = false;
            };
            this.$result.afterListClear = () => {
                this.open = false;
                this.blur();
            };
            this.hook.onConnected(() => {
                this.addEventListener('mousedown-clear', onClearStart);
                this.addEventListener('focus', onFocus);
                this.addEventListener('click-clear', onClearEnd);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('mousedown-clear', onClearStart);
                this.removeEventListener('focus', onFocus);
                this.removeEventListener('click-clear', onClearEnd);
            });
            {
                this.proxyEvent(this.$popup, 'opened');
                this.proxyEvent(this.$popup, 'closed');
            }
            this.hook.onDisconnected(() => {
                document.body.removeChild(this.$popup);
            });
            this.hook.onAttributeChangedDeps(PROXY_POPUP_ACCESSORS_KEBAB, (name, _, newValue) => {
                if (name === 'open') {
                    if (this.open && !document.body.contains(this.$popup)) {
                        document.body.appendChild(this.$popup);
                    }
                    this.$popup.open = this.open;
                    if (!this.open) {
                        this.$datetime.showValue(this.$datetime.selected ?? new Date());
                    }
                }
                else {
                    this.$popup.setAttribute(name, newValue);
                }
            });
            this.#setupDateTime();
        }
        #setupDateTime() {
            this.$confirmButton.onclick = () => {
                this.open = false;
            };
            this.$datetime.addEventListener('change', () => {
                this.#model.content = this.$datetime.selected;
            });
            this.hook.onAttributeChanged((attrName, _, newValue) => {
                if (BlDateTime.observedAttributes.includes(attrName)) {
                    this.$datetime.setAttribute(attrName, newValue);
                }
            });
        }
        #setupResult() {
            this.hook.onConnected(() => {
                if (this.$result.placeholder == null) {
                    this.$result.placeholder = '请选择日期时间';
                }
                if (!this.$result.suffixIcon) {
                    this.$result.suffixIcon = 'time';
                }
            });
            this.hook.onAttributeChangedDeps(PROXY_RESULT_ACCESSORS_KEBAB, (name, _, newValue) => {
                this.$result.setAttribute(name, newValue);
            });
            const renderPlaceholder = () => {
                this.$result.placeholder = this.placeholder ?? '请选择日期时间';
            };
            this.hook.onRender(renderPlaceholder);
            this.hook.onConnected(this.render);
            this.hook.onAttributeChanged(this.render);
        }
        #setupConnect() {
            const $proxy = makeISelectableProxy();
            connectSelectable(this.$result, $proxy);
            connectSelectable($proxy, this.$datetime);
            $proxy.acceptSelected = selected => {
                this.#model.content = selected[0]?.value ?? null;
            };
            $proxy.deselect = selected => {
                if (dateTimeEquals(this.#model.content, selected?.value)) {
                    this.#model.content = null;
                }
            };
            $proxy.clearSelected = () => {
                this.#model.content = null;
                this.open = false;
                this.blur();
            };
            subscribe(this.#model, value => {
                const selected = value == null ? [] : [{ value, label: this.$datetime.formatter.content(value) }];
                this.$result.acceptSelected(selected);
                this.$datetime.selected = value;
                if (value)
                    this.$datetime.showValue(value);
                dispatchEvent(this, 'change', { detail: { value } });
            });
        }
        #setupAria() {
            this.hook.onConnected(() => {
                this.setAttribute('aria-haspopup', 'true');
            });
        }
    };
    return BlDateTimePicker = _classThis;
})();
