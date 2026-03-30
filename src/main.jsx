import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routes from './providers/RouterProvider.jsx'
import StoreProvider from './providers/StoreProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>

  <Routes />
    </StoreProvider>
  </StrictMode>,
)
