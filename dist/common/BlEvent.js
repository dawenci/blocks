const uniqueId = (function () {
    let id = 0;
    return function uniqueId(prefix) {
        return (prefix || '') + id++;
    };
})();
const isEmpty = (() => {
    const hasOwn = Object.prototype.hasOwnProperty;
    return function isEmpty(obj) {
        if (obj == null)
            return true;
        for (const p in obj) {
            if (hasOwn.call(obj, p))
                return false;
        }
        return true;
    };
})();
function once(func) {
    let called = false;
    let memo;
    return function (...args) {
        if (called)
            return memo;
        called = true;
        return (memo = func(...args));
    };
}
function onceMap(map, name, callback, offer) {
    if (typeof callback !== 'function')
        return map;
    const _once = (map[name] = once(function () {
        offer(name, _once);
        callback.apply(this, arguments);
    }));
    _once._callback = callback;
    return map;
}
function iterateEvents(iteratee, events, name, callback, opts) {
    const eventSplitter = /\s+/;
    let i = 0;
    let names;
    if (name && typeof name === 'object') {
        if (callback !== void 0 && 'context' in opts && opts.context === void 0) {
            opts.context = callback;
        }
        for (names = Object.keys(name ?? {}); i < names.length; i++) {
            events = iterateEvents(iteratee, events, names[i], name[names[i]], opts);
        }
    }
    else if (name && eventSplitter.test(name)) {
        for (names = name.split(eventSplitter); i < names.length; i++) {
            events = iteratee(events, names[i], callback, opts);
        }
    }
    else {
        events = iteratee(events, name, callback, opts);
    }
    return events;
}
function onIteratee(events, name, callback, options) {
    if (callback) {
        const handlers = events[name] || (events[name] = []);
        const context = options.context;
        const ctx = context || options.ctx;
        const listening = options.listening;
        if (listening)
            listening.count += 1;
        handlers.push({ callback, context, ctx, listening });
    }
    return events;
}
function offIteratee(events, name, callback, options) {
    if (!events)
        return;
    const context = options.context;
    const listeners = options.listeners;
    let i = 0;
    let names;
    if (!name && !context && !callback) {
        for (names = Object.keys(listeners ?? {}); i < names.length; i++) {
            listeners[names[i]]._cleanup();
        }
        return;
    }
    names = name ? [name] : Object.keys(events);
    for (; i < names.length; i++) {
        name = names[i];
        const handlers = events[name];
        if (!handlers)
            break;
        const remaining = [];
        for (let j = 0; j < handlers.length; j++) {
            const handler = handlers[j];
            if ((callback && callback !== handler.callback && callback !== handler.callback._callback) ||
                (context && context !== handler.context)) {
                remaining.push(handler);
            }
            else {
                const listening = handler.listening;
                if (listening)
                    listening.off(name, callback);
            }
        }
        if (remaining.length) {
            events[name] = remaining;
        }
        else {
            delete events[name];
        }
    }
    return events;
}
function triggerIteratee(objEvents, name, callback, args) {
    if (objEvents) {
        const events = objEvents[name];
        let allEvents = objEvents.all;
        if (events && allEvents)
            allEvents = allEvents.slice();
        if (events)
            trigger(events, args);
        if (allEvents)
            trigger(allEvents, [name].concat(args));
    }
    return objEvents;
}
function trigger(events, args) {
    const count = events.length;
    const arg1 = args[0];
    const arg2 = args[1];
    const arg3 = args[2];
    let event;
    let i = -1;
    switch (args.length) {
        case 0:
            while (++i < count)
                (event = events[i]).callback.call(event.ctx);
            return;
        case 1:
            while (++i < count)
                (event = events[i]).callback.call(event.ctx, arg1);
            return;
        case 2:
            while (++i < count)
                (event = events[i]).callback.call(event.ctx, arg1, arg2);
            return;
        case 3:
            while (++i < count)
                (event = events[i]).callback.call(event.ctx, arg1, arg2, arg3);
            return;
        default:
            while (++i < count)
                (event = events[i]).callback.apply(event.ctx, args);
            return;
    }
}
let _listening;
export class BlEvent {
    __events__;
    __listenId__;
    __listeners__;
    __listeningTo__;
    on(name, callback, context) {
        this.__events__ = iterateEvents(onIteratee, this.__events__ || {}, name, callback, {
            context,
            ctx: this,
            listening: _listening,
        });
        if (_listening) {
            const listeners = this.__listeners__ || (this.__listeners__ = {});
            listeners[_listening.id] = _listening;
            _listening.interop = false;
        }
        return this;
    }
    off(name, callback, context) {
        if (!this.__events__)
            return this;
        this.__events__ = iterateEvents(offIteratee, this.__events__, name, callback, {
            context: context,
            listeners: this.__listeners__,
        });
        return this;
    }
    trigger(name, ...rest) {
        if (!this.__events__)
            return this;
        iterateEvents(triggerIteratee, this.__events__, name, void 0, rest);
        return this;
    }
    listenTo(target, name, callback) {
        if (!target)
            return this;
        const id = target.__listenId__ || (target.__listenId__ = uniqueId('l'));
        const listeningTo = this.__listeningTo__ || (this.__listeningTo__ = {});
        let listening = (_listening = listeningTo[id]);
        if (!listening) {
            if (!this.__listenId__) {
                this.__listenId__ = uniqueId('l');
            }
            listening = _listening = listeningTo[id] = new Listening(this, target);
        }
        let error;
        try {
            target.on(name, callback, this);
        }
        catch (e) {
            error = e;
        }
        _listening = void 0;
        if (error)
            throw error;
        if (listening.interop) {
            listening.on(name, callback);
        }
        return this;
    }
    stopListening(obj, name, callback) {
        const listeningTo = this.__listeningTo__;
        if (!listeningTo)
            return this;
        const ids = obj ? [obj.__listenId__] : Object.keys(listeningTo);
        for (let i = 0; i < ids.length; i++) {
            const listening = listeningTo[ids[i]];
            if (!listening)
                break;
            listening.target.off(name, callback, this);
            if (listening.interop) {
                listening.off(name, callback);
            }
        }
        if (isEmpty(listeningTo))
            this.__listeningTo__ = void 0;
        return this;
    }
    once(name, callback, context) {
        const events = iterateEvents(onceMap, {}, name, callback, this.off.bind(this));
        if (typeof name === 'string' && (context === undefined || context === null)) {
            callback = void 0;
        }
        return this.on(events, callback, context);
    }
    listenToOnce(obj, name, callback) {
        const events = iterateEvents(onceMap, {}, name, callback, this.stopListening.bind(this, obj));
        return this.listenTo(obj, events);
    }
}
class Listening {
    listener;
    target;
    __events__ = void 0;
    id;
    interop = true;
    count = 0;
    on;
    constructor(listener, target) {
        this.listener = listener;
        this.target = target;
        this.listener = listener;
        this.target = target;
        this.id = listener.__listenId__;
    }
    off(name, callback) {
        let shouldCleanup;
        if (this.interop) {
            this.__events__ = iterateEvents(offIteratee, this.__events__, name, callback, {
                context: void 0,
                listeners: void 0,
            });
            shouldCleanup = !this.__events__;
        }
        else {
            this.count--;
            shouldCleanup = this.count === 0;
        }
        if (shouldCleanup) {
            this._cleanup();
        }
    }
    _cleanup() {
        delete this.listener.__listeningTo__[this.target.__listenId__];
        if (!this.interop) {
            delete this.target.__listeners__[this.id];
        }
    }
}
Listening.prototype.on = BlEvent.prototype.on;
