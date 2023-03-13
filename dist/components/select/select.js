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
import '../popup/index.js';
import '../input/index.js';
import '../select-result/index.js';
import './optgroup.js';
import './option.js';
import { defineClass } from '../../decorators/defineClass.js';
import { every, find, forEach, findIndex } from '../../common/utils.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { slotTemplate, popupTemplate } from './select.template.js';
import { style } from './select.style.js';
import { BlocksSelectResult } from '../select-result/index.js';
import { BlocksOption } from './option.js';
import { BlocksOptGroup } from './optgroup.js';
import { cloneElement } from '../../common/cloneElement.js';
import { connectSelectable } from '../../common/connectSelectable.js';
import { dispatchEvent } from '../../common/event.js';
const isOption = ($el) => $el instanceof BlocksOption;
const isGroup = ($el) => $el instanceof BlocksOptGroup;
export let BlocksSelect = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-select',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BlocksSelect = class extends BlocksSelectResult {
        static {
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksSelect = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'select';
        }
        constructor() {
            super();
            const $optionSlot = slotTemplate();
            const $popup = popupTemplate();
            const $list = $popup.querySelector('.option-list');
            this._ref.$optionSlot = $optionSlot;
            this._ref.$popup = $popup;
            this._ref.$list = $list;
            this._ref.$popup.anchor = () => this;
            this.shadowRoot.appendChild($optionSlot);
            this.onfocus = () => {
                this._openPopup();
            };
            $list.onclick = e => {
                const $target = e.target;
                if (isOption($target)) {
                    this._selectOption($target);
                }
                this.render();
            };
            $list.addEventListener('select', e => {
                const target = e.target;
                const data = { value: target.value, label: target.label };
                dispatchEvent($list, 'select-list:select', { detail: { value: data } });
            });
            $list.addEventListener('deselect', e => {
                const target = e.target;
                const data = { value: target.value, label: target.label };
                dispatchEvent($list, 'select-list:deselect', { detail: { value: data } });
            });
            $list.clearSelected = () => {
                this.clearValue();
                this.clearSearch();
                this.render();
            };
            $list.deselect = (selected) => {
                const $selected = find(this.options, option => option.value === selected.value);
                if ($selected)
                    $selected.selected = false;
            };
            $list.searchSelectable = (searchString) => {
                this.searchString = searchString;
                this.filter();
            };
            connectSelectable(this, $list);
            $popup.addEventListener('opened', () => {
                this.#initClickOutside();
            });
            $popup.addEventListener('closed', () => {
                this.clearSearch();
                this.#destroyClickOutside();
            });
            $optionSlot.addEventListener('slotchange', () => {
                this.#initOptions();
            });
            this.suffixIcon = 'down';
            this.#initKeymap();
        }
        searchString = '';
        get selectedOptions() {
            return this.value;
        }
        set selectedOptions(value) {
            this.value = value;
            const valueMap = Object.create(null);
            const values = this.getValues();
            values.forEach(item => {
                valueMap[item.value] = true;
            });
            forEach(this.options, option => {
                option.silentSelected(!!valueMap[option.value]);
            });
        }
        #optionFilter;
        get optionFilter() {
            if (this.#optionFilter) {
                return this.#optionFilter;
            }
            return (option, searchString) => (option.label ?? option.textContent).includes(searchString);
        }
        set optionFilter(value) {
            if (typeof value !== 'function')
                return;
            this.#optionFilter = value;
        }
        get options() {
            return Array.prototype.slice.call(this._ref.$list.querySelectorAll('bl-option'));
        }
        select(selected) {
            super.select(selected);
            if (!this.multiple) {
                this._ref.$popup.open = false;
                this.classList.remove('dropdown');
            }
        }
        _openPopup() {
            const { $popup } = this._ref;
            $popup.style.minWidth = `${this.offsetWidth}px`;
            $popup.open = true;
            this.classList.add('dropdown');
            this.focus();
        }
        _closePopup() {
            this._ref.$popup.open = false;
            this.classList.remove('dropdown');
            this.blur();
        }
        clearValue() {
            super.clearValue();
            this._ref.$optionSlot.assignedElements().forEach($option => {
                if (isOption($option)) {
                    $option.silentSelected(false);
                }
            });
            this._ref.$list.querySelectorAll('[selected]').forEach($option => {
                $option.silentSelected(false);
            });
            this._renderValue();
        }
        connectedCallback() {
            document.body.appendChild(this._ref.$popup);
            super.connectedCallback();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            document.body.removeChild(this._ref.$popup);
            this.#destroyClickOutside();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
        }
        #initOptions() {
            this._ref.$list.innerHTML = '';
            this._ref.$optionSlot.assignedElements().forEach(el => {
                if (isOption(el) || isGroup(el)) {
                    const copy = cloneElement(el);
                    if (isOption(copy)) {
                        copy.setAttribute('tabindex', '0');
                    }
                    if (copy.id) {
                        copy.removeAttribute('id');
                    }
                    this._ref.$list.appendChild(copy);
                }
            });
        }
        _selectOption(option) {
            if (option.disabled)
                return;
            if (option.parentElement instanceof BlocksOptGroup && option.parentElement.disabled) {
                return;
            }
            if (this.multiple) {
                option.selected = !option.selected;
            }
            else {
                const selected = this._ref.$list.querySelector('[selected]');
                if (selected && selected !== option) {
                    selected.selected = false;
                }
                option.selected = true;
            }
        }
        #initKeymap() {
            let currentFocusValue;
            const focusPrev = () => {
                const all = this.options.filter(el => !el.disabled);
                if (!all.length)
                    return;
                const index = findIndex(all, item => item.value === currentFocusValue);
                const prev = all[index - 1] ?? all[all.length - 1];
                if (prev) {
                    currentFocusValue = prev.value;
                    prev.focus();
                }
            };
            const focusNext = () => {
                const all = this.options.filter(el => !el.disabled);
                if (!all.length)
                    return;
                const index = findIndex(all, item => item.value === currentFocusValue);
                const next = all[index + 1] ?? all[0];
                if (next) {
                    currentFocusValue = next.value;
                    next.focus();
                }
            };
            this.onkeydown = e => {
                if (e.key === 'Escape') {
                    this._closePopup();
                }
                if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const first = this.options.find($option => !$option.disabled);
                    if (first) {
                        currentFocusValue = first.value;
                        first.focus();
                    }
                }
            };
            this._ref.$popup.onkeydown = e => {
                if (e.key === 'Escape') {
                    this._closePopup();
                }
                else if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
                    focusNext();
                }
                else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
                    focusPrev();
                }
                else if (e.key === ' ' || e.key === 'Enter') {
                    const $option = this.options.find(item => item.value === currentFocusValue);
                    if ($option)
                        this._selectOption($option);
                }
            };
        }
        filter() {
            const searchString = this.searchString;
            forEach(this.options, option => {
                option.style.display = this.optionFilter(option, searchString) ? '' : 'none';
            });
            forEach(this._ref.$list.querySelectorAll('bl-optgroup'), group => {
                const options = group.querySelectorAll('bl-option');
                group.style.display = every(options, option => option.style.display === 'none') ? 'none' : '';
            });
        }
        #clearClickOutside;
        #initClickOutside() {
            if (!this.#clearClickOutside) {
                this.#clearClickOutside = onClickOutside([this, this._ref.$popup], () => {
                    if (this._ref.$popup.open) {
                        this._ref.$popup.open = false;
                        this.classList.remove('dropdown');
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
    };
    return BlocksSelect = _classThis;
})();
