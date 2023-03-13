export function forEachStore() {
    const store = [];
    function set(list) {
        store.push(...list);
    }
    return {
        store,
        set,
    };
}
