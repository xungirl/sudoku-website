import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '2rem',
          margin: '2rem',
          background: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #ef4444',
          color: '#f8fafc',
          fontFamily: 'monospace',
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#94a3b8', fontSize: '0.85rem' }}>
            {this.state.error.toString()}
          </pre>
          <button
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Clear Data &amp; Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
