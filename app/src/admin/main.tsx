import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import siteCss from '@/site.css?inline'
import './admin.css'
import App from './App'

// Inlined so Vite cannot share a CSS chunk with the case study and change its stylesheet order.
const style = document.createElement('style')
style.textContent = siteCss
document.head.prepend(style)

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
