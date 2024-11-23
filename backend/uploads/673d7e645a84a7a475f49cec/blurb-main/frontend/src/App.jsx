import React from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './auth/Signup'
import Login from './auth/Login'
import ViewProfile from './pages/ViewProfile'
import SearchUserProfile from './pages/SearchUserProfile'

import Notification from './pages/Notification'

const App = () => {
  const userId = localStorage.getItem('userId');
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/register',
      element: <Signup />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/profile/:id',
      element: <ViewProfile />
    },
    {
      path: '/search/profile/:id',
      element: <SearchUserProfile />
    },
    {
      path: '/b/notifications/:id',
      element: <Notification />

    }
  ])

  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  )
}

export default App
