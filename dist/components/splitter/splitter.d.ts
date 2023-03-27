import type { EnumAttr } from '../../decorators/attr.js';
import { BlocksSplitterPane } from './pane.js';
import { Component } from '../component/Component.js';
export interface BlocksSplitter extends Component {
    _ref: {
        $layout: HTMLElement;
        $panes: HTMLElement;
        $cover: HTMLElement;
        $slot: HTMLSlotElement;
    };
}
export declare class BlocksSplitter extends Component {
    #private;
    accessor direction: EnumAttr<['horizontal', 'vertical']>;
    accessor handleSize: number;
    panes: BlocksSplitterPane[];
    handles: HTMLElement[];
    constructor();
    _renderDirection(): void;
    get size(): number;
    renderHandles(): void;
    getPaneSize($pane: BlocksSplitterPane): number;
    isSizeFrozen($pane: BlocksSplitterPane): boolean;
    getPanePosition($pane: BlocksSplitterPane): number;
    getHandlerSize(): number;
    getPaneIndex($pane: BlocksSplitterPane): number;
    resizePane($pane: BlocksSplitterPane, newSize: number): void;
    collapsePane($pane: BlocksSplitterPane): void;
    expandPane($pane: BlocksSplitterPane): void;
    layout(): void;
    setActiveHandle($pane: BlocksSplitterPane): void;
    clearActiveHandle(): void;
    getHandleIndex($handle: HTMLElement): number;
    _getGrowSize($pane: BlocksSplitterPane): number;
    _getShrinkSize($pane: BlocksSplitterPane): number;
    _growPanes(rest: number, panes: BlocksSplitterPane[]): void;
    _shrinkPanes(rest: number, panes: BlocksSplitterPane[]): void;
    toggleCover(visible: boolean): void;
}
