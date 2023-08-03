import { addDecoratorData } from '../decorators.js';
import { makeAccessor } from './makeAccessor.js';
export const prop = (options = { defaults: null }) => {
    const decorator = (_, ctx) => {
        const propName = String(ctx.name);
        const { get, set, init } = makeAccessor(propName, options);
        addDecoratorData({
            type: 'prop',
            name: String(ctx.name),
            attrName: propName,
            upgrade: options.upgrade ?? true,
            observed: false,
        });
        return { get, set, init };
    };
    return decorator;
};
