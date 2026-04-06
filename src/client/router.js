import { signal, computed } from '@preact/signals'

// Current route state
const route = signal(parseLocation())

// Previous path — for "return after login" and "close docs"
const previousPath = signal(null)

const routes = []

const addRoute = (pattern, component) => {
  const keys = []
  const regex = pattern.replace(/:(\w+)/g, (_, key) => {
    keys.push(key)
    return '([^/]+)'
  }).replace(/\*/g, () => {
    keys.push('0')
    return '(.*)'
  })
  routes.push({ regex: new RegExp(`^${regex}$`), keys, component })
}

const navigate = (path, replace = false) => {
  if (path === location.pathname) return
  const currentIsDoc = location.pathname.startsWith('/docs')
  const nextIsDoc = path.startsWith('/docs')
  if (replace) {
    history.replaceState(null, '', path)
  } else {
    // Only record previousPath when entering docs from outside.
    // While navigating within docs, keep the original pre-docs path.
    if (!currentIsDoc || !nextIsDoc) {
      previousPath.value = location.pathname + location.search
    }
    history.pushState(null, '', path)
  }
  route.value = parseLocation()
}

// Computed match result — recomputes whenever route changes
const currentMatch = computed(() => {
  const path = route.value.path
  for (const r of routes) {
    const m = path.match(r.regex)
    if (m) {
      const p = {}
      r.keys.forEach((key, i) => { p[key] = decodeURIComponent(m[i + 1]) })
      return { component: r.component, params: p }
    }
  }
  return { component: null, params: {} }
})

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

export { route, currentMatch, routes, addRoute, navigate, previousPath }
