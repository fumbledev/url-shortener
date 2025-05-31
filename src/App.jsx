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
import UrlProvider from '../src/Context'
import RequireAuth from './components/RequireAuth'
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
        element :(
              <RequireAuth> 
                <Dashboard/>
              </RequireAuth>
        ),
      },
      {
        path : "/auth",
        element : <Auth/>
      },
      {
        path : "/link/:id",
        element :(
              <RequireAuth> 
                <Link/>
              </RequireAuth>
        ),
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
    <UrlProvider>
    <RouterProvider router={router}/>
    </UrlProvider>
  )
}

export default App
