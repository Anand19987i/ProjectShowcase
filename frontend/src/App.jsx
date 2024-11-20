import React from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import Navbar from './pages/Navbar'
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ViewProfile from './pages/ViewProfile';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import SearchProjects from './pages/SearchProjects';

const App = () => {
  const appRouter = createBrowserRouter(
    [
      {
        path: '/signup',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile/:id',
        element: <ViewProfile />,
      },
      {
        path: '/upload/project',
        element: <CreateProject />,
      },
      {
        path: '/detail/:projectId',
        element: <ProjectDetail />,
      },
      {
        path: '/projects/search',
        element: <SearchProjects />
      }
    ],
    {
      future: {
        v7_relativeSplatPath: true, // Handles splat route resolution
        v7_fetcherPersist: true, // Ensures fetcher persistence behavior
        v7_normalizeFormMethod: true, // Normalizes `formMethod` to uppercase
        v7_partialHydration: true, // Changes hydration behavior
        v7_skipActionErrorRevalidation: true, // Skips revalidation after 4xx/5xx action responses
      },
    }
  );
  
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  )
}

export default App
