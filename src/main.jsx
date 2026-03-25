import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { GameProvider } from './context/GameContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

console.log('[Sudoku] App starting...')

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter>
      <GameProvider>
        <App />
      </GameProvider>
    </BrowserRouter>
  </ErrorBoundary>
)

console.log('[Sudoku] App rendered.')
