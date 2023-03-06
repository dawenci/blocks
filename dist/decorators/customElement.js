import { handleMembers } from './defineClass.js';
export const customElement = (name) => {
    const decorator = (target, ctx) => {
        ctx.addInitializer(function () {
            handleMembers(target);
            if (!customElements.get(name)) {
                customElements.define(name, target);
            }
        });
    };
    return decorator;
};
