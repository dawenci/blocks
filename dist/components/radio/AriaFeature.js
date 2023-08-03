import { Feature } from '../../common/Feature/Feature.js';
export class AriaFeature extends Feature {
    init() {
        const update = () => {
            this.component.setAttribute('aria-checked', this.component.checked ? 'true' : 'false');
        };
        this.hook.onRender(update);
        this.hook.onConnected(update);
        this.hook.onAttributeChangedDep('checked', update);
    }
}
