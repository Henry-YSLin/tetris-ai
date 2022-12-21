import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.scss';

const Container = document.getElementById('app');
if (!Container) {
  console.error('React initialization failed, root container not found');
} else {
  const root = createRoot(Container);
  root.render(<App />);
}
