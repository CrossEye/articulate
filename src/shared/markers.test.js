import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { nextMarker, parseRoman, toRoman, isRoman } from './markers.js'

describe('markers', () => {
  it('increments numeric markers', () => {
    assert.equal(nextMarker('1'), '2')
    assert.equal(nextMarker('99'), '100')
  })

  it('increments s-numbered markers', () => {
    assert.equal(nextMarker('s1'), 's2')
    assert.equal(nextMarker('s203'), 's204')
  })

  it('increments alphabetic markers', () => {
    assert.equal(nextMarker('A'), 'B')
    assert.equal(nextMarker('a'), 'b')
    assert.equal(nextMarker('C'), 'D')
  })

  it('increments Roman numeral markers (multi-char)', () => {
    assert.equal(nextMarker('II'), 'III')
    assert.equal(nextMarker('III'), 'IV')
    assert.equal(nextMarker('IX'), 'X')
    assert.equal(nextMarker('iv'), 'v')
  })

  it('treats single Roman-ambiguous letters as alphabetic', () => {
    assert.equal(nextMarker('I'), 'J')
    assert.equal(nextMarker('V'), 'W')
    assert.equal(nextMarker('C'), 'D')
  })

  it('parses Roman numerals', () => {
    assert.equal(parseRoman('I'), 1)
    assert.equal(parseRoman('IV'), 4)
    assert.equal(parseRoman('IX'), 9)
    assert.equal(parseRoman('XLII'), 42)
  })

  it('converts to Roman numerals', () => {
    assert.equal(toRoman(1), 'I')
    assert.equal(toRoman(4), 'IV')
    assert.equal(toRoman(9), 'IX')
    assert.equal(toRoman(42), 'XLII')
  })

  it('detects Roman numerals', () => {
    assert.equal(isRoman('IV'), true)
    assert.equal(isRoman('abc'), false)
    assert.equal(isRoman('42'), false)
  })
})
