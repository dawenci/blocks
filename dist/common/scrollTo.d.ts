type ScrollToOptions = {
    duration?: number;
    done?: () => void;
    smoother?: (t: number) => number;
    property?: string;
};
export declare function scrollTo(scrollable: HTMLElement, to?: number, options?: ScrollToOptions): typeof noop;
declare function noop(): void;
export {};
