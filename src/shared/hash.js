import { createHash } from 'node:crypto'

const contentHash = (body, caption = '', nodeType = 'section', metadata = null) => {
  const canonical = JSON.stringify({ body, caption, nodeType, metadata })
  return createHash('sha256').update(canonical).digest('hex')
}

export { contentHash }
