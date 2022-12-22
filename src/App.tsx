import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Error404 from './pages/Error404';
import Home from './pages/Home';
import LocalMultiGame from './pages/LocalMultiGame';
import SoloGame from './pages/SoloGame';

const ROUTER = createHashRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error404 />,
  },
  {
    path: '/solo',
    element: <SoloGame />,
  },
  {
    path: '/multi/local',
    element: <LocalMultiGame />,
  },
]);

export default function App() {
  return <RouterProvider router={ROUTER} />;
}
