export class SetupControlEvent {
    static setup(options) {
        return new SetupControlEvent(options).setup();
    }
    #setup = false;
    #component;
    constructor(options) {
        this.#component = options.component;
    }
    setup() {
        if (this.#setup)
            return this;
        this.#setup = true;
        const onKeydown = (e) => {
            if (e.defaultPrevented)
                return;
            if (e.keyCode === 32) {
                e.preventDefault();
            }
        };
        const onKeyup = (e) => {
            if (e.defaultPrevented)
                return;
            if (e.keyCode === 32) {
                this.#component.dispatchEvent(new KeyboardEvent('keypress', {
                    ...e,
                    bubbles: true,
                    cancelable: true,
                    keyCode: 32,
                    key: ' ',
                }));
            }
            if (e.keyCode === 32 || e.keyCode === 13) {
                this.#component.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                }));
            }
        };
        this.#component.onConnected(() => {
            this.#component.addEventListener('keydown', onKeydown);
            this.#component.addEventListener('keyup', onKeyup);
        });
        this.#component.onDisconnected(() => {
            this.#component.removeEventListener('keydown', onKeydown);
            this.#component.removeEventListener('keyup', onKeyup);
        });
        return this;
    }
}
