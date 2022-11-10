type Offset = { x: number; y: number }

type Point = {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
}

type OnEnd = (data: {
  eventType: string;
  start: Point;
  current: Point;
  offset: Offset;
}) => void

type OnMove = (data: {
  eventType: string;
  preventDefault: () => boolean;
  stopPropagation: () => boolean;
  stopImmediatePropagation: () => boolean;
  start: Point;
  current: Point;
  offset: Offset;
}) => void

type OnCancel = (data: {
  eventType: string;
  start: Point;
  current: Point;
  offset: Offset;
}) => void

type OnStart = (data: {
  eventType: string;
  $target: EventTarget;
  start: Point;
  current: Point;
  offset: Offset;
  stop: () => boolean;
  preventDefault: () => boolean;
  stopPropagation: () => boolean;
  stopImmediatePropagation: () => boolean;
}) => void

export function onDragMove($el: Element, options: {
  onStart: OnStart;
  onEnd: OnEnd;
  onMove: OnMove;
  onCancel: OnCancel;
}): () => void
