import { appendObservedAttributes } from './appendObservedAttributes.js';
export function handleAccessors(target, targetOrOptions) {
    if (targetOrOptions.proxyAccessors) {
        targetOrOptions.proxyAccessors.forEach(({ klass, names }) => {
            appendObservedAttributes(target, names);
            names.forEach(name => {
                const accessorDesc = Object.getOwnPropertyDescriptor(klass.prototype, name);
                if (accessorDesc) {
                    Object.defineProperty(target.prototype, name, accessorDesc);
                }
            });
        });
    }
}
