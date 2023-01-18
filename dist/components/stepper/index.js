import { enumGetter, enumSetter, strGetter, strSetter, } from '../../common/property.js';
import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js';
import { parseIcon } from '../../icon/index.js';
import { Component } from '../Component.js';
import { stepperTemplate, stepTemplate } from './template.js';
export class BlocksSteps extends Component {
    ref;
    static get observedAttributes() {
        return ['direction', 'size'];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(stepperTemplate.content.cloneNode(true));
        const $slot = shadowRoot.querySelector('slot');
        const $layout = shadowRoot.getElementById('layout');
        this.ref = {
            $slot,
            $layout,
        };
    }
    get direction() {
        return enumGetter('direction', ['horizontal', 'vertical'])(this);
    }
    set direction(value) {
        enumSetter('direction', ['horizontal', 'vertical'])(this, value);
    }
    get size() {
        return sizeGetter(this);
    }
    set size(value) {
        sizeSetter(this, value);
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    stepIndex($step) {
        return this.ref.$slot.assignedElements().findIndex($el => $el === $step);
    }
}
if (!customElements.get('bl-stepper')) {
    customElements.define('bl-stepper', BlocksSteps);
}
export class BlocksStep extends Component {
    ref;
    static get observedAttributes() {
        return ['step-title', 'description', 'icon', 'status'];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(stepTemplate.content.cloneNode(true));
        const $layout = shadowRoot.getElementById('layout');
        const $icon = shadowRoot.getElementById('icon');
        const $title = shadowRoot.getElementById('title');
        const $description = shadowRoot.getElementById('description');
        this.ref = {
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
    get stepTitle() {
        return strGetter('step-title')(this);
    }
    set stepTitle(value) {
        strSetter('step-title')(this, value);
    }
    get description() {
        return strGetter('description')(this);
    }
    set description(value) {
        strSetter('description')(this, value);
    }
    get icon() {
        return strGetter('icon')(this);
    }
    set icon(value) {
        strSetter('icon')(this, value);
    }
    get status() {
        return enumGetter('status', ['wait', 'process', 'success', 'error'])(this);
    }
    set status(value) {
        enumSetter('status', ['wait', 'process', 'success', 'error'])(this, value);
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
        this._renderContent(this.ref.$icon, $default);
    }
    _renderTitle() {
        this._renderContent(this.ref.$title, document.createTextNode(this.stepTitle));
    }
    _renderDescription() {
        const $text = document.createTextNode(this.description ?? '');
        this._renderContent(this.ref.$description, $text);
    }
}
if (!customElements.get('bl-step')) {
    customElements.define('bl-step', BlocksStep);
}
