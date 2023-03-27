import { append, prepend, unmount } from '../../common/mount.js';
export class SetupFocusCapture {
    static setup(options) {
        return new SetupFocusCapture(options).setup();
    }
    #setup = false;
    #component;
    #predicate;
    #container;
    #firstFocusable = null;
    #lastFocusable = null;
    #lastFocus = null;
    #loop = false;
    #init;
    constructor(options) {
        this.#component = options.component;
        this.#container = options.container;
        this.#predicate = options.predicate;
        this.#init = options.init;
        if (options.loop)
            this.#loop = true;
    }
    get $lastFocus() {
        return this.#lastFocus;
    }
    set $lastFocus(value) {
        this.#lastFocus = value;
    }
    get $firstFocusable() {
        return this.#firstFocusable;
    }
    get $lastFocusable() {
        return this.#lastFocusable;
    }
    withContainer(container) {
        this.#container = container;
        return this;
    }
    withPredicate(getDisabled) {
        this.#predicate = getDisabled;
        return this;
    }
    withLoop(loop) {
        this.#loop = !!loop;
        if (this.#firstFocusable && (this.#firstFocusable.onkeydown || this.#firstFocusable.onfocus)) {
            this.start();
        }
    }
    start() {
        const $container = this.#container.call(this.#component);
        if (!this.#firstFocusable) {
            this.#firstFocusable = document.createElement('button');
            this.#firstFocusable.setAttribute('part', 'first-focusable');
        }
        if ($container.firstElementChild !== this.#firstFocusable)
            prepend(this.#firstFocusable, $container);
        if (!this.#lastFocusable) {
            this.#lastFocusable = document.createElement('button');
            this.#lastFocusable.setAttribute('part', 'last-focusable');
        }
        if ($container.lastElementChild !== this.#lastFocusable)
            append(this.#lastFocusable, $container);
        if (this.#loop) {
            this.#firstFocusable.onfocus = this.#lastFocusable.onfocus = null;
            this.#firstFocusable.onkeydown = (e) => {
                if (e.key === 'Tab' && e.shiftKey) {
                    this.#lastFocusable?.focus();
                }
            };
            this.#lastFocusable.onkeydown = (e) => {
                if (e.key === 'Tab' && !e.shiftKey) {
                    this.#firstFocusable?.focus();
                }
            };
        }
        else {
            this.#firstFocusable.onkeydown = this.#lastFocusable.onkeydown = null;
            this.#firstFocusable.onfocus = this.#lastFocusable.onfocus = () => {
                if (this.#lastFocus) {
                    this.#lastFocus.focus();
                }
            };
        }
        return this;
    }
    stop() {
        if (this.#firstFocusable) {
            this.#firstFocusable.onkeydown = this.#firstFocusable.onfocus = null;
            unmount(this.#firstFocusable);
        }
        if (this.#lastFocusable) {
            this.#lastFocusable.onkeydown = this.#lastFocusable.onfocus = null;
            unmount(this.#lastFocusable);
        }
        return this;
    }
    setup() {
        if (this.#setup)
            return this;
        this.#setup = true;
        this.#component.addEventListener('blur', (e) => {
            if (!this.#predicate.call(this.#component))
                return;
            this.#lastFocus = e.target;
        }, true);
        if (this.#init)
            this.#init.call(this.#component);
        return this;
    }
}
