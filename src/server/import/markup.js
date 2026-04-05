// TiddlyWiki-to-Markdown markup converter.
// Converts TiddlyWiki formatting to Markdown equivalents.

// Bold: ''text'' -> **text**
const convertBold = (text) =>
  text.replace(/''(.+?)''/g, '**$1**')

// Italic: //text// -> *text*
const convertItalic = (text) =>
  text.replace(/\/\/(.+?)\/\//g, '*$1*')

// Underline: __text__ -> _text_ (or just remove underline markers)
const convertUnderline = (text) =>
  text.replace(/__(.+?)__/g, '_$1_')

// Strikethrough: ~~text~~ -> ~~text~~ (same in both)
// No conversion needed

// Code: `text` -> `text` (same in both)
// No conversion needed

// Headings: ! -> #, !! -> ##, etc.
const convertHeadings = (text) =>
  text.replace(/^(!{1,6})\s*/gm, (_, bangs) =>
    '#'.repeat(bangs.length) + ' '
  )

// TiddlyWiki links: [[display text|url]] -> [display text](url)
// Also handles simple [[title]] links
const convertLinks = (text) =>
  text
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '[$1]($2)')
    .replace(/\[\[([^\]]+)\]\]/g, '[$1]($1)')

// Bullet lists: * -> - (TW uses * for unordered)
const convertBulletLists = (text) =>
  text.replace(/^(\*+)\s/gm, (_, stars) =>
    '  '.repeat(stars.length - 1) + '- '
  )

// Numbered lists: # -> 1. (TW uses # for ordered)
const convertNumberedLists = (text) =>
  text.replace(/^(#+)\s/gm, (_, hashes) =>
    '  '.repeat(hashes.length - 1) + '1. '
  )

// Strip TW macro calls: <<macroName args>> -> empty or placeholder
// Known macros that are just structural and should be removed entirely
const stripStructuralMacros = (text) =>
  text
    .replace(/^\s*<<sections\s+\d+>>\s*$/gm, '')
    .replace(/^\s*<<subsections\s+\d+>>\s*$/gm, '')
    .replace(/^\s*<<sub-subsections\s+[\w.]+>>\s*$/gm, '')
    .replace(/^\s*<<sections>>\s*$/gm, '')

// Convert cross-reference macros: <<Section NNN>> -> [[chN/sNNN]]
// This is charter-specific; the caller provides a path resolver
const convertCrossRefs = (text, pathResolver) =>
  pathResolver
    ? text.replace(/<<Section\s+(\d+[A-Z]?(?:\([^)]+\))*)>>/g, (_, ref) =>
        `[[${pathResolver(ref)}]]`
      )
    : text

// Apply all conversions
const twToMarkdown = (text, options = {}) => {
  let result = text
  result = stripStructuralMacros(result)
  result = convertBold(result)
  result = convertItalic(result)
  result = convertUnderline(result)
  result = convertHeadings(result)
  result = convertLinks(result)
  result = convertBulletLists(result)
  result = convertNumberedLists(result)
  if (options.pathResolver) {
    result = convertCrossRefs(result, options.pathResolver)
  }
  return result.trim()
}

export {
  twToMarkdown,
  convertBold,
  convertItalic,
  convertUnderline,
  convertHeadings,
  convertLinks,
  convertBulletLists,
  convertNumberedLists,
  stripStructuralMacros,
  convertCrossRefs,
}
