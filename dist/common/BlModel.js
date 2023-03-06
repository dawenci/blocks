import { BlEvent } from './BlEvent.js';
export class BlModel extends BlEvent {
    _isDestroyed = false;
    get(key) {
        return this.data[key];
    }
    set(key, value, preventEmit = false) {
        const oldValue = this.data[key];
        if (oldValue === value)
            return;
        this.data[key] = value;
        if (!preventEmit && !this._isDestroyed) {
            this.trigger(`update:${String(key)}`, oldValue, value);
        }
    }
    destroy() {
        this._isDestroyed = true;
        this.off();
    }
}
