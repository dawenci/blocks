export declare type VarName = 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export declare type TokenType = VarName | 'text';
export declare type Token = {
    type: TokenType;
    payload: string;
};
export declare const parseDateFormat: (str: string) => Token[];
