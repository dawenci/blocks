var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { BlocksVList } from '../vlist/index.js';
import { dispatchEvent } from '../../common/event.js';
import { parseHighlight } from '../../common/highlight.js';
import { template } from './template.js';
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js';
import { customElement } from '../../decorators/customElement.js';
import { attr } from '../../decorators/attr.js';
export let BlocksList = (() => {
    let _classDecorators = [customElement('bl-list')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabledField_decorators;
    let _disabledField_initializers = [];
    let _idField_decorators;
    let _idField_initializers = [];
    let _labelField_decorators;
    let _labelField_initializers = [];
    let _checkable_decorators;
    let _checkable_initializers = [];
    let _multiple_decorators;
    let _multiple_initializers = [];
    let _search_decorators;
    let _search_initializers = [];
    var BlocksList = class extends BlocksVList {
        static {
            _disabled_decorators = [attr('boolean')];
            _disabledField_decorators = [attr('string')];
            _idField_decorators = [attr('string')];
            _labelField_decorators = [attr('string')];
            _checkable_decorators = [attr('boolean')];
            _multiple_decorators = [attr('boolean')];
            _search_decorators = [attr('string')];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _disabledField_decorators, { kind: "accessor", name: "disabledField", static: false, private: false, access: { has: obj => "disabledField" in obj, get: obj => obj.disabledField, set: (obj, value) => { obj.disabledField = value; } } }, _disabledField_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _idField_decorators, { kind: "accessor", name: "idField", static: false, private: false, access: { has: obj => "idField" in obj, get: obj => obj.idField, set: (obj, value) => { obj.idField = value; } } }, _idField_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _labelField_decorators, { kind: "accessor", name: "labelField", static: false, private: false, access: { has: obj => "labelField" in obj, get: obj => obj.labelField, set: (obj, value) => { obj.labelField = value; } } }, _labelField_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _checkable_decorators, { kind: "accessor", name: "checkable", static: false, private: false, access: { has: obj => "checkable" in obj, get: obj => obj.checkable, set: (obj, value) => { obj.checkable = value; } } }, _checkable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } } }, _multiple_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _search_decorators, { kind: "accessor", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search, set: (obj, value) => { obj.search = value; } } }, _search_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksList = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #checkedSet = (__runInitializers(this, _instanceExtraInitializers), void 0);
        static get observedAttributes() {
            return super.observedAttributes.concat([
                'border',
                'disabled',
                'disabled-field',
                'id-field',
                'label-field',
                'checkable',
                'multiple',
                'search',
                'stripe',
            ]);
        }
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, void 0);
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #disabledField_accessor_storage = __runInitializers(this, _disabledField_initializers, 'disabled');
        get disabledField() { return this.#disabledField_accessor_storage; }
        set disabledField(value) { this.#disabledField_accessor_storage = value; }
        #idField_accessor_storage = __runInitializers(this, _idField_initializers, 'id');
        get idField() { return this.#idField_accessor_storage; }
        set idField(value) { this.#idField_accessor_storage = value; }
        #labelField_accessor_storage = __runInitializers(this, _labelField_initializers, void 0);
        get labelField() { return this.#labelField_accessor_storage; }
        set labelField(value) { this.#labelField_accessor_storage = value; }
        #checkable_accessor_storage = __runInitializers(this, _checkable_initializers, void 0);
        get checkable() { return this.#checkable_accessor_storage; }
        set checkable(value) { this.#checkable_accessor_storage = value; }
        #multiple_accessor_storage = __runInitializers(this, _multiple_initializers, void 0);
        get multiple() { return this.#multiple_accessor_storage; }
        set multiple(value) { this.#multiple_accessor_storage = value; }
        #search_accessor_storage = __runInitializers(this, _search_initializers, void 0);
        get search() { return this.#search_accessor_storage; }
        set search(value) { this.#search_accessor_storage = value; }
        constructor() {
            super();
            const { comTemplate } = template();
            const shadowRoot = this.shadowRoot;
            shadowRoot.insertBefore(comTemplate.content.cloneNode(true), this._ref.$viewport);
            this.#checkedSet = new Set();
            this._ref.$list.onclick = e => {
                if (this.disabled)
                    return;
                let $item = e.target;
                if ($item === this._ref.$list)
                    return;
                while ($item !== this._ref.$list) {
                    if ($item.classList.contains('item')) {
                        break;
                    }
                    $item = $item.parentElement;
                }
                if ($item.hasAttribute('disabled'))
                    return;
                dispatchEvent(this, 'click-item', {
                    detail: {
                        id: $item.dataset.id,
                        data: this.getVirtualItemByKey($item.dataset.id)?.data,
                    },
                });
                if (this.checkable) {
                    this._selectItem($item);
                }
            };
            const isDisabledItem = ($item) => {
                return this.disabled || $item.hasAttribute('disabled');
            };
            captureEventWhenEnable(this, 'keydown', e => {
                const $focus = this._ref.$list.querySelector(':focus');
                if (e.key === 'ArrowDown') {
                    if (!$focus)
                        return;
                    e.preventDefault();
                    let $next = $focus.nextElementSibling;
                    while ($next && isDisabledItem($next)) {
                        $next = $next.nextElementSibling;
                    }
                    if ($next) {
                        ;
                        $next.focus();
                    }
                    else {
                        const scrollableBottom = this._ref.$viewport.getScrollableBottom();
                        const scrollDelta = Math.min(this.viewportHeight / 2, scrollableBottom);
                        this._ref.$viewport.viewportScrollTop += scrollDelta;
                    }
                }
                else if (e.key === 'ArrowUp') {
                    if (!$focus)
                        return;
                    e.preventDefault();
                    let $prev = $focus.previousElementSibling;
                    while ($prev && isDisabledItem($prev)) {
                        $prev = $prev.previousElementSibling;
                    }
                    if ($prev) {
                        ;
                        $prev.focus();
                    }
                    else {
                        const scrollableTop = this._ref.$viewport.getScrollableTop();
                        const scrollDelta = Math.min(this.viewportHeight / 2, scrollableTop);
                        this._ref.$viewport.viewportScrollTop -= scrollDelta;
                    }
                }
                else if (e.key === ' ' || e.key === 'Enter') {
                    if (!$focus)
                        return;
                    e.preventDefault();
                    $focus.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                    }));
                }
            });
        }
        get checkedData() {
            return [...(this.#checkedSet ?? [])].map((vitem) => vitem.data);
        }
        set checkedData(data) {
            this.#checkedSet = new Set(data
                .map(data => this.virtualDataMap[this.keyMethod(data)])
                .filter(vitem => !!vitem));
            this.render();
            dispatchEvent(this, 'select-list:change', {
                detail: {
                    value: this.checkedData.map(data => ({
                        label: this.internalLabelMethod(data),
                        value: this.keyMethod(data),
                    })),
                },
            });
        }
        get checked() {
            return this.checkedData.map(this.keyMethod.bind(this));
        }
        set checked(ids) {
            const vitems = ids
                .map(id => this.getVirtualItemByKey(id))
                .filter(vitem => !!vitem);
            this.#checkedSet = new Set(vitems);
            this.render();
            dispatchEvent(this, 'select-list:change', {
                detail: {
                    value: this.checkedData.map(data => ({
                        label: this.internalLabelMethod(data),
                        value: this.keyMethod(data),
                    })),
                },
            });
        }
        select(data) {
            const vitem = this.virtualDataMap[data.value];
            if (!vitem)
                return;
            if (this.#checkedSet.has(vitem))
                return;
            if (this.multiple) {
                this.#checkedSet.add(vitem);
            }
            else {
                this.#checkedSet = new Set([vitem]);
            }
            this.render();
            dispatchEvent(this, 'select-list:select', { detail: { value: data } });
            dispatchEvent(this, 'select-list:change', {
                detail: {
                    value: this.checkedData.map(data => ({
                        label: this.internalLabelMethod(data),
                        value: this.keyMethod(data),
                    })),
                },
            });
        }
        deselect(data) {
            const vitem = this.virtualDataMap[data.value];
            if (!vitem)
                return;
            if (!this.#checkedSet.has(vitem))
                return;
            this.#checkedSet.delete(vitem);
            this.render();
            dispatchEvent(this, 'select-list:deselect', { detail: { value: data } });
            dispatchEvent(this, 'select-list:change', {
                detail: {
                    value: this.checkedData.map(data => ({
                        label: this.internalLabelMethod(data),
                        value: this.keyMethod(data),
                    })),
                },
            });
        }
        searchSelectable(searchString) {
            this.search = searchString;
        }
        clearSelected() {
            if (this.checkedData.length) {
                this.checkedData = [];
            }
        }
        _selectItem($item) {
            const vitem = this.virtualDataMap[$item.dataset.virtualKey];
            const label = this.internalLabelMethod(vitem.data);
            const value = this.keyMethod(vitem.data);
            if (this.multiple) {
                if (this.#checkedSet.has(vitem)) {
                    this.deselect({ value, label });
                }
                else {
                    this.select({ value, label });
                }
            }
            else {
                this.select({ value, label });
            }
        }
        _renderDisabled() {
            if (this.disabled) {
                this.setAttribute('aria-disabled', 'true');
            }
            else {
                this.setAttribute('aria-disabled', 'false');
            }
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            switch (attrName) {
                case 'disabled': {
                    this._renderDisabled();
                    break;
                }
                case 'disabled-field': {
                    this.render();
                    break;
                }
                case 'search': {
                    this.generateViewData();
                    break;
                }
                case 'multiple': {
                    if (this.checkable && !this.multiple && this.#checkedSet.size) {
                        this.#checkedSet = new Set([
                            [...this.#checkedSet][this.#checkedSet.size - 1],
                        ]);
                    }
                    break;
                }
                case 'id-field': {
                    if (this.idField) {
                        this.keyMethod = (data) => {
                            return data[this.idField];
                        };
                    }
                    break;
                }
                default: {
                    if (BlocksList.observedAttributes.includes(attrName)) {
                        this.render();
                    }
                }
            }
        }
        internalLabelMethod(data) {
            if (typeof this.labelMethod === 'function')
                return this.labelMethod(data) ?? '';
            if (typeof this.labelField === 'string')
                return data[this.labelField] ?? '';
            return data.label ?? '';
        }
        keyMethod(data) {
            if (this.idMethod) {
                return this.idMethod(data);
            }
            return data[this.idField];
        }
        async filterMethod(data) {
            if (!this.search)
                return data;
            const len = data.length;
            const results = [];
            return new Promise(resolve => {
                setTimeout(() => {
                    for (let i = 0; i < len; i += 1) {
                        const vItem = data[i];
                        if (this.internalLabelMethod(vItem.data).includes(this.search)) {
                            results.push(vItem);
                        }
                    }
                    resolve(results);
                });
            });
        }
        parseHighlight(label, highlightText) {
            return parseHighlight(label, highlightText);
        }
        _renderItemDisabled($item, vitem) {
            const isDisabled = (this.disabled || vitem.data[this.disabledField]) ?? false;
            if (isDisabled) {
                $item.removeAttribute('tabindex');
                $item.setAttribute('disabled', '');
            }
            else {
                $item.setAttribute('tabindex', '-1');
                $item.removeAttribute('disabled');
            }
            if (this.#checkedSet.has(vitem)) {
                $item.classList.add('checked');
            }
            else {
                $item.classList.remove('checked');
            }
        }
        itemRender($item, vitem) {
            $item.classList.add('item');
            $item.innerHTML = `<div class="prefix"></div><div class="label"></div><div class="suffix"></div>`;
            const label = this.internalLabelMethod(vitem.data) ?? '';
            if (this.search && this.search.length) {
                $item.children[1].innerHTML = this.parseHighlight(label, this.search)
                    .map(textSlice => {
                    return `<span class="${textSlice.highlight ? 'highlight' : ''}">${textSlice.text}</span>`;
                })
                    .join('');
            }
            else {
                $item.children[1].innerHTML = label;
            }
            this._renderItemDisabled($item, vitem);
        }
    };
    return BlocksList = _classThis;
})();
