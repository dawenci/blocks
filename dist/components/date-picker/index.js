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
import { attr } from '../../decorators/attr.js';
import { connectSelectable } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { popupTemplate, resultTemplate } from './template.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { style } from './style.js';
import { BlocksDate } from '../date/index.js';
import { BlocksSelectResult } from '../select-result/index.js';
import { BlocksPopup } from '../popup/index.js';
import { Control } from '../base-control/index.js';
export let BlocksDatePicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-date-picker',
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
    let _mode_decorators;
    let _mode_initializers = [];
    let _$result_decorators;
    let _$result_initializers = [];
    var BlocksDatePicker = class extends Control {
        static {
            _format_decorators = [attr('string', { defaults: 'YYYY-MM-DD' })];
            _open_decorators = [attr('boolean')];
            _mode_decorators = [attr('enum', { enumValues: ['single', 'multiple'] })];
            _$result_decorators = [shadowRef('#result')];
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _mode_decorators, { kind: "accessor", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } } }, _mode_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDatePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [
                ...BlocksPopup.observedAttributes,
                ...BlocksDate.observedAttributes,
                ...BlocksSelectResult.observedAttributes,
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
        #mode_accessor_storage = __runInitializers(this, _mode_initializers, 'single');
        get mode() { return this.#mode_accessor_storage; }
        set mode(value) { this.#mode_accessor_storage = value; }
        #$result_accessor_storage = __runInitializers(this, _$result_initializers, void 0);
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(resultTemplate());
            this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex(0);
            this.#setupPopup();
            this.#setupResult();
            connectSelectable(this.$result, this.$date, {
                afterHandleListChange: () => {
                    if (this.mode === 'single') {
                        this.open = false;
                    }
                },
                afterHandleResultClear: () => {
                    this.open = false;
                    this.blur();
                },
            });
        }
        get value() {
            return this.$result.value;
        }
        set value(value) {
            if (value) {
                this.$date.showValue(value);
                this.$date.selectByDate(value);
            }
            else {
                this.$date.selected = [];
            }
        }
        get values() {
            return this.$result.values;
        }
        set values(values) {
            this.$date.selected = values;
        }
        get disabledDate() {
            return this.$date.disabledDate;
        }
        set disabledDate(value) {
            this.$date.disabledDate = value;
        }
        #setupResult() {
            this.onConnected(() => {
                if (this.$result.placeholder == null) {
                    this.$result.placeholder = '请选择日期';
                }
            });
            this.onAttributeChanged((attrName, _, newValue) => {
                if (BlocksSelectResult.observedAttributes.includes(attrName)) {
                    this.$result.setAttribute(attrName, newValue);
                }
                if (attrName === 'mode') {
                    this.$result.multiple = newValue === 'multiple';
                }
            });
            this.onConnected(this.render);
            this.onAttributeChanged(this.render);
            this.onAttributeChangedDep('format', () => {
                this.$date.notifySelectListChange();
            });
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$date = this.$popup.querySelector('bl-date');
            this.$confirmButton = this.$popup.querySelector('bl-button');
            this.$popup.anchorElement = () => this.$result;
            let isClickClear = false;
            const onClearStart = () => {
                isClickClear = true;
            };
            const onFocus = () => {
                if (!isClickClear) {
                    if (!this.open) {
                        this.$date.showValue(this.$date.selected[this.$date.selected.length - 1] ?? new Date());
                    }
                    this.open = true;
                }
                isClickClear = false;
            };
            const onClearEnd = () => {
                isClickClear = false;
            };
            this.onConnected(() => {
                this.addEventListener('mousedown-clear', onClearStart);
                this.addEventListener('focus', onFocus);
                this.addEventListener('click-clear', onClearEnd);
            });
            this.onDisconnected(() => {
                this.removeEventListener('mousedown-clear', onClearStart);
                this.removeEventListener('focus', onFocus);
                this.removeEventListener('click-clear', onClearEnd);
            });
            this.onDisconnected(() => {
                document.body.removeChild(this.$popup);
            });
            this.onAttributeChanged((name, _, val) => {
                if (BlocksPopup.observedAttributes.includes(name)) {
                    if (name === 'open') {
                        if (this.open && !document.body.contains(this.$popup)) {
                            document.body.appendChild(this.$popup);
                        }
                        this.$popup.open = this.open;
                    }
                    else {
                        this.$popup.setAttribute(name, val);
                    }
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
            this.#setupDate();
            this.#setupConfirm();
        }
        #setupDate() {
            const reEmitChange = () => {
                if (this.$date.mode !== 'multiple') {
                    dispatchEvent(this, 'change', { detail: { value: this.value } });
                }
            };
            this.onConnected(() => {
                this.$date.addEventListener('change', reEmitChange);
            });
            this.onDisconnected(() => {
                this.$date.removeEventListener('change', reEmitChange);
            });
            this.onAttributeChanged((attrName, _, newValue) => {
                if (BlocksDate.observedAttributes.includes(attrName)) {
                    this.$date.setAttribute(attrName, newValue);
                }
            });
        }
        #setupConfirm() {
            const onClickConfirm = () => {
                dispatchEvent(this, 'change', { detail: { value: this.value } });
                this.render();
                this.open = false;
            };
            const renderAction = () => {
                const val = this.$date.mode;
                this.$popup.querySelector('#action').style.display = val === 'multiple' ? 'block' : 'none';
            };
            this.$popup.onConnected(renderAction);
            this.$date.onAttributeChangedDep('mode', renderAction);
            this.onConnected(() => {
                this.$confirmButton.onclick = onClickConfirm;
            });
            this.onDisconnected(() => {
                this.$confirmButton.onclick = null;
            });
        }
    };
    return BlocksDatePicker = _classThis;
})();
