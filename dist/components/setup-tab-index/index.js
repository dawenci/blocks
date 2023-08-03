export class SetupTabIndex {
    static setup(options) {
        return new SetupTabIndex(options).setup();
    }
    #setup = false;
    #component;
    #disabledPredicate;
    #postUpdate;
    #target;
    #tabIndex = null;
    get tabIndex() {
        return this.#tabIndex;
    }
    set tabIndex(value) {
        if (this.#tabIndex === value)
            return;
        this.#tabIndex = value;
        this.update();
    }
    #disabledTabIndex = null;
    get disabledTabIndex() {
        return this.#disabledTabIndex;
    }
    set disabledTabIndex(value) {
        if (this.#disabledTabIndex === value)
            return;
        this.#disabledTabIndex = value;
        this.update();
    }
    constructor(options) {
        this.#component = options.component;
        if (options.tabIndex != null)
            this.#tabIndex = options.tabIndex;
        this.#postUpdate = options.postUpdate;
        this.#target = options.target;
        this.#disabledPredicate = options.disabledPredicate;
    }
    withTabIndex(tabIndex) {
        this.tabIndex = tabIndex;
        return this;
    }
    withDisabledTabIndex(tabIndex) {
        this.disabledTabIndex = tabIndex;
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
            ? this.disabledTabIndex
            : this.tabIndex;
        const $elements = this.#target.call(this.#component);
        for (let i = 0; i < $elements.length; ++i) {
            const $el = $elements[i];
            if (!$el)
                continue;
            if (value === null) {
                if ($el.hasAttribute('tabindex'))
                    $el.removeAttribute('tabindex');
            }
            else {
                const strValue = String(value);
                if ($el.getAttribute('tabindex') !== strValue)
                    $el.setAttribute('tabindex', strValue);
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
        this.#component.hook.onRender(update);
        this.#component.hook.onConnected(update);
        this.#component.hook.onAttributeChangedDep('disabled', update);
        this.#component.hook.onAttributeChangedDep('tabindex', (_, __, val) => {
            this.tabIndex = val;
            update();
        });
        return this;
    }
}
