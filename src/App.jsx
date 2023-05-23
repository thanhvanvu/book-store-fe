import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import Login from './pages/Login/Login'
import Contact from './pages/Contact/Contact'
import Header from './pages/Header/Header'
import Footer from './pages/Footer/Footer'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'

const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <div>404 Not Found</div>,

      // Nested Route
      children: [
        { index: true, element: <Home /> },
        {
          path: 'contact',
          element: <Contact />,
        },
      ],
    },

    // route login
    {
      path: 'login',
      element: <Login />,
    },

    // route register
    {
      path: 'register',
      element: <Register />,
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
