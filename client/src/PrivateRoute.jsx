import React, { useEffect } from 'react'
import { checkLogin } from './features/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { isLoggedIn, checkLoginLoading } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  if (!checkLoginLoading && !isLoggedIn) {
    return <Navigate to="/auth" />
  }

  return (
    <>{children}</>
  )
}

export default PrivateRoute