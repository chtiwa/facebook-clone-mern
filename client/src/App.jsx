import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Authentication from './pages/authentication/Authentication';
import Home from './pages/home/Home'
import User from './pages/user/User'
// import Navbar from './components/navbar/Navbar'
import Redirect from './Redirect'
import Messenger from './pages/messenger/Messenger'
import Layout from './Layout'
import ResetPassword from './pages/resetPassword/ResetPassword';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import MessageModal from './components/modal/Modal'

const App = () => {
  useEffect(() => {
    const socket = "http://localhost:5001"
  }, [])
  return (
    <BrowserRouter>
      <MessageModal />
      <Routes>
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="" element={<Home />} />
          <Route path="user" element={<User />} />
          <Route path="messenger" element={<Messenger />} />
        </Route>
        <Route path="/auth" element={<PublicRoute><Authentication /></PublicRoute>} />
        <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
        <Route path="*" element={<Redirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App