import { computed, reactive } from '../../common/reactive.js';
export const fromAttr = (component, attrName) => {
    const init = component[attrName];
    const observable = reactive(init);
    const update = () => {
        observable.content = component[attrName];
    };
    component.hook.onConnected(update);
    component.hook.onAttributeChangedDep(attrName, update);
    return computed(v => v, [observable]);
};
