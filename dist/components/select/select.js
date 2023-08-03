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
import '../list/index.js';
import '../popup/index.js';
import './optgroup.js';
import './option.js';
import '../select-result/index.js';
import { confirmTemplate, popupTemplate, resultTemplate, slotTemplate } from './select.template.js';
import { PROXY_POPUP_ACCESSORS, PROXY_POPUP_ACCESSORS_KEBAB, PROXY_RESULT_ACCESSORS, PROXY_RESULT_ACCESSORS_KEBAB, } from '../../common/constants.js';
import { connectSelectable, makeISelectableProxy } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { reactive, subscribe } from '../../common/reactive.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './select.style.js';
import { BlList } from '../list/index.js';
import { BlOptGroup } from './optgroup.js';
import { BlPopup } from '../popup/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { BlControl } from '../base-control/index.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
const isOption = ($el) => $el.tagName === 'BL-OPTION';
const isGroup = ($el) => $el.tagName === 'BL-OPTGROUP';
export let BlSelect = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-select',
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
    let _$result_decorators;
    let _$result_initializers = [];
    let _$optionSlot_decorators;
    let _$optionSlot_initializers = [];
    var BlSelect = class extends BlControl {
        static {
            _$result_decorators = [shadowRef('bl-select-result')];
            _$optionSlot_decorators = [shadowRef('[part="slot"]')];
            __esDecorate(this, null, _$result_decorators, { kind: "accessor", name: "$result", static: false, private: false, access: { has: obj => "$result" in obj, get: obj => obj.$result, set: (obj, value) => { obj.$result = value; } } }, _$result_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$optionSlot_decorators, { kind: "accessor", name: "$optionSlot", static: false, private: false, access: { has: obj => "$optionSlot" in obj, get: obj => obj.$optionSlot, set: (obj, value) => { obj.$optionSlot = value; } } }, _$optionSlot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlSelect = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...PROXY_RESULT_ACCESSORS_KEBAB, ...PROXY_POPUP_ACCESSORS_KEBAB];
        }
        static get role() {
            return 'select';
        }
        #$result_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _$result_initializers, void 0));
        get $result() { return this.#$result_accessor_storage; }
        set $result(value) { this.#$result_accessor_storage = value; }
        #$optionSlot_accessor_storage = __runInitializers(this, _$optionSlot_initializers, void 0);
        get $optionSlot() { return this.#$optionSlot_accessor_storage; }
        set $optionSlot(value) { this.#$optionSlot_accessor_storage = value; }
        $list;
        $popup;
        $confirmButton;
        _model = reactive([], (a, b) => {
            return a.length === b.length && a.every(i => b.includes(i));
        });
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
            this.#setupAria();
        }
        selected = [];
        get options() {
            return Array.prototype.slice.call(this.querySelectorAll('bl-option'));
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
        #setupResult() {
            this.hook.onAttributeChangedDeps(PROXY_RESULT_ACCESSORS_KEBAB, (name, _, newValue) => {
                this.$result.setAttribute(name, newValue);
            });
        }
        #setupConnect() {
            const $proxy = makeISelectableProxy();
            connectSelectable(this.$result, $proxy);
            connectSelectable($proxy, this.$list);
            $proxy.acceptSelected = selected => {
                this._model.content = selected.map(item => item.value);
                if (!this.multiple) {
                    this.open = false;
                }
            };
            $proxy.deselect = selected => {
                this._model.content = this._model.content.filter(item => item !== selected.value);
            };
            $proxy.clearSelected = () => {
                this._model.content = [];
                this.open = false;
                this.blur();
            };
            subscribe(this._model, values => {
                const selected = values.map(value => {
                    const item = this.$list.getVirtualItemByKey(value).data;
                    const label = item.label;
                    return { value, label };
                });
                this.options.forEach($option => {
                    const selected = values.some(item => String(item) === $option.getAttribute('value'));
                    if ($option.silentSelected) {
                        $option.silentSelected(selected);
                    }
                    else {
                        if (selected) {
                            $option.setAttribute('selected', '');
                        }
                        else {
                            $option.removeAttribute('selected');
                        }
                    }
                });
                this.$result.acceptSelected(selected);
                this.$list.checked = values;
                const value = !this.multiple ? values[0] ?? null : values;
                dispatchEvent(this, 'change', { detail: { value } });
            });
        }
        #setupPopup() {
            this.$popup = popupTemplate();
            this.$popup.anchorElement = () => this;
            this.hook.onDisconnected(() => {
                document.body.removeChild(this.$popup);
            });
            this.hook.onAttributeChangedDeps(PROXY_POPUP_ACCESSORS_KEBAB, (name, _, newValue) => {
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
            {
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
            }
            this.hook.onAttributeChangedDep('open', () => {
                const { $popup } = this;
                if (this.open) {
                    $popup.style.minWidth = `${this.offsetWidth}px`;
                    this.$result.classList.add('dropdown');
                }
                else {
                    this.$result.classList.remove('dropdown');
                    this.blur();
                }
            });
        }
        #setupSelectableList() {
            this.$list = this.$popup.querySelector('.option-list');
            const updateMultiple = () => {
                this.$list.multiple = this.$result.multiple = this.multiple;
            };
            updateMultiple();
            this.hook.onAttributeChangedDep('multiple', updateMultiple);
            this.$popup.addEventListener('closed', () => {
                this.$result.clearSearch();
            });
        }
        #setupConfirm() {
            const render = () => {
                if (this.$result.multiple) {
                    if (!this.$confirmButton) {
                        this.$confirmButton = this.$popup.appendChild(confirmTemplate());
                        this.$confirmButton.onclick = () => {
                            this.open = false;
                        };
                    }
                }
                else {
                    if (this.$confirmButton) {
                        this.$popup.removeChild(this.$confirmButton);
                        this.$confirmButton = undefined;
                    }
                }
            };
            this.hook.onRender(render);
            this.hook.onConnected(render);
            this.hook.onAttributeChangedDep('multiple', render);
        }
        #setupOptions() {
            const _render = BlList.prototype.itemRender;
            this.$list.itemRender = function ($item, vitem) {
                _render.call(this, $item, vitem);
                if (vitem.data.value.startsWith('__group_')) {
                    $item.style.backgroundColor = 'transparent';
                    $item.querySelector('.label').style.paddingLeft = '';
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
                    this._model.content = selected;
                }
            };
            this.hook.onConnected(syncOptions);
            this.$optionSlot.addEventListener('slotchange', syncOptions);
            const onSelectOption = (e) => {
                const target = e.target;
                const value = target.getAttribute('value');
                if (!value)
                    return;
                if (this.multiple) {
                    this._model.content = this._model.content.concat([value]);
                }
                else {
                    this._model.content = [value];
                }
            };
            const onDeselectOption = (e) => {
                const target = e.target;
                const value = target.getAttribute('value');
                if (!value)
                    return;
                this._model.content = this._model.content.filter(item => String(item) !== value);
            };
            this.hook.onConnected(() => {
                this.addEventListener('select', onSelectOption);
                this.addEventListener('deselect', onDeselectOption);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('select', onSelectOption);
                this.removeEventListener('deselect', onDeselectOption);
            });
        }
        #setupKeymap() {
            this.onkeydown = e => {
                if (e.key === 'Escape') {
                    this.open = false;
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
                    this.open = false;
                }
            };
        }
        selectOption($option) {
            if ($option.disabled)
                return;
            if ($option.parentElement instanceof BlOptGroup && $option.parentElement.disabled) {
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
        #setupAria() {
            this.hook.onConnected(() => {
                this.setAttribute('aria-haspopup', 'listbox');
            });
        }
    };
    return BlSelect = _classThis;
})();
