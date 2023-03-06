import { clearDecoratorData, getDecoratorData, } from './decorators.js';
export const defineClass = (target, ctx) => {
    ctx.addInitializer(function () {
        handleMembers(target);
    });
};
export function handleMembers(target) {
    const data = getDecoratorData();
    handleAttrs(target, data);
    handleUpgrade(target, data);
    clearDecoratorData();
}
function hasObservedAttributes(target) {
    return !!target.observedAttributes;
}
function handleAttrs(target, data) {
    const observedAttrs = data
        .filter(record => record.type === 'attr' && record.observed !== false)
        .map(record => record.attrName);
    if (observedAttrs.length) {
        let newGetter;
        if (hasObservedAttributes(target)) {
            const mergedAttrs = [
                ...new Set((target.observedAttributes ?? []).concat(observedAttrs)),
            ];
            newGetter = () => mergedAttrs;
        }
        else {
            newGetter = () => observedAttrs;
        }
        Object.defineProperty(target, 'observedAttributes', {
            get: () => newGetter(),
            enumerable: true,
            configurable: true,
        });
    }
}
function hasUpgradeProperties(target) {
    return target.upgradeProperties;
}
function handleUpgrade(target, data) {
    const upgradeProps = data
        .filter(record => record.upgrade)
        .map(record => record.name);
    if (upgradeProps.length) {
        let newGetter;
        if (hasUpgradeProperties(target)) {
            const mergedProps = [
                ...new Set((target.upgradeProperties ?? []).concat(upgradeProps)),
            ];
            newGetter = () => mergedProps;
        }
        else {
            newGetter = () => upgradeProps;
        }
        Object.defineProperty(target, 'upgradeProperties', {
            get: () => newGetter(),
            enumerable: true,
            configurable: true,
        });
    }
}
