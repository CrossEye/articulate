const splitPath = (path) =>
  path ? path.split('/').filter(Boolean) : []

const joinPath = (...segments) =>
  segments.flat().filter(Boolean).join('/')

const parentPath = (path) => {
  const segments = splitPath(path)
  return segments.length > 1 ? joinPath(segments.slice(0, -1)) : null
}

const lastSegment = (path) => {
  const segments = splitPath(path)
  return segments.length > 0 ? segments[segments.length - 1] : ''
}

const depth = (path) =>
  splitPath(path).length - 1

const slugify = (marker) =>
  marker
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export { splitPath, joinPath, parentPath, lastSegment, depth, slugify }
