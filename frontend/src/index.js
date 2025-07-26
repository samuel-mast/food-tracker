import React from 'react';
import ReactDOM from 'react-dom/client';

//CSS
import './index.css';

//Pages
import App from './App';
import ErrorPage from './ErrorPage';
import Recipes from './Recipes';
import Tracker from './Tracker';

//Routing
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Home from './Home';

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
