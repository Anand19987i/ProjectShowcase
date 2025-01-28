import React from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ViewProfile from './pages/ViewProfile';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import SearchProjects from './pages/SearchProjects';
import UpdateProject from './pages/UpdateProject';
import UserProfile from './pages/UserProfile';
import About from './pages/About';
import Blog from './pages/Blog';
import Explore from './pages/Explore';
import FAQ from './pages/FAQ';
import CodeEditor from './pages/CodeEditor';

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
        path: '/profile/:userId',
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
      },
      {
        path: '/update/project/:projectId',
        element: <UpdateProject/>
      },
      {
        path: '/q/profile/:userId',
        element: <UserProfile />
      },
      {
        path:'/code-editor',
        element: <CodeEditor />
      },
      {
        path: '/blog',
        element: <Blog/>
      },
      {
        path: '/explore',
        element: <Explore/>
      },
      {
        path: '/faqs',
        element: <FAQ/>
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
