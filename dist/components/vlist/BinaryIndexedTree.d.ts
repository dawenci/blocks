type BinaryIndexedTreeOptions = {
    maxVal: number;
    defaultFrequency?: number;
};
export declare class BinaryIndexedTree {
    private _countNeg;
    private _maxVal;
    private _msb;
    private _defaultFrequency;
    private _tree;
    constructor(options: BinaryIndexedTreeOptions);
    get defaultFrequency(): number;
    get maxVal(): number;
    _getTree(index: number): number;
    _addTree(index: number, delta: number): void;
    _checkIndex(index: number): void;
    _readSingle(idx: number): number;
    _changed(freqCur: number, freqNew: number): void;
    _update(idx: number, delta: number): void;
    _writeSingle(idx: number, freq: number): void;
    _read(count: number): number;
    _find(sum: number, before: (m: number, t: number) => boolean): number;
    readSingle(idx: number): number;
    update(idx: number, delta: number): void;
    writeSingle(idx: number, freq: number): void;
    read(count: number): number;
    lowerBound(sum: number): number;
    upperBound(sum: number): number;
}
export {};
