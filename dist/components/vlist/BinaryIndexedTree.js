const isInteger = Number.isInteger || (v => typeof v === 'number' && isFinite(v) && Math.floor(v) === v);
function mostSignificantBit(value) {
    let result = value;
    result |= result >> 1;
    result |= result >> 2;
    result |= result >> 4;
    result |= result >> 8;
    result |= result >> 16;
    result |= result >> 32;
    result -= result >> 1;
    return result;
}
export class BinaryIndexedTree {
    _countNeg;
    _maxVal;
    _msb;
    _defaultFrequency;
    _tree;
    constructor(options) {
        const { defaultFrequency = 0, maxVal } = options;
        this._defaultFrequency = defaultFrequency;
        this._maxVal = maxVal;
        this._tree = { 0: 0 };
        this._msb = mostSignificantBit(maxVal);
        this._countNeg = defaultFrequency < 0 ? maxVal : 0;
    }
    get defaultFrequency() {
        return this._defaultFrequency;
    }
    get maxVal() {
        return this._maxVal;
    }
    _getTree(index) {
        if (index in this._tree) {
            return this._tree[index];
        }
        return this._defaultFrequency * (index & -index);
    }
    _addTree(index, delta) {
        this._tree[index] = this._getTree(index) + delta;
    }
    _checkIndex(index) {
        if (!isInteger(index)) {
            throw new Error('Invalid index');
        }
        if (index < 0 || index >= this._maxVal) {
            throw new Error('Index out of range');
        }
    }
    _readSingle(idx) {
        let index = idx + 1;
        let sum = this._getTree(index);
        const z = index - (index & -index);
        index--;
        while (index !== z) {
            sum -= this._getTree(index);
            index -= index & -index;
        }
        return sum;
    }
    _changed(freqCur, freqNew) {
        if (freqCur < 0 && freqNew >= 0) {
            this._countNeg--;
        }
        else if (freqCur >= 0 && freqNew < 0) {
            this._countNeg++;
        }
    }
    _update(idx, delta) {
        let index = idx + 1;
        while (index <= this._maxVal) {
            this._addTree(index, delta);
            index += index & -index;
        }
    }
    _writeSingle(idx, freq) {
        const freqCur = this._readSingle(idx);
        this._update(idx, freq - freqCur);
        this._changed(freqCur, freq);
    }
    _read(count) {
        let index = count;
        let sum = 0;
        while (index) {
            sum += this._getTree(index);
            index -= index & -index;
        }
        return sum;
    }
    _find(sum, before) {
        let left = 0;
        let right = this._msb << 1;
        let sumT = sum;
        while (right > left + 1) {
            const middle = (left + right) >> 1;
            const sumM = this._getTree(middle);
            if (middle <= this._maxVal && before(sumM, sumT)) {
                sumT -= sumM;
                left = middle;
            }
            else {
                right = middle;
            }
        }
        return left;
    }
    readSingle(idx) {
        this._checkIndex(idx);
        return this._readSingle(idx);
    }
    update(idx, delta) {
        this._checkIndex(idx);
        const freqCur = this._readSingle(idx);
        this._update(idx, delta);
        this._changed(freqCur, freqCur + delta);
    }
    writeSingle(idx, freq) {
        this._checkIndex(idx);
        this._writeSingle(idx, freq);
    }
    read(count) {
        if (!isInteger(count)) {
            throw new Error('Invalid count');
        }
        return this._read(Math.max(Math.min(count, this._maxVal), 0));
    }
    lowerBound(sum) {
        if (this._countNeg > 0) {
            throw new Error('Sequence is not non-descending');
        }
        return this._find(sum, (x, y) => x < y);
    }
    upperBound(sum) {
        if (this._countNeg > 0) {
            throw new Error('Sequence is not non-descending');
        }
        return this._find(sum, (x, y) => x <= y);
    }
}
