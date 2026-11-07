import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './pages/ForgotPassword'
import LoginMagic from './pages/LoginMagic'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import AllCourses from './pages/AllCourses'
import AddCourses from './pages/admin/AddCourses'
import CreateCourse from './pages/admin/CreateCourse'
import CreateLecture from './pages/admin/CreateLecture'
import EditLecture from './pages/admin/EditLecture'

import getCouseData from './customHooks/getCouseData'
import PrivateRoute from './components/PrivateRoute'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import SearchWithAi from './pages/SearchWithAi'
import RoadmapGenerator from './pages/RoadmapGenerator'
import AIHub from './pages/AIHub'
import InterviewSimulator from './pages/InterviewSimulator'
import StudyPlanner from './pages/StudyPlanner'
import AIQuiz from './pages/AIQuiz'
import MistakeEngine from './pages/MistakeEngine'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import getAllReviews from './customHooks/getAllReviews'

export const serverUrl =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://learning-management-system-backend-z7kv.onrender.com");

function App() {
  const { userData } = useSelector(state => state.user)

  getCurrentUser()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={!userData ? <Login /> : <Navigate to="/" replace />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" replace />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/login-magic' element={<LoginMagic />} />

        {/* Student & Authenticated Routes */}
        <Route path='/allcourses' element={<PrivateRoute><AllCourses /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path='/editprofile' element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path='/viewcourse/:courseId' element={<PrivateRoute><ViewCourse /></PrivateRoute>} />
        <Route path='/enrolledcourses' element={<PrivateRoute><EnrolledCourse /></PrivateRoute>} />
        <Route path='/viewlecture/:courseId' element={<PrivateRoute><ViewLecture /></PrivateRoute>} />
        <Route path='/searchwithai' element={<PrivateRoute><SearchWithAi /></PrivateRoute>} />
        <Route path='/roadmap' element={<PrivateRoute><RoadmapGenerator /></PrivateRoute>} />
        <Route path='/ai-hub' element={<PrivateRoute><AIHub /></PrivateRoute>} />
        <Route path='/interview-simulator' element={<PrivateRoute><InterviewSimulator /></PrivateRoute>} />
        <Route path='/study-planner' element={<PrivateRoute><StudyPlanner /></PrivateRoute>} />
        <Route path='/quiz' element={<PrivateRoute><AIQuiz /></PrivateRoute>} />
        <Route path='/error-tracker' element={<PrivateRoute><MistakeEngine /></PrivateRoute>} />
        <Route path='/resume-analyzer' element={<PrivateRoute><ResumeAnalyzer /></PrivateRoute>} />

        {/* Educator Only Routes */}
        <Route path='/dashboard' element={<PrivateRoute educatorOnly><Dashboard /></PrivateRoute>} />
        <Route path='/courses' element={<PrivateRoute educatorOnly><Courses /></PrivateRoute>} />
        <Route path='/addcourses/:courseId' element={<PrivateRoute educatorOnly><AddCourses /></PrivateRoute>} />
        <Route path='/createcourses' element={<PrivateRoute educatorOnly><CreateCourse /></PrivateRoute>} />
        <Route path='/createlecture/:courseId' element={<PrivateRoute educatorOnly><CreateLecture /></PrivateRoute>} />
        <Route path='/editlecture/:courseId/:lectureId' element={<PrivateRoute educatorOnly><EditLecture /></PrivateRoute>} />

        {/* Catch-all */}
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
