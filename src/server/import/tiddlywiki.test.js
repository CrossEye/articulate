import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseTid } from './tiddlywiki.js'

describe('TiddlyWiki .tid parser', () => {
  it('parses fields and body', () => {
    const content = `caption: Test Caption
title: TestTiddler
tags: Section Chapter3
type: text/vnd.tiddlywiki

This is the body text.
It has multiple lines.`

    const { fields, body } = parseTid(content)
    assert.equal(fields.caption, 'Test Caption')
    assert.equal(fields.title, 'TestTiddler')
    assert.equal(fields.tags, 'Section Chapter3')
    assert.equal(fields.type, 'text/vnd.tiddlywiki')
    assert.ok(body.includes('This is the body text.'))
    assert.ok(body.includes('It has multiple lines.'))
  })

  it('handles empty body', () => {
    const content = `title: Empty
tags: Test

`
    const { fields, body } = parseTid(content)
    assert.equal(fields.title, 'Empty')
    assert.equal(body, '')
  })

  it('handles fields with empty values', () => {
    const content = `title: Test
description:

Body here.`

    const { fields, body } = parseTid(content)
    assert.equal(fields.description, '')
    assert.equal(body, 'Body here.')
  })
})
