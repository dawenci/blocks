type Size = {
    width: number;
    height: number;
};
export declare const sizeObserve: (el: HTMLElement, handler: (size: Size) => void) => () => void;
export {};
