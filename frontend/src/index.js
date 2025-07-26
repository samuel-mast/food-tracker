//React
import React from 'react';
import ReactDOM from 'react-dom/client';

//CSS
import './index.css';

//Pages
import App from './App';
import ErrorPage from './pages/ErrorPage';
import Recipes from './pages/Recipes';
import Tracker from './pages/Tracker';
import Home from './pages/Home';

//Routing
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", 
    element: <App />, 
    errorElement: <ErrorPage />, 
    children: [
      { index: true, element: <Home /> },
      { path: "/recipes", element: <Recipes /> },
      { path: "/tracker", element: <Tracker /> },
    ] },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
