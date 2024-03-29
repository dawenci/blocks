import { BlSplitterPane } from './pane.js';
import { BlComponent } from '../component/Component.js';
export declare class BlSplitter extends BlComponent {
    #private;
    accessor direction: OneOf<['horizontal', 'vertical']>;
    accessor handleSize: number;
    panes: BlSplitterPane[];
    handles: HTMLElement[];
    accessor $layout: HTMLElement;
    accessor $panes: HTMLElement;
    accessor $cover: HTMLElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    _renderDirection(): void;
    get size(): number;
    renderHandles(): void;
    getPaneSize($pane: BlSplitterPane): number;
    isSizeFrozen($pane: BlSplitterPane): boolean;
    getPanePosition($pane: BlSplitterPane): number;
    getHandlerSize(): number;
    getPaneIndex($pane: BlSplitterPane): number;
    resizePane($pane: BlSplitterPane, newSize: number): void;
    collapsePane($pane: BlSplitterPane): void;
    expandPane($pane: BlSplitterPane): void;
    layout(): void;
    setActiveHandle($pane: BlSplitterPane): void;
    clearActiveHandle(): void;
    getHandleIndex($handle: HTMLElement): number;
    _getGrowSize($pane: BlSplitterPane): number;
    _getShrinkSize($pane: BlSplitterPane): number;
    _growPanes(rest: number, panes: BlSplitterPane[]): void;
    _shrinkPanes(rest: number, panes: BlSplitterPane[]): void;
    toggleCover(visible: boolean): void;
}
