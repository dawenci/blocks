import { handleMixins } from './handleMixins.js';
import { handleMembers } from './handleMembers.js';
import { handleAccessors } from './handleAccessors.js';
import { handleCustomElement } from './handleCustomElement.js';
import { handleShadowDom } from './handleShadowDom.js';
import { handleStyles } from './handleStyles.js';
export function defineClass(targetOrOptions, ctx) {
    if (isOptions(targetOrOptions)) {
        return (target, ctx) => {
            ctx.addInitializer(function () {
                handleMixins(target, targetOrOptions);
                handleAccessors(target, targetOrOptions);
                handleStyles(target, targetOrOptions);
                handleMembers(target);
                handleShadowDom(target, targetOrOptions);
                handleCustomElement(target, targetOrOptions);
            });
        };
    }
    else {
        ctx.addInitializer(function () {
            handleMembers(targetOrOptions);
        });
    }
}
function isOptions(targetOrOptions) {
    return typeof targetOrOptions === 'object';
}
