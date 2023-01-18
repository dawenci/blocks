declare type Offset = {
    x: number;
    y: number;
};
declare type Point = {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
};
export declare type OnEnd = (data: {
    eventType: string;
    start: Point;
    current: Point;
    offset: Offset;
}) => void;
export declare type OnMove = (data: {
    eventType: string;
    preventDefault: () => boolean;
    stopPropagation: () => boolean;
    stopImmediatePropagation: () => boolean;
    start: Point;
    current: Point;
    offset: Offset;
}) => void;
export declare type OnCancel = (data: {
    eventType: string;
    start: Point;
    current: Point;
    offset: Offset;
}) => void;
export declare type OnStart = (data: {
    eventType: string;
    $target: HTMLElement;
    start: Point;
    current: Point;
    offset: Offset;
    stop: () => boolean;
    preventDefault: () => boolean;
    stopPropagation: () => boolean;
    stopImmediatePropagation: () => boolean;
}) => void;
declare type Options = {
    onStart?: OnStart;
    onEnd?: OnEnd;
    onMove?: OnMove;
    onCancel?: OnCancel;
};
export declare function onDragMove($el: HTMLElement, options: Options): () => void;
export {};
