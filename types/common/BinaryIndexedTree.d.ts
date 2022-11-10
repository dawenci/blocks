/**
 * Class BinaryIndexedTree
 */
export class BinaryIndexedTree {
  /**
   * The default initial frequency
   * @type {number}
   */
  get defaultFrequency(): number

  /**
   * The maximum value which will have non-zero frequency
   * @type {number}
   */
  get maxVal(): number


  /**
   * Read a single frequency
   * @param {number} idx - The 0 based index for the frequency
   * @return {number}
   */
  readSingle(idx: number): number

  /**
   * Update a single frequency with a delta value
   * @param {number} idx - The 0 based index for the frequency
   * @param {number} delta - The delta value of the freqency
   * @return {undefined}
   */
  update(idx: number, delta: number): void

  /**
   * Update a single frequency with a given value
   * @param {number} idx - The 0 based index for the frequency
   * @param {number} freq - The new frequency
   * @return {undefined}
   */
  writeSingle(idx: number, freq: number): void

  /**
   * Read the sum of the first `count` frequencies
   * @param {number} count - The count of frequencies to accumulate
   * @return {number}
   */
  read(count: number): number

  /**
   * Read the lower-bound with the given cumulated frequency
   * *REQUIRE ALL FREQUENCIES TO BE NON-NEGATIVE*
   * @param {number} sum - The cumulated frequency
   * @return {number}
   */
  lowerBound(sum: number): number

  /**
   * Read the upper-bound with the given cumulated frequency
   * *REQUIRE ALL FREQUENCIES TO BE NON-NEGATIVE*
   * @param {number} sum - The cumulated frequency
   * @return {number}
   */
  upperBound(sum: number): number
}
