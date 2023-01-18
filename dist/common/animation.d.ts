export declare function transitionEnter(el: HTMLElement, name: string): void;
export declare function transitionLeave(el: HTMLElement, name: string): void;
export declare function doTransitionEnter(el: HTMLElement, name: string, onEnd: () => void): void;
export declare function doTransitionLeave(el: HTMLElement, name: string, onEnd: () => void): void;
export declare function isTransitionEnter(el: HTMLElement, name: string): boolean;
export declare function isTransitionLeave(el: HTMLElement, name: string): boolean;
export declare function isTransition(el: HTMLElement, name: string): boolean;
export declare function clearTransition(el: HTMLElement, name: string): void;
export declare function onTransitionEnd(el: HTMLElement, callback: () => void): () => void;
