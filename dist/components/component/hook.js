import * as internal from './hook-internal.js';
export function onConnected(callback) {
    const currentHook = internal.getCurrentHook();
    if (currentHook)
        internal.onConnected(currentHook, callback);
}
export function onDisconnected(callback) {
    const currentHook = internal.getCurrentHook();
    if (currentHook)
        internal.onDisconnected(currentHook, callback);
}
export function onAdopted(callback) {
    const currentHook = internal.getCurrentHook();
    if (currentHook)
        internal.onAdopted(currentHook, callback);
}
export function onAttributeChanged(callback) {
    const currentHook = internal.getCurrentHook();
    if (currentHook)
        internal.onAttributeChanged(currentHook, callback);
}
export function onAttributeChangedDep(callback, dep) {
    const currentHook = internal.getCurrentHook();
    if (currentHook)
        internal.onAttributeChangedDep(currentHook, callback, dep);
}
export function onAttributeChangedDeps(callback, deps) {
    const currentHook = internal.getCurrentHook();
    if (currentHook)
        internal.onAttributeChangedDeps(currentHook, callback, deps);
}
export function onRender(callback) {
    const currentHook = internal.getCurrentHook();
    if (currentHook)
        internal.onRender(currentHook, callback);
}
