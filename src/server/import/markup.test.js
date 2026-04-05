import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  twToMarkdown,
  convertBold,
  convertItalic,
  convertLinks,
  convertHeadings,
  convertBulletLists,
  convertNumberedLists,
  stripStructuralMacros,
  convertCrossRefs,
} from './markup.js'

describe('TW to Markdown', () => {
  it('converts bold', () => {
    assert.equal(convertBold("this is ''bold'' text"), 'this is **bold** text')
  })

  it('converts italic', () => {
    assert.equal(convertItalic('this is //italic// text'), 'this is *italic* text')
  })

  it('converts TW links with display text', () => {
    assert.equal(
      convertLinks('see [[Section 7|https://example.com]]'),
      'see [Section 7](https://example.com)',
    )
  })

  it('converts simple TW links', () => {
    assert.equal(convertLinks('see [[Something]]'), 'see [Something](Something)')
  })

  it('converts headings', () => {
    assert.equal(convertHeadings('! Title'), '# Title')
    assert.equal(convertHeadings('!! Subtitle'), '## Subtitle')
  })

  it('converts bullet lists', () => {
    assert.equal(convertBulletLists('* item'), '- item')
    assert.equal(convertBulletLists('** nested'), '  - nested')
  })

  it('converts numbered lists', () => {
    assert.equal(convertNumberedLists('# item'), '1. item')
    assert.equal(convertNumberedLists('## nested'), '  1. nested')
  })

  it('strips structural macros', () => {
    assert.equal(stripStructuralMacros('<<sections 1>>'), '')
    assert.equal(stripStructuralMacros('<<subsections 302>>'), '')
    assert.equal(stripStructuralMacros('<<sections>>'), '')
  })

  it('converts cross-references with a path resolver', () => {
    const resolver = (ref) => `ch3/s${ref}`
    assert.equal(
      convertCrossRefs('See <<Section 302>> for details.', resolver),
      'See [[ch3/s302]] for details.',
    )
  })

  it('applies all conversions', () => {
    const input = "<<sections 1>>\nThis is ''bold'' and //italic//."
    const result = twToMarkdown(input)
    assert.equal(result, 'This is **bold** and *italic*.')
  })
})
