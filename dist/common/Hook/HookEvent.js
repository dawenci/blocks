import { Event } from '../Event/Event.js';
export class HookEvent extends Event {
    merge(hook) {
        const data = hook._data;
        [0, 1, 2, 3, 4].forEach(type => {
            if (data[type]) {
                data[type].forEach((callback) => {
                    this.on(type, callback);
                });
            }
        });
    }
}
