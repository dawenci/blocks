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
import { BlocksVList, VirtualItem } from '../vlist/index.js';
import { attr } from '../../decorators/attr.js';
import { boolSetter } from '../../common/property.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { isEmpty, merge, uniqBy, flatten } from '../../common/utils.js';
import { parseHighlight } from '../../common/highlight.js';
import { style } from './style.js';
export class VirtualNode extends VirtualItem {
    constructor(options) {
        super(options);
        this.parentKey = options.parentKey;
        this.expanded = !!options.expanded;
        this.checked = !!options.checked;
        this.indeterminate = !!options.indeterminate;
        this.parent = null;
        this.children = [];
        this._retain = false;
    }
}
export let BlocksTree = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-tree',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _activeKey_decorators;
    let _activeKey_initializers = [];
    let _activable_decorators;
    let _activable_initializers = [];
    let _checkable_decorators;
    let _checkable_initializers = [];
    let _checkOnClickNode_decorators;
    let _checkOnClickNode_initializers = [];
    let _checkStrictly_decorators;
    let _checkStrictly_initializers = [];
    let _defaultFoldAll_decorators;
    let _defaultFoldAll_initializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _expandOnClickNode_decorators;
    let _expandOnClickNode_initializers = [];
    let _wrap_decorators;
    let _wrap_initializers = [];
    let _multiple_decorators;
    let _multiple_initializers = [];
    let _indentUnit_decorators;
    let _indentUnit_initializers = [];
    let _idField_decorators;
    let _idField_initializers = [];
    let _labelField_decorators;
    let _labelField_initializers = [];
    let _search_decorators;
    let _search_initializers = [];
    var BlocksTree = class extends BlocksVList {
        static {
            _activeKey_decorators = [attr('string')];
            _activable_decorators = [attr('boolean')];
            _checkable_decorators = [attr('boolean')];
            _checkOnClickNode_decorators = [attr('boolean')];
            _checkStrictly_decorators = [attr('boolean')];
            _defaultFoldAll_decorators = [attr('boolean')];
            _disabled_decorators = [attr('boolean')];
            _expandOnClickNode_decorators = [attr('boolean')];
            _wrap_decorators = [attr('boolean')];
            _multiple_decorators = [attr('boolean')];
            _indentUnit_decorators = [attr('int')];
            _idField_decorators = [attr('string')];
            _labelField_decorators = [attr('string')];
            _search_decorators = [attr('string')];
            __esDecorate(this, null, _activeKey_decorators, { kind: "accessor", name: "activeKey", static: false, private: false, access: { has: obj => "activeKey" in obj, get: obj => obj.activeKey, set: (obj, value) => { obj.activeKey = value; } } }, _activeKey_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _activable_decorators, { kind: "accessor", name: "activable", static: false, private: false, access: { has: obj => "activable" in obj, get: obj => obj.activable, set: (obj, value) => { obj.activable = value; } } }, _activable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _checkable_decorators, { kind: "accessor", name: "checkable", static: false, private: false, access: { has: obj => "checkable" in obj, get: obj => obj.checkable, set: (obj, value) => { obj.checkable = value; } } }, _checkable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _checkOnClickNode_decorators, { kind: "accessor", name: "checkOnClickNode", static: false, private: false, access: { has: obj => "checkOnClickNode" in obj, get: obj => obj.checkOnClickNode, set: (obj, value) => { obj.checkOnClickNode = value; } } }, _checkOnClickNode_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _checkStrictly_decorators, { kind: "accessor", name: "checkStrictly", static: false, private: false, access: { has: obj => "checkStrictly" in obj, get: obj => obj.checkStrictly, set: (obj, value) => { obj.checkStrictly = value; } } }, _checkStrictly_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _defaultFoldAll_decorators, { kind: "accessor", name: "defaultFoldAll", static: false, private: false, access: { has: obj => "defaultFoldAll" in obj, get: obj => obj.defaultFoldAll, set: (obj, value) => { obj.defaultFoldAll = value; } } }, _defaultFoldAll_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _expandOnClickNode_decorators, { kind: "accessor", name: "expandOnClickNode", static: false, private: false, access: { has: obj => "expandOnClickNode" in obj, get: obj => obj.expandOnClickNode, set: (obj, value) => { obj.expandOnClickNode = value; } } }, _expandOnClickNode_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _wrap_decorators, { kind: "accessor", name: "wrap", static: false, private: false, access: { has: obj => "wrap" in obj, get: obj => obj.wrap, set: (obj, value) => { obj.wrap = value; } } }, _wrap_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } } }, _multiple_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _indentUnit_decorators, { kind: "accessor", name: "indentUnit", static: false, private: false, access: { has: obj => "indentUnit" in obj, get: obj => obj.indentUnit, set: (obj, value) => { obj.indentUnit = value; } } }, _indentUnit_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _idField_decorators, { kind: "accessor", name: "idField", static: false, private: false, access: { has: obj => "idField" in obj, get: obj => obj.idField, set: (obj, value) => { obj.idField = value; } } }, _idField_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _labelField_decorators, { kind: "accessor", name: "labelField", static: false, private: false, access: { has: obj => "labelField" in obj, get: obj => obj.labelField, set: (obj, value) => { obj.labelField = value; } } }, _labelField_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _search_decorators, { kind: "accessor", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search, set: (obj, value) => { obj.search = value; } } }, _search_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksTree = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...super.observedAttributes, ...['border', 'stripe']];
        }
        #activeKey_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _activeKey_initializers, void 0));
        get activeKey() { return this.#activeKey_accessor_storage; }
        set activeKey(value) { this.#activeKey_accessor_storage = value; }
        #activable_accessor_storage = __runInitializers(this, _activable_initializers, void 0);
        get activable() { return this.#activable_accessor_storage; }
        set activable(value) { this.#activable_accessor_storage = value; }
        #checkable_accessor_storage = __runInitializers(this, _checkable_initializers, void 0);
        get checkable() { return this.#checkable_accessor_storage; }
        set checkable(value) { this.#checkable_accessor_storage = value; }
        #checkOnClickNode_accessor_storage = __runInitializers(this, _checkOnClickNode_initializers, void 0);
        get checkOnClickNode() { return this.#checkOnClickNode_accessor_storage; }
        set checkOnClickNode(value) { this.#checkOnClickNode_accessor_storage = value; }
        #checkStrictly_accessor_storage = __runInitializers(this, _checkStrictly_initializers, void 0);
        get checkStrictly() { return this.#checkStrictly_accessor_storage; }
        set checkStrictly(value) { this.#checkStrictly_accessor_storage = value; }
        #defaultFoldAll_accessor_storage = __runInitializers(this, _defaultFoldAll_initializers, void 0);
        get defaultFoldAll() { return this.#defaultFoldAll_accessor_storage; }
        set defaultFoldAll(value) { this.#defaultFoldAll_accessor_storage = value; }
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, void 0);
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #expandOnClickNode_accessor_storage = __runInitializers(this, _expandOnClickNode_initializers, void 0);
        get expandOnClickNode() { return this.#expandOnClickNode_accessor_storage; }
        set expandOnClickNode(value) { this.#expandOnClickNode_accessor_storage = value; }
        #wrap_accessor_storage = __runInitializers(this, _wrap_initializers, void 0);
        get wrap() { return this.#wrap_accessor_storage; }
        set wrap(value) { this.#wrap_accessor_storage = value; }
        #multiple_accessor_storage = __runInitializers(this, _multiple_initializers, void 0);
        get multiple() { return this.#multiple_accessor_storage; }
        set multiple(value) { this.#multiple_accessor_storage = value; }
        #indentUnit_accessor_storage = __runInitializers(this, _indentUnit_initializers, 16);
        get indentUnit() { return this.#indentUnit_accessor_storage; }
        set indentUnit(value) { this.#indentUnit_accessor_storage = value; }
        #idField_accessor_storage = __runInitializers(this, _idField_initializers, void 0);
        get idField() { return this.#idField_accessor_storage; }
        set idField(value) { this.#idField_accessor_storage = value; }
        #labelField_accessor_storage = __runInitializers(this, _labelField_initializers, void 0);
        get labelField() { return this.#labelField_accessor_storage; }
        set labelField(value) { this.#labelField_accessor_storage = value; }
        #search_accessor_storage = __runInitializers(this, _search_initializers, void 0);
        get search() { return this.#search_accessor_storage; }
        set search(value) { this.#search_accessor_storage = value; }
        labelMethod;
        _checkedSet;
        #batchUpdateFold;
        #lastChecked;
        constructor() {
            super();
            this._checkedSet = new Set();
            this.$list.onclick = this.#onClick.bind(this);
            const onBound = () => {
                this.removeEventListener('data-bound', onBound);
                if (this.defaultFoldAll) {
                    this.foldAll();
                }
                if (this._checkedSet.size) {
                    this._checkedSet = new Set();
                }
            };
            this.addEventListener('data-bound', onBound);
            this.onAttributeChangedDep('search', () => {
                this.generateViewData();
            });
            this.onAttributeChangedDep('wrap', () => {
                this._resetCalculated();
                this.redraw();
                this.restoreAnchor();
            });
        }
        get checkedData() {
            const data = [...this._checkedSet].map(vitem => vitem.data);
            return data;
        }
        set checkedData(value) {
            const vitems = value
                .map(data => this.virtualDataMap[this.internalKeyMethod(data)])
                .filter(vitem => !!vitem);
            this._checkedSet = new Set(vitems);
            this.render();
            dispatchEvent(this, 'select-list:change', {
                detail: {
                    value: vitems.map(vitem => {
                        return {
                            label: this.internalLabelMethod(vitem.data),
                            value: this.internalKeyMethod(vitem.data),
                        };
                    }),
                },
            });
        }
        get checked() {
            const list = [...this._checkedSet];
            return list.map(vitem => vitem.virtualKey);
        }
        set checked(ids) {
            const vitems = ids.map(id => this.virtualDataMap[id]).filter(vitem => !!vitem);
            this._checkedSet = new Set(vitems);
            this.render();
            dispatchEvent(this, 'select-list:change', {
                detail: {
                    value: vitems.map(vitem => {
                        return {
                            label: this.internalLabelMethod(vitem.data),
                            value: this.internalKeyMethod(vitem.data),
                        };
                    }),
                },
            });
        }
        select(data) {
            this.#toggleCheck(data.value, true);
        }
        deselect(data) {
            this.#toggleCheck(data.value, false);
        }
        clearSelected() {
            if (!this.multiple) {
                if (this.#lastChecked) {
                    this.#updateCheck(this.#lastChecked, false);
                    dispatchEvent(this, 'select-list:change', {
                        detail: {
                            value: [],
                        },
                    });
                }
                return;
            }
            this.#batchToggleCheck(this.checked, false);
        }
        internalLabelMethod(data) {
            if (typeof this.labelMethod === 'function')
                return this.labelMethod(data) ?? '';
            if (typeof this.labelField === 'string')
                return data[this.labelField] ?? '';
            return data.label ?? '';
        }
        internalKeyMethod(data) {
            if (typeof this.keyMethod === 'function')
                return this.keyMethod(data);
            if (typeof this.idField === 'string')
                return data[this.idField];
            return data.id;
        }
        filterMethod(data) {
            if (!this.search)
                return Promise.resolve(data);
            const len = data.length;
            const results = [];
            for (let i = 0; i < len; i += 1) {
                const vItem = data[i];
                if (this.internalLabelMethod(vItem.data).includes(this.search)) {
                    vItem._retain = true;
                    let parent = vItem.parent;
                    while (parent) {
                        parent._retain = true;
                        parent = parent.parent;
                    }
                }
            }
            return new Promise(resolve => {
                setTimeout(() => {
                    for (let i = 0; i < len; i += 1) {
                        const vItem = data[i];
                        if (vItem._retain) {
                            results.push(vItem);
                            vItem._retain = undefined;
                        }
                    }
                    resolve(results);
                });
            });
        }
        _renderItemClass($item, vitem) {
            $item.classList.add('node-item');
            $item.classList.toggle('node-item-active', String(vitem.virtualKey) === this.activeKey);
            $item.style.paddingLeft = this.#indent(vitem) + 'px';
        }
        _renderItemArrow($item, vitem) {
            let $toggle = $item.querySelector('.node-toggle');
            if (!$toggle) {
                $toggle = document.createElement('span');
                $toggle.className = 'node-toggle';
                $item.children.length ? $item.insertBefore($toggle, $item.firstElementChild) : $item.appendChild($toggle);
            }
            if (this.hasChild(vitem)) {
                $toggle.classList.remove('is-leaf');
                $toggle.classList.toggle('folded', !vitem.expanded);
                $toggle.classList.toggle('expanded', !!vitem.expanded);
            }
            else {
                $toggle.classList.remove('folded');
                $toggle.classList.remove('expanded');
                $toggle.classList.add('is-leaf');
            }
        }
        _renderItemCheckable($item, vitem) {
            let $check = $item.querySelector('.node-check');
            if (!this.checkable) {
                if ($check)
                    $item.removeChild($check);
            }
            else {
                let $input;
                let $label;
                if (!$check) {
                    $check = document.createElement('span');
                    $check.className = 'node-check';
                    if ($item.lastElementChild.classList.contains('node-label')) {
                        $item.insertBefore($check, $item.lastElementChild);
                    }
                    else {
                        $item.appendChild($check);
                    }
                    $input = $check.appendChild(document.createElement('input'));
                    $input.name = 'node-check-name';
                    $input.className = 'node-check-input';
                    $label = $check.appendChild(document.createElement('label'));
                    $label.classList.add('node-check-label');
                }
                else {
                    $input = $check.querySelector('input');
                    $label = $check.querySelector('label');
                }
                $input.id = `node-check-${vitem.virtualKey}-${this.cid}`;
                $label.setAttribute('for', $input.id);
                boolSetter('checked')($input, vitem.checked);
                boolSetter('disabled')($input, this.disableCheckMethod?.(vitem.data) ?? false);
                $input.setAttribute('data-tree-node-key', vitem.virtualKey);
                if (!this.multiple) {
                    $input.setAttribute('type', 'radio');
                }
                else {
                    $input.setAttribute('type', 'checkbox');
                    const isIndeterminate = !this.checkStrictly && vitem.indeterminate;
                    $input.classList.toggle('indeterminate', isIndeterminate);
                    $input.indeterminate = isIndeterminate;
                }
            }
        }
        _renderItemContent($item, vitem) {
            let $label = $item.querySelector('.node-label');
            let $labelText;
            if (!$label) {
                $label = $item.appendChild(document.createElement('span'));
                $labelText = $label.appendChild(document.createElement('span'));
                $label.classList.add('node-label');
            }
            else {
                $labelText = $label.querySelector('span');
            }
            const text = this.internalLabelMethod(vitem.data);
            if (this.search && this.search.length) {
                $labelText.innerHTML = this.parseHighlight(text, this.search)
                    .map(textSlice => {
                    return `<span class="${textSlice.highlight ? 'highlight' : ''}">${textSlice.text}</span>`;
                })
                    .join('');
            }
            else {
                $labelText.innerHTML = text;
            }
        }
        itemRender($item, vitem) {
            this._renderItemClass($item, vitem);
            this._renderItemArrow($item, vitem);
            this._renderItemCheckable($item, vitem);
            this._renderItemContent($item, vitem);
        }
        disableActiveMethod(data) {
            return false;
        }
        disableToggleMethod(data) {
            return false;
        }
        disableCheckMethod(data) {
            return false;
        }
        active(virtualKey, options) {
            if (!this.activable)
                return;
            const oldKey = this.activeKey ?? '';
            const newItem = this.getVirtualItemByKey(virtualKey);
            if (!newItem)
                return;
            this.activeKey = virtualKey;
            const $newNode = this.getNodeByVirtualKey(virtualKey);
            this.itemRender($newNode, newItem);
            const oldItem = this.getVirtualItemByKey(oldKey);
            const $oldNode = this.getNodeByVirtualKey(oldKey);
            if ($oldNode) {
                this.itemRender($oldNode, oldItem);
            }
            if (!options || !options.preventEmit) {
                dispatchEvent(this, 'active', {
                    detail: { key: virtualKey, oldKey },
                });
            }
        }
        getActive() {
            return this.activeKey;
        }
        clearActive(options) {
            if (this.activeKey) {
                const virtualKey = this.activeKey;
                this.activeKey = null;
                if (!options || !options.preventEmit) {
                    dispatchEvent(this, 'inactive', {
                        detail: { key: virtualKey },
                    });
                }
            }
        }
        expand(virtualKey) {
            const node = this.getVirtualItemByKey(virtualKey);
            if (node)
                return this.#expand(node);
        }
        fold(virtualKey) {
            const node = this.getVirtualItemByKey(virtualKey);
            if (node)
                return this.#fold(node);
        }
        toggle(virtualKey) {
            const node = this.getVirtualItemByKey(virtualKey);
            if (!node)
                return;
            if (node.expanded)
                this.#fold(node);
            else
                this.#expand(node);
        }
        foldAll() {
            ;
            this.virtualData.forEach(node => {
                if (node.children) {
                    node.expanded = false;
                }
            });
            this.#batchUpdateFold = true;
            this.#updateFold(this.virtualData);
            this.#batchUpdateFold = false;
        }
        expandAll() {
            ;
            this.virtualData.forEach(node => {
                if (node.children)
                    node.expanded = true;
            });
            this.#batchUpdateFold = true;
            this.#updateFold(this.virtualData);
            this.#batchUpdateFold = false;
        }
        #toggleCheck(virtualKey, value, options = {}) {
            if (!this.checkable)
                return;
            const vitem = this.getVirtualItemByKey(virtualKey);
            if (!vitem || vitem.checked === value)
                return;
            if (!this.multiple) {
                this.#toggleRadio(vitem, options);
                return;
            }
            this.#batchToggleCheck([virtualKey], value, options);
        }
        #toggleRadio(vitem, options) {
            if (this.#lastChecked) {
                if (this.#lastChecked === vitem)
                    return;
                this.#updateCheck(this.#lastChecked, false, options.toggleCheckEvent);
                dispatchEvent(this, 'select-list:deselect', {
                    detail: {
                        value: {
                            label: this.internalLabelMethod(this.#lastChecked.data),
                            value: this.#lastChecked.virtualKey,
                        },
                    },
                });
            }
            this.#updateCheck(vitem, true, options.toggleCheckEvent);
            this.#lastChecked = vitem;
            dispatchEvent(this, 'select-list:select', {
                detail: {
                    value: {
                        value: vitem.virtualKey,
                        label: this.internalLabelMethod(vitem.data),
                    },
                },
            });
            dispatchEvent(this, 'select-list:change', {
                detail: {
                    value: [
                        {
                            value: vitem.virtualKey,
                            label: this.internalLabelMethod(vitem.data),
                        },
                    ],
                },
            });
        }
        #batchToggleCheckStrictly(vItems, value, options = {}) {
            const disabled = typeof options.disabled === 'boolean' ? options.disabled : false;
            const checked = typeof value === 'boolean' ? value : !vItems.every(vitem => vitem.checked);
            vItems.forEach(vitem => {
                if (disabled || !this.disableCheckMethod(vitem.data)) {
                    this.#updateCheck(vitem, checked, options.toggleCheckEvent);
                }
            });
        }
        #batchToggleCheckNonStrictly(vItems, value, options = {}) {
            const disabled = typeof options.disabled === 'boolean' ? options.disabled : false;
            if (!disabled) {
                vItems = vItems.filter(vitem => !this.disableCheckMethod(vitem.data));
                if (!vItems.length)
                    return;
            }
            const descendant = flatten(vItems.map(this.#descendant.bind(this)));
            const excluded = [];
            const leaves = [];
            if (disabled) {
                descendant.forEach(vitem => {
                    if (isEmpty(vitem.children)) {
                        leaves.push(vitem);
                    }
                });
            }
            else {
                descendant.forEach(vitem => {
                    if (this.disableCheckMethod(vitem.data)) {
                        excluded.push(vitem);
                    }
                    else if (isEmpty(vitem.children)) {
                        leaves.push(vitem);
                    }
                });
            }
            let checked;
            if (value == null) {
                checked = !(leaves.length ? leaves.every(leaf => leaf.checked) : vItems.every(node => node.checked));
            }
            else {
                checked = !!value;
            }
            {
                leaves.forEach(vitem => {
                    this.#updateCheck(vitem, checked, options.toggleCheckEvent);
                    this.#updateIndeterminate(vitem, false);
                });
                vItems.forEach(vitem => {
                    this.#updateCheck(vitem, checked, options.toggleCheckEvent);
                    this.#updateIndeterminate(vitem, false);
                });
            }
            {
                leaves.forEach(vitem => this.#updateAncestorFrom(vitem, options.toggleCheckEvent));
                vItems.forEach(vitem => this.#updateAncestorFrom(vitem, options.toggleCheckEvent));
                excluded.forEach(vitem => {
                    if (vitem.checked !== checked)
                        this.#updateAncestorFrom(vitem, options.toggleCheckEvent);
                });
            }
        }
        #batchToggleCheck(virtualKeys, value, options = {}) {
            if (!this.multiple)
                return;
            const vitems = uniqBy(vitem => vitem.virtualKey, virtualKeys.map(this.getVirtualItemByKey.bind(this)));
            if (!vitems.length)
                return;
            options = merge({}, options, { toggleCheckEvent: {} });
            if (this.checkStrictly) {
                this.#batchToggleCheckStrictly(vitems, value, options);
            }
            else {
                this.#batchToggleCheckNonStrictly(vitems, value, options);
            }
            if (!options.preventEmit && !isEmpty(options.toggleCheckEvent)) {
                Object.keys(options.toggleCheckEvent).forEach(eventName => {
                    const data = options.toggleCheckEvent[eventName];
                    if (data.length === 1) {
                        dispatchEvent(this, eventName, {
                            detail: {
                                value: {
                                    value: this.internalKeyMethod(data[0]),
                                    label: this.internalLabelMethod(data[0]),
                                },
                            },
                        });
                    }
                });
                dispatchEvent(this, 'select-list:change', {
                    detail: {
                        value: this.checkedData.map(data => {
                            return {
                                label: this.internalLabelMethod(data),
                                value: this.internalKeyMethod(data),
                            };
                        }),
                    },
                });
            }
        }
        #updateCheck(vitem, checked, event = {}) {
            if (vitem.checked !== checked) {
                const eventName = checked ? 'select-list:select' : 'select-list:deselect';
                if (!event[eventName]) {
                    event[eventName] = [];
                }
                event[eventName].push({
                    value: vitem.virtualKey,
                    label: this.internalLabelMethod(vitem.data),
                });
            }
            vitem.checked = checked;
            this._checkedSet[checked ? 'add' : 'delete'](vitem);
            const $item = this.getNodeByVirtualKey(vitem.virtualKey);
            if ($item)
                this.itemRender($item, vitem);
        }
        #updateIndeterminate(vitem, value) {
            vitem.indeterminate = value;
            const $item = this.getNodeByVirtualKey(vitem.virtualKey);
            if ($item) {
                const $input = $item.querySelector('input');
                $input.indeterminate = value;
                $input.classList.toggle('indeterminate', value);
            }
        }
        #childrenStatus(vitem) {
            const children = vitem.children;
            let count = children?.length;
            if (!count)
                return [0, false];
            let hasIndeterminateChild = false;
            let checkedCount = 0;
            while (count--) {
                const child = children[count];
                if (child.checked)
                    checkedCount += 1;
                else if (child.indeterminate)
                    hasIndeterminateChild = true;
            }
            if (checkedCount === children.length) {
                return [1, false];
            }
            if (checkedCount > 0) {
                return [0.5, true];
            }
            return [0, hasIndeterminateChild];
        }
        #updateAncestorFrom(node, event) {
            const ancestor = this.#ancestor(node).reverse();
            let hasIndeterminate = false;
            while (ancestor.length) {
                const parent = ancestor.pop();
                if (!parent)
                    break;
                if (hasIndeterminate) {
                    this.#updateCheck(parent, false, event);
                    this.#updateIndeterminate(parent, true);
                    continue;
                }
                const [checkedStatus, indeterminate] = this.#childrenStatus(parent);
                if (indeterminate) {
                    hasIndeterminate = true;
                    this.#updateCheck(parent, false, event);
                    this.#updateIndeterminate(parent, true);
                    continue;
                }
                this.#updateCheck(parent, checkedStatus === 1, event);
                this.#updateIndeterminate(parent, checkedStatus === 0.5);
            }
        }
        #updateFold(vItems) {
            const expandItems = vItems.filter(vItem => vItem.expanded);
            const foldedItems = vItems.filter(vItem => !vItem.expanded);
            foldedItems.forEach(vItem => {
                this.#fold(vItem);
            });
            expandItems.forEach(vItem => {
                this.#expand(vItem);
            });
        }
        #expand(vitem, preventEmit = false) {
            vitem.expanded = true;
            const listKeys = this.#descendant(vitem)
                .filter(child => this.visible(child))
                .map(child => child.virtualKey);
            if (listKeys.length) {
                this.showByKeys(listKeys, this.#batchUpdateFold);
            }
            if (!preventEmit) {
                dispatchEvent(this, 'expand', {
                    detail: { key: vitem.virtualKey },
                });
            }
        }
        #fold(node, preventEmit = false) {
            node.expanded = false;
            const children = this.#descendant(node);
            const listKeys = children.map(child => child.virtualKey);
            if (listKeys.length) {
                this.hideByKeys(listKeys, this.#batchUpdateFold);
            }
            if (this.activeKey && children.findIndex(child => child.virtualKey === this.activeKey) !== -1) {
                const virtualKey = this.activeKey;
                this.activeKey = null;
                if (!preventEmit) {
                    dispatchEvent(this, 'inactive', {
                        detail: { key: virtualKey },
                    });
                }
            }
            if (!preventEmit) {
                dispatchEvent(this, 'fold', {
                    detail: { key: node.virtualKey },
                });
            }
        }
        #descendant(node) {
            const pickChild = (node, children = []) => {
                if (!node.children)
                    return children;
                node.children.forEach(child => {
                    children.push(child);
                    pickChild(child, children);
                });
                return children;
            };
            return pickChild(node);
        }
        #ancestor(node) {
            const result = [];
            while (node.parent) {
                result.push(node.parent);
                node = node.parent;
            }
            return result;
        }
        #siblings(node) {
            const parent = node.parent;
            if (parent) {
                return parent.children ?? [];
            }
            return this.virtualData.filter(node => !node.parent);
        }
        async virtualMap(data) {
            const virtualData = [];
            let index = 0;
            const convert = (data) => {
                const virtualKey = this.internalKeyMethod(data) ?? index;
                const vnode = new VirtualNode({
                    virtualKey,
                    height: this.defaultItemSize,
                    data,
                    checked: false,
                    expanded: true,
                    children: [],
                });
                virtualData.push(vnode);
                index += 1;
                const len = data.children?.length;
                if (len) {
                    for (let i = 0; i < len; i += 1) {
                        const childNode = convert(data.children[i]);
                        childNode.parent = vnode;
                        childNode.parentKey = vnode.virtualKey;
                        vnode.children.push(childNode);
                    }
                }
                return vnode;
            };
            data.forEach(convert);
            return virtualData;
        }
        level(node) {
            let level = 1;
            while (node.parent) {
                level += 1;
                node = node.parent;
            }
            return level;
        }
        isTopLevel(node) {
            return !!node.parent;
        }
        hasChild(node) {
            return node.children && node.children.length > 0;
        }
        visible(node) {
            if (node.parent && (!node.parent.expanded || !this.visible(node.parent))) {
                return false;
            }
            return true;
        }
        parseHighlight(label, highlightText) {
            return parseHighlight(label, highlightText);
        }
        #onClick(e) {
            let nodeItem;
            let el = e.target;
            let doToggle = false;
            let doCheck = false;
            let doActive = false;
            while (el) {
                if (el === e.currentTarget)
                    break;
                if (el.classList.contains('node-toggle')) {
                    nodeItem = el.parentElement;
                    doToggle = true;
                    break;
                }
                if (el.classList.contains('node-check-input')) {
                    nodeItem = el.parentElement.parentElement;
                    if (el.disabled) {
                        break;
                    }
                    doCheck = true;
                    break;
                }
                if (el.classList.contains('node-label')) {
                    nodeItem = el.parentElement;
                    doActive = true;
                    if (this.expandOnClickNode) {
                        doToggle = true;
                    }
                    if (this.checkOnClickNode) {
                        doCheck = true;
                    }
                    break;
                }
                if (el.classList.contains('node-item')) {
                    nodeItem = el;
                    doActive = true;
                    break;
                }
                el = el.parentNode;
            }
            if (!nodeItem)
                return;
            const virtualKey = nodeItem.dataset.virtualKey;
            if (doToggle) {
                if (!this.disableToggleMethod(this.getVirtualItemByKey(virtualKey).data)) {
                    this.toggle(virtualKey);
                }
            }
            if (doCheck) {
                if (!this.disableCheckMethod(this.getVirtualItemByKey(virtualKey).data)) {
                    this.#toggleCheck(virtualKey);
                }
            }
            if (doActive) {
                if (!this.disableActiveMethod(this.getVirtualItemByKey(virtualKey).data)) {
                    this.active(virtualKey);
                }
            }
            dispatchEvent(this, 'click', {
                detail: { key: virtualKey },
            });
        }
        #indent(node) {
            return (this.level(node) - 1) * this.indentUnit;
        }
        #nodeStyle(node) {
            const indent = this.#indent(node);
            return {
                paddingLeft: `${indent}px`,
            };
        }
    };
    return BlocksTree = _classThis;
})();
