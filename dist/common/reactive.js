const id = (a, b) => a === b;
const isSubObj = (sub) => {
    return !!sub.update;
};
const callSub = (sub, state, prevState) => {
    if (isSubObj(sub)) {
        sub.update(state, prevState);
    }
    else {
        sub(state, prevState);
    }
};
class ReadWriteObservable {
    #state;
    #equal;
    #subs;
    constructor(val, equal = id) {
        this.#state = val;
        this.#equal = equal;
    }
    get content() {
        return this.#state;
    }
    set content(val) {
        if (this.#equal(this.content, val))
            return;
        const prevState = this.#state;
        this.#state = val;
        this.#notify(prevState);
    }
    hasSub(sub) {
        if (this.#subs) {
            return this.#subs.has(sub);
        }
        return false;
    }
    addSub(sub) {
        if (this.#subs) {
            this.#subs.add(sub);
        }
        else {
            this.#subs = new Set([sub]);
        }
    }
    removeSub(sub) {
        if (!this.#subs)
            return;
        this.#subs.delete(sub);
    }
    clearSub() {
        this.#subs?.clear();
    }
    #notify(prevState) {
        if (this.#subs) {
            this.#subs.forEach(sub => {
                callSub(sub, this.content, prevState);
            });
        }
    }
}
class ComputedObservable {
    #source;
    #equal;
    #deps;
    #update;
    constructor(update, deps, equal) {
        this.#update = update;
        this.#deps = deps;
        this.#equal = equal;
        this.#deps.forEach(dep => dep.addSub(this));
    }
    get content() {
        return this.#ensureReactive().content;
    }
    hasSub(sub) {
        return this.#ensureReactive().hasSub(sub);
    }
    addSub(sub) {
        this.#ensureReactive().addSub(sub);
    }
    removeSub(sub) {
        this.#ensureReactive().removeSub(sub);
    }
    clearSub() {
        this.#ensureReactive().clearSub();
    }
    update() {
        if (this.#source) {
            this.#source.content = this.#compute();
        }
    }
    #ensureReactive() {
        if (this.#source)
            return this.#source;
        this.#source = new ReadWriteObservable(this.#compute(), this.#equal);
        return this.#source;
    }
    #compute() {
        const args = (this.#deps ? this.#deps.map(dep => dep.content) : []);
        return this.#update(...args);
    }
}
export const reactive = (val, equal) => {
    return new ReadWriteObservable(val, equal);
};
export const computed = (update, deps, equal = id) => {
    return new ComputedObservable(update, deps, equal);
};
export const subscribe = (reactive, sub) => {
    reactive.addSub(sub);
    return () => reactive.removeSub(sub);
};
export const unsubscribe = (reactive, sub) => {
    if (sub) {
        reactive.removeSub(sub);
    }
    else {
        reactive.clearSub();
    }
};
