type ScrollToOptions = {
    duration?: number;
    done?: () => void;
    smoother?: (t: number) => number;
    property?: string;
};
export declare function scrollTo(scrollable: HTMLElement, to?: number, options?: ScrollToOptions): (() => void) | undefined;
export {};
