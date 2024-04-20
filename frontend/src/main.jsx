// This is the main file of the webapp
// It renders the App component in the root div of the index.html file

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Calendar from './pages/calendar.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './pages/errorPage.jsx'
import Levels from './pages/levels.jsx'
import WorkoutModal from './components/WorkoutModal.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/levels",
    element: <Levels />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
