type BinaryIndexedTreeOptions = {
  maxVal: number
  defaultFrequency?: number
}

const isInteger =
  Number.isInteger ||
  (v => typeof v === 'number' && isFinite(v) && Math.floor(v) === v)

function mostSignificantBit(value: any) {
  let result = value

  result |= result >> 1
  result |= result >> 2
  result |= result >> 4
  result |= result >> 8
  result |= result >> 16
  result |= result >> 32
  result -= result >> 1

  return result
}

/**
 * Class BinaryIndexedTree
 */
export class BinaryIndexedTree {
  private _countNeg: number
  private _maxVal: number
  private _msb: number
  private _defaultFrequency: number
  private _tree: Record<number, number>

  /**
   * @param {Object} options
   * @param {number} options.maxVal - The maximum value which will have non-zero frequency
   * @param {number} [options.defaultFrequency=0] - The default initial frequency
   */
  constructor(options: BinaryIndexedTreeOptions) {
    const { defaultFrequency = 0, maxVal } = options
    this._defaultFrequency = defaultFrequency
    this._maxVal = maxVal
    this._tree = { 0: 0 }
    this._msb = mostSignificantBit(maxVal)
    this._countNeg = defaultFrequency < 0 ? (maxVal as number) : 0
  }

  /**
   * The default initial frequency
   * @type {number}
   */
  get defaultFrequency() {
    return this._defaultFrequency
  }

  /**
   * The maximum value which will have non-zero frequency
   * @type {number}
   */
  get maxVal() {
    return this._maxVal
  }

  _getTree(index: number): number {
    if (index in this._tree) {
      return this._tree[index]
    }

    return this._defaultFrequency * (index & -index)
  }

  _addTree(index: number, delta: number): void {
    this._tree[index] = this._getTree(index) + delta
  }

  _checkIndex(index: number): void {
    if (!isInteger(index)) {
      throw new Error('Invalid index')
    }
    if (index < 0 || index >= (this._maxVal as any)) {
      throw new Error('Index out of range')
    }
  }

  _readSingle(idx: number) {
    let index = idx + 1
    let sum = this._getTree(index)
    const z = index - (index & -index)

    index--

    while (index !== z) {
      sum -= this._getTree(index)
      index -= index & -index
    }

    return sum
  }

  _changed(freqCur: number, freqNew: number): void {
    if (freqCur < 0 && freqNew >= 0) {
      this._countNeg--
    } else if (freqCur >= 0 && freqNew < 0) {
      this._countNeg++
    }
  }

  _update(idx: number, delta: number): void {
    let index = idx + 1

    while (index <= (this._maxVal as number)) {
      this._addTree(index, delta)
      index += index & -index
    }
  }

  _writeSingle(idx: number, freq: number): void {
    const freqCur = this._readSingle(idx)

    this._update(idx, freq - freqCur)
    this._changed(freqCur, freq)
  }

  _read(count: number): number {
    let index = count
    let sum = 0
    while (index) {
      sum += this._getTree(index)
      index -= index & -index
    }

    return sum
  }

  _find(sum: number, before: (m: number, t: number) => boolean) {
    let left = 0
    let right = this._msb << 1
    let sumT = sum

    while (right > left + 1) {
      const middle = (left + right) >> 1
      const sumM = this._getTree(middle)

      if (middle <= (this._maxVal as number) && before(sumM, sumT)) {
        sumT -= sumM
        left = middle
      } else {
        right = middle
      }
    }
    return left
  }

  /**
   * Read a single frequency
   * @param {number} idx - The 0 based index for the frequency
   * @return {number}
   */
  readSingle(idx: number): number {
    this._checkIndex(idx)
    return this._readSingle(idx)
  }

  /**
   * Update a single frequency with a delta value
   * @param {number} idx - The 0 based index for the frequency
   * @param {number} delta - The delta value of the freqency
   * @return {undefined}
   */
  update(idx: number, delta: number): void {
    this._checkIndex(idx)
    const freqCur = this._readSingle(idx)

    this._update(idx, delta)
    this._changed(freqCur, freqCur + delta)
  }

  /**
   * Update a single frequency with a given value
   * @param {number} idx - The 0 based index for the frequency
   * @param {number} freq - The new frequency
   * @return {undefined}
   */
  writeSingle(idx: number, freq: number): void {
    this._checkIndex(idx)
    this._writeSingle(idx, freq)
  }

  /**
   * Read the sum of the first `count` frequencies
   * @param {number} count - The count of frequencies to accumulate
   * @return {number}
   */
  read(count: number): number {
    if (!isInteger(count)) {
      throw new Error('Invalid count')
    }
    return this._read(Math.max(Math.min(count, this._maxVal as number), 0))
  }

  /**
   * Read the lower-bound with the given cumulated frequency
   * *REQUIRE ALL FREQUENCIES TO BE NON-NEGATIVE*
   * @param {number} sum - The cumulated frequency
   * @return {number}
   */
  lowerBound(sum: number): number {
    if (this._countNeg > 0) {
      throw new Error('Sequence is not non-descending')
    }
    return this._find(sum, (x, y) => x < y)
  }

  /**
   * Read the upper-bound with the given cumulated frequency
   * *REQUIRE ALL FREQUENCIES TO BE NON-NEGATIVE*
   * @param {number} sum - The cumulated frequency
   * @return {number}
   */
  upperBound(sum: number): number {
    if (this._countNeg > 0) {
      throw new Error('Sequence is not non-descending')
    }
    return this._find(sum, (x, y) => x <= y)
  }
}
