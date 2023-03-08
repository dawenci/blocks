import { clearDecoratorData, getDecoratorData } from './decorators.js';
function isOptions(targetOrOptions) {
    return typeof targetOrOptions === 'object';
}
export function defineClass(targetOrOptions, ctx) {
    if (isOptions(targetOrOptions)) {
        return (target, ctx) => {
            ctx.addInitializer(function () {
                if (targetOrOptions.mixins) {
                    targetOrOptions.mixins.forEach(baseCtor => {
                        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                            if (name === 'constructor' && target.prototype.constructor) {
                                return;
                            }
                            Object.defineProperty(target.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                                Object.create(null));
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
                if (targetOrOptions.styles) {
                    const $style = document.createElement('style');
                    $style.textContent = targetOrOptions.styles.join('\n');
                    appendComponentStyles(target, $style);
                }
                handleMembers(target);
                if (targetOrOptions.attachShadow) {
                    const shadowRootInit = typeof targetOrOptions.attachShadow !== 'object'
                        ? { mode: 'open' }
                        : targetOrOptions.attachShadow;
                    Object.defineProperty(target, '_shadowRootInit', {
                        get: () => shadowRootInit,
                        enumerable: true,
                        configurable: true,
                    });
                }
                if (targetOrOptions.customElement) {
                    if (!customElements.get(targetOrOptions.customElement)) {
                        customElements.define(targetOrOptions.customElement, target);
                    }
                }
            });
        };
    }
    else {
        ctx.addInitializer(function () {
            handleMembers(targetOrOptions);
        });
    }
}
export function handleMembers(target) {
    const data = getDecoratorData();
    appendObservedAttributes(target, data
        .filter(record => record.type === 'attr' && record.observed !== false)
        .map(record => record.attrName));
    appendUpgradeProperties(target, data.filter(record => record.upgrade).map(record => record.name));
    clearDecoratorData();
}
function hasObservedAttributes(target) {
    return !!target.observedAttributes;
}
export function appendObservedAttributes(target, observedAttrs) {
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
export function appendUpgradeProperties(target, upgradeProps) {
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
function hasStyles(target) {
    return !!target._$componentStyle;
}
export function appendComponentStyles(target, $fragment) {
    if ($fragment) {
        const $styleFragment = hasStyles(target)
            ? target._$componentStyle.cloneNode(true)
            : document.createDocumentFragment();
        $styleFragment.appendChild($fragment);
        Object.defineProperty(target, '_$componentStyle', {
            get: () => $styleFragment,
            enumerable: true,
            configurable: true,
        });
    }
}
