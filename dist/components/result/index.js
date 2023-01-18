import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js';
import { ClearableControlBox } from '../base-clearable-control-box/index.js';
export class BlocksResult extends ClearableControlBox {
    static get observedAttributes() {
        return ['size'].concat(super.observedAttributes);
    }
    constructor() {
        super();
        const $content = document.createElement('div');
        $content.id = 'content';
        const $slot = $content.appendChild(document.createElement('slot'));
        this._appendContent($content);
        this._ref.$content = $content;
        this._ref.$slot = $slot;
    }
    get size() {
        return sizeGetter(this);
    }
    set size(value) {
        sizeSetter(this, value);
    }
}
if (!customElements.get('bl-result')) {
    customElements.define('bl-result', BlocksResult);
}
