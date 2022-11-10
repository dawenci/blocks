/**
 * 监听滚轮事件
 *
 * @export
 * @param {Element} el 监听滚轮事件的元素
 * @param {(event: WheelEvent, data: {spinX: number; spinY: number, pixelX: number, pixelY: number}) => void} handler
 */
export function onWheel(
  el: Element,
  handler: (event: WheelEvent, normalized: {
    spinX: number;
    spinY: number;
    pixelX: number;
    pixelY: number;
  }) => void
): void
