let idSeed = Date.now();
export const uniqId = () => {
    return ++idSeed;
};
