import { padLeft } from './utils.js';
export const tokenize = (str) => {
    const tokens = [];
    const len = str.length;
    let pos = 0;
    let text = '';
    const pushText = () => {
        if (text) {
            tokens.push({ type: 'text', payload: text });
            text = '';
        }
    };
    function eatVar(type, payload) {
        pushText();
        tokens.push({ type, payload });
        pos += payload.length;
    }
    const eatText = () => {
        text += str[pos];
        pos += 1;
    };
    while (pos < len) {
        const ch = str[pos];
        const ch2 = str[pos + 1];
        if (ch === 'Y' && ch2 === 'Y') {
            eatVar('year', str[pos + 2] === 'Y' && str[pos + 3] === 'Y' ? 'YYYY' : 'YY');
        }
        else if (ch === 'M') {
            eatVar('month', ch2 === 'M' ? 'MM' : 'M');
        }
        else if (ch === 'D') {
            eatVar('day', ch2 === 'D' ? 'DD' : 'D');
        }
        else if (ch === 'H') {
            eatVar('hour', ch2 === 'H' ? 'HH' : 'H');
        }
        else if (ch === 'm') {
            eatVar('minute', ch2 === 'm' ? 'mm' : 'm');
        }
        else if (ch === 's') {
            eatVar('second', ch2 === 's' ? 'ss' : 's');
        }
        else if (str.substr(pos, 3) === 'SSS') {
            eatVar('millisecond', 'SSS');
        }
        else {
            eatText();
        }
    }
    pushText();
    return tokens;
};
export const compile = (format) => {
    const tokens = tokenize(format);
    return (date) => {
        return tokens.reduce((acc, token) => {
            switch (token.type) {
                case 'year': {
                    const y = String(date.getFullYear());
                    return acc + y;
                }
                case 'month': {
                    const m = String(date.getMonth() + 1);
                    return acc + (token.payload.length === 2 ? padLeft('0', 2, m) : m);
                }
                case 'day': {
                    const d = String(date.getDate());
                    return acc + (token.payload.length === 2 ? padLeft('0', 2, d) : d);
                }
                case 'hour': {
                    const h = String(date.getHours());
                    return acc + (token.payload.length === 2 ? padLeft('0', 2, h) : h);
                }
                case 'minute': {
                    const m = String(date.getMinutes());
                    return acc + (token.payload.length === 2 ? padLeft('0', 2, m) : m);
                }
                case 'second': {
                    const s = String(date.getSeconds());
                    return acc + (token.payload.length === 2 ? padLeft('0', 2, s) : s);
                }
                case 'millisecond': {
                    const ms = String(date.getMilliseconds());
                    return acc + padLeft('0', 3, ms);
                }
                default:
                    return acc + token.payload;
            }
        }, '');
    };
};
