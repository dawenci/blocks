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
import '../tag/index.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr, attrs } from '../../decorators/attr.js';
import { dispatchEvent } from '../../common/event.js';
import { contentTemplate, moreTemplate, placeholderTemplate, searchTemplate, tagTemplate, valueTextTemplate, } from './template.js';
import { style } from './style.js';
import { append, mountAfter, mountBefore, unmount } from '../../common/mount.js';
import { ClearableControlBox } from '../base-clearable-control-box/index.js';
export let BlocksSelectResult = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-select-result',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _multiple_decorators;
    let _multiple_initializers = [];
    let _searchable_decorators;
    let _searchable_initializers = [];
    let _maxTagCount_decorators;
    let _maxTagCount_initializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    var BlocksSelectResult = class extends ClearableControlBox {
        static {
            _size_decorators = [attrs.size];
            _multiple_decorators = [attr('boolean')];
            _searchable_decorators = [attr('boolean')];
            _maxTagCount_decorators = [attr('int')];
            _placeholder_decorators = [attr('string')];
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } } }, _multiple_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _searchable_decorators, { kind: "accessor", name: "searchable", static: false, private: false, access: { has: obj => "searchable" in obj, get: obj => obj.searchable, set: (obj, value) => { obj.searchable = value; } } }, _searchable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _maxTagCount_decorators, { kind: "accessor", name: "maxTagCount", static: false, private: false, access: { has: obj => "maxTagCount" in obj, get: obj => obj.maxTagCount, set: (obj, value) => { obj.maxTagCount = value; } } }, _maxTagCount_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } } }, _placeholder_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksSelectResult = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return super.observedAttributes.concat([
                'clearable',
                'max-tag-count',
                'multiple',
                'placeholder',
                'prefix-icon',
                'searchable',
                'size',
                'suffix-icon',
            ]);
        }
        #size_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _size_initializers, void 0));
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #multiple_accessor_storage = __runInitializers(this, _multiple_initializers, void 0);
        get multiple() { return this.#multiple_accessor_storage; }
        set multiple(value) { this.#multiple_accessor_storage = value; }
        #searchable_accessor_storage = __runInitializers(this, _searchable_initializers, void 0);
        get searchable() { return this.#searchable_accessor_storage; }
        set searchable(value) { this.#searchable_accessor_storage = value; }
        #maxTagCount_accessor_storage = __runInitializers(this, _maxTagCount_initializers, Infinity);
        get maxTagCount() { return this.#maxTagCount_accessor_storage; }
        set maxTagCount(value) { this.#maxTagCount_accessor_storage = value; }
        #placeholder_accessor_storage = __runInitializers(this, _placeholder_initializers, void 0);
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        constructor() {
            super();
            this._ref.$content = this._appendContent(contentTemplate());
            this._ref.$layout.oninput = e => {
                const searchString = e.target.value;
                this.#notifySearch(searchString);
            };
            this.addEventListener('click-clear', () => {
                this.#notifyClear();
            });
            this._ref.$layout.onclose = e => {
                const $tag = e.target;
                const label = $tag.textContent ?? '';
                const value = $tag.dataset.value;
                this.deselect({ value, label });
            };
        }
        #formatter;
        get formatter() {
            if (this.#formatter) {
                return this.#formatter;
            }
            return (item) => item?.label ?? '';
        }
        set formatter(value) {
            if (typeof value === 'function') {
                this.#formatter = value;
            }
            this.render();
        }
        get label() {
            return this._ref.$content.textContent;
        }
        _value = null;
        get value() {
            return this._value;
        }
        set value(value) {
            this._value = value;
            this._renderValue();
        }
        #notifySearch(searchString) {
            if (this.disabled)
                return;
            dispatchEvent(this, 'select-result:search', { detail: { searchString } });
        }
        #notifyClear() {
            if (this.disabled)
                return;
            dispatchEvent(this, 'select-result:clear');
        }
        #notifyDeselect(selected) {
            if (this.disabled)
                return;
            dispatchEvent(this, 'select-result:deselect', {
                detail: { value: selected },
            });
        }
        acceptSelected(value) {
            if (this.multiple) {
                const currentValues = this.getValues();
                const isSame = currentValues.length === value.length &&
                    currentValues.every((item, index) => item.value === value[index].value && item.label === value[index].label);
                if (isSame) {
                    return;
                }
                this.value = value.slice();
            }
            else {
                if (value.length === 0) {
                    this.value = null;
                }
                else {
                    this.value = value[0];
                }
            }
        }
        select(selected) {
            if (!this.multiple) {
                this.acceptSelected([selected]);
            }
            else {
                const values = this.getValues().filter(item => item.value !== selected.value);
                values.push(selected);
                this.acceptSelected(values);
            }
        }
        deselect(selected) {
            const values = this.getValues();
            const newValues = values.filter(item => item.value !== selected.value);
            this.acceptSelected(newValues);
            this._renderValue();
            this.#notifyDeselect(selected);
        }
        getValue() {
            if (this.value == null) {
                return null;
            }
            if (Array.isArray(this.value)) {
                return this.value[0] ?? null;
            }
            return this.value;
        }
        getValues() {
            if (this.value == null) {
                return [];
            }
            if (Array.isArray(this.value)) {
                return this.value;
            }
            return [this.value];
        }
        clearValue() {
            this._value = null;
            this._renderValue();
        }
        _isEmpty() {
            return this.multiple ? !this._ref.$content.querySelectorAll('bl-tag').length : !this._ref.$content.textContent;
        }
        clearSearch() {
            if (this._ref.$search) {
                this._ref.$search.value = '';
                this.#notifySearch('');
            }
        }
        _renderClass() {
            this._ref.$layout.classList.toggle('single', !this.multiple);
            this._ref.$layout.classList.toggle('multiple', this.multiple);
        }
        _renderPlaceholder() {
            if (this.placeholder) {
                if (!this._ref.$placeholder) {
                    this._ref.$placeholder = placeholderTemplate();
                    mountAfter(this._ref.$placeholder, this._ref.$content);
                }
                this._ref.$placeholder.textContent = this.placeholder;
                this._ref.$placeholder.style.left = this._ref.$content.offsetLeft + 'px';
            }
            else {
                if (this._ref.$placeholder) {
                    unmount(this._ref.$placeholder);
                    this._ref.$placeholder = undefined;
                }
            }
        }
        _renderSearchable() {
            this.internalTabIndex = this.searchable ? '-1' : '0';
            if (this.searchable) {
                if (!this._ref.$search) {
                    const $search = searchTemplate();
                    this._ref.$search = $search;
                    if (this._ref.$plainTextValue) {
                        mountBefore($search, this._ref.$plainTextValue);
                    }
                    else {
                        append($search, this._ref.$content);
                    }
                }
            }
            else {
                if (this._ref.$search) {
                    unmount(this._ref.$search);
                }
            }
        }
        _renderValue() {
            this._ref.$layout.classList.toggle('empty', !this.getValues().length);
            if (!this.multiple) {
                if (!this._ref.$plainTextValue) {
                    this._ref.$plainTextValue = valueTextTemplate();
                    append(this._ref.$plainTextValue, this._ref.$content);
                }
                else {
                    this._ref.$plainTextValue.textContent = '';
                }
                this._ref.$content.querySelectorAll('bl-tag').forEach(unmount);
            }
            else if (this._ref.$plainTextValue) {
                unmount(this._ref.$plainTextValue);
            }
            if (!this.multiple) {
                const value = this.getValue();
                this._ref.$plainTextValue.textContent = value ? this.formatter(value) : '';
                return;
            }
            const values = this.getValues();
            const tagCount = Math.min(values.length, this.maxTagCount);
            const hiddenCount = values.length - tagCount;
            const $tags = this._ref.$content.getElementsByTagName('bl-tag');
            while ($tags.length > tagCount) {
                unmount($tags[$tags.length - 1]);
            }
            while ($tags.length < tagCount) {
                const $tag = tagTemplate();
                if (this._ref.$search) {
                    mountBefore($tag, this._ref.$search);
                }
                else {
                    append($tag, this._ref.$content);
                }
            }
            for (let i = 0; i < tagCount; i += 1) {
                const item = values[i];
                const $tag = $tags[i];
                const label = this.formatter(item);
                const value = item.value;
                $tag.size = this.size;
                $tag.textContent = label;
                $tag.dataset.value = value;
                $tag.closeable = this.clearable;
            }
            let $more = this._ref.$content.querySelector('.more');
            if (hiddenCount > 0) {
                if (!$more) {
                    $more = moreTemplate();
                    $more.innerText = `+${hiddenCount}`;
                    if (this._ref.$search) {
                        mountBefore($more, this._ref.$search);
                    }
                    else {
                        append($more, this._ref.$content);
                    }
                }
                else {
                    $more.innerText = `+${hiddenCount}`;
                }
            }
            else {
                if ($more) {
                    unmount($more);
                }
            }
        }
        render() {
            super.render();
            this._renderClass();
            this._renderPlaceholder();
            this._renderSearchable();
            this._renderValue();
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            switch (attrName) {
                case 'max-tag-count': {
                    this._renderValue();
                    break;
                }
                case 'multiple': {
                    this._renderClass();
                    break;
                }
                case 'placeholder': {
                    this._renderPlaceholder();
                    break;
                }
                case 'searchable': {
                    this._renderSearchable();
                    break;
                }
                case 'prefix-icon':
                case 'loading': {
                    this._renderPlaceholder();
                    break;
                }
                case 'size': {
                    this.render();
                    break;
                }
            }
        }
    };
    return BlocksSelectResult = _classThis;
})();
