export type AttrType = 'string' | 'number' | 'int' | 'enum' | 'boolean' | 'intRange';
export type AttrOptions = {
    observed?: boolean;
    upgrade?: boolean;
    enumValues?: any[] | readonly any[];
    min?: number;
    max?: number;
    get?: (element: any) => any;
    set?: (element: any, value: any) => void;
    defaults?: any | ((componentInstance: any) => any);
};
export type PropOptions = {
    upgrade?: boolean;
    get?: (element: any) => any;
    set?: (element: any, value: any) => void;
    defaults?: any | ((componentInstance: any) => any);
};
export type DecoratorRecord = {
    type: 'attr' | 'prop' | 'shadowRef';
    name: string;
    attrType?: string;
    attrName?: string;
    upgrade?: boolean;
    observed?: boolean;
};
export declare function addDecoratorData(record: DecoratorRecord): void;
export declare function clearDecoratorData(): void;
export declare function getDecoratorData(): DecoratorRecord[];
