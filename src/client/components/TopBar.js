import { html } from 'htm/preact'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const TopBar = () => {
  const doc = state.currentDoc.value
  const version = state.currentVersion.value
  const revSeq = state.currentRevisionSeq.value
  const diff = state.currentDiff.value
  const user = state.currentUser.value

  const versionHref = doc && version ? `/${doc.id}/${version.id}` : null

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/logout')
    } catch (_) {}
    state.currentUser.value = null
    navigate('/login')
  }

  return html`
    <header class="top-bar">
      <a class="top-bar__brand" href="/" onclick=${(e) => { e.preventDefault(); navigate('/') }}>
        Articulate
      </a>
      ${doc && html`
        <span class="top-bar__sep">/</span>
        <a class="top-bar__crumb" href="/${doc.id}" onclick=${(e) => { e.preventDefault(); navigate(`/${doc.id}`) }}>
          ${doc.title}
        </a>
      `}
      ${version && html`
        <span class="top-bar__sep">/</span>
        ${diff
          ? html`<a class="top-bar__crumb" href=${versionHref} onclick=${(e) => { e.preventDefault(); navigate(versionHref) }}>${version.name}</a>`
          : html`<span class="top-bar__current">${version.name}</span>`
        }
        ${version.kind === 'branch' && html`<span class="top-bar__badge">branch</span>`}
        ${!!version.locked && html`<span class="top-bar__badge">locked</span>`}
      `}
      ${version && revSeq != null && html`
        <span class="top-bar__sep">/</span>
        ${diff
          ? html`<a class="top-bar__crumb" href=${versionHref + '/rev/' + revSeq} onclick=${(e) => { e.preventDefault(); navigate(versionHref + '/rev/' + revSeq) }}>Rev ${revSeq}</a>`
          : html`<span class="top-bar__current">Rev ${revSeq}</span>`
        }
      `}
      ${diff && html`
        <span class="top-bar__sep">/</span>
        <span class="top-bar__current">Diff: Rev ${diff.seqA} \u2192 Rev ${diff.seqB}</span>
      `}
      <div class="top-bar__spacer" />
      <a class="top-bar__link" href="/docs" onclick=${(e) => { e.preventDefault(); navigate('/docs') }}>
        Docs
      </a>
      ${user
        ? html`
          ${user.role === 'admin' && html`
            <a class="top-bar__link" href="/admin" onclick=${(e) => { e.preventDefault(); navigate('/admin') }}>Admin</a>
          `}
          <span class="top-bar__user">${user.display_name || user.username}</span>
          <a class="top-bar__link" href="/login" onclick=${handleLogout}>Log out</a>
        `
        : html`
          <a class="top-bar__link" href="/login" onclick=${(e) => { e.preventDefault(); navigate('/login') }}>Log in</a>
        `
      }
    </header>
  `
}

export default TopBar
