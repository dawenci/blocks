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
import { parseIcon } from '../../icon/index.js';
import { Component } from '../Component.js';
import { stepperTemplate, stepTemplate } from './template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr, attrs } from '../../decorators/attr.js';
const statusEnum = ['wait', 'process', 'success', 'error'];
export let BlocksSteps = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-stepper',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    var BlocksSteps = class extends Component {
        static {
            _direction_decorators = [attr('enum', { enumValues: ['horizontal', 'vertical'] })];
            _size_decorators = [attrs.size];
            __esDecorate(this, null, _direction_decorators, { kind: "accessor", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } } }, _direction_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksSteps = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return ['direction', 'size'];
        }
        #direction_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _direction_initializers, void 0));
        get direction() { return this.#direction_accessor_storage; }
        set direction(value) { this.#direction_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(stepperTemplate.content.cloneNode(true));
            const $slot = shadowRoot.querySelector('slot');
            const $layout = shadowRoot.getElementById('layout');
            this._ref = {
                $slot,
                $layout,
            };
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        stepIndex($step) {
            return this._ref.$slot.assignedElements().findIndex($el => $el === $step);
        }
    };
    return BlocksSteps = _classThis;
})();
export let BlocksStep = (() => {
    let _classDecorators_1 = [defineClass({
            customElement: 'bl-step',
        })];
    let _classDescriptor_1;
    let _classExtraInitializers_1 = [];
    let _classThis_1;
    let _instanceExtraInitializers_1 = [];
    let _stepTitle_decorators;
    let _stepTitle_initializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _icon_decorators;
    let _icon_initializers = [];
    let _status_decorators;
    let _status_initializers = [];
    var BlocksStep = class extends Component {
        static {
            _stepTitle_decorators = [attr('string')];
            _description_decorators = [attr('string')];
            _icon_decorators = [attr('string')];
            _status_decorators = [attr('enum', { enumValues: statusEnum })];
            __esDecorate(this, null, _stepTitle_decorators, { kind: "accessor", name: "stepTitle", static: false, private: false, access: { has: obj => "stepTitle" in obj, get: obj => obj.stepTitle, set: (obj, value) => { obj.stepTitle = value; } } }, _stepTitle_initializers, _instanceExtraInitializers_1);
            __esDecorate(this, null, _description_decorators, { kind: "accessor", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } } }, _description_initializers, _instanceExtraInitializers_1);
            __esDecorate(this, null, _icon_decorators, { kind: "accessor", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, get: obj => obj.icon, set: (obj, value) => { obj.icon = value; } } }, _icon_initializers, _instanceExtraInitializers_1);
            __esDecorate(this, null, _status_decorators, { kind: "accessor", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } } }, _status_initializers, _instanceExtraInitializers_1);
            __esDecorate(null, _classDescriptor_1 = { value: this }, _classDecorators_1, { kind: "class", name: this.name }, null, _classExtraInitializers_1);
            BlocksStep = _classThis_1 = _classDescriptor_1.value;
            __runInitializers(_classThis_1, _classExtraInitializers_1);
        }
        static get observedAttributes() {
            return ['step-title', 'description', 'icon', 'status'];
        }
        #stepTitle_accessor_storage = (__runInitializers(this, _instanceExtraInitializers_1), __runInitializers(this, _stepTitle_initializers, void 0));
        get stepTitle() { return this.#stepTitle_accessor_storage; }
        set stepTitle(value) { this.#stepTitle_accessor_storage = value; }
        #description_accessor_storage = __runInitializers(this, _description_initializers, void 0);
        get description() { return this.#description_accessor_storage; }
        set description(value) { this.#description_accessor_storage = value; }
        #icon_accessor_storage = __runInitializers(this, _icon_initializers, void 0);
        get icon() { return this.#icon_accessor_storage; }
        set icon(value) { this.#icon_accessor_storage = value; }
        #status_accessor_storage = __runInitializers(this, _status_initializers, void 0);
        get status() { return this.#status_accessor_storage; }
        set status(value) { this.#status_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(stepTemplate.content.cloneNode(true));
            const $layout = shadowRoot.getElementById('layout');
            const $icon = shadowRoot.getElementById('icon');
            const $title = shadowRoot.getElementById('title');
            const $description = shadowRoot.getElementById('description');
            this._ref = {
                $layout,
                $icon,
                $title,
                $description,
            };
            const slots = shadowRoot.querySelectorAll('slot');
            Array.prototype.forEach.call(slots, $slot => {
                const $parent = $slot.parentElement;
                $slot.addEventListener('slotchange', () => {
                    switch ($parent) {
                        case $icon:
                            return this._renderIcon();
                        case $title:
                            return this._renderTitle();
                        case $description:
                            return this._renderDescription();
                    }
                });
            });
        }
        get $stepper() {
            return this.closest('bl-stepper');
        }
        render() {
            this._renderIcon();
            this._renderTitle();
            this._renderDescription();
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            switch (attrName) {
                case 'icon': {
                    this._renderIcon();
                    break;
                }
                case 'step-title': {
                    this._renderTitle();
                    break;
                }
                case 'description': {
                    this._renderDescription();
                    break;
                }
            }
        }
        _renderContent($slotParent, $default) {
            let empty = true;
            const $slot = $slotParent.querySelector('slot');
            if ($slot
                .assignedNodes()
                .filter($node => $node.nodeType === 1 || $node.nodeType === 3).length) {
                empty = false;
            }
            else if ($default) {
                $slotParent.innerHTML = '';
                $slotParent.appendChild($slot);
                $slotParent.appendChild($default);
                empty = false;
            }
            $slotParent.classList.toggle('empty', empty);
        }
        _renderIcon() {
            let $default = this.icon
                ? parseIcon(this.icon)
                : null;
            if (!$default) {
                $default = document.createElement('i');
                $default.textContent = String(this.$stepper.stepIndex(this) + 1);
            }
            this._renderContent(this._ref.$icon, $default);
        }
        _renderTitle() {
            this._renderContent(this._ref.$title, document.createTextNode(this.stepTitle));
        }
        _renderDescription() {
            const $text = document.createTextNode(this.description ?? '');
            this._renderContent(this._ref.$description, $text);
        }
    };
    return BlocksStep = _classThis_1;
})();
