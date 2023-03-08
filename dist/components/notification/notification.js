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
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
import { dispatchEvent } from '../../common/event.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { style } from './style.js';
import { __color_success, __color_danger, __color_warning, __color_primary, } from '../../theme/var-light.js';
export var NotificationPlacement;
(function (NotificationPlacement) {
    NotificationPlacement["TopRight"] = "top-right";
    NotificationPlacement["BottomRight"] = "bottom-right";
    NotificationPlacement["BottomLeft"] = "bottom-left";
    NotificationPlacement["TopLeft"] = "top-left";
})(NotificationPlacement || (NotificationPlacement = {}));
export var NotificationType;
(function (NotificationType) {
    NotificationType["Message"] = "message";
    NotificationType["Success"] = "success";
    NotificationType["Error"] = "error";
    NotificationType["Info"] = "info";
    NotificationType["Warning"] = "warning";
})(NotificationType || (NotificationType = {}));
export const notificationTypes = [
    NotificationType.Message,
    NotificationType.Success,
    NotificationType.Error,
    NotificationType.Info,
    NotificationType.Warning,
];
export let BlocksNotification = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-notification',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _closeable_decorators;
    let _closeable_initializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _type_decorators;
    let _type_initializers = [];
    var BlocksNotification = class extends Component {
        static {
            _closeable_decorators = [attr('boolean')];
            _duration_decorators = [attr('number')];
            _type_decorators = [attr('enum', { enumValues: notificationTypes })];
            __esDecorate(this, null, _closeable_decorators, { kind: "accessor", name: "closeable", static: false, private: false, access: { has: obj => "closeable" in obj, get: obj => obj.closeable, set: (obj, value) => { obj.closeable = value; } } }, _closeable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _duration_decorators, { kind: "accessor", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } } }, _duration_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } } }, _type_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksNotification = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #closeable_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _closeable_initializers, void 0));
        get closeable() { return this.#closeable_accessor_storage; }
        set closeable(value) { this.#closeable_accessor_storage = value; }
        #duration_accessor_storage = __runInitializers(this, _duration_initializers, 10);
        get duration() { return this.#duration_accessor_storage; }
        set duration(value) { this.#duration_accessor_storage = value; }
        #type_accessor_storage = __runInitializers(this, _type_initializers, void 0);
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template());
            const $layout = shadowRoot.querySelector('#layout');
            const $icon = shadowRoot.querySelector('#icon');
            const $content = shadowRoot.querySelector('#content');
            this.ref = {
                $layout,
                $icon,
                $content,
            };
            $layout.onmouseenter = () => {
                this._clearAutoClose();
            };
            $layout.onmouseleave = () => {
                this._setAutoClose();
            };
        }
        close() {
            if (!this.parentElement)
                return;
            this.ontransitionend = e => {
                if (e.propertyName === 'opacity' && e.target === this) {
                    dispatchEvent(this, 'closed');
                    this.destroy();
                }
            };
            if (this.parentElement.className.includes('bottom')) {
                this.style.cssText = `transform:translate(0,100%);opacity:0`;
            }
            else {
                this.style.cssText = `transform:translate(0,-100%);opacity:0`;
            }
        }
        render() {
            const fill = this.type === 'success'
                ? __color_success
                : this.type === 'error'
                    ? __color_danger
                    : this.type === 'warning'
                        ? __color_warning
                        : this.type === 'info'
                            ? __color_primary
                            : undefined;
            const iconName = this.type === 'warning' ? 'info' : this.type ?? '';
            const $icon = getRegisteredSvgIcon(iconName, { fill });
            if ($icon) {
                this.ref.$icon.innerHTML = '';
                this.ref.$icon.appendChild($icon);
            }
            if (this.closeable) {
                if (!this.ref.$close) {
                    this.ref.$close = this.ref.$layout.appendChild(document.createElement('button'));
                    this.ref.$close.id = 'close';
                    this.ref.$close.appendChild(getRegisteredSvgIcon('cross'));
                    this.ref.$close.onclick = () => {
                        this.close();
                    };
                }
            }
            else {
                if (this.ref.$close) {
                    this.ref.$close.parentElement.removeChild(this.ref.$close);
                    this.ref.$close = undefined;
                }
            }
        }
        destroy() {
            this._clearAutoClose();
            if (this.parentElement) {
                this.parentElement.removeChild(this);
            }
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
            this._setAutoClose();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            this.render();
            if (attrName === 'duration' && this.duration) {
                this._setAutoClose();
            }
        }
        #autoCloseTimer;
        _clearAutoClose() {
            clearTimeout(this.#autoCloseTimer);
        }
        _setAutoClose() {
            if (this.duration && this.duration > 0) {
                this._clearAutoClose();
                this.#autoCloseTimer = setTimeout(() => {
                    this.close();
                }, this.duration * 1000);
            }
        }
    };
    return BlocksNotification = _classThis;
})();
