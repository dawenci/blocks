export type VarName = 'day' | 'hour' | 'minute' | 'second' | 'millisecond'

export type TokenType = VarName | 'text'

export type Token = {
  type: TokenType
  payload: string
}

export const parseDateFormat = (str: string) => {
  const tokens: Token[] = []
  const len = str.length
  let pos = 0
  let text = ''
  const pushText = () => {
    if (text) {
      tokens.push({ type: 'text', payload: text })
      text = ''
    }
  }
  function eatVar(type: 'day', payload: 'D' | 'DD'): void
  function eatVar(type: 'hour', payload: 'H' | 'HH'): void
  function eatVar(type: 'minute', payload: 'm' | 'mm'): void
  function eatVar(type: 'second', payload: 's' | 'ss'): void
  function eatVar(type: 'millisecond', payload: 'SSS'): void
  function eatVar(type: any, payload: any): void {
    pushText()
    tokens.push({ type, payload })
    pos += payload.length
  }
  const eatText = () => {
    text += str[pos]
    pos += 1
  }
  while (pos < len) {
    const ch = str[pos]
    const ch2 = str[pos + 1]
    if (ch === 'D') {
      eatVar('day', ch2 === 'D' ? 'DD' : 'D')
    } else if (ch === 'H') {
      eatVar('hour', ch2 === 'H' ? 'HH' : 'H')
    } else if (ch === 'm') {
      eatVar('minute', ch2 === 'm' ? 'mm' : 'm')
    } else if (ch === 's') {
      eatVar('second', ch2 === 's' ? 'ss' : 's')
    } else if (str.substr(pos, 3) === 'SSS') {
      eatVar('millisecond', 'SSS')
    } else {
      eatText()
    }
  }
  pushText()
  return tokens
}
