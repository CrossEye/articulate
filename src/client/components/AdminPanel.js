import { html } from 'htm/preact'
import { signal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const AdminPanel = () => {
  const user = state.currentUser.value
  if (!user || user.role !== 'admin') {
    return html`
      <main class="main-content">
        <h1>Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </main>
    `
  }

  return html`
    <main class="main-content admin-page">
      <h1>Admin Panel</h1>
      <div class="admin-sections">
        <${UserSection} />
        <${InviteSection} />
      </div>
    </main>
  `
}

const UserSection = () => {
  const users = signal([])
  const error = signal(null)
  const showForm = signal(false)
  const formUsername = signal('')
  const formPassword = signal('')
  const formDisplayName = signal('')
  const formRole = signal('editor')

  const loadUsers = () => {
    api.get('/users').then(data => { users.value = data }).catch(err => { error.value = err.message })
  }

  useEffect(loadUsers, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    error.value = null
    try {
      await api.post('/users', {
        username: formUsername.value,
        password: formPassword.value,
        displayName: formDisplayName.value || undefined,
        role: formRole.value,
      })
      formUsername.value = ''
      formPassword.value = ''
      formDisplayName.value = ''
      formRole.value = 'editor'
      showForm.value = false
      loadUsers()
    } catch (err) {
      error.value = err.message
    }
  }

  const handleDelete = async (userId, username) => {
    if (!confirm(`Delete user "${username}"?`)) return
    try {
      await api.delete(`/users/${userId}`)
      loadUsers()
    } catch (err) {
      error.value = err.message
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole })
      loadUsers()
    } catch (err) {
      error.value = err.message
    }
  }

  return html`
    <section class="admin-section">
      <h2>Users</h2>
      ${error.value && html`<div class="auth-error">${error.value}</div>`}
      <table class="admin-table">
        <thead>
          <tr><th>Username</th><th>Display Name</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${users.value.map(u => html`
            <tr key=${u.id}>
              <td>${u.username}</td>
              <td>${u.display_name || '\u2014'}</td>
              <td>
                <select value=${u.role} onchange=${(e) => handleRoleChange(u.id, e.target.value)}>
                  <option value="admin">admin</option>
                  <option value="editor">editor</option>
                  <option value="viewer">viewer</option>
                </select>
              </td>
              <td>
                ${u.id !== state.currentUser.value?.id && html`
                  <button class="btn btn--small btn--danger" onclick=${() => handleDelete(u.id, u.username)}>Delete</button>
                `}
              </td>
            </tr>
          `)}
        </tbody>
      </table>

      ${showForm.value
        ? html`
          <form class="admin-form" onsubmit=${handleCreate}>
            <input type="text" class="auth-input" placeholder="Username" value=${formUsername.value}
              oninput=${(e) => { formUsername.value = e.target.value }} required />
            <input type="text" class="auth-input" placeholder="Display Name" value=${formDisplayName.value}
              oninput=${(e) => { formDisplayName.value = e.target.value }} />
            <input type="password" class="auth-input" placeholder="Password" value=${formPassword.value}
              oninput=${(e) => { formPassword.value = e.target.value }} required minlength="6" />
            <select class="auth-input" value=${formRole.value} onchange=${(e) => { formRole.value = e.target.value }}>
              <option value="editor">editor</option>
              <option value="admin">admin</option>
              <option value="viewer">viewer</option>
            </select>
            <div class="admin-form__actions">
              <button type="submit" class="btn btn--primary">Create User</button>
              <button type="button" class="btn" onclick=${() => { showForm.value = false }}>Cancel</button>
            </div>
          </form>
        `
        : html`<button class="btn btn--primary" onclick=${() => { showForm.value = true }}>Add User</button>`
      }
    </section>
  `
}

const InviteSection = () => {
  const invites = signal([])
  const error = signal(null)
  const inviteRole = signal('editor')
  const inviteHours = signal(72)
  const newInviteUrl = signal(null)

  const loadInvites = () => {
    api.get('/invites').then(data => { invites.value = data }).catch(err => { error.value = err.message })
  }

  useEffect(loadInvites, [])

  const handleGenerate = async () => {
    error.value = null
    newInviteUrl.value = null
    try {
      const invite = await api.post('/invites', {
        role: inviteRole.value,
        expiresInHours: Number(inviteHours.value),
      })
      newInviteUrl.value = `${location.origin}/invite/${invite.token}`
      loadInvites()
    } catch (err) {
      error.value = err.message
    }
  }

  const handleRevoke = async (token) => {
    try {
      await api.delete(`/invites/${token}`)
      loadInvites()
    } catch (err) {
      error.value = err.message
    }
  }

  const copyUrl = () => {
    if (newInviteUrl.value) navigator.clipboard?.writeText(newInviteUrl.value)
  }

  return html`
    <section class="admin-section">
      <h2>Invites</h2>
      ${error.value && html`<div class="auth-error">${error.value}</div>`}

      <div class="admin-invite-gen">
        <select class="auth-input" value=${inviteRole.value} onchange=${(e) => { inviteRole.value = e.target.value }}>
          <option value="editor">editor</option>
          <option value="admin">admin</option>
          <option value="viewer">viewer</option>
        </select>
        <label class="admin-invite-hours">
          Expires in
          <input type="number" class="auth-input" value=${inviteHours.value} min="1" max="720"
            oninput=${(e) => { inviteHours.value = e.target.value }} style="width: 5rem" />
          hours
        </label>
        <button class="btn btn--primary" onclick=${handleGenerate}>Generate Invite</button>
      </div>

      ${newInviteUrl.value && html`
        <div class="admin-invite-url">
          <input type="text" class="auth-input" value=${newInviteUrl.value} readonly onclick=${(e) => e.target.select()} />
          <button class="btn" onclick=${copyUrl}>Copy</button>
        </div>
      `}

      ${invites.value.length > 0 && html`
        <table class="admin-table">
          <thead>
            <tr><th>Role</th><th>Status</th><th>Expires</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${invites.value.map(inv => {
              const expired = new Date(inv.expires_at) < new Date()
              const status = inv.used_at ? 'Used' : expired ? 'Expired' : 'Active'
              return html`
                <tr key=${inv.token}>
                  <td>${inv.role}</td>
                  <td class=${`invite-status invite-status--${status.toLowerCase()}`}>${status}</td>
                  <td>${new Date(inv.expires_at).toLocaleString()}</td>
                  <td>
                    ${!inv.used_at && html`
                      <button class="btn btn--small btn--danger" onclick=${() => handleRevoke(inv.token)}>Revoke</button>
                    `}
                  </td>
                </tr>
              `
            })}
          </tbody>
        </table>
      `}
    </section>
  `
}

export default AdminPanel
