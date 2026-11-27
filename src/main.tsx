import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Legal } from './pages/Legal'
import './index.css'

const caminho = window.location.pathname.replace(/\/(index\.html)?$/, '')
const pagina = caminho.endsWith('/privacidade') ? (
  <Legal qual="privacidade" />
) : caminho.endsWith('/termos') ? (
  <Legal qual="termos" />
) : (
  <App />
)

createRoot(document.getElementById('root')!).render(<StrictMode>{pagina}</StrictMode>)
