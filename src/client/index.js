import './styles/main.css'
import './styles/editor.css'
import { render } from 'preact'
import { html } from 'htm/preact'
import App from './app.js'

const root = document.getElementById('app')
render(html`<${App} />`, root)

// Dev-mode live reload
if (process.env.NODE_ENV !== 'production') {
  const events = new EventSource('/__live-reload')
  events.onmessage = (e) => {
    if (e.data === 'reload') location.reload()
  }
}
