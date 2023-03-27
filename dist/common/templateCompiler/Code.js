export class Code {
    spaceSize = '    ';
    _code = '';
    _indent = 0;
    get code() {
        return this._code;
    }
    get indentSpaces() {
        return repeat(this.spaceSize, this.indent);
    }
    get indent() {
        return this._indent;
    }
    set indent(n) {
        this._indent = n;
    }
    indentLines(code, indent = 0) {
        const spaces = repeat(this.spaceSize, indent);
        return (spaces +
            code.trim().replaceAll(/\n/g, newline => {
                return newline + spaces;
            }));
    }
    appendCode(code) {
        this._code += code;
        return this;
    }
    prependCode(code) {
        this._code = code + this._code;
        return this;
    }
    prependLine(line) {
        this.prependCode(this.indentSpaces + line + '\n');
        return this;
    }
    appendLine(line) {
        this.appendCode(this.indentSpaces + line + '\n');
        return this;
    }
    blockStart(line) {
        this.appendLine(line);
        this._indent += 1;
        return this;
    }
    blockEnd(line) {
        this._indent -= 1;
        this.appendLine(line);
        return this;
    }
    blockEndAndStart(line) {
        this._indent -= 1;
        this.appendLine(line);
        this._indent += 1;
        return this;
    }
}
function repeat(c, n) {
    let ret = '';
    while (n--) {
        ret += c;
    }
    return ret;
}
