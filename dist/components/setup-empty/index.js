export class SetupEmpty {
    static setup(options) {
        return new SetupEmpty(options).setup();
    }
    #setup = false;
    #component;
    #predicate;
    #target;
    #className;
    #postUpdate;
    #init;
    constructor(options) {
        this.#component = options.component;
        this.#predicate = options.predicate;
        this.#target = options.target;
        this.#postUpdate = options.postUpdate;
        this.#init = options.init;
        this.#className = options.className ?? 'empty';
    }
    withTarget(target) {
        this.#target = target;
        return this;
    }
    withPredicate(isEmpty) {
        this.#predicate = isEmpty;
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
        this.#component.hook.onRender(update);
        this.#component.hook.onConnected(update);
        if (this.#init)
            this.#init.call(this.#component);
        return this;
    }
    update() {
        const $target = this.#target.call(this.#component);
        const isEmpty = this.#predicate.call(this.#component);
        $target.classList.toggle(this.#className, isEmpty);
        if (this.#postUpdate) {
            this.#postUpdate.call(this.#component);
        }
        return this;
    }
}
