import { appendObservedAttributes } from './appendObservedAttributes.js';
import { appendUpgradeProperties } from './appendUpgradeProperties.js';
import { clearDecoratorData, getDecoratorData } from '../decorators.js';
export function handleMembers(target) {
    const data = getDecoratorData();
    appendObservedAttributes(target, data.filter(record => record.type === 'attr' && record.observed !== false).map(record => record.attrName));
    appendUpgradeProperties(target, data.filter(record => record.upgrade).map(record => record.name));
    clearDecoratorData();
}
