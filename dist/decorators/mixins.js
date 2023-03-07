import { appendObservedAttributes, appendUpgradeProperties, } from './defineClass.js';
import { appendComponentStyles } from './style.js';
export const mixins = (constructors) => {
    const decorator = (target, { addInitializer }) => {
        addInitializer(function () {
            constructors.forEach(baseCtor => {
                Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                    if (name === 'constructor' && target.prototype.constructor) {
                        return;
                    }
                    Object.defineProperty(target.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                        Object.create(null));
                });
            });
            appendObservedAttributes(target, constructors.reduce((acc, ctor) => acc.concat(ctor.observedAttributes ?? []), []));
            appendUpgradeProperties(target, constructors.reduce((acc, ctor) => acc.concat(ctor.upgradeProperties ?? []), []));
            appendComponentStyles(target, constructors.reduce((acc, ctor) => {
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
        });
    };
    return decorator;
};
