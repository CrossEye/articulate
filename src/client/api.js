const BASE = '/api/v1'

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = Object.assign(new Error(body.error || res.statusText), { status: res.status })
    // Redirect to login on 401, unless already on a public page or checking session
    if (res.status === 401 && !path.startsWith('/auth/me')) {
      const loc = location.pathname
      if (loc !== '/login' && !loc.startsWith('/invite/')) {
        const next = encodeURIComponent(loc + location.search)
        location.href = `/login?next=${next}`
      }
    }
    throw err
  }
  return res.json()
}

const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export default api
