import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import NotPermitted from './NotPermitted'

const RoleBaseRoute = (props) => {
  // check if current page is admin?
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
        <>
          <RoleBaseRoute>{props.children}</RoleBaseRoute>
        </>
      ) : (
        <>
          {/* if user is not logged in, redirect user to login page */}
          {/* <Navigate to="/login" replace /> */}
        </>
      )}
    </>
  )
}

export default ProtectedRoute

// <RoleBaseRoute>{props.children}</RoleBaseRoute> is a children of component ProtectedRoute
// props.children is a children of component RoleBaseRoute, need to check if user is Admin ? yes, render admin page
