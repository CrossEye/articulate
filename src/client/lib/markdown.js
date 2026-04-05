// Client-side Markdown rendering with cross-reference support.
// Uses a simple regex approach for now; will integrate marked later if needed.

const escapeHtml = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// Render cross-references: [[path]] or [[path|display text]]
const renderCrossRefs = (html, onNavigate) => {
  return html.replace(
    /\[\[([^|\]]+?)(?:\|([^\]]+?))?\]\]/g,
    (_, path, display) => {
      const text = display || path
      return `<a href="#" class="cross-ref" data-path="${escapeHtml(path)}">${escapeHtml(text)}</a>`
    },
  )
}

export { renderCrossRefs, escapeHtml }
