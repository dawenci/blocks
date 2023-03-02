import { dispatchEvent } from '../../common/event.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter, } from '../../common/property.js';
import { Component } from '../Component.js';
import { template } from './template.js';
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
const closeableGetter = boolGetter('closeable');
const closeableSetter = boolSetter('closeable');
const typeGetter = enumGetter('type', notificationTypes);
const typeSetter = enumSetter('type', notificationTypes);
export class BlocksNotification extends Component {
    ref;
    static get observedAttributes() {
        return ['closeable', 'duration', 'type'];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
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
    get closeable() {
        return closeableGetter(this);
    }
    set closeable(value) {
        closeableSetter(this, value);
    }
    get type() {
        return typeGetter(this);
    }
    set type(value) {
        typeSetter(this, value);
    }
    get duration() {
        return intGetter('duration')(this) ?? 10;
    }
    set duration(value) {
        intSetter('duration')(this, value);
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
}
if (!customElements.get('bl-notification')) {
    customElements.define('bl-notification', BlocksNotification);
}
