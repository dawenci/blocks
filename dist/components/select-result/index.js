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
import { append, mountAfter, mountBefore, prepend, unmount } from '../../common/mount.js';
import { attr, attrs } from '../../decorators/attr/index.js';
import { contentTemplate, moreTemplate, placeholderTemplate, searchTemplate, tagTemplate, valueTextTemplate, } from './template.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './style.js';
import { BlClearableControlBox } from '../base-clearable-control-box/index.js';
export let BlSelectResult = (() => {
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
    let _$content_decorators;
    let _$content_initializers = [];
    let _$search_decorators;
    let _$search_initializers = [];
    let _$valueText_decorators;
    let _$valueText_initializers = [];
    let _$placeholder_decorators;
    let _$placeholder_initializers = [];
    var BlSelectResult = class extends BlClearableControlBox {
        static {
            _size_decorators = [attrs.size];
            _multiple_decorators = [attr('boolean')];
            _searchable_decorators = [attr('boolean')];
            _maxTagCount_decorators = [attr('int')];
            _placeholder_decorators = [attr('string')];
            _$content_decorators = [shadowRef('[part="content"]')];
            _$search_decorators = [shadowRef('[part="search"]', false)];
            _$valueText_decorators = [shadowRef('[part="value-text"]', false)];
            _$placeholder_decorators = [shadowRef('[part="placeholder"]', false)];
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } } }, _multiple_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _searchable_decorators, { kind: "accessor", name: "searchable", static: false, private: false, access: { has: obj => "searchable" in obj, get: obj => obj.searchable, set: (obj, value) => { obj.searchable = value; } } }, _searchable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _maxTagCount_decorators, { kind: "accessor", name: "maxTagCount", static: false, private: false, access: { has: obj => "maxTagCount" in obj, get: obj => obj.maxTagCount, set: (obj, value) => { obj.maxTagCount = value; } } }, _maxTagCount_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } } }, _placeholder_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$content_decorators, { kind: "accessor", name: "$content", static: false, private: false, access: { has: obj => "$content" in obj, get: obj => obj.$content, set: (obj, value) => { obj.$content = value; } } }, _$content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$search_decorators, { kind: "accessor", name: "$search", static: false, private: false, access: { has: obj => "$search" in obj, get: obj => obj.$search, set: (obj, value) => { obj.$search = value; } } }, _$search_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$valueText_decorators, { kind: "accessor", name: "$valueText", static: false, private: false, access: { has: obj => "$valueText" in obj, get: obj => obj.$valueText, set: (obj, value) => { obj.$valueText = value; } } }, _$valueText_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$placeholder_decorators, { kind: "accessor", name: "$placeholder", static: false, private: false, access: { has: obj => "$placeholder" in obj, get: obj => obj.$placeholder, set: (obj, value) => { obj.$placeholder = value; } } }, _$placeholder_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlSelectResult = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
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
        #$content_accessor_storage = __runInitializers(this, _$content_initializers, void 0);
        get $content() { return this.#$content_accessor_storage; }
        set $content(value) { this.#$content_accessor_storage = value; }
        #$search_accessor_storage = __runInitializers(this, _$search_initializers, void 0);
        get $search() { return this.#$search_accessor_storage; }
        set $search(value) { this.#$search_accessor_storage = value; }
        #$valueText_accessor_storage = __runInitializers(this, _$valueText_initializers, void 0);
        get $valueText() { return this.#$valueText_accessor_storage; }
        set $valueText(value) { this.#$valueText_accessor_storage = value; }
        #$placeholder_accessor_storage = __runInitializers(this, _$placeholder_initializers, void 0);
        get $placeholder() { return this.#$placeholder_accessor_storage; }
        set $placeholder(value) { this.#$placeholder_accessor_storage = value; }
        constructor() {
            super();
            this.appendContent(contentTemplate());
            this.#setupTabindex();
            this.#setupMultiple();
            this.#setupEmptyClass();
            this.#setupPlaceholder();
            this.#setupData();
            this.#setupSize();
            this.#setupSearch();
            this.#setupDeselect();
            this.#setupClear();
            this.hook.onConnected(this.render);
        }
        #tagSelectedMap = new WeakMap();
        #data = [];
        get data() {
            return this.#data;
        }
        set data(selected) {
            this.#data = selected;
            this._reanderData();
            this._emptyFeature.update();
        }
        get dataCount() {
            return this.data.length;
        }
        #formatter;
        #defaultFormatter = (item) => item?.label ?? '';
        get formatter() {
            return this.#formatter ?? this.#defaultFormatter;
        }
        set formatter(value) {
            if (typeof value === 'function') {
                this.#formatter = value;
            }
            this.render();
        }
        get label() {
            return this.data[0]?.label ?? '';
        }
        get labels() {
            return this.data.map(item => item.label);
        }
        get value() {
            return this.data[0]?.value ?? null;
        }
        get values() {
            return this.data.map(item => item.value);
        }
        acceptSelected(selected) {
            if (this.multiple) {
                this.data = selected.slice();
            }
            else {
                this.data = selected.slice(0, 1);
            }
            dispatchEvent(this, 'select-result:after-accept-selected');
        }
        #setupTabindex() {
            this._tabIndexFeature
                .withTabIndex(0)
                .withTarget(() => (this.searchable ? [this.$search] : [this.$layout]))
                .withPostUpdate(() => {
                if (this.searchable) {
                    this.$layout.removeAttribute('tabindex');
                }
                else {
                    if (this.$search) {
                        this.$search.removeAttribute('tabindex');
                    }
                }
            });
            this.hook.onAttributeChangedDep('searchable', () => {
                this._tabIndexFeature.update();
            });
        }
        #setupEmptyClass() {
            this._emptyFeature.withPredicate(() => !this.dataCount);
            const render = () => this._emptyFeature.update();
            this.hook.onRender(render);
            this.hook.onConnected(render);
            this.hook.onConnected(() => {
                this.addEventListener('select-result:clear', render);
                this.addEventListener('select-result:deselect', render);
                this.addEventListener('select-result:after-accept-selected', render);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('select-result:clear', render);
                this.removeEventListener('select-result:deselect', render);
                this.removeEventListener('select-result:after-accept-selected', render);
            });
        }
        #setupMultiple() {
            const render = () => {
                this.$layout.classList.toggle('single', !this.multiple);
                this.$layout.classList.toggle('multiple', this.multiple);
            };
            this.hook.onRender(render);
            this.hook.onConnected(render);
            this.hook.onAttributeChangedDep('multiple', render);
        }
        #setupPlaceholder() {
            const render = () => {
                if (this.placeholder) {
                    if (!this.$placeholder) {
                        const $placeholder = placeholderTemplate();
                        mountAfter($placeholder, this.$content);
                    }
                    this.$placeholder.textContent = this.placeholder;
                    this.$placeholder.style.left = this.$content.offsetLeft + 'px';
                }
                else {
                    if (this.$placeholder) {
                        unmount(this.$placeholder);
                    }
                }
            };
            this.hook.onRender(render);
            this.hook.onConnected(render);
            this.hook.onAttributeChangedDeps(['placeholder', 'prefix-icon', 'loading'], render);
        }
        #setupClear() {
            const notifyClear = () => {
                if (this.disabled)
                    return;
                dispatchEvent(this, 'select-result:clear');
            };
            this.hook.onConnected(() => {
                this.addEventListener('click-clear', notifyClear);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('click-clear', notifyClear);
            });
        }
        #setupDeselect() {
            const notifyDeselect = (selected) => {
                if (this.disabled)
                    return;
                dispatchEvent(this, 'select-result:deselect', { detail: { value: selected } });
            };
            const onDeselect = (e) => {
                const $tag = e.target;
                notifyDeselect(this.#tagSelectedMap.get($tag));
            };
            this.hook.onConnected(() => {
                this.$layout.addEventListener('close', onDeselect);
            });
            this.hook.onDisconnected(() => {
                this.$layout.removeEventListener('close', onDeselect);
            });
        }
        #setupSearch() {
            this.hook.onRender(this._renderSearchable);
            this.hook.onAttributeChangedDep('searchable', this._renderSearchable);
            this.addEventListener('select-result:search', e => {
                this.$layout.classList.toggle('searching', !!e.detail.searchString.length);
            });
            this.$layout.oninput = e => {
                const searchString = e.target.value;
                this.#notifySearch(searchString);
            };
        }
        _renderSearchable() {
            if (this.searchable) {
                if (!this.$search) {
                    const $search = searchTemplate();
                    prepend($search, this.$content);
                    this._tabIndexFeature.update();
                }
            }
            else {
                if (this.$search) {
                    unmount(this.$search);
                }
            }
        }
        clearSearch() {
            if (this.$search) {
                this.$search.value = '';
                this.#notifySearch('');
            }
        }
        #notifySearch(searchString) {
            if (this.disabled)
                return;
            dispatchEvent(this, 'select-result:search', { detail: { searchString } });
        }
        #setupData() {
            this.hook.onRender(this._reanderData);
            this.hook.onAttributeChangedDep('max-tag-count', this._reanderData);
        }
        _reanderData() {
            this.$layout.classList.toggle('has-result', !!this.dataCount);
            if (!this.multiple) {
                if (!this.$valueText) {
                    const $valueText = valueTextTemplate();
                    append($valueText, this.$content);
                }
                else {
                    this.$valueText.textContent = '';
                }
                this.$content.querySelectorAll('bl-tag').forEach(unmount);
            }
            else if (this.$valueText) {
                unmount(this.$valueText);
            }
            if (!this.multiple) {
                const value = this.data[0];
                this.$valueText.textContent = value ? this.formatter(value) : '';
                return;
            }
            const values = this.data;
            const tagCount = Math.min(values.length, this.maxTagCount);
            const hiddenCount = values.length - tagCount;
            const $tags = this.$content.getElementsByTagName('bl-tag');
            while ($tags.length > tagCount) {
                unmount($tags[$tags.length - 1]);
            }
            while ($tags.length < tagCount) {
                const $tag = tagTemplate();
                append($tag, this.$content);
            }
            for (let i = 0; i < tagCount; i += 1) {
                const item = values[i];
                const $tag = $tags[i];
                const label = this.formatter(item);
                $tag.size = this.size;
                $tag.textContent = label;
                this.#tagSelectedMap.set($tag, item);
                $tag.closeable = this.clearable;
            }
            let $more = this.$content.querySelector('.more');
            if (hiddenCount > 0) {
                if (!$more) {
                    $more = moreTemplate();
                    $more.innerText = `+${hiddenCount}`;
                    if (this.$search) {
                        mountBefore($more, this.$search);
                    }
                    else {
                        append($more, this.$content);
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
        #setupSize() {
            this.hook.onAttributeChangedDep('size', this.render);
        }
    };
    return BlSelectResult = _classThis;
})();
