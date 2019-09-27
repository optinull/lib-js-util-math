'use strict'

const { BigNumber } = require('bignumber.js')

BigNumber.config({ EXPONENTIAL_AT: [-20, 40] })
BigNumber.DEBUG = true // Use true to throw on NAN initialization

const BN = () => BigNumber

/**
 * @param {string|number|BigNumber} value
 */
const nBN = (value) => {
  if (Number.isNaN(value) || value === 'NaN') throw new Error('ERR_NUM_NAN')
  if (typeof value !== 'string' && typeof value !== 'number' &&
    !(value instanceof BigNumber)) throw new Error('ERR_NUM_NAN')
  if (value === 'Infinity' || value === '-Infinity' ||
    value === Infinity || value === -Infinity) throw new Error('ERR_NUM_INFINITE')

  try {
    return new BigNumber(value)
  } catch (err) {
    throw new Error('ERR_NUM_NAN')
  }
}

/**
 * @param {string|number|BigNumber} value
 */
const validateBN = (value, opts = { allowNegative: true, allowZero: true, allowDecimals: true }) => {
  const n = nBN(value)
  if (opts.allowZero === false && n.isZero()) throw new Error('ERR_NUM_ZERO')
  if (opts.allowNegative === false && n.isNegative()) throw new Error('ERR_NUM_NOT_POS')
  if (opts.allowDecimals === false && /e|\./.test(n.toString())) throw new Error('ERR_NUM_WITH_PRECISION')
}

/**
 * @param {...(string|number|BigNumber)} values
 * @returns {BigNumber}
 */
const safeSumBN = (...values) => {
  let res = nBN(values[0])
  for (let i = 1; i < values.length; i++) {
    res = res.plus(values[i])
  }
  if (res.isNaN() || !res.isFinite()) throw new Error('ERR_NUM_NAN')
  return res
}

/**
 * @param {...(string|number|BigNumber)} values First elem is subtracted by others
 * @returns {BigNumber}
 */
const safeSubBN = (...values) => {
  let res = nBN(values[0])
  for (let i = 1; i < values.length; i++) {
    res = res.minus(values[i])
  }
  if (res.isNaN() || !res.isFinite()) throw new Error('ERR_NUM_NAN')
  return res
}

/**
 * @param {...(string|number|BigNumber)} values
 * @returns {BigNumber}
 */
const safeMulBN = (...values) => {
  let res = nBN(values[0])
  for (let i = 1; i < values.length; i++) {
    res = res.multipliedBy(values[i])
  }
  if (res.isNaN() || !res.isFinite()) throw new Error('ERR_NUM_NAN')
  return res
}

/**
 * @param {...(string|number|BigNumber)} values First elem is divided by others
 * @returns {BigNumber}
 */
const safeDivBN = (...values) => {
  if (values.length < 2) throw new Error('ERR_INVALID_PARAMS')
  const dividers = values.slice(1)
  dividers.forEach(value => validateBN(value, { allowZero: false }))

  let res = nBN(values[0])
  for (let i = 1; i < values.length; i++) {
    res = res.dividedBy(values[i])
  }
  if (res.isNaN() || !res.isFinite()) throw new Error('ERR_NUM_NAN')
  return res
}

module.exports = {
  BN,
  nBN,
  validateBN,
  safeSumBN,
  safeSubBN,
  safeMulBN,
  safeDivBN
}
