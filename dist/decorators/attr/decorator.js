import { makeAccessor } from './makeAccessor.js';
import { kebabCase } from '../../common/utils.js';
import { addDecoratorData } from '../decorators.js';
export const attr = ((attrType = 'string', options = { defaults: null }) => {
    const decorator = (_, ctx) => {
        const attrName = kebabCase(String(ctx.name));
        const { get, set, init } = makeAccessor(attrType, attrName, options);
        addDecoratorData({
            type: 'attr',
            name: String(ctx.name),
            attrType,
            attrName,
            upgrade: options.upgrade ?? true,
            observed: options.observed,
        });
        return { get, set, init };
    };
    return decorator;
});
attr.bool = attr('boolean');
attr.int = attr('int');
attr.num = attr('number');
attr.str = attr('string');
attr.enum = enumValues => attr('enum', { enumValues });
attr.intRange = (min, max) => attr('intRange', { min, max });
