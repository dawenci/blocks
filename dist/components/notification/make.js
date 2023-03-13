import './notification.js';
import { NotificationPlacement, notificationTypes } from './notification.js';
import { intSetter, enumSetter, boolSetter } from '../../common/property.js';
const placementEnum = [
    NotificationPlacement.TopRight,
    NotificationPlacement.BottomRight,
    NotificationPlacement.BottomLeft,
    NotificationPlacement.TopLeft,
];
const normalizePlacement = (value) => {
    if (placementEnum.includes(value)) {
        return value;
    }
    return NotificationPlacement.TopRight;
};
function cage(placement) {
    placement = normalizePlacement(placement);
    let cage = document.querySelector('.bl-notification-cage' + '.' + placement);
    if (!cage) {
        cage = document.body.appendChild(document.createElement('div'));
        cage.className = `bl-notification-cage ${placement}`;
        let cssText = 'pointer-events:none;overflow:hidden;position:fixed;z-index:100;display:flex;flex-flow:column nowrap;padding:8px 0;';
        switch (placement) {
            case 'top-right': {
                cssText += 'top:0;right:0;bottom:0;left:auto;justify-content:flex-start;';
                break;
            }
            case 'bottom-right': {
                cssText += 'top:0;right:0;bottom:0;left:auto;justify-content:flex-end;';
                break;
            }
            case 'bottom-left': {
                cssText += 'top:0;right:auto;bottom:0;left:0;justify-content:flex-end;';
                break;
            }
            case 'top-left': {
                cssText += 'top:0;right:auto;bottom:0;left:0;justify-content:flex-start;';
                break;
            }
        }
        cage.style.cssText = cssText;
    }
    return cage;
}
export function blNotify(options = {}) {
    const $el = document.createElement('bl-notification');
    enumSetter('type', notificationTypes)($el, options.type);
    boolSetter('closeable')($el, options.closeable ?? false);
    if (options.duration != null)
        intSetter('duration')($el, options.duration);
    let content = options.content ?? '';
    if (options.title) {
        content = `<h1 slot="title">${options.title}</h1>` + (content ?? '');
    }
    $el.innerHTML = content;
    const placement = normalizePlacement(options.placement);
    const parent = cage(placement);
    if (placement.endsWith('right')) {
        $el.style.cssText = `transform:translate(100%, 0);opacity:0;`;
    }
    else {
        $el.style.cssText = `transform:translate(-100%, 0);opacity:0;`;
    }
    if (placement.startsWith('top')) {
        parent.appendChild($el);
    }
    else {
        if (parent.firstElementChild) {
            parent.insertBefore($el, parent.firstElementChild);
        }
        else {
            parent.appendChild($el);
        }
    }
    $el.offsetHeight;
    $el.style.cssText = `transform:translate(0, 0);opacity:1;`;
    let closedCallback;
    let closed = false;
    const onClosed = () => {
        closed = true;
        if (closedCallback)
            closedCallback();
        $el.removeEventListener('closed', onClosed);
    };
    $el.addEventListener('closed', onClosed);
    return {
        el: $el,
        close() {
            $el.close();
            return this;
        },
        onclose(callback) {
            if (closed) {
                callback();
            }
            else {
                closedCallback = callback;
            }
            return this;
        },
    };
}
