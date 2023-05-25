import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import NotPermitted from './NotPermitted'

const RoleBaseRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  const user = useSelector((state) => state.account.user)
  const userRole = user.role

  if (isAdminRoute && userRole === 'ADMIN') {
    return <>{props.children}</>
  } else {
    return <NotPermitted />
  }
}

const ProtectedRoute = (props) => {
  // state redux, account reduder, isAuthenticated: value in reducer
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated)
  console.log(isAuthenticated)

  return (
    <>
      {isAuthenticated === true ? (
        <>{props.children}</>
      ) : (
        <>
          {/* if user is not logged in, redirect user to login page */}
          <Navigate to="/login" replace />
        </>
      )}
    </>
  )
}

export default ProtectedRoute
