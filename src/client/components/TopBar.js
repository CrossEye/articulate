import { html } from 'htm/preact'
import { state } from '../state.js'
import { navigate, previousPath, route } from '../router.js'
import api from '../api.js'

// Inline wordmark SVG — avoids a network request and allows CSS coloring
const Wordmark = () => html`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 52" class="top-bar__wordmark" aria-label="Articulate">
    <g transform="translate(4, 2) scale(0.26)">
      <rect x="20" y="10" width="160" height="155" rx="12" fill="#eff6ff"/>
      <rect x="35" y="23" width="130" height="130" rx="10" fill="#dbeafe"/>
      <rect x="50" y="37" width="100" height="104" rx="8" fill="#93c5fd"/>
      <rect x="65" y="51" width="70" height="78" rx="6" fill="#3b82f6"/>
      <rect x="78" y="63" width="44" height="54" rx="5" fill="#1e40af"/>
      <text x="100" y="95" text-anchor="middle" font-family="'Courier New', monospace"
        font-size="22" fill="white" font-weight="bold">A</text>
    </g>
    <text x="54" y="33" font-family="Georgia, serif" font-size="22" fill="white"
      font-weight="bold" letter-spacing="1">Articulate</text>
    <text x="55" y="46" font-family="Georgia, serif" font-size="6.5" fill="#93c5fd"
      letter-spacing="2.5">COLLABORATIVE DOCUMENT EDITING</text>
  </svg>
`

const TopBar = () => {
  const doc = state.currentDoc.value
  const version = state.currentVersion.value
  const revSeq = state.currentRevisionSeq.value
  const diff = state.currentDiff.value
  const user = state.currentUser.value
  const currentPath = route.value.path
  const isDocsPage = currentPath.startsWith('/docs')

  const versionHref = doc && version ? `/${doc.id}/${version.id}` : null

  const handleLogout = async (e) => {
    e.preventDefault()
    const next = encodeURIComponent(location.pathname + location.search)
    try { await api.post('/auth/logout') } catch (_) {}
    state.currentUser.value = null
    navigate(`/login?next=${next}`)
  }

  const handleDocsToggle = (e) => {
    e.preventDefault()
    if (isDocsPage) {
      // Return to wherever we were before opening docs
      const prev = previousPath.value
      navigate(prev && !prev.startsWith('/docs') ? prev : '/')
    } else {
      navigate('/docs')
    }
  }

  return html`
    <header class="top-bar">
      <!-- Tier 1: brand + user -->
      <div class="top-bar__primary">
        <a class="top-bar__brand" href="/" onclick=${(e) => { e.preventDefault(); navigate('/') }}>
          <${Wordmark} />
        </a>
        <div class="top-bar__user-area">
          ${user
            ? html`
              ${user.role === 'admin' && html`
                <a class="top-bar__link" href="/admin"
                  onclick=${(e) => { e.preventDefault(); navigate('/admin') }}>Admin</a>
              `}
              <span class="top-bar__user">${user.display_name || user.username}</span>
              <a class="top-bar__link" href="/login" onclick=${handleLogout}>Log out</a>
            `
            : html`
              <a class="top-bar__link" href="/login"
                onclick=${(e) => { e.preventDefault(); navigate('/login') }}>Log in</a>
            `
          }
        </div>
      </div>

      <!-- Tier 2: breadcrumbs + docs toggle -->
      <div class="top-bar__secondary">
        <nav class="top-bar__breadcrumbs">
          ${doc && html`
            <a class="top-bar__crumb" href="/${doc.id}"
              onclick=${(e) => { e.preventDefault(); navigate(`/${doc.id}`) }}>
              ${doc.title}
            </a>
          `}
          ${version && html`
            <span class="top-bar__sep">/</span>
            ${diff
              ? html`<a class="top-bar__crumb" href=${versionHref}
                  onclick=${(e) => { e.preventDefault(); navigate(versionHref) }}>${version.name}</a>`
              : html`<span class="top-bar__current">${version.name}</span>`
            }
            ${version.kind === 'branch' && html`<span class="top-bar__badge">branch</span>`}
            ${!!version.locked && html`<span class="top-bar__badge">locked</span>`}
          `}
          ${version && revSeq != null && html`
            <span class="top-bar__sep">/</span>
            ${diff
              ? html`<a class="top-bar__crumb" href=${versionHref + '/rev/' + revSeq}
                  onclick=${(e) => { e.preventDefault(); navigate(versionHref + '/rev/' + revSeq) }}>
                  Rev ${revSeq}
                </a>`
              : html`<span class="top-bar__current">Rev ${revSeq}</span>`
            }
          `}
          ${diff && html`
            <span class="top-bar__sep">/</span>
            <span class="top-bar__current">Diff ${diff.seqA}\u2192${diff.seqB}</span>
          `}
        </nav>
        <a class="top-bar__docs-btn" href="/docs" onclick=${handleDocsToggle}>
          ${isDocsPage ? 'Close docs' : 'Docs'}
        </a>
      </div>
    </header>
  `
}

export default TopBar
