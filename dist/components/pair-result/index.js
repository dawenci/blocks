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
import { attr, attrs } from '../../decorators/attr.js';
import { template } from './template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { style } from './style.js';
import { ClearableControlBox } from '../base-clearable-control-box/index.js';
export let BlocksPairResult = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-pair-result',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _placeholderFirst_decorators;
    let _placeholderFirst_initializers = [];
    let _placeholderSecond_decorators;
    let _placeholderSecond_initializers = [];
    let _$content_decorators;
    let _$content_initializers = [];
    let _$first_decorators;
    let _$first_initializers = [];
    let _$second_decorators;
    let _$second_initializers = [];
    var BlocksPairResult = class extends ClearableControlBox {
        static {
            _size_decorators = [attrs.size];
            _placeholderFirst_decorators = [attr('string')];
            _placeholderSecond_decorators = [attr('string')];
            _$content_decorators = [shadowRef('#content')];
            _$first_decorators = [shadowRef('[part="first"]')];
            _$second_decorators = [shadowRef('[part="second"]')];
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholderFirst_decorators, { kind: "accessor", name: "placeholderFirst", static: false, private: false, access: { has: obj => "placeholderFirst" in obj, get: obj => obj.placeholderFirst, set: (obj, value) => { obj.placeholderFirst = value; } } }, _placeholderFirst_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholderSecond_decorators, { kind: "accessor", name: "placeholderSecond", static: false, private: false, access: { has: obj => "placeholderSecond" in obj, get: obj => obj.placeholderSecond, set: (obj, value) => { obj.placeholderSecond = value; } } }, _placeholderSecond_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$content_decorators, { kind: "accessor", name: "$content", static: false, private: false, access: { has: obj => "$content" in obj, get: obj => obj.$content, set: (obj, value) => { obj.$content = value; } } }, _$content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$first_decorators, { kind: "accessor", name: "$first", static: false, private: false, access: { has: obj => "$first" in obj, get: obj => obj.$first, set: (obj, value) => { obj.$first = value; } } }, _$first_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$second_decorators, { kind: "accessor", name: "$second", static: false, private: false, access: { has: obj => "$second" in obj, get: obj => obj.$second, set: (obj, value) => { obj.$second = value; } } }, _$second_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksPairResult = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get disableEventTypes() {
            return ['focus', 'click', 'touchstart', 'keydown'];
        }
        #size_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _size_initializers, void 0));
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #placeholderFirst_accessor_storage = __runInitializers(this, _placeholderFirst_initializers, void 0);
        get placeholderFirst() { return this.#placeholderFirst_accessor_storage; }
        set placeholderFirst(value) { this.#placeholderFirst_accessor_storage = value; }
        #placeholderSecond_accessor_storage = __runInitializers(this, _placeholderSecond_initializers, void 0);
        get placeholderSecond() { return this.#placeholderSecond_accessor_storage; }
        set placeholderSecond(value) { this.#placeholderSecond_accessor_storage = value; }
        #$content_accessor_storage = __runInitializers(this, _$content_initializers, void 0);
        get $content() { return this.#$content_accessor_storage; }
        set $content(value) { this.#$content_accessor_storage = value; }
        #$first_accessor_storage = __runInitializers(this, _$first_initializers, void 0);
        get $first() { return this.#$first_accessor_storage; }
        set $first(value) { this.#$first_accessor_storage = value; }
        #$second_accessor_storage = __runInitializers(this, _$second_initializers, void 0);
        get $second() { return this.#$second_accessor_storage; }
        set $second(value) { this.#$second_accessor_storage = value; }
        constructor() {
            super();
            this.appendContent(template());
            this._disabledFeature.withTarget(() => [this, this.$first, this.$second]);
            this._tabIndexFeature.withTabIndex(-1);
            this._emptyFeature.withPredicate(() => !this.firstSelected || !this.secondSelected);
            this.#setupResult();
            this.#setupPlaceholder();
            this.#setupEmptyClass();
            this.#setupClear();
            this.#setupSize();
        }
        #active = null;
        get active() {
            return this.#active;
        }
        set active(value) {
            if (this.#active === value)
                return;
            this.#active = value;
            if (value === 'first') {
                this.$first.classList.toggle('active', true);
                this.$second.classList.toggle('active', false);
                dispatchEvent(this, 'active', { detail: { value: 'first' } });
            }
            else if (value === 'second') {
                this.$first.classList.toggle('active', false);
                this.$second.classList.toggle('active', true);
                dispatchEvent(this, 'active', { detail: { value: 'second' } });
            }
            else {
                this.$first.classList.toggle('active', false);
                this.$second.classList.toggle('active', false);
                dispatchEvent(this, 'active', { detail: { value: null } });
            }
        }
        #firstSelected = null;
        get firstSelected() {
            return this.#firstSelected;
        }
        set firstSelected(value) {
            this.#firstSelected = value;
            this.$first.value = this.firstSelected ? this.formatter(this.firstSelected) : '';
            dispatchEvent(this, 'change-first', { detail: { value } });
        }
        #secondSelected = null;
        get secondSelected() {
            return this.#secondSelected;
        }
        set secondSelected(value) {
            this.#secondSelected = value;
            this.$second.value = this.secondSelected ? this.formatter(this.secondSelected) : '';
            dispatchEvent(this, 'change-second', { detail: { value } });
        }
        get activeSelected() {
            switch (this.active) {
                case 'first':
                    return this.firstSelected;
                case 'second':
                    return this.secondSelected;
                default:
                    return null;
            }
        }
        set activeSelected(value) {
            switch (this.active) {
                case 'first': {
                    this.firstSelected = value;
                    break;
                }
                case 'second': {
                    this.secondSelected = value;
                    break;
                }
            }
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
        get labels() {
            return [this.firstSelected?.label ?? '', this.secondSelected?.label ?? ''];
        }
        get values() {
            return [this.firstSelected?.value ?? null, this.secondSelected?.value ?? null];
        }
        acceptSelected(selected) {
            if (!selected[0] && !selected[1]) {
                this.firstSelected = this.secondSelected = null;
                this.active = null;
                dispatchEvent(this, 'change', { detail: { value: [null, null] } });
            }
            else if (selected[0] && selected[1]) {
                this.firstSelected = selected[0];
                this.secondSelected = selected[1];
                this.active = null;
                dispatchEvent(this, 'change', { detail: { value: [this.firstSelected, this.secondSelected] } });
            }
            else {
                if (selected[0]) {
                    this.firstSelected = selected[0];
                    this.secondSelected = null;
                    dispatchEvent(this, 'change', { detail: { value: [this.firstSelected, this.secondSelected] } });
                    this.active = 'second';
                }
                else if (selected[1]) {
                    this.secondSelected = selected[1];
                    this.firstSelected = null;
                    dispatchEvent(this, 'change', { detail: { value: [this.firstSelected, this.secondSelected] } });
                    this.active = 'first';
                }
            }
            this._emptyFeature.update();
            dispatchEvent(this, 'select-result:accept');
        }
        #setupResult() {
            const updateDisplay = () => {
                this.$first.value = this.firstSelected ? this.formatter(this.firstSelected) : '';
                this.$second.value = this.secondSelected ? this.formatter(this.secondSelected) : '';
            };
            this.onConnected(updateDisplay);
            const onFocus = (e) => {
                const $target = e.target;
                if (this.$first.contains($target)) {
                    this.active = 'first';
                }
                else if (this.$second.contains($target)) {
                    this.active = 'second';
                }
            };
            const onLayoutFocus = () => {
                if (this.active === null) {
                    this.active = 'first';
                }
            };
            this.onConnected(() => {
                this.$first.onfocus = this.$second.onfocus = onFocus;
                this.addEventListener('click', onLayoutFocus);
            });
            this.onDisconnected(() => {
                this.removeEventListener('click', onLayoutFocus);
                this.$first.onfocus = this.$second.onfocus = null;
            });
        }
        #setupEmptyClass() {
            const render = () => this._emptyFeature.update();
            this.onRender(render);
            this.onConnected(render);
            this.onConnected(() => {
                this.addEventListener('select-result:clear', render);
                this.addEventListener('select-result:deselect', render);
                this.addEventListener('select-result:accept', render);
            });
            this.onDisconnected(() => {
                this.removeEventListener('select-result:clear', render);
                this.removeEventListener('select-result:deselect', render);
                this.removeEventListener('select-result:accept', render);
            });
        }
        #setupPlaceholder() {
            const renderPlaceholder = () => {
                this.$first.setAttribute('placeholder', this.placeholderFirst ?? '');
                this.$second.setAttribute('placeholder', this.placeholderSecond ?? '');
            };
            this.onRender(renderPlaceholder);
            this.onConnected(renderPlaceholder);
            this.onAttributeChangedDeps(['placeholder-first', 'placeholder-second'], renderPlaceholder);
        }
        #setupClear() {
            const notifyClear = () => {
                if (this.disabled)
                    return;
                dispatchEvent(this, 'pair-result:clear');
            };
            this.onConnected(() => {
                this.addEventListener('click-clear', notifyClear);
            });
            this.onDisconnected(() => {
                this.removeEventListener('click-clear', notifyClear);
            });
        }
        #setupSize() {
            this.onAttributeChangedDep('size', this.render);
        }
    };
    return BlocksPairResult = _classThis;
})();
