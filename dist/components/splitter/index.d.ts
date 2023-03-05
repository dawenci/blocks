import { Component } from '../Component.js';
import type { EnumAttr } from '../../decorators/attr.js';
export interface BlocksSplitter extends Component {
    _ref: {
        $layout: HTMLElement;
        $panes: HTMLElement;
        $cover: HTMLElement;
        $slot: HTMLSlotElement;
    };
}
export declare class BlocksSplitter extends Component {
    panes: BlocksSplitterPane[];
    handles: HTMLElement[];
    static get observedAttributes(): string[];
    accessor direction: EnumAttr<['horizontal', 'vertical']>;
    accessor handleSize: number;
    constructor();
    _renderDirection(): void;
    get size(): number;
    _offSizeObserve?: () => void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
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
    _initResizeEvents(): void;
    _getGrowSize($pane: BlocksSplitterPane): number;
    _getShrinkSize($pane: BlocksSplitterPane): number;
    _growPanes(rest: number, panes: BlocksSplitterPane[]): void;
    _shrinkPanes(rest: number, panes: BlocksSplitterPane[]): void;
    toggleCover(visible: boolean): void;
}
export declare class BlocksSplitterPane extends Component {
    static get observedAttributes(): string[];
    accessor basis: number;
    accessor grow: number;
    accessor shrink: number;
    accessor max: number;
    accessor min: number;
    collapseSize?: number;
    constructor();
    _size?: number | null;
    get size(): number;
    set size(value: number);
    getSplitter(): BlocksSplitter;
    updateStyle(): void;
    connectedCallback(): void;
    collapse(): void;
    expand(): void;
}
