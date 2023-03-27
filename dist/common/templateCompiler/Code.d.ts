export declare class Code {
    spaceSize: string;
    _code: string;
    _indent: number;
    get code(): string;
    get indentSpaces(): string;
    get indent(): number;
    set indent(n: number);
    indentLines(code: string, indent?: number): string;
    appendCode(code: string): this;
    prependCode(code: string): this;
    prependLine(line: string): this;
    appendLine(line: string): this;
    blockStart(line: string): this;
    blockEnd(line: string): this;
    blockEndAndStart(line: string): this;
}
