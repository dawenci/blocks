export class SetupDisabled {
    static setup(options) {
        return new SetupDisabled(options).setup();
    }
    #setup = false;
    #component;
    #predicate;
    #target;
    #postUpdate;
    #disableEventTypes;
    #handler = (e) => {
        if (this.#predicate.call(this.#component)) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    };
    constructor(options) {
        this.#component = options.component;
        this.#predicate = options.predicate;
        this.#postUpdate = options.postUpdate;
        this.#target = options.target;
        this.#disableEventTypes = options.disableEventTypes ?? [];
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
    withDisableEventTypes(types) {
        this.#clearEvents();
        this.#disableEventTypes = types;
        this.#bindEvents();
    }
    setup() {
        if (this.#setup)
            return this;
        this.#setup = true;
        const update = () => this.update();
        this.#component.hook.onRender(update);
        this.#component.hook.onConnected(update);
        this.#component.hook.onAttributeChangedDep('disabled', update);
        this.#bindEvents();
        return this;
    }
    #clearEvents() {
        for (const type of this.#disableEventTypes) {
            this.#component.removeEventListener(type, this.#handler, true);
        }
    }
    #bindEvents() {
        const types = this.#disableEventTypes.length
            ? this.#disableEventTypes
            : this.#component.constructor.disableEventTypes;
        if (types?.length) {
            for (let i = 0; i < types.length; ++i) {
                this.#component.addEventListener(types[i], this.#handler, true);
            }
        }
    }
    update() {
        const $target = this.#target.call(this.#component);
        if (!$target.length)
            return;
        const disabled = this.#predicate.call(this.#component);
        for (let i = 0; i < $target.length; ++i) {
            const $el = $target[i];
            if (!$el)
                continue;
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
