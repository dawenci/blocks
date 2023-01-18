export const getElementTarget = (event) => {
    if (event.target instanceof HTMLElement) {
        return event.target;
    }
    return null;
};
