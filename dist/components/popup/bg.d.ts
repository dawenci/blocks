import { PopupOrigin } from './origin.js';
export interface MakeOptions {
    $svg: SVGElement;
    width: number;
    height: number;
    arrowSize: number;
    lineWidth: number;
    radius: number;
    stroke: string;
    fill: string;
    origin: PopupOrigin;
}
export declare function updateBg({ $svg, width, height, arrowSize, lineWidth, radius, stroke, fill, origin }: MakeOptions): SVGElement;
