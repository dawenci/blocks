import { onClickOutside } from '../../common/onClickOutside.js';
export class SetupClickOutside {
    static setup(options) {
        return new SetupClickOutside(options).setup();
    }
    #setup = false;
    #component;
    #update;
    #target;
    #init;
    constructor(options) {
        this.#component = options.component;
        this.#update = options.update;
        this.#target = options.target;
        this.#init = options.init;
    }
    withTarget(target) {
        this.#target = target;
        return this;
    }
    withUpdate(update) {
        this.#update = update;
        return this;
    }
    setup() {
        if (this.#setup)
            return this;
        this.#setup = true;
        this.#component.hook.onDisconnected(() => {
            this.unbind();
        });
        if (this.#init)
            this.#init.call(this.#component);
        return this;
    }
    #cleanup;
    bind() {
        if (!this.#cleanup) {
            const targets = this.#target.call(this.#component);
            this.#cleanup = onClickOutside(targets, (e) => {
                this.#update.call(this.#component, e);
            });
        }
        return this;
    }
    unbind() {
        if (this.#cleanup) {
            this.#cleanup();
            this.#cleanup = undefined;
        }
        return this;
    }
}
