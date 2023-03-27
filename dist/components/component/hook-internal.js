let currentHook = null;
export function setCurrentHook(hook) {
    currentHook = hook;
}
export function getCurrentHook() {
    return currentHook;
}
export var HookType;
(function (HookType) {
    HookType[HookType["Connected"] = 0] = "Connected";
    HookType[HookType["Disconnected"] = 1] = "Disconnected";
    HookType[HookType["Adopted"] = 2] = "Adopted";
    HookType[HookType["AttributeChanged"] = 3] = "AttributeChanged";
    HookType[HookType["Render"] = 4] = "Render";
})(HookType || (HookType = {}));
export class Hook {
    hooks = Object.create(null);
    on(type, callback) {
        const hooks = this.hooks[type] ?? (this.hooks[type] = []);
        hooks.push(callback);
    }
    call(ctx, type, ...args) {
        const hooks = this.hooks[type];
        if (!hooks)
            return;
        for (let i = 0; i < hooks.length; i += 1) {
            hooks[i].apply(ctx, args);
        }
    }
    clear() {
        this.hooks = Object.create(null);
    }
}
export function clearHooks(hook) {
    hook.clear();
}
export function onConnected(hook, callback) {
    hook.on(0, callback);
}
export function onDisconnected(hook, callback) {
    hook.on(1, callback);
}
export function onAdopted(hook, callback) {
    hook.on(2, callback);
}
export function onAttributeChanged(hook, callback) {
    hook.on(3, callback);
}
export function onAttributeChangedDep(hook, callback, dep) {
    function wrapped(name, oldValue, newValue) {
        if (name === dep)
            callback.call(this, name, oldValue, newValue);
    }
    hook.on(3, wrapped);
}
export function onAttributeChangedDeps(hook, callback, deps) {
    const depMap = Object.create(null);
    deps.forEach(dep => {
        depMap[dep] = true;
    });
    function wrapped(name, oldValue, newValue) {
        if (depMap[name])
            callback.call(this, name, oldValue, newValue);
    }
    hook.on(3, wrapped);
}
export function onRender(hook, callback) {
    hook.on(4, callback);
}
