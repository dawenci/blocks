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
import '../list/index.js';
import '../input/index.js';
import './optgroup.js';
import './option.js';
import '../popup/index.js';
import '../select-result/index.js';
import { attr } from '../../decorators/attr.js';
import { boolGetter } from '../../common/property.js';
import { connectSelectable } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass.js';
import { onceEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { popupTemplate, slotTemplate, resultTemplate } from './select.template.js';
import { style } from './select.style.js';
import { BlocksList } from '../list/index.js';
import { BlocksOptGroup } from './optgroup.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksSelectResult } from '../select-result/index.js';
import { Control } from '../base-control/index.js';
const isOption = ($el) => $el.tagName === 'BL-OPTION';
const isGroup = ($el) => $el.tagName === 'BL-OPTGROUP';
export let BlocksSelect = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-select',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _open_decorators;
    let _open_initializers = [];
    let _$result_decorators;
    let _$result_initializers = [];
    let _$optionSlot_decorators;
    let _$optionSlot_initializers = [];
    var BlocksSelect = class extends Control {
        static {
            _open_decorators = [attr('boolean')];
            _$result_decorators = [shadowRef('bl-select-result')];
            _$optionSlot_decorators = [shadowRef('[part="slot"]')];
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$optionSlot_decorators, { kind: "accessor", name: "$optionSlot", static: false, private: false, access: { has: obj => "$optionSlot" in obj, get: obj => obj.$optionSlot, set: (obj, value) => { obj.$optionSlot = value; } } }, _$optionSlot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksSelect = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...BlocksSelectResult.observedAttributes, ...BlocksPopup.observedAttributes];
        }
        static get role() {
            return 'select';
        }
        static get disableEventTypes() {
            return ['click', 'keydown', 'touchstart'];
        }
        #open_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _open_initializers, void 0));
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #$result_accessor_storage = __runInitializers(this, _$result_initializers, void 0);
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        #$optionSlot_accessor_storage = __runInitializers(this, _$optionSlot_initializers, void 0);
        get $optionSlot() { return this.#$optionSlot_accessor_storage; }
        set $optionSlot(value) { this.#$optionSlot_accessor_storage = value; }
        $list;
        $popup;
        $confirmButton;
        constructor() {
            super();
            this.appendShadowChildren([resultTemplate(), slotTemplate()]);
            this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex('0');
            this.#setupResult();
            this.#setupPopup();
            this.#setupSelectableList();
            this.#setupOptions();
            this.#setupConfirm();
            this.#setupKeymap();
            this.#setupConnect();
        }
        selected = [];
        get options() {
            return Array.prototype.slice.call(this.querySelectorAll('bl-option'));
        }
        #setupResult() {
            this.$result.suffixIcon = 'down';
            this.onAttributeChangedDeps(BlocksSelectResult.observedAttributes, (name, _, newValue) => {
                this.$result.setAttribute(name, newValue);
            });
        }
        #setupConnect() {
            let clearConnection;
            this.onConnected(() => {
                clearConnection = connectSelectable(this.$result, this.$list, {
                    afterHandleListChange: selected => {
                        if (!this.$result.multiple) {
                            this.open = false;
                            this.$result.classList.remove('dropdown');
                        }
                        this.options.forEach($option => {
                            $option.silentSelected(selected.some(item => item.value === $option.value));
                        });
                    },
                    afterHandleResultClear: () => {
                        this._closePopup();
                    },
                });
            });
            this.onDisconnected(() => {
                clearConnection();
            });
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.onAttributeChangedDeps(BlocksPopup.observedAttributes, (name, _, newValue) => {
                if (name === 'open') {
                    if (this.open && !document.body.contains(this.$popup)) {
                        document.body.appendChild(this.$popup);
                    }
                    this.$popup.open = this.open;
                }
                else {
                    this.$popup.setAttribute(name, newValue);
                }
            });
            this.$popup.anchorElement = () => this;
            this.onDisconnected(() => {
                document.body.removeChild(this.$popup);
            });
            {
                let isClickClear = false;
                const onClearStart = () => {
                    isClickClear = true;
                };
                const onFocus = () => {
                    if (!isClickClear)
                        this._openPopup();
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
            }
            let clear;
            const initClickOutside = () => {
                if (!clear) {
                    clear = onClickOutside([this, this.$popup], () => {
                        if (this.open) {
                            this.open = false;
                            this.$result.classList.remove('dropdown');
                        }
                    });
                }
            };
            const destroyClickOutside = () => {
                if (clear) {
                    clear();
                    clear = undefined;
                }
            };
            this.$popup.addEventListener('opened', () => {
                initClickOutside();
            });
            this.$popup.addEventListener('closed', () => {
                destroyClickOutside();
            });
            this.onDisconnected(() => {
                destroyClickOutside();
            });
        }
        _openPopup() {
            const { $popup } = this;
            $popup.style.minWidth = `${this.offsetWidth}px`;
            this.open = true;
            this.$result.classList.add('dropdown');
        }
        _closePopup() {
            this.open = false;
            this.$result.classList.remove('dropdown');
            this.blur();
        }
        #setupSelectableList() {
            this.$list = this.$popup.querySelector('.option-list');
            const updateMultiple = () => {
                this.$list.multiple = boolGetter('multiple')(this);
                this.$result.multiple = boolGetter('multiple')(this);
            };
            updateMultiple();
            this.onAttributeChangedDep('multiple', updateMultiple);
            this.$popup.addEventListener('closed', () => {
                this.$result.clearSearch();
            });
        }
        #setupConfirm() {
            const render = () => {
                if (this.$result.multiple) {
                    if (!this.$confirmButton) {
                        this.$confirmButton = this.$popup.appendChild(document.createElement('bl-button'));
                        this.$confirmButton.type = 'primary';
                        this.$confirmButton.size = 'small';
                        this.$confirmButton.innerText = '确定';
                        this.$confirmButton.block = true;
                        this.$confirmButton.style.cssText = `margin:8px`;
                        this.$confirmButton.onclick = () => this._closePopup();
                    }
                }
                else {
                    if (this.$confirmButton) {
                        this.$popup.removeChild(this.$confirmButton);
                        this.$confirmButton = undefined;
                    }
                }
            };
            this.onRender(render);
            this.onConnected(render);
            this.onAttributeChangedDep('multiple', render);
        }
        #setupOptions() {
            const _render = BlocksList.prototype.itemRender;
            this.$list.itemRender = function ($item, vitem) {
                _render.call(this, $item, vitem);
                if (vitem.data.value.startsWith('__group_')) {
                    $item.style.backgroundColor = 'transparent';
                }
                else {
                    $item.querySelector('.label').style.paddingLeft = '24px';
                }
            };
            const syncOptions = () => {
                const $element = this.$optionSlot.assignedElements();
                const options = [];
                const selected = [];
                const collect = (list, isDisabled = false) => {
                    for (let i = 0; i < list.length; ++i) {
                        const $el = list[i];
                        if (isGroup($el)) {
                            const label = $el.getAttribute('label') ?? 'group';
                            const value = `__group_` + label;
                            const disabled = true;
                            options.push({ label, value, disabled });
                            collect($el.children, $el.hasAttribute('disabled'));
                        }
                        else if (isOption($el)) {
                            const value = $el.getAttribute('value') || '';
                            const label = $el.getAttribute('label') || $el.innerText || value;
                            const disabled = isDisabled || $el.hasAttribute('disabled');
                            const data = { label, value, disabled };
                            options.push(data);
                            if ($el.hasAttribute('selected')) {
                                selected.push(data.value);
                            }
                        }
                    }
                };
                collect($element);
                this.$list.data = options;
                if (selected.length) {
                    onceEvent(this.$list, 'data-bound', () => {
                        this.$list.checked = selected;
                    });
                }
            };
            this.onConnected(syncOptions);
            this.$optionSlot.addEventListener('slotchange', syncOptions);
            const onSelectOption = (e) => {
                const target = e.target;
                const data = { value: target.value, label: target.label ?? target.value ?? '' };
                this.$list.select(data);
            };
            const onDeselectOption = (e) => {
                const target = e.target;
                const data = { value: target.value, label: target.label ?? target.value ?? '' };
                this.$list.deselect(data);
            };
            this.onConnected(() => {
                this.addEventListener('select', onSelectOption);
                this.addEventListener('deselect', onDeselectOption);
            });
            this.onDisconnected(() => {
                this.removeEventListener('select', onSelectOption);
                this.removeEventListener('deselect', onDeselectOption);
            });
        }
        #setupKeymap() {
            this.onkeydown = e => {
                if (e.key === 'Escape') {
                    this._closePopup();
                }
                if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.$list.focus();
                    this.$list.focusNext();
                }
            };
            this.$list.onkeydown = e => {
                if (e.key === 'Escape') {
                    this.$list.blur();
                    this._closePopup();
                }
            };
        }
        selectOption($option) {
            if ($option.disabled)
                return;
            if ($option.parentElement instanceof BlocksOptGroup && $option.parentElement.disabled) {
                return;
            }
            if (this.$result.multiple) {
                $option.selected = !$option.selected;
            }
            else {
                const selected = this.$list.querySelector('[selected]');
                if (selected && selected !== $option) {
                    selected.selected = false;
                }
                $option.selected = true;
            }
        }
    };
    return BlocksSelect = _classThis;
})();
