import { padLeft } from './utils.js'

export type VarName = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'

export type TokenType = VarName | 'text'

export type Token = {
  type: TokenType
  payload: string
}

export const tokenize = (str: string) => {
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
  function eatVar(type: 'year', payload: 'YYYY' | 'YY'): void
  function eatVar(type: 'month', payload: 'M' | 'MM'): void
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
    if (ch === 'Y' && ch2 === 'Y') {
      eatVar('year', str[pos + 2] === 'Y' && str[pos + 3] === 'Y' ? 'YYYY' : 'YY')
    } else if (ch === 'M') {
      eatVar('month', ch2 === 'M' ? 'MM' : 'M')
    } else if (ch === 'D') {
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

export const compile = (format: string): ((date: Date) => string) => {
  const tokens = tokenize(format)
  return (date: Date) => {
    return tokens.reduce((acc, token) => {
      switch (token.type) {
        case 'year': {
          const y = String(date.getUTCFullYear())
          return acc + y
        }
        case 'month': {
          const m = String(date.getUTCMonth() + 1)
          return acc + (token.payload.length === 2 ? padLeft('0', 2, m) : m)
        }
        case 'day': {
          const d = String(date.getUTCDate())
          return acc + (token.payload.length === 2 ? padLeft('0', 2, d) : d)
        }
        case 'hour': {
          const h = String(date.getUTCHours())
          return acc + (token.payload.length === 2 ? padLeft('0', 2, h) : h)
        }
        case 'minute': {
          const m = String(date.getUTCMinutes())
          return acc + (token.payload.length === 2 ? padLeft('0', 2, m) : m)
        }
        case 'second': {
          const s = String(date.getUTCSeconds())
          return acc + (token.payload.length === 2 ? padLeft('0', 2, s) : s)
        }
        case 'millisecond': {
          const ms = String(date.getUTCMilliseconds())
          return acc + padLeft('0', 3, ms)
        }
        // text
        default:
          return acc + token.payload
      }
    }, '')
  }
}
