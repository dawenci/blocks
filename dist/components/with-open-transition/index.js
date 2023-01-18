import { dispatchEvent } from '../../common/event.js';
import { strGetter, strSetter } from '../../common/property.js';
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js';
import { openGetter, openSetter } from '../../common/propertyAccessor.js';
export class WithOpenTransition extends HTMLElement {
    onOpen;
    onClose;
    static get observedAttributes() {
        return ['open'];
    }
    get open() {
        return openGetter(this);
    }
    set open(value) {
        openSetter(this, value);
    }
    get openTransitionName() {
        return strGetter('open-transition-name')(this) ?? 'zoom';
    }
    set openTransitionName(value) {
        strSetter('open-transition-name')(this, value);
    }
    _onOpenAttributeChange() {
        if (this.open) {
            doTransitionEnter(this, this.openTransitionName, () => {
                if (this.onOpen) {
                    this.onOpen();
                }
                dispatchEvent(this, 'opened');
            });
        }
        else {
            doTransitionLeave(this, this.openTransitionName, () => {
                if (this.onClose) {
                    this.onClose();
                }
                dispatchEvent(this, 'closed');
            });
        }
        dispatchEvent(this, 'open-changed', {
            detail: {
                value: this.open,
            },
        });
    }
}
