import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.scss';

const container = document.getElementById('app');
if (!container) {
  console.error('React initialization failed, root container not found');
} else {
  const root = createRoot(container);
  root.render(<App />);
}
