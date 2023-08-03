export function appendUpgradeProperties(target, upgradeProps) {
    if (upgradeProps.length) {
        let newGetter;
        if (hasUpgradeProperties(target)) {
            const mergedProps = [...new Set((target.upgradeProperties ?? []).concat(upgradeProps))];
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
function hasUpgradeProperties(target) {
    return target.upgradeProperties;
}
