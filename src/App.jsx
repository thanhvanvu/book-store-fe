import React, { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import Login from './pages/Login/Login'
import Contact from './pages/Contact/Contact'
import Header from './pages/Header/Header'
import Footer from './pages/Footer/Footer'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import './styles/App.scss'
import { handleFetchAccount } from './services/userService'
import { useDispatch } from 'react-redux'
import { doLoginAction } from './redux/account/accountSlice'

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
  const dispatch = useDispatch()

  //#region  when DOM render, automatically send API to get user information
  const getAccount = async () => {
    let response = await handleFetchAccount()
    if (response?.data?.user) {
      let user = response.data.user
      dispatch(doLoginAction(user))
    }
  }

  useEffect(() => {
    getAccount()
  }, [])
  //#endregion

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
