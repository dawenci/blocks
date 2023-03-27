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
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { parseHighlight } from '../../common/highlight.js';
import { style } from './style.js';
import { BlocksVList } from '../vlist/index.js';
import { SetupDisabled } from '../setup-disabled/index.js';
import { SetupTabIndex } from '../setup-tab-index/index.js';
export let BlocksList = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-list',
            styles: [style],
            attachShadow: {
                mode: 'open',
                delegatesFocus: true,
            },
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _border_decorators;
    let _border_initializers = [];
    let _stripe_decorators;
    let _stripe_initializers = [];
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
            _border_decorators = [attr('boolean', { observed: false })];
            _stripe_decorators = [attr('boolean', { observed: false })];
            _disabled_decorators = [attr('boolean')];
            _disabledField_decorators = [attr('string')];
            _idField_decorators = [attr('string')];
            _labelField_decorators = [attr('string')];
            _checkable_decorators = [attr('boolean')];
            _multiple_decorators = [attr('boolean')];
            _search_decorators = [attr('string')];
            __esDecorate(this, null, _border_decorators, { kind: "accessor", name: "border", static: false, private: false, access: { has: obj => "border" in obj, get: obj => obj.border, set: (obj, value) => { obj.border = value; } } }, _border_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _stripe_decorators, { kind: "accessor", name: "stripe", static: false, private: false, access: { has: obj => "stripe" in obj, get: obj => obj.stripe, set: (obj, value) => { obj.stripe = value; } } }, _stripe_initializers, _instanceExtraInitializers);
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
        #border_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _border_initializers, void 0));
        get border() { return this.#border_accessor_storage; }
        set border(value) { this.#border_accessor_storage = value; }
        #stripe_accessor_storage = __runInitializers(this, _stripe_initializers, void 0);
        get stripe() { return this.#stripe_accessor_storage; }
        set stripe(value) { this.#stripe_accessor_storage = value; }
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
        #checkedSet = new Set();
        #focusVitem = null;
        _disabledFeature = SetupDisabled.setup({
            component: this,
            predicate() {
                return this.disabled;
            },
            target() {
                return [this];
            },
        });
        _tabIndexFeature = SetupTabIndex.setup({
            tabIndex: 0,
            component: this,
            disabledPredicate() {
                return this.disabled;
            },
            target() {
                return [this.$viewport];
            },
        });
        constructor() {
            super();
            this.#setupEvents();
            this.onConnected(() => {
                this.upgradeProperty(['checkedData', 'checked']);
            });
        }
        #setupEvents() {
            const onListClick = (e) => {
                if (this.disabled)
                    return;
                let $item = e.target;
                if ($item === this.$list)
                    return;
                while ($item !== this.$list) {
                    if ($item.classList.contains('item')) {
                        break;
                    }
                    $item = $item.parentElement;
                }
                if ($item.hasAttribute('disabled'))
                    return;
                this.focusById($item.dataset.virtualKey);
                dispatchEvent(this, 'click-item', {
                    detail: {
                        id: $item.dataset.id,
                        data: this.getVirtualItemByKey($item.dataset.id)?.data,
                    },
                });
                if (this.checkable) {
                    const vitem = this.getVirtualItemByKey($item.dataset.virtualKey);
                    if (!vitem)
                        return;
                    if (this.multiple && this.#checkedSet.has(vitem.virtualKey)) {
                        this.deselectById(vitem.virtualKey);
                    }
                    else {
                        this.selectById(vitem.virtualKey);
                    }
                }
            };
            this.onConnected(() => {
                this.$list.onclick = onListClick;
            });
            this.onDisconnected(() => {
                this.$list.onclick = null;
            });
            const onKeydown = (e) => {
                if (e.key === 'ArrowDown') {
                    this.focusNext();
                    e.preventDefault();
                }
                else if (e.key === 'ArrowUp') {
                    this.focusPrev();
                    e.preventDefault();
                }
                else if (e.key === ' ' || e.key === 'Enter') {
                    if (!this.checkable || !this.#focusVitem)
                        return;
                    e.preventDefault();
                    if (this.multiple && this.#checkedSet.has(this.#focusVitem.virtualKey)) {
                        this.deselectById(this.#focusVitem.virtualKey);
                    }
                    else {
                        this.selectById(this.#focusVitem.virtualKey);
                    }
                }
            };
            let clearKeydown;
            this.onConnected(() => {
                clearKeydown = captureEventWhenEnable(this, 'keydown', onKeydown);
            });
            this.onDisconnected(() => {
                clearKeydown();
            });
            const clearFocus = () => {
                this.focusById('');
            };
            this.onConnected(() => {
                this.$viewport.addEventListener('blur', clearFocus);
            });
            this.onDisconnected(() => {
                this.$viewport.removeEventListener('blur', clearFocus);
            });
        }
        get checkedData() {
            return [...(this.#checkedSet ?? [])].map(vkey => this.getVirtualItemByKey(vkey).data);
        }
        set checkedData(data) {
            this.#checkedSet = new Set(data.map(data => this.keyMethod(data)).filter(vkey => !!this.getVirtualItemByKey(vkey)));
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
            this.#checkedSet = new Set(ids.filter(id => !!this.getVirtualItemByKey(id)));
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
        focusById(id) {
            const old = this.#focusVitem;
            this.#focusVitem = this.getVirtualItemByKey(id) ?? null;
            if (this.#focusVitem?.virtualKey === old?.virtualKey)
                return;
            if (this.#focusVitem) {
                const $item = this.getNodeByVirtualKey(id);
                if ($item)
                    this.itemRender($item, this.#focusVitem);
            }
            if (old) {
                const $item = this.getNodeByVirtualKey(old.virtualKey);
                if ($item)
                    this.itemRender($item, old);
            }
        }
        focusNext() {
            const totalCount = this.virtualViewData.length;
            if (!totalCount)
                return;
            let index;
            const current = this.#focusVitem;
            if (current) {
                index = current.virtualViewIndex + 1;
                if (index >= totalCount)
                    return;
            }
            else {
                index = 0;
            }
            let result;
            for (; index < totalCount; ++index) {
                const vitem = this.virtualViewData[index];
                if (vitem.data[this.disabledField]) {
                    continue;
                }
                result = vitem;
                break;
            }
            if (result) {
                this.focusById(result.virtualKey);
                if (!this.$list.querySelector(`[data-virtual-key="${result.virtualKey}"]`)) {
                    this.scrollToKey(result.virtualKey, 0);
                }
            }
        }
        focusPrev() {
            const totalCount = this.virtualViewData.length;
            if (!totalCount)
                return;
            let index;
            const current = this.#focusVitem;
            if (current) {
                index = current.virtualViewIndex - 1;
                if (index < 0)
                    return;
            }
            else {
                index = this.virtualViewData.length - 1;
            }
            let result;
            for (; index >= 0; --index) {
                const vitem = this.virtualViewData[index];
                if (vitem.data[this.disabledField]) {
                    continue;
                }
                result = vitem;
                break;
            }
            if (result) {
                this.focusById(result.virtualKey);
                if (!this.$list.querySelector(`[data-virtual-key="${result.virtualKey}"]`)) {
                    this.backScrollToKey(result.virtualKey, 0);
                }
            }
        }
        select(data) {
            const vitem = this.getVirtualItemByKey(data.value);
            if (!vitem)
                return;
            const vkey = vitem.virtualKey;
            if (this.#checkedSet.has(vkey))
                return;
            if (this.multiple) {
                this.#checkedSet.add(vkey);
                const $item = this.getNodeByVirtualKey(vkey);
                if ($item)
                    this.itemRender($item, vitem);
            }
            else {
                const [old] = [...this.#checkedSet.values()];
                this.#checkedSet = new Set([vkey]);
                const $new = this.getNodeByVirtualKey(vkey);
                if ($new)
                    this.itemRender($new, vitem);
                const $old = old && this.getNodeByVirtualKey(old);
                if ($old)
                    this.itemRender($old, this.getVirtualItemByKey(old));
            }
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
            const vitem = this.getVirtualItemByKey(data.value);
            if (!vitem)
                return;
            const vkey = vitem.virtualKey;
            if (!this.#checkedSet.has(vkey))
                return;
            this.#checkedSet.delete(vkey);
            dispatchEvent(this, 'select-list:deselect', { detail: { value: data } });
            dispatchEvent(this, 'select-list:change', {
                detail: {
                    value: this.checkedData.map(data => ({
                        label: this.internalLabelMethod(data),
                        value: this.keyMethod(data),
                    })),
                },
            });
            const $item = this.getNodeByVirtualKey(vkey);
            if ($item) {
                this.itemRender($item, vitem);
            }
        }
        searchSelectable(searchString) {
            this.search = searchString;
        }
        clearSelected() {
            if (this.checkedData.length) {
                this.checkedData = [];
            }
        }
        selectById(id) {
            const vitem = this.getVirtualItemByKey(id);
            if (!vitem)
                return;
            const label = this.internalLabelMethod(vitem.data);
            const value = this.keyMethod(vitem.data);
            this.select({ value, label });
        }
        deselectById(id) {
            const vitem = this.getVirtualItemByKey(id);
            if (!vitem)
                return;
            const label = this.internalLabelMethod(vitem.data);
            const value = this.keyMethod(vitem.data);
            this.deselect({ value, label });
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
                        this.#checkedSet = new Set([[...this.#checkedSet][this.#checkedSet.size - 1]]);
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
        _renderItemFocus($item, vitem) {
            $item.classList.toggle('focus', !!this.#focusVitem && this.#focusVitem.virtualKey === vitem.virtualKey);
        }
        _renderItemChecked($item, vitem) {
            if (this.#checkedSet.has(vitem.virtualKey)) {
                $item.classList.add('checked');
            }
            else {
                $item.classList.remove('checked');
            }
        }
        _renderItemDisabled($item, vitem) {
            const isDisabled = (this.disabled || vitem.data[this.disabledField]) ?? false;
            if (isDisabled) {
                $item.setAttribute('disabled', '');
            }
            else {
                $item.removeAttribute('disabled');
            }
        }
        itemRender($item, vitem) {
            if (!$item.classList.contains('item')) {
                $item.classList.add('item');
                if (this.children.length) {
                    const $fragment = document.createDocumentFragment();
                    Array.prototype.forEach.call(this.children, $child => {
                        $fragment.appendChild($child.cloneNode(true));
                    });
                    $item.appendChild($fragment);
                }
                else {
                    $item.innerHTML = `<div class="prefix"></div>
<div class="label"></div>
<div class="suffix"></div>`;
                }
            }
            const $label = $item.querySelector('.label');
            if (!$label)
                return;
            const label = this.internalLabelMethod(vitem.data) ?? '';
            if (this.search && this.search.length) {
                $label.innerHTML = this.parseHighlight(label, this.search)
                    .map(textSlice => {
                    return `<span class="${textSlice.highlight ? 'highlight' : ''}">${textSlice.text}</span>`;
                })
                    .join('');
            }
            else {
                $label.innerHTML = label;
            }
            this._renderItemDisabled($item, vitem);
            this._renderItemChecked($item, vitem);
            this._renderItemFocus($item, vitem);
        }
    };
    return BlocksList = _classThis;
})();
