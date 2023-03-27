export declare const enum EnvType {
    Root = 0,
    For = 1
}
export declare class EnvRecord {
    static uid: number;
    type: EnvType;
    rawName: string;
    name: string;
    constructor(type: EnvType, rawName: string);
    static root(): EnvRecord;
    static for(rawName: string): EnvRecord;
}
