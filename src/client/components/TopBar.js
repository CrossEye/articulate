import { html } from 'htm/preact'
import { state } from '../state.js'
import { navigate } from '../router.js'

const TopBar = () => {
  const doc = state.currentDoc.value
  const version = state.currentVersion.value

  return html`
    <header class="top-bar">
      <a class="top-bar__brand" href="/" onclick=${(e) => { e.preventDefault(); navigate('/') }}>
        Articulate
      </a>
      ${doc && html`
        <span class="top-bar__sep">/</span>
        <a class="top-bar__doc" href="/${doc.id}" onclick=${(e) => { e.preventDefault(); navigate(`/${doc.id}`) }}>
          ${doc.title}
        </a>
      `}
      ${version && html`
        <span class="top-bar__sep">/</span>
        <span class="top-bar__version">${version.name}</span>
      `}
      <div class="top-bar__spacer" />
      <a class="top-bar__link" href="/docs" onclick=${(e) => { e.preventDefault(); navigate('/docs') }}>
        Docs
      </a>
    </header>
  `
}

export default TopBar
