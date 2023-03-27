export class SetupTabIndex {
    static setup(options) {
        return new SetupTabIndex(options).setup();
    }
    #setup = false;
    #component;
    #disabledPredicate;
    #postUpdate;
    #target;
    #internalTabIndex = null;
    get tabIndex() {
        return this.#internalTabIndex;
    }
    set tabIndex(value) {
        if (this.#internalTabIndex === value)
            return;
        this.#internalTabIndex = value;
        this.update();
    }
    constructor(options) {
        this.#component = options.component;
        if (options.tabIndex != null)
            this.#internalTabIndex = options.tabIndex;
        this.#postUpdate = options.postUpdate;
        this.#target = options.target;
        this.#disabledPredicate = options.disabledPredicate;
    }
    withTabIndex(tabIndex) {
        this.tabIndex = tabIndex;
        return this;
    }
    withDisabledPredicate(getDisabled) {
        this.#disabledPredicate = getDisabled;
        return this;
    }
    withPostUpdate(postUpdate) {
        this.#postUpdate = postUpdate;
        return this;
    }
    withTarget(target) {
        this.#target = target;
        return this;
    }
    update() {
        const value = (this.#disabledPredicate && this.#disabledPredicate.call(this.#component)) || this.tabIndex == null
            ? null
            : this.tabIndex;
        const $elements = this.#target.call(this.#component);
        for (let i = 0; i < $elements.length; ++i) {
            const $el = $elements[i];
            if (!$el)
                continue;
            if (value === null) {
                $el.removeAttribute('tabindex');
            }
            else {
                $el.setAttribute('tabindex', String(value));
            }
            if (this.#postUpdate) {
                this.#postUpdate.call(this.#component);
            }
        }
    }
    setup() {
        if (this.#setup)
            return this;
        this.#setup = true;
        const update = () => {
            this.update();
        };
        this.#component.onRender(update);
        this.#component.onConnected(update);
        this.#component.onAttributeChangedDep('disabled', update);
        this.#component.onAttributeChangedDep('tabindex', (_, __, val) => {
            this.tabIndex = val;
            update();
        });
        return this;
    }
}
