import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { splitPath, joinPath, parentPath, lastSegment, depth, slugify } from './paths.js'

describe('paths', () => {
  it('splits a path into segments', () => {
    assert.deepEqual(splitPath('ch2/s203/C'), ['ch2', 's203', 'C'])
    assert.deepEqual(splitPath(''), [])
    assert.deepEqual(splitPath('root'), ['root'])
  })

  it('joins segments into a path', () => {
    assert.equal(joinPath('ch2', 's203', 'C'), 'ch2/s203/C')
    assert.equal(joinPath(['a', 'b'], 'c'), 'a/b/c')
  })

  it('returns parent path', () => {
    assert.equal(parentPath('ch2/s203/C'), 'ch2/s203')
    assert.equal(parentPath('ch2'), null)
    assert.equal(parentPath(''), null)
  })

  it('returns last segment', () => {
    assert.equal(lastSegment('ch2/s203/C'), 'C')
    assert.equal(lastSegment('root'), 'root')
    assert.equal(lastSegment(''), '')
  })

  it('computes depth', () => {
    assert.equal(depth('root'), 0)
    assert.equal(depth('root/ch1'), 1)
    assert.equal(depth('root/ch2/s203'), 2)
  })

  it('slugifies markers', () => {
    assert.equal(slugify('Section 203'), 'section-203')
    assert.equal(slugify('A'), 'a')
    assert.equal(slugify('III'), 'iii')
  })
})
