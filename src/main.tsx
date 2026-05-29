import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Spotify rejects localhost redirect URIs; use loopback IP instead.
if (window.location.hostname === 'localhost') {
  window.location.replace(
    window.location.href.replace('//localhost', '//127.0.0.1'),
  )
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
