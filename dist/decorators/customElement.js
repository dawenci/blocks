export const customElement = (name) => {
    const decorator = (target, ctx) => {
        ctx.addInitializer(function () {
            if (!customElements.get(name)) {
                customElements.define(name, target);
            }
        });
    };
    return decorator;
};
