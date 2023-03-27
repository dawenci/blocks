export class Code {
  spaceSize = '    '
  _code = ''
  // _codes: string[] = []
  _indent = 0

  get code() {
    // return this._codes.join('')
    return this._code
  }

  get indentSpaces() {
    return repeat(this.spaceSize, this.indent)
  }

  get indent() {
    return this._indent
  }

  set indent(n: number) {
    this._indent = n
  }

  // 移除首尾空白后，首行以及每个换行位置自动插入指定缩进
  indentLines(code: string, indent = 0) {
    const spaces = repeat(this.spaceSize, indent)
    return (
      spaces +
      code.trim().replaceAll(/\n/g, newline => {
        return newline + spaces
      })
    )
  }

  appendCode(code: string) {
    // this._codes.push(code)
    this._code += code
    return this
  }

  prependCode(code: string) {
    // this._codes.unshift(code)
    this._code = code + this._code
    return this
  }

  prependLine(line: string) {
    this.prependCode(this.indentSpaces + line + '\n')
    return this
  }

  appendLine(line: string) {
    this.appendCode(this.indentSpaces + line + '\n')
    return this
  }

  // indent
  blockStart(line: string) {
    this.appendLine(line)
    this._indent += 1
    return this
  }

  // outdent
  blockEnd(line: string) {
    this._indent -= 1
    this.appendLine(line)
    return this
  }

  blockEndAndStart(line: string) {
    this._indent -= 1
    this.appendLine(line)
    this._indent += 1
    return this
  }
}

function repeat(c: string, n: number): string {
  let ret = ''
  while (n--) {
    ret += c
  }
  return ret
}
