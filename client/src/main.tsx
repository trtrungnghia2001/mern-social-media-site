import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/index.css'
import App from './App.tsx'
import ReactQueryClientProvider from './contexts/ReactQueryClientProvider.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ReactQueryClientProvider>
        <App />
      </ReactQueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
