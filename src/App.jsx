import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { Children } from 'react'
import AppLayout from './layouts/AppLayout.jsx'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import Link from './pages/Link'
import RedirectLink from './pages/RedirectLink'

const router = createBrowserRouter([
  {
    element : <AppLayout/>,
    children : [
      {
        path : "/",
        element : <LandingPage/>
      },
      {
        path : "/dashboard",
        element : <Dashboard/>
      },
      {
        path : "/auth",
        element : <Auth/>
      },
      {
        path : "/link/:id",
        element : <Link/>
      },
      {
        path : "/:id",
        element : <RedirectLink/>
      }
    ]
  }
])

const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
