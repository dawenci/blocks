import { appendComponentStyles } from './appendComponentStyles.js';
import { appendObservedAttributes } from './appendObservedAttributes.js';
import { appendUpgradeProperties } from './appendUpgradeProperties.js';
export function handleMixins(target, targetOrOptions) {
    if (targetOrOptions.mixins) {
        targetOrOptions.mixins.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                if (name === 'constructor' && target.prototype.constructor) {
                    return;
                }
                const desc = Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null);
                if (name === 'setupMixin' && target.prototype.setupMixin) {
                    const fn1 = target.prototype.setupMixin;
                    const fn2 = desc.value;
                    const newFn = function () {
                        fn1.call(this);
                        fn2.call(this);
                    };
                    desc.value = newFn;
                }
                Object.defineProperty(target.prototype, name, desc);
            });
        });
        appendObservedAttributes(target, targetOrOptions.mixins.reduce((acc, ctor) => acc.concat(ctor.observedAttributes ?? []), []));
        appendUpgradeProperties(target, targetOrOptions.mixins.reduce((acc, ctor) => acc.concat(ctor.upgradeProperties ?? []), []));
        appendComponentStyles(target, targetOrOptions.mixins.reduce((acc, ctor) => {
            if (!acc)
                return ctor._$componentStyle;
            if (ctor._$componentStyle) {
                if (!acc) {
                    acc = document.createDocumentFragment();
                }
                acc.appendChild(ctor._$componentStyle);
            }
            return acc;
        }, null));
    }
}
