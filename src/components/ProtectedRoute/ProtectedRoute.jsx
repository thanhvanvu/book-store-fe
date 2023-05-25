import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = (props) => {
  // state redux, account reduder, isAuthenticated: value in reducer
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated)

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
