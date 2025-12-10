import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import VisualComparePage from './dev/VisualComparePage'

const rootElement = document.getElementById('root')
const path = window.location.pathname

if (path.startsWith('/dev/compare')) {
  createRoot(rootElement!).render(
    <StrictMode>
      <VisualComparePage />
    </StrictMode>,
  )
} else {
  createRoot(rootElement!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
