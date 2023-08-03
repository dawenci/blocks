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
import '../input/index.js';
import '../select-result/index.js';
import '../popup/index.js';
import '../time/index.js';
import { attr } from '../../decorators/attr/index.js';
import { connectSelectable, makeISelectableProxy } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { prop } from '../../decorators/prop/index.js';
import { reactive, subscribe } from '../../common/reactive.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './style.js';
import { template } from './template.js';
import { template as popupTemplate } from './popup.template.js';
import { BlControl } from '../base-control/index.js';
import { BlPopup } from '../popup/index.js';
import { BlTime, timeEquals } from '../time/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { PROXY_POPUP_ACCESSORS, PROXY_POPUP_ACCESSORS_KEBAB, PROXY_RESULT_ACCESSORS, PROXY_RESULT_ACCESSORS_KEBAB, } from '../../common/constants.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export let BlTimePicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-time-picker',
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
    let _open_decorators;
    let _open_initializers = [];
    let _hour_decorators;
    let _hour_initializers = [];
    let _minute_decorators;
    let _minute_initializers = [];
    let _second_decorators;
    let _second_initializers = [];
    let _$result_decorators;
    let _$result_initializers = [];
    var BlTimePicker = class extends BlControl {
        static {
            _open_decorators = [attr('boolean')];
            _hour_decorators = [prop({
                    get(self) {
                        return self.#model.content?.hour ?? null;
                    },
                    set(self, value) {
                        BlTime.prototype.setField.call(self, self.#model, 'hour', value);
                    },
                })];
            _minute_decorators = [prop({
                    get(self) {
                        return self.#model.content?.minute ?? null;
                    },
                    set(self, value) {
                        BlTime.prototype.setField.call(self, self.#model, 'minute', value);
                    },
                })];
            _second_decorators = [prop({
                    get(self) {
                        return self.#model.content?.second ?? null;
                    },
                    set(self, value) {
                        BlTime.prototype.setField.call(self, self.#model, 'second', value);
                    },
                })];
            _$result_decorators = [shadowRef('[part="result"]')];
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _hour_decorators, { kind: "accessor", name: "hour", static: false, private: false, access: { has: obj => "hour" in obj, get: obj => obj.hour, set: (obj, value) => { obj.hour = value; } } }, _hour_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _minute_decorators, { kind: "accessor", name: "minute", static: false, private: false, access: { has: obj => "minute" in obj, get: obj => obj.minute, set: (obj, value) => { obj.minute = value; } } }, _minute_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _second_decorators, { kind: "accessor", name: "second", static: false, private: false, access: { has: obj => "second" in obj, get: obj => obj.second, set: (obj, value) => { obj.second = value; } } }, _second_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlTimePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...PROXY_POPUP_ACCESSORS_KEBAB, ...PROXY_RESULT_ACCESSORS_KEBAB, ...BlTime.observedAttributes];
        }
        #open_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _open_initializers, void 0));
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #hour_accessor_storage = __runInitializers(this, _hour_initializers, void 0);
        get hour() { return this.#hour_accessor_storage; }
        set hour(value) { this.#hour_accessor_storage = value; }
        #minute_accessor_storage = __runInitializers(this, _minute_initializers, void 0);
        get minute() { return this.#minute_accessor_storage; }
        set minute(value) { this.#minute_accessor_storage = value; }
        #second_accessor_storage = __runInitializers(this, _second_initializers, void 0);
        get second() { return this.#second_accessor_storage; }
        set second(value) { this.#second_accessor_storage = value; }
        #$result_accessor_storage = __runInitializers(this, _$result_initializers, void 0);
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        #model = reactive(null, timeEquals);
        constructor() {
            super();
            this.appendShadowChild(template());
            this.#setupResult();
            this.#setupPopup();
            this.#setupConnect();
            this.#setupAria();
        }
        get value() {
            return this.#model.content;
        }
        set value(value) {
            BlTime.prototype.setModel.call(this, this.#model, value);
        }
        get disabledTime() {
            return this.$time.disabledTime;
        }
        set disabledTime(value) {
            this.$time.disabledTime = value;
        }
        isDisabled(field, value) {
            return this.$time.isDisabled(field, value);
        }
        firstEnableModel(fixHour, fixMinute, fixSecond) {
            return this.$time.firstEnableModel(fixHour, fixMinute, fixSecond);
        }
        _clickOutside = SetupClickOutside.setup({
            component: this,
            target() {
                return [this, this.$popup];
            },
            update() {
                if (this.open)
                    this.open = false;
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
        #setupResult() {
            this.hook.onAttributeChangedDeps(PROXY_RESULT_ACCESSORS_KEBAB, (attrName, oldValue, newValue) => {
                this.$result.setAttribute(attrName, newValue);
            });
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$time = this.$popup.querySelector('bl-time');
            this.$popup.anchorElement = () => this.$result;
            let isClickClear = false;
            const onClearStart = () => {
                isClickClear = true;
            };
            const onFocus = () => {
                if (!isClickClear) {
                    this.open = true;
                    this.$time.scrollToActive();
                }
                isClickClear = false;
            };
            const onClearEnd = () => {
                isClickClear = false;
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
            const $confirm = this.$popup.querySelector('bl-button');
            const onConfirm = this._confirm.bind(this);
            $confirm.onclick = onConfirm;
            this.hook.onDisconnected(() => {
                document.body.removeChild(this.$popup);
            });
            this.hook.onAttributeChangedDeps(PROXY_POPUP_ACCESSORS_KEBAB, (name, _, val) => {
                if (name === 'open') {
                    if (this.open && !document.body.contains(this.$popup)) {
                        document.body.appendChild(this.$popup);
                    }
                    this.$popup.open = this.open;
                }
                else {
                    this.$popup.setAttribute(name, val);
                }
            });
            {
                this.proxyEvent(this.$popup, 'opened');
                this.proxyEvent(this.$popup, 'closed');
            }
            this.#setupTime();
        }
        #setupTime() {
            this.hook.onAttributeChangedDeps(BlTime.observedAttributes, (attrName, oldValue, newValue) => {
                this.$time.setAttribute(attrName, newValue);
            });
        }
        _confirm() {
            this.open = false;
        }
        #setupConnect() {
            const $proxy = makeISelectableProxy();
            connectSelectable(this.$result, $proxy);
            connectSelectable($proxy, this.$time);
            $proxy.acceptSelected = selected => {
                this.#model.content = selected[0]?.value ?? null;
            };
            $proxy.clearSelected = () => {
                this.#model.content = null;
                this.open = false;
                this.blur();
            };
            subscribe(this.#model, value => {
                const selected = value == null ? [] : [{ value, label: this.$time.formatter(value) }];
                this.$result.acceptSelected(selected);
                this.$time.value = value;
                dispatchEvent(this, 'change', { detail: { value } });
            });
        }
        #setupAria() {
            this.hook.onConnected(() => {
                this.setAttribute('aria-haspopup', 'true');
            });
        }
    };
    return BlTimePicker = _classThis;
})();
