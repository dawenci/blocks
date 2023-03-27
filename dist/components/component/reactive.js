import { reactive } from '../../common/reactive.js';
export const fromAttr = (component, attrName) => {
    const init = component[attrName];
    const observable = reactive(init);
    const update = () => {
        observable.content = component[attrName];
    };
    component.onConnected(update);
    component.onAttributeChangedDep(attrName, update);
    return observable;
};
