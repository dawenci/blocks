import type { ColorFormat } from '../color/Color.js';
import '../color/index.js';
import '../select-result/index.js';
import { BlPopup } from '../popup/index.js';
import { BlColor } from '../color/index.js';
import { BlControl } from '../base-control/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { PROXY_POPUP_ACCESSORS, PROXY_RESULT_ACCESSORS } from '../../common/constants.js';
export interface BlColorPicker extends BlControl, Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>, Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
    $popup: BlPopup;
    $color: BlColor;
    defaultColor?: number;
}
export declare class BlColorPicker extends BlControl {
    #private;
    static get observedAttributes(): readonly string[];
    accessor formatString: ColorFormat;
    accessor value: number;
    accessor open: boolean;
    accessor clearable: boolean;
    accessor $result: BlSelectResult;
    get $arrowWrapper(): HTMLSpanElement;
    constructor();
    get hex(): string;
    set hex(value: string);
    get hsl(): import("../color/Color.js").ColorTuple3;
    set hsl(value: import("../color/Color.js").ColorTuple3);
    get hsla(): import("../color/Color.js").ColorTuple4;
    set hsla(value: import("../color/Color.js").ColorTuple4);
    get hsv(): number[];
    set hsv(value: number[]);
    get hsva(): number[];
    set hsva(value: number[]);
    get rgb(): import("../color/Color.js").ColorTuple3;
    set rgb(value: import("../color/Color.js").ColorTuple3);
    get rgba(): import("../color/Color.js").ColorTuple4;
    set rgba(value: import("../color/Color.js").ColorTuple4);
    format(fmt: ColorFormat): string;
}
