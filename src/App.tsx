import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Error404 from './pages/Error404';
import Home from './pages/Home';
import LocalMultiGame from './pages/LocalMultiGame';
import TestGame from './pages/TestGame';

const ROUTER = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error404 />,
  },
  {
    path: '/test',
    element: <TestGame />,
  },
  {
    path: '/multi/local',
    element: <LocalMultiGame />,
  },
]);

export default function App() {
  return <RouterProvider router={ROUTER} />;
}
