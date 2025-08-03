//React
import React from 'react';
import ReactDOM from 'react-dom/client';

//CSS
import './index.css';

//Pages
import App from './App';
import ErrorPage from './pages/ErrorPage';
import Recipes from './pages/Recipes';
import MealTracker from './pages/MealTracker';

//Routing
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", 
    element: <App />, 
    errorElement: <ErrorPage />, 
    children: [
      { index: true, element: <MealTracker /> },
      { path: "/recipes", element: <Recipes /> },
    ] },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
