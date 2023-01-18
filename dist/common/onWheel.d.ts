declare type Data = {
    spinX: number;
    spinY: number;
    pixelX: number;
    pixelY: number;
};
export declare function onWheel(el: Element, handler: (event: WheelEvent, data: Data) => void): void;
export {};
