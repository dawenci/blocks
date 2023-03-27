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
import { defineClass } from '../../decorators/defineClass.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { parseIcon } from '../../icon/index.js';
import { style } from './step.style.js';
import { template } from './step.template.js';
import { Component } from '../component/Component.js';
const statusEnum = ['wait', 'process', 'success', 'error'];
export let BlocksStep = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-step',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _stepTitle_decorators;
    let _stepTitle_initializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _icon_decorators;
    let _icon_initializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$icon_decorators;
    let _$icon_initializers = [];
    let _$title_decorators;
    let _$title_initializers = [];
    let _$description_decorators;
    let _$description_initializers = [];
    var BlocksStep = class extends Component {
        static {
            _direction_decorators = [attr('enum', { enumValues: ['horizontal', 'vertical'] })];
            _stepTitle_decorators = [attr('string')];
            _description_decorators = [attr('string')];
            _icon_decorators = [attr('string')];
            _status_decorators = [attr('enum', { enumValues: statusEnum })];
            _$layout_decorators = [shadowRef('#layout')];
            _$icon_decorators = [shadowRef('#icon')];
            _$title_decorators = [shadowRef('#title')];
            _$description_decorators = [shadowRef('#description')];
            __esDecorate(this, null, _direction_decorators, { kind: "accessor", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } } }, _direction_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _stepTitle_decorators, { kind: "accessor", name: "stepTitle", static: false, private: false, access: { has: obj => "stepTitle" in obj, get: obj => obj.stepTitle, set: (obj, value) => { obj.stepTitle = value; } } }, _stepTitle_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _description_decorators, { kind: "accessor", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } } }, _description_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _icon_decorators, { kind: "accessor", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, get: obj => obj.icon, set: (obj, value) => { obj.icon = value; } } }, _icon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _status_decorators, { kind: "accessor", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } } }, _status_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$icon_decorators, { kind: "accessor", name: "$icon", static: false, private: false, access: { has: obj => "$icon" in obj, get: obj => obj.$icon, set: (obj, value) => { obj.$icon = value; } } }, _$icon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$title_decorators, { kind: "accessor", name: "$title", static: false, private: false, access: { has: obj => "$title" in obj, get: obj => obj.$title, set: (obj, value) => { obj.$title = value; } } }, _$title_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$description_decorators, { kind: "accessor", name: "$description", static: false, private: false, access: { has: obj => "$description" in obj, get: obj => obj.$description, set: (obj, value) => { obj.$description = value; } } }, _$description_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksStep = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #direction_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _direction_initializers, void 0));
        get direction() { return this.#direction_accessor_storage; }
        set direction(value) { this.#direction_accessor_storage = value; }
        #stepTitle_accessor_storage = __runInitializers(this, _stepTitle_initializers, void 0);
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
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$icon_accessor_storage = __runInitializers(this, _$icon_initializers, void 0);
        get $icon() { return this.#$icon_accessor_storage; }
        set $icon(value) { this.#$icon_accessor_storage = value; }
        #$title_accessor_storage = __runInitializers(this, _$title_initializers, void 0);
        get $title() { return this.#$title_accessor_storage; }
        set $title(value) { this.#$title_accessor_storage = value; }
        #$description_accessor_storage = __runInitializers(this, _$description_initializers, void 0);
        get $description() { return this.#$description_accessor_storage; }
        set $description(value) { this.#$description_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template());
            const slots = shadowRoot.querySelectorAll('slot');
            Array.prototype.forEach.call(slots, $slot => {
                const $parent = $slot.parentElement;
                $slot.addEventListener('slotchange', () => {
                    switch ($parent) {
                        case this.$icon:
                            return this._renderIcon();
                        case this.$title:
                            return this._renderTitle();
                        case this.$description:
                            return this._renderDescription();
                    }
                });
            });
            this.onConnected(() => {
                if (this.parentElement.tagName !== 'BL-STEPPER') {
                    this.parentElement.removeChild(this);
                    throw new Error('The parent element of `bl-step` should be `bl-stepper`.');
                }
            });
            this.onConnected(this.render);
            this.onAttributeChangedDep('icon', this._renderIcon);
            this.onAttributeChangedDep('step-title', this._renderTitle);
            this.onAttributeChangedDep('description', this._renderDescription);
        }
        get $stepper() {
            return this.closest('bl-stepper');
        }
        render() {
            super.render();
            this._renderIcon();
            this._renderTitle();
            this._renderDescription();
        }
        _renderContent($slotParent, $default) {
            let empty = true;
            const $slot = $slotParent.querySelector('slot');
            if ($slot.assignedNodes().filter($node => $node.nodeType === 1 || $node.nodeType === 3).length) {
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
            let $default = this.icon ? parseIcon(this.icon) : null;
            if (!$default) {
                $default = document.createElement('i');
                $default.textContent = String(this.$stepper.stepIndex(this) + 1);
            }
            this._renderContent(this.$icon, $default);
        }
        _renderTitle() {
            this._renderContent(this.$title, document.createTextNode(this.stepTitle));
        }
        _renderDescription() {
            const $text = document.createTextNode(this.description ?? '');
            this._renderContent(this.$description, $text);
        }
    };
    return BlocksStep = _classThis;
})();
