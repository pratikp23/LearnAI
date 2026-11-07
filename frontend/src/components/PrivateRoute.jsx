import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

const PrivateRoute = ({ children, educatorOnly = false }) => {
  const { userData, loading } = useSelector((state) => state.user)
  const location = useLocation()

  // 1. While authentication status is being verified, show loading indicator instead of kicking to login
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFC] gap-4">
        <ClipLoader size={45} color="#5B21B6" />
        <span className="text-sm font-semibold text-[#5B21B6] tracking-wide">Loading your session...</span>
      </div>
    )
  }

  // 2. If finished loading and not logged in, redirect to login while preserving target route
  if (!userData) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 3. If educator access is required, enforce educator role
  if (educatorOnly && userData.role !== 'educator') {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute
