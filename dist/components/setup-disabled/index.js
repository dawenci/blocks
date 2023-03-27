export class SetupDisabled {
    static setup(options) {
        return new SetupDisabled(options).setup();
    }
    #setup = false;
    #component;
    #predicate;
    #target;
    #postUpdate;
    constructor(options) {
        this.#component = options.component;
        this.#predicate = options.predicate;
        this.#postUpdate = options.postUpdate;
        this.#target = options.target;
    }
    withTarget(target) {
        this.#target = target;
        return this;
    }
    withPredicate(getDisabled) {
        this.#predicate = getDisabled;
        return this;
    }
    withPostUpdate(postUpdate) {
        this.#postUpdate = postUpdate;
        return this;
    }
    setup() {
        if (this.#setup)
            return this;
        this.#setup = true;
        const update = () => this.update();
        this.#component.onRender(update);
        this.#component.onConnected(update);
        this.#component.onAttributeChangedDep('disabled', update);
        const types = this.#component.constructor.disableEventTypes;
        if (types?.length) {
            const handler = (e) => {
                if (this.#predicate.call(this.#component)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            };
            for (let i = 0; i < types.length; ++i) {
                this.#component.addEventListener(types[i], handler, true);
            }
        }
        return this;
    }
    update() {
        const $target = this.#target.call(this.#component);
        if (!$target.length)
            return;
        const disabled = this.#predicate.call(this.#component);
        for (let i = 0; i < $target.length; ++i) {
            const $el = $target[i];
            if ($el === this.#component) {
                if (disabled) {
                    $el.setAttribute('aria-disabled', 'true');
                }
                else {
                    $el.setAttribute('aria-disabled', 'false');
                }
            }
            else {
                if (disabled) {
                    $el.setAttribute('disabled', '');
                }
                else {
                    $el.removeAttribute('disabled');
                }
            }
        }
        if (this.#postUpdate) {
            this.#postUpdate.call(this.#component);
        }
    }
}
