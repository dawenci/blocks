import { BlEvent } from './BlEvent.js';
export class BlModel extends BlEvent {
    data;
    _isDestroyed = false;
    silent = false;
    constructor(data) {
        super();
        this.data = data;
    }
    has(key) {
        return key in this.data;
    }
    get(key) {
        return this.data[key];
    }
    set(key, value) {
        const oldValue = this.data[key];
        if (oldValue === value)
            return false;
        this.data[key] = value;
        this.trigger(`update:${String(key)}`, oldValue, value);
        this.trigger('change');
        return true;
    }
    batch(fn) {
        this.silent = true;
        fn.call(this, (name, payload) => {
            this.silent = false;
            this.trigger(name, payload);
        });
    }
    reset(data) {
        this.data = data;
        this.trigger('reset');
        this.trigger('change');
    }
    trigger(name, ...args) {
        if (this.silent || this._isDestroyed)
            return this;
        return super.trigger(name, ...args);
    }
    destroy() {
        this._isDestroyed = true;
        this.off();
    }
}
