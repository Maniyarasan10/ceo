import { createRoot } from 'react-dom/client';
import './styles/variables.css';
import './styles/globals.css';
import './styles/typography.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
