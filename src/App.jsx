import { useEffect } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { doGetAccountAction } from './redux/account/accountSlice'
import HashLoading from './components/Loading/HashLoading'
import NotFound from './components/NotFound/NotFound'
import Admin from './pages/admin/admin'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

export default function App() {
  const dispatch = useDispatch()

  // state redux, account reduder, isAuthenticated: value in reducer
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated)

  //#region  when DOM render, automatically send API to get user information
  const getAccount = async () => {
    // if user is on page login/admin, no need to fetch account
    if (window.location.pathname === '/login') {
      return
    }
    let response = await handleFetchAccount()
    if (response?.data?.user) {
      let user = response.data.user
      dispatch(doGetAccountAction(user))
    }
  }

  useEffect(() => {
    getAccount()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  //#endregion

  const Layout = () => {
    return (
      <div className="layout-app">
        <Header />
        <Outlet />
        <Footer />
      </div>
    )
  }

  const LayoutAdmin = () => {
    return (
      <div className="layout-app">
        <Header />
        <Outlet />
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
      ],
    },

    // layout for admin page
    {
      path: '/admin',
      element: <LayoutAdmin />,
      errorElement: <NotFound />,

      // Nested Route
      children: [
        {
          index: true,
          element: (
            // if user is login, user can go to admin page. If not, redirect to login
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          ),
        },
        {
          path: 'user',
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
      {/* check if user logged in ? */}
      {/* If use not log in, allow user go to page /login */}
      {isAuthenticated === true ||
      window.location.pathname === '/login' ||
      window.location.pathname === '/register' ||
      window.location.pathname === '/' ? (
        <RouterProvider router={router} />
      ) : (
        <HashLoading />
      )}
    </>
  )
}
