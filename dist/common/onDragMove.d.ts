type Offset = {
    x: number;
    y: number;
};
type Point = {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
};
export type OnEnd = (data: {
    eventType: string;
    start: Point;
    current: Point;
    offset: Offset;
}) => void;
export type OnMove = (data: {
    eventType: string;
    preventDefault: () => boolean;
    stopPropagation: () => boolean;
    stopImmediatePropagation: () => boolean;
    start: Point;
    current: Point;
    offset: Offset;
}) => void;
export type OnCancel = (data: {
    eventType: string;
    start: Point;
    current: Point;
    offset: Offset;
}) => void;
export type OnStart = (data: {
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
type Options = {
    onStart?: OnStart;
    onEnd?: OnEnd;
    onMove?: OnMove;
    onCancel?: OnCancel;
};
export declare function onDragMove($el: HTMLElement, options: Options): () => void;
export {};
