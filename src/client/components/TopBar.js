import { html } from 'htm/preact'
import { state } from '../state.js'
import { navigate, previousPath, route } from '../router.js'
import api from '../api.js'

const Wordmark = () => html`
  <div class="top-bar__wordmark">
    <img class="top-bar__icon" src="/assets/icon.svg" alt="" />
    <div class="top-bar__wordmark-text">
      <span class="top-bar__name">Articulate</span>
      <span class="top-bar__tagline">Collaborative Document Editing</span>
    </div>
  </div>
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
