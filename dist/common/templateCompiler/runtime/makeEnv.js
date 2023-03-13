class Env {
    name;
    parent;
    records = Object.create(null);
    dirty_keys = new Set();
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    dirty(key, data) {
        const is_dirty = key in data && data[key] !== this.records[key];
        if (is_dirty)
            this.dirty_keys.add(key);
        return is_dirty;
    }
}
export function makeEnv(name, parent, records = Object.create(null)) {
    const env = new Env(name, parent);
    if (records)
        env.records = records;
    return env;
}
