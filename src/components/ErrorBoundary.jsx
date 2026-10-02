import { Component } from 'react';

// Keeps a runtime error from leaving a blank white page: React unmounts the
// tree on an uncaught error, so without this the visitor sees nothing at all.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
    this.reload = this.reload.bind(this);
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[portfolio] render error', error, info?.componentStack);
  }

  reload() {
    this.setState({ failed: false });
    window.location.reload();
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div
        style={{
          position: 'fixed',
          inset: '0',
          zIndex: '9999',
          display: 'grid',
          placeContent: 'center',
          justifyItems: 'start',
          gap: '1rem',
          padding: 'clamp(1.5rem, 6vw, 4rem)',
          background: '#0A0A0A',
          color: '#EDEDED',
          fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: '0.6' }}>
          Something broke
        </p>
        <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 5vw, 2.6rem)', lineHeight: '1.05', fontWeight: '700' }}>
          This page failed to render.
        </h1>
        <p style={{ margin: 0, maxWidth: '46ch', opacity: '0.72', lineHeight: '1.55' }}>
          A reload usually fixes it. If it keeps happening, the console has the details.
        </p>
        <button
          type="button"
          onClick={this.reload}
          style={{
            marginTop: '0.5rem',
            minHeight: '44px',
            padding: '0 1.4rem',
            border: '1px solid #EDEDED',
            borderRadius: '999px',
            background: '#EDEDED',
            color: '#0A0A0A',
            font: 'inherit',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}