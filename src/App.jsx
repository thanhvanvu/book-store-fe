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
import Book from './pages/Book/Book'
import AdminLayout from './components/Admin/AdminLayout'
import AdminContent from './pages/AdminPage/AdminContent'
import UserTable from './components/Admin/User/UserTable'

export default function App() {
  const dispatch = useDispatch()

  // state redux, account reduder, isAuthenticated: value in reducer
  const { isAuthenticated, isLoading } = useSelector((state) => state.account)

  //#region  when DOM render, automatically send API to get user information
  const getAccount = async () => {
    // if user is on page login/admin, no need to fetch account
    if (window.location.pathname === '/login') {
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
      element: <AdminLayout />,
      errorElement: <NotFound />,

      // Nested Route
      children: [
        {
          index: true,
          element: (
            // if user is login, user can go to admin page. If not, redirect to login
            <ProtectedRoute>
              <AdminContent />
            </ProtectedRoute>
          ),
        },
        {
          path: 'book',
          element: <Book />,
        },
        {
          path: 'user',
          element: <UserTable />,
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
