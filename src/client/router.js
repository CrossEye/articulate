import { signal, effect } from '@preact/signals'

// Current route state
const route = signal(parseLocation())
const params = signal({})

const routes = []

const addRoute = (pattern, component) => {
  const keys = []
  const regex = pattern.replace(/:(\w+)/g, (_, key) => {
    keys.push(key)
    return '([^/]+)'
  }).replace(/\*/g, '(.*)')
  routes.push({ regex: new RegExp(`^${regex}$`), keys, component })
}

const navigate = (path, replace = false) => {
  if (path === location.pathname) return
  if (replace) {
    history.replaceState(null, '', path)
  } else {
    history.pushState(null, '', path)
  }
  route.value = parseLocation()
}

const match = () => {
  const path = route.value.path
  for (const r of routes) {
    const m = path.match(r.regex)
    if (m) {
      const p = {}
      r.keys.forEach((key, i) => { p[key] = decodeURIComponent(m[i + 1]) })
      params.value = p
      return r.component
    }
  }
  return null
}

function parseLocation() {
  return {
    path: location.pathname,
    search: location.search,
    hash: location.hash,
  }
}

// Listen for popstate (back/forward)
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    route.value = parseLocation()
  })
}

export { route, params, routes, addRoute, navigate, match }
