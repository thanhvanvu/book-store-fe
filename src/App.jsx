import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import Login from './pages/Login/Login'
import Contact from './pages/Contact/Contact'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import './styles/App.scss'
import { handleFetchAccount } from './services/userService'
import { useDispatch, useSelector } from 'react-redux'
import { doFetchAccount, doLoginAction } from './redux/account/accountSlice'
import HashLoading from './components/Loading/HashLoading'
import NotFound from './components/NotFound/NotFound'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import AdminLayout from './components/Admin/AdminLayout'
import Announcement from './components/Annoucement/Announcement'
import UserTable from './components/Admin/User/UserTable'
import ProductTable from './components/Admin/Product/ProductTable'
import ProductPage from './pages/Product/ProductPage'
import Cart from './pages/Cart/Cart'
import History from './pages/History/History'
import Dashboard from './components/Admin/Dashboard/Dashboard'
import { useState } from 'react'

export default function App() {
  const dispatch = useDispatch()

  // state redux, account reduder, isAuthenticated: value in reducer

  //#region  when DOM render, automatically send API to get user information
  const getAccount = async () => {
    // if user is on page login/register, no need to fetch account
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    ) {
      return
    }
    let response = await handleFetchAccount()
    if (response?.data?.user) {
      let user = response.data.user
      dispatch(doFetchAccount(user))
    }
  }

  useEffect(() => {
    getAccount()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  //#endregion

  const Layout = () => {
    const [searchBook, setSearchBook] = useState('')
    return (
      <div className="layout-app">
        <Header searchBook={searchBook} setSearchBook={setSearchBook} />
        <Outlet context={[searchBook, setSearchBook]} />
        <Footer />
      </div>
    )
  }

  const router = createBrowserRouter([
    // layout for homepage
    {
      path: '/',
      element: <Layout />,
      errorElement: <NotFound />,

      // Nested Route
      children: [
        { index: true, element: <Home /> },
        {
          path: 'contact',
          element: <Contact />,
        },
        {
          path: 'product/:slug',
          element: <ProductPage />,
        },
        {
          path: 'cart',
          element: <Cart />,
        },
        {
          path: 'history',
          element: <History />,
        },
      ],
    },

    // layout for admin page
    {
      path: '/admin',
      element: <AdminLayout />,
      errorElement: <NotFound />,

      // Nested Route
      children: [
        {
          index: true,
          element: (
            // if user is login, user can go to admin page. If not, redirect to login
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: 'book',
          element: (
            <ProtectedRoute>
              <ProductTable />
            </ProtectedRoute>
          ),
        },
        {
          path: 'user',
          element: (
            <ProtectedRoute>
              <UserTable />
            </ProtectedRoute>
          ),
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
    // <>
    //   {/* check if user logged in ? */}
    //   {/* If user not log in, allow user go to page /login */}
    //   {isLoading === false ||
    //   window.location.pathname === '/login' ||
    //   window.location.pathname === '/register' ||
    //   window.location.pathname === '/' ? (
    //     <RouterProvider router={router} />
    //   ) : (
    //     <HashLoading />
    //   )}
    // </>

    <>
      <RouterProvider router={router} />
    </>
  )
}
