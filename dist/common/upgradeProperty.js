export function upgradeProperty(element, prop) {
    if (element.hasOwnProperty(prop)) {
        const value = element[prop];
        delete element[prop];
        element[prop] = value;
    }
}
