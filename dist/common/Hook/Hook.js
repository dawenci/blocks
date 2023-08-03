import { HookEvent } from './HookEvent.js';
export class Hook {
    _hookEv_ = new HookEvent();
    clear() {
        this._hookEv_.offAll();
    }
    onConnected(callback) {
        this._hookEv_.on(0, callback);
    }
    callConnected(ctx) {
        this._hookEv_.triggerWithArgsCtx(ctx, 0);
    }
    onDisconnected(callback) {
        this._hookEv_.on(1, callback);
    }
    callDisconnected(ctx) {
        this._hookEv_.triggerWithArgsCtx(ctx, 1);
    }
    onAdopted(callback) {
        this._hookEv_.on(2, callback);
    }
    callAdopted(ctx) {
        this._hookEv_.triggerWithArgsCtx(ctx, 2);
    }
    onAttributeChanged(callback) {
        this._hookEv_.on(3, callback);
    }
    callAttributeChanged(ctx, ...args) {
        this._hookEv_.triggerWithArgsCtx(ctx, 3, ...args);
    }
    onAttributeChangedDep(dep, callback) {
        function wrapped(name, oldValue, newValue) {
            if (name === dep)
                callback.call(this, name, oldValue, newValue);
        }
        this._hookEv_.on(3, wrapped);
    }
    onAttributeChangedDeps(deps, callback) {
        const depMap = Object.create(null);
        deps.forEach(dep => {
            depMap[dep] = true;
        });
        function wrapped(name, oldValue, newValue) {
            if (depMap[name])
                callback.call(this, name, oldValue, newValue);
        }
        this._hookEv_.on(3, wrapped);
    }
    onRender(callback) {
        this._hookEv_.on(4, callback);
    }
    callRender(ctx) {
        this._hookEv_.triggerWithArgsCtx(ctx, 4);
    }
    merge(other) {
        this._hookEv_.merge(other._hookEv_);
    }
}
