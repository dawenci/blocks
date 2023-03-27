const uniqueId = (function () {
    let id = 0;
    return function uniqueId() {
        return `${id++}`;
    };
})();
const isEmpty = (() => {
    const hasOwn = Object.prototype.hasOwnProperty;
    return function isEmpty(obj) {
        for (const p in obj) {
            if (hasOwn.call(obj, p))
                return false;
        }
        return true;
    };
})();
const isPlainObject = (() => {
    const toString = Object.prototype.toString;
    return function (obj) {
        return toString.call(obj) === '[object Object]';
    };
})();
function isBlEvent(obj) {
    return typeof obj?.on === 'function';
}
function onceMap(output, type, callback, offer) {
    if (typeof callback !== 'function')
        return output;
    const _once = (output[type] = function (...args) {
        offer(type, _once);
        callback.apply(this, args);
    });
    _once._callback = callback;
    return output;
}
function makeOnceWrapper(typeOrMap, callback, offer) {
    const output = Object.create(null);
    if (typeof typeOrMap === 'string') {
        onceMap(output, typeOrMap, callback, offer);
    }
    else if (Array.isArray(typeOrMap)) {
        typeOrMap.forEach(name => onceMap(output, name, callback, offer));
    }
    else if (isPlainObject(typeOrMap)) {
        const obj = typeOrMap;
        Object.keys(obj).forEach(name => onceMap(output, name, obj[name], offer));
    }
    return output;
}
function addBinding(events, type, callback) {
    const handlers = events[type] ?? (events[type] = []);
    _currentListening?.refInc();
    handlers.push({ callback, listening: _currentListening });
}
function normalizeAndAddEvent(events, typeOrKv, callback) {
    if (typeof typeOrKv === 'string') {
        if (!callback)
            return;
        addBinding(events, typeOrKv, callback);
    }
    else if (Array.isArray(typeOrKv)) {
        if (!callback)
            return;
        typeOrKv.forEach(name => addBinding(events, name, callback));
    }
    else if (isPlainObject(typeOrKv)) {
        const obj = typeOrKv;
        Object.keys(obj).forEach(name => {
            const callback = obj[name];
            if (!callback)
                return;
            addBinding(events, name, callback);
        });
    }
}
function removeBinding(events, type, callback) {
    const names = typeof type === 'string' ? [type] : Object.keys(events);
    for (let i = 0; i < names.length; i++) {
        type = names[i];
        const handlers = events[type];
        if (!handlers)
            return;
        const remaining = [];
        for (let j = 0; j < handlers.length; j++) {
            const handler = handlers[j];
            if (callback && callback !== handler.callback && callback !== handler.callback._callback) {
                remaining.push(handler);
            }
            else {
                handler.listening?.refDec();
            }
        }
        if (remaining.length) {
            events[type] = remaining;
        }
        else {
            delete events[type];
        }
    }
}
function normalizeAndRemoveEvent(events, typeOrMapOrCb, callback) {
    if (typeOrMapOrCb == null || typeof typeOrMapOrCb === 'string') {
        removeBinding(events, typeOrMapOrCb, callback);
    }
    if (typeof typeOrMapOrCb === 'function') {
        removeBinding(events, void 0, typeOrMapOrCb);
    }
    else if (Array.isArray(typeOrMapOrCb)) {
        typeOrMapOrCb.forEach(name => {
            if (name) {
                removeBinding(events, name, callback);
            }
        });
    }
    else if (isPlainObject(typeOrMapOrCb)) {
        const obj = typeOrMapOrCb;
        Object.keys(obj).forEach(name => {
            const callback = obj[name];
            removeBinding(events, name, callback);
        });
    }
}
function triggerEvents(events, type, args) {
    const types = Array.isArray(type) ? type : [type];
    types.forEach(type => {
        const handlers = events[type];
        let allEvents = events.all;
        if (handlers && allEvents) {
            allEvents = allEvents.slice();
        }
        if (handlers) {
            trigger(handlers, args);
        }
        if (allEvents) {
            trigger(allEvents, [type].concat(args));
        }
    });
}
function trigger(handlerRecords, args) {
    const count = handlerRecords.length;
    const arg1 = args[0];
    const arg2 = args[1];
    const arg3 = args[2];
    let i = -1;
    switch (args.length) {
        case 0:
            while (++i < count)
                handlerRecords[i].callback();
            return;
        case 1:
            while (++i < count)
                handlerRecords[i].callback(arg1);
            return;
        case 2:
            while (++i < count)
                handlerRecords[i].callback(arg1, arg2);
            return;
        case 3:
            while (++i < count)
                handlerRecords[i].callback(arg1, arg2, arg3);
            return;
        default:
            while (++i < count)
                handlerRecords[i].callback(...args);
            return;
    }
}
const EVENTS_FIELD = '_bl_events_';
const ID_FIELD = '_bl_event_id_';
const LISTENER_FIELD = '_bl_listeners_';
const LISTENING_FIELD = '_bl_listening_';
let _currentListening;
export class Listening {
    listener;
    target;
    refCount = 0;
    listenerId;
    listenToId;
    constructor(listener, target) {
        this.listener = listener;
        this.target = target;
        this.listener = listener;
        this.target = target;
        this.listenerId = listener[ID_FIELD];
        this.listenToId = target[ID_FIELD];
    }
    refInc() {
        ++this.refCount;
    }
    refDec() {
        if (--this.refCount === 0)
            this.cleanup();
    }
    cleanup() {
        delete this.listener[LISTENING_FIELD][this.listenToId];
        delete this.target[LISTENER_FIELD][this.listenerId];
    }
}
export class BlEvent {
    [EVENTS_FIELD];
    [ID_FIELD];
    [LISTENER_FIELD];
    [LISTENING_FIELD];
    on(typeOrKv, callback) {
        const events = (this[EVENTS_FIELD] = this[EVENTS_FIELD] ?? Object.create(null));
        normalizeAndAddEvent(events, typeOrKv, callback);
        if (_currentListening) {
            const listeners = this[LISTENER_FIELD] || (this[LISTENER_FIELD] = Object.create(null));
            listeners[_currentListening.id] = _currentListening;
        }
        return this;
    }
    once(typeOrKv, callback) {
        return this.on(makeOnceWrapper(typeOrKv, callback, this.off.bind(this)));
    }
    off(typeOrKvOrCb, callback) {
        const events = this[EVENTS_FIELD];
        if (!events)
            return this;
        normalizeAndRemoveEvent(events, typeOrKvOrCb, callback);
        return this;
    }
    trigger(type, ...payloads) {
        const events = this[EVENTS_FIELD];
        if (!events)
            return this;
        triggerEvents(events, type, payloads);
        return this;
    }
    listenTo(other, typeOrKv, callback) {
        if (!isBlEvent(other))
            return this;
        const id = other[ID_FIELD] || (other[ID_FIELD] = uniqueId());
        const listeningMap = this[LISTENING_FIELD] || (this[LISTENING_FIELD] = Object.create(null));
        _currentListening = listeningMap[id];
        if (!_currentListening) {
            if (!this[ID_FIELD])
                this[ID_FIELD] = uniqueId();
            _currentListening = listeningMap[id] = new Listening(this, other);
        }
        other.on(typeOrKv, callback);
        _currentListening = void 0;
        return this;
    }
    listenToOnce(other, typeOrKv, callback) {
        const events = makeOnceWrapper(typeOrKv, callback, this.stopListening.bind(this, other));
        return this.listenTo(other, events);
    }
    stopListening(other, typeOrKvOrCb, callback) {
        const listeningMap = this[LISTENING_FIELD];
        if (!listeningMap)
            return this;
        const hasTarget = isBlEvent(other);
        if (!hasTarget) {
            callback = typeOrKvOrCb;
            typeOrKvOrCb = other;
        }
        const stop = (listening) => {
            if (typeOrKvOrCb && callback) {
                listening.target.off(typeOrKvOrCb, callback);
            }
            else {
                listening.target.off(typeOrKvOrCb);
            }
        };
        if (hasTarget) {
            const id = other[ID_FIELD];
            const listening = id ? listeningMap[id] : null;
            if (listening) {
                stop(listening);
            }
        }
        else {
            const ids = Object.keys(listeningMap);
            for (let i = 0; i < ids.length; i++) {
                const listening = listeningMap[ids[i]];
                stop(listening);
            }
        }
        if (isEmpty(listeningMap))
            this[LISTENING_FIELD] = void 0;
        return this;
    }
}
