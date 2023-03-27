export type VarName = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export type TokenType = VarName | 'text';
export type Token = {
    type: TokenType;
    payload: string;
};
export declare const tokenize: (str: string) => Token[];
export declare const compile: (format: string) => (date: Date) => string;
