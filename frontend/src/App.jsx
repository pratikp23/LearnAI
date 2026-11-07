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

  let { userData } = useSelector(state => state.user)

  getCurrentUser()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()
  return (
    <>

      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to={"/signup"} />} />
        <Route path='/allcourses' element={<PrivateRoute><AllCourses /></PrivateRoute>} />
        <Route path='/viewcourse/:courseId' element={userData ? <ViewCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={"/signup"} />} />
        <Route path='/enrolledcourses' element={userData ? <EnrolledCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/searchwithai' element={userData ? <SearchWithAi /> : <Navigate to={"/signup"} />} />
        <Route path='/roadmap' element={userData ? <RoadmapGenerator /> : <Navigate to={"/signup"} />} />
        <Route path='/ai-hub' element={userData ? <AIHub /> : <Navigate to={"/signup"} />} />
        <Route path='/interview-simulator' element={userData ? <InterviewSimulator /> : <Navigate to={"/signup"} />} />
        <Route path='/study-planner' element={userData ? <StudyPlanner /> : <Navigate to={"/signup"} />} />
        <Route path='/quiz' element={userData ? <AIQuiz /> : <Navigate to={"/signup"} />} />
        <Route path='/error-tracker' element={userData ? <MistakeEngine /> : <Navigate to={"/signup"} />} />
        <Route path='/resume-analyzer' element={userData ? <ResumeAnalyzer /> : <Navigate to={"/signup"} />} />

        <Route path='/dashboard' element={userData?.role === "educator" ? <Dashboard /> : <Navigate to={"/signup"} />} />
        <Route path='/courses' element={userData?.role === "educator" ? <Courses /> : <Navigate to={"/signup"} />} />
        <Route path='/addcourses/:courseId' element={userData?.role === "educator" ? <AddCourses /> : <Navigate to={"/signup"} />} />
        <Route path='/createcourses' element={userData?.role === "educator" ? <CreateCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/createlecture/:courseId' element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator" ? <EditLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/login-magic' element={<LoginMagic />} />
      </Routes>

    </>

  )
}

export default App
