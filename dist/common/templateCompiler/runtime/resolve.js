import { BlModel } from '../../BlModel.js';
export const resolve = (env, key, ...path) => {
    let value = env instanceof BlModel ? env.get(key) : env[key];
    for (let i = 0, l = path.length; value && i < l; i += 1) {
        if (!(value = value[path[i]]))
            break;
    }
    return value;
};
