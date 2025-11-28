import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import CustomNavbar from './CustomNavbar';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedAdminRoute from './contexts/ProtectedAdminRoute';

// Eager Loading للصفحات المهمة
import Home from './components/Home';
import Login from './Login';
import Register from './Register';

// Lazy Loading للصفحات الأقل أهمية
const ProjectsEditing = lazy(() => import('./components/ProjectsEditing'));
const ProjectsAI = lazy(() => import('./components/ProjectsAI'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const ContactUs = lazy(() => import('./components/ContactUs'));
const StoreProject = lazy(() => import('./components/StoreProject'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Users = lazy(() => import('./components/Users'));
const VideoPage = lazy(() => import('./components/VideoPage'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));
const AddAiProject = lazy(() => import('./components/AddAiProject'));
const AiProjectList = lazy(() => import('./components/AiProjectList'));
const AiProjectDetail = lazy(() => import('./components/AiProjectDetail'));
const AiProjectDashboard = lazy(() => import('./components/AiProjectDashboard'));
const AiProjectCards = lazy(() => import('./components/AiProjectCards'));
const AddInternalAiProject = lazy(() => import('./components/AddInternalAiProject'));
const InternalProjectDetail = lazy(() => import('./components/InternalProjectDetail'));
const AddVideoProject = lazy(() => import('./components/AddVideoProject'));
const VideoProjectCards = lazy(() => import('./components/VideoProjectCards'));
const VideoProjectDetail = lazy(() => import('./components/VideoProjectDetail'));
const InternalProjectDashboard = lazy(() => import('./components/InternalProjectDashboard'));
const VideoProjectDashboard = lazy(() => import('./components/VideoProjectDashboard'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./components/TermsAndConditions'));
const AddCourse = lazy(() => import('./components/AddCourse'));
const CourseList = lazy(() => import('./components/CourseList'));
const CourseDetail = lazy(() => import('./components/CourseDetail'));
const Courses = lazy(() => import('./components/Courses'));

// Loading Component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, rgb(9,47,107) 0%, rgb(15,76,160) 100%)'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '5px solid rgba(255,255,255,0.2)',
      borderTop: '5px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CustomNavbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/projects' element={<VideoProjectCards />} />
            <Route path='/video-projects/:id' element={<VideoProjectDetail />} />
            <Route path='/projects-ai' element={<AiProjectCards />} />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/contact-us' element={<ContactUs />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/project-details/:id" element={<VideoPage />} />
            <Route path="/ai-projects/:id" element={<AiProjectDetail />} />
            <Route path="/internal-projects/:id" element={<InternalProjectDetail />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
            <Route path='/courses' element={<CourseList />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path='add-project' element={<StoreProject />} />
              <Route path='manageProjectsPage' element={<ProjectDetails />} />
              <Route path="add-ai-project" element={<AddAiProject />} />
              <Route path="manageProjectAiPage" element={<AiProjectDashboard />} />
              <Route path="add-in-ai-project" element={<AddInternalAiProject />} />
              <Route path="add-video-project" element={<AddVideoProject />} />
              <Route path="manageInternalAiProject" element={<InternalProjectDashboard />} />
              <Route path="manageVideoProject" element={<VideoProjectDashboard />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="courses" element={<Courses />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={
              <div style={{
                textAlign: 'center',
                padding: '100px 20px',
                background: 'linear-gradient(135deg, rgb(9,47,107) 0%, rgb(15,76,160) 100%)',
                minHeight: '100vh',
                color: 'white'
              }}>
                <h1 style={{ fontSize: '80px', marginBottom: '20px' }}>404</h1>
                <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>الصفحة غير موجودة</h2>
                <p style={{ fontSize: '18px', marginBottom: '30px' }}>عذراً، الصفحة التي تبحث عنها غير موجودة</p>
                <a href="/" style={{
                  padding: '15px 40px',
                  background: 'white',
                  color: 'rgb(9,47,107)',
                  textDecoration: 'none',
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  display: 'inline-block'
                }}>
                  العودة للرئيسية
                </a>
              </div>
            } />
          </Routes>
        </Suspense>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;