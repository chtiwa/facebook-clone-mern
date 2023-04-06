import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { checkLogin } from './features/authSlice'
import { useSelector, useDispatch } from 'react-redux'

const PublicRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { isLoggedIn, checkLoginLoading } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  if (!checkLoginLoading && isLoggedIn) {
    return <Navigate to="/home" />
  }

  return (
    <>{children} </>
  )
}

export default PublicRoute