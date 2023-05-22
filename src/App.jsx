import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login/Login'

const Layout = () => {
  return <>Main page</>
}

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <div>404 Not Found</div>,
    },

    {
      path: 'login',
      element: <Login />,
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
