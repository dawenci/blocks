export class Event {
    _data = Object.create(null);
    on(type, callback) {
        const hooks = this._data[type] ?? (this._data[type] = []);
        hooks.push(callback);
    }
    off(type, callback) {
        const hooks = this._data[type];
        if (!hooks)
            return;
        const index = hooks.indexOf(callback);
        if (index !== -1) {
            hooks.splice(index, 1);
        }
    }
    offType(type) {
        delete this._data[type];
    }
    offAll() {
        this._data = Object.create(null);
    }
    triggerCtx(ctx, type) {
        const fns = this._data[type];
        if (!fns)
            return;
        for (let i = 0; i < fns.length; ++i) {
            fns[i].call(ctx ?? this);
        }
    }
    trigger(type) {
        this.triggerCtx(undefined, type);
    }
    triggerWithArgsCtx(ctx, type, ...args) {
        const fns = this._data[type];
        if (!fns)
            return;
        for (let i = 0; i < fns.length; ++i) {
            fns[i].apply(ctx ?? this, args);
        }
    }
    triggerWithArgs(type, ...args) {
        this.triggerWithArgsCtx(undefined, type, ...args);
    }
    merge(other) {
        Object.keys(other._data).forEach(key => {
            if (!this._data[key]) {
                this._data[key] = other._data[key];
            }
            else {
                this._data[key] = this._data[key].concat(other._data[key]);
            }
        });
    }
}
