export type VarName = 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export type TokenType = VarName | 'text';
export type Token = {
    type: TokenType;
    payload: string;
};
export declare const parseDateFormat: (str: string) => Token[];
