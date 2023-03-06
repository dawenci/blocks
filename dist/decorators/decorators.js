const decoratorDataForCurrentClass = [];
export function addDecoratorData(record) {
    decoratorDataForCurrentClass.push(record);
}
export function clearDecoratorData() {
    decoratorDataForCurrentClass.length = 0;
}
export function getDecoratorData() {
    return decoratorDataForCurrentClass.slice();
}
