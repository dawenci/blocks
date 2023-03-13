export const resolve = (env, ...path) => {
    let value = env;
    for (let i = 0, l = path.length; i < l; i += 1) {
        if (!(value = value[path[i]]))
            break;
    }
    return value;
};
