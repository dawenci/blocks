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
import { connectSelectable, } from '../../common/connectSelectable.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { treeTemplate, popupTemplate, styleTemplate } from './template.js';
import { BlocksPopup, PopupOrigin } from '../popup/index.js';
import { BlocksTree } from '../tree/index.js';
import { Control } from '../base-control/index.js';
export let BlocksDropdownTree = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-dropdown-tree',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _triggerMode_decorators;
    let _triggerMode_initializers = [];
    let _open_decorators;
    let _open_initializers = [];
    let _origin_decorators;
    let _origin_initializers = [];
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
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlocksDropdownTree = class extends Control {
        static {
            _triggerMode_decorators = [attr('enum', { enumValues: ['hover', 'click'] })];
            _open_decorators = [attr('boolean')];
            _origin_decorators = [attr('enum', { enumValues: Object.values(PopupOrigin) })];
            _disabledField_decorators = [attr('string')];
            _idField_decorators = [attr('string')];
            _labelField_decorators = [attr('string')];
            _checkable_decorators = [attr('boolean')];
            _multiple_decorators = [attr('boolean')];
            _$slot_decorators = [shadowRef('slot')];
            __esDecorate(this, null, _triggerMode_decorators, { kind: "accessor", name: "triggerMode", static: false, private: false, access: { has: obj => "triggerMode" in obj, get: obj => obj.triggerMode, set: (obj, value) => { obj.triggerMode = value; } } }, _triggerMode_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _origin_decorators, { kind: "accessor", name: "origin", static: false, private: false, access: { has: obj => "origin" in obj, get: obj => obj.origin, set: (obj, value) => { obj.origin = value; } } }, _origin_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _disabledField_decorators, { kind: "accessor", name: "disabledField", static: false, private: false, access: { has: obj => "disabledField" in obj, get: obj => obj.disabledField, set: (obj, value) => { obj.disabledField = value; } } }, _disabledField_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _idField_decorators, { kind: "accessor", name: "idField", static: false, private: false, access: { has: obj => "idField" in obj, get: obj => obj.idField, set: (obj, value) => { obj.idField = value; } } }, _idField_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _labelField_decorators, { kind: "accessor", name: "labelField", static: false, private: false, access: { has: obj => "labelField" in obj, get: obj => obj.labelField, set: (obj, value) => { obj.labelField = value; } } }, _labelField_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _checkable_decorators, { kind: "accessor", name: "checkable", static: false, private: false, access: { has: obj => "checkable" in obj, get: obj => obj.checkable, set: (obj, value) => { obj.checkable = value; } } }, _checkable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } } }, _multiple_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDropdownTree = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...BlocksPopup.observedAttributes, ...BlocksTree.observedAttributes];
        }
        #triggerMode_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _triggerMode_initializers, 'click'));
        get triggerMode() { return this.#triggerMode_accessor_storage; }
        set triggerMode(value) { this.#triggerMode_accessor_storage = value; }
        #open_accessor_storage = __runInitializers(this, _open_initializers, void 0);
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #origin_accessor_storage = __runInitializers(this, _origin_initializers, void 0);
        get origin() { return this.#origin_accessor_storage; }
        set origin(value) { this.#origin_accessor_storage = value; }
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
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(document.createElement('slot'));
            this.$popup = popupTemplate();
            this.$tree = treeTemplate();
            this.$popup.appendChildren([styleTemplate(), this.$tree]);
            connectSelectable(this, this.$tree, {
                afterHandleListChange: () => {
                    if (!this.multiple) {
                        this.open = false;
                    }
                },
                afterHandleResultClear: () => {
                    this.closePopup();
                    if (document.activeElement) {
                        ;
                        document.activeElement.blur();
                    }
                },
            });
            this.#setupPopup();
            this.#setupList();
            this.onConnected(this.render);
        }
        #setupPopup() {
            this.onConnected(() => {
                if (!this.hasAttribute('origin')) {
                    this.origin = PopupOrigin.TopStart;
                }
                const defaultAnchorGetter = () => this.$slot.assignedElements()?.[0] ?? this;
                this.setAnchorGetter(defaultAnchorGetter);
                this.$popup.arrow = 8;
                this.$popup.autoflip = true;
                this.$popup.anchorElement = () => (this.getAnchorGetter() ?? defaultAnchorGetter)();
            });
            this.onDisconnected(() => {
                document.body.removeChild(this.$popup);
            });
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
            let clear;
            const initClickOutside = () => {
                if (!clear) {
                    clear = onClickOutside([this, this.$popup], () => {
                        this.open = false;
                    });
                }
            };
            const destroyClickOutside = () => {
                if (clear) {
                    clear();
                    clear = undefined;
                }
            };
            const onOpened = () => initClickOutside();
            const onClosed = () => destroyClickOutside();
            this.onConnected(() => {
                this.$popup.addEventListener('opened', onOpened);
                this.$popup.addEventListener('closed', onClosed);
            });
            this.onDisconnected(() => {
                this.$popup.removeEventListener('opened', onOpened);
                this.$popup.removeEventListener('closed', onClosed);
            });
            let isClickClear = false;
            const onClearStart = () => {
                isClickClear = true;
            };
            const onClearEnd = () => {
                isClickClear = false;
            };
            const onSlotFocus = () => {
                if (!isClickClear)
                    this.openPopup();
                isClickClear = false;
            };
            this.onConnected(() => {
                this.addEventListener('mousedown-clear', onClearStart);
                this.addEventListener('focus', onSlotFocus, true);
                this.addEventListener('click', onSlotFocus, true);
                this.addEventListener('click-clear', onClearEnd);
            });
            this.onDisconnected(() => {
                this.removeEventListener('mousedown-clear', onClearStart);
                this.removeEventListener('focus', onSlotFocus, true);
                this.removeEventListener('click', onSlotFocus, true);
                this.removeEventListener('click-clear', onClearEnd);
            });
        }
        #setupList() {
            this.onAttributeChanged((attrName, _, newValue) => {
                if (BlocksTree.observedAttributes.includes(attrName)) {
                    this.$tree.setAttribute(attrName, newValue);
                }
            });
            const onOpened = () => this.redrawList();
            const onClickItem = (event) => {
                dispatchEvent(this, 'click-item', { detail: { id: event.detail.id } });
            };
            this.onConnected(() => {
                this.$popup.addEventListener('opened', onOpened);
                this.$tree.addEventListener('click-item', onClickItem);
            });
            this.onDisconnected(() => {
                this.$popup.removeEventListener('opened', onOpened);
                this.$tree.removeEventListener('click-item', onClickItem);
            });
        }
        _findResultComponent() {
            const canAcceptValue = ($el) => {
                return typeof $el.acceptSelected === 'function';
            };
            return this.$slot.assignedElements().find(canAcceptValue);
        }
        acceptSelected(value) {
            const $result = this._findResultComponent();
            if ($result && $result.acceptSelected) {
                $result.acceptSelected(value);
            }
        }
        get data() {
            return this.$tree.data;
        }
        set data(value) {
            this.$tree.data = value;
        }
        get checked() {
            return this.$tree.checked;
        }
        set checked(ids) {
            this.$tree.checked = ids;
        }
        get checkedData() {
            return this.$tree.checkedData;
        }
        set checkedData(value) {
            this.$tree.checkedData = value;
        }
        #anchorGetter;
        getAnchorGetter() {
            return this.#anchorGetter;
        }
        setAnchorGetter(value) {
            this.#anchorGetter = value;
        }
        openPopup() {
            this.open = true;
        }
        closePopup() {
            this.open = false;
        }
        redrawList() {
            this.$tree.redraw();
        }
    };
    return BlocksDropdownTree = _classThis;
})();
