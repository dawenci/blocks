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
import { attr, attrs } from '../../decorators/attr/index.js';
import { connectSelectable, makeISelectableProxy } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { popupTemplate, resultTemplate } from './template.js';
import { reactive, subscribe } from '../../common/reactive.js';
import { style } from './style.js';
import { BlDate, dateEquals } from '../date/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { BlPopup } from '../popup/index.js';
import { BlControl } from '../base-control/index.js';
import { PROXY_POPUP_ACCESSORS, PROXY_POPUP_ACCESSORS_KEBAB, PROXY_RESULT_ACCESSORS, PROXY_RESULT_ACCESSORS_KEBAB, } from '../../common/constants.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export let BaseDatePicker = (() => {
    let _classDecorators = [defineClass({
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
    let _size_decorators;
    let _size_initializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _open_decorators;
    let _open_initializers = [];
    let _$result_decorators;
    let _$result_initializers = [];
    var BaseDatePicker = class extends BlControl {
        static {
            _size_decorators = [attrs.size];
            _format_decorators = [attr('string', { defaults: 'YYYY-MM-DD' })];
            _open_decorators = [attr('boolean')];
            _$result_decorators = [shadowRef('#result')];
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BaseDatePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...PROXY_POPUP_ACCESSORS_KEBAB, ...PROXY_RESULT_ACCESSORS_KEBAB, ...BlDate.observedAttributes];
        }
        #size_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _size_initializers, void 0));
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #format_accessor_storage = __runInitializers(this, _format_initializers, void 0);
        get format() { return this.#format_accessor_storage; }
        set format(value) { this.#format_accessor_storage = value; }
        #open_accessor_storage = __runInitializers(this, _open_initializers, void 0);
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #$result_accessor_storage = __runInitializers(this, _$result_initializers, void 0);
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        _model = reactive([], (a, b) => {
            if (a.length !== b.length)
                return false;
            return a.every((aItem, index) => {
                const bItem = b[index];
                return dateEquals(aItem, bItem);
            });
        });
        constructor() {
            super();
            this.appendShadowChild(resultTemplate());
            this._disabledFeature.withTarget(() => [this, this.$result]);
            this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex(0);
            this.#setupPopup();
            this.#setupResult();
            this.#setupConnect();
            this.#setupAria();
        }
        get value() {
            return this._model.content[0] ?? null;
        }
        set value(value) {
            this._model.content = Array.isArray(value) ? value : value ? [value] : [];
        }
        get disabledDate() {
            return this.$date.disabledDate;
        }
        set disabledDate(value) {
            this.$date.disabledDate = value;
        }
        get mode() {
            return 'single';
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
        _showLastValueInPanel() {
            const dates = this._model.content;
            if (dates.length) {
                this.$date.showValue(dates[dates.length - 1] ?? new Date());
            }
        }
        #setupResult() {
            this.hook.onConnected(() => {
                if (this.$result.placeholder == null) {
                    this.$result.placeholder = '请选择日期';
                }
            });
            this.hook.onAttributeChanged((name, _, newValue) => {
                if (PROXY_RESULT_ACCESSORS_KEBAB.includes(name)) {
                    this.$result.setAttribute(name, newValue);
                }
                if (name === 'mode') {
                    this.$result.multiple = newValue === 'multiple';
                }
            });
            this.hook.onConnected(this.render);
            this.hook.onAttributeChanged(this.render);
            this.hook.onAttributeChangedDep('format', () => {
                this.$date.notifySelectListChange();
            });
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$date = this.$popup.querySelector('bl-date');
            this.$date.dateEquals = dateEquals;
            this.$confirmButton = this.$popup.querySelector('bl-button');
            this.$popup.anchorElement = () => this.$result;
            let isClickClear = false;
            const onClearStart = () => {
                isClickClear = true;
            };
            const onFocus = () => {
                if (!isClickClear)
                    this.open = true;
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
            this.hook.onDisconnected(() => {
                document.body.removeChild(this.$popup);
            });
            this.hook.onAttributeChangedDeps(PROXY_POPUP_ACCESSORS_KEBAB, (name, _, newValue) => {
                if (name === 'open') {
                    if (this.open && !document.body.contains(this.$popup)) {
                        document.body.appendChild(this.$popup);
                    }
                    this.$popup.open = this.open;
                    if (this.open) {
                        this._showLastValueInPanel();
                    }
                }
                else {
                    this.$popup.setAttribute(name, newValue);
                }
            });
            {
                this.proxyEvent(this.$popup, 'opened');
                this.proxyEvent(this.$popup, 'closed');
            }
            this.#setupDate();
            this.#setupConfirm();
        }
        #setupDate() {
            this.hook.onAttributeChanged((attrName, _, newValue) => {
                if (BlDate.observedAttributes.includes(attrName)) {
                    this.$date.setAttribute(attrName, newValue);
                }
            });
        }
        #setupConfirm() {
            const onClickConfirm = () => {
                this.open = false;
            };
            const renderAction = () => {
                const val = this.$date.mode;
                this.$popup.querySelector('#action').style.display = val === 'multiple' ? 'block' : 'none';
            };
            this.$popup.hook.onConnected(renderAction);
            this.$date.hook.onAttributeChangedDep('mode', renderAction);
            this.hook.onConnected(() => {
                this.$confirmButton.onclick = onClickConfirm;
            });
            this.hook.onDisconnected(() => {
                this.$confirmButton.onclick = null;
            });
        }
        #setupConnect() {
            const $proxy = makeISelectableProxy();
            connectSelectable(this.$result, $proxy);
            connectSelectable($proxy, this.$date);
            $proxy.acceptSelected = selected => {
                this._model.content = selected.map(item => item.value);
                if (this.mode === 'single') {
                    this.open = false;
                }
            };
            $proxy.deselect = selected => {
                this._model.content = this._model.content.filter(item => !dateEquals(item, selected.value));
            };
            $proxy.clearSelected = () => {
                this._model.content = [];
                this.open = false;
                this.blur();
            };
            subscribe(this._model, values => {
                const selected = values.map(value => {
                    return { value, label: this.$date.formatter.content(value) };
                });
                this.$result.acceptSelected(selected);
                this.$date.selected = values;
                this._showLastValueInPanel();
                const value = this.mode === 'single' ? values[0] ?? null : values;
                dispatchEvent(this, 'change', { detail: { value } });
            });
        }
        #setupAria() {
            this.hook.onConnected(() => {
                this.setAttribute('aria-haspopup', 'true');
            });
        }
    };
    return BaseDatePicker = _classThis;
})();
