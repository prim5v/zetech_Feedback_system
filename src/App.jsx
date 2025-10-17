import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { IssueProvider } from "./context/IssueContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import SubmitIssuePage from "./pages/SubmitIssuePage";
import TrackIssuePage from "./pages/TrackIssuePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import IssueDetailsPage from "./pages/IssueDetailsPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import LoginPage from "./pages/LoginPage";
import AccessDenied from "./pages/AccessDenied";

// ✅ Centralized Unauthorized Page
const UnauthorizedPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
    <h1 className="text-4xl font-bold text-red-600 mb-3">Access Denied 🚫</h1>
    <p className="text-gray-600 mb-6">
      You don’t have permission to view this page.
    </p>
    <a
      href="/"
      className="bg-zetech-blue text-white px-4 py-2 rounded-md hover:bg-zetech-blue-dark transition"
    >
      Go Home
    </a>
  </div>
);

export default function App() {
  return (
    // ✅ The Router must wrap AuthProvider to give it navigation context
    <Router>
      <AuthProvider>
        <IssueProvider>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/submit"
              element={
                <Layout>
                  <SubmitIssuePage />
                </Layout>
              }
            />
            <Route
              path="/track"
              element={
                <Layout>
                  <TrackIssuePage />
                </Layout>
              }
            />

            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Login Routes */}
            {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <Layout>
                    <AdminDashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/issues/:id"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <Layout>
                    <IssueDetailsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Student Protected Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRoles={["student"]}>
                  <Layout>
                    <StudentDashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Catch-All 404 */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center h-screen text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-3">
                    404 - Page Not Found
                  </h1>
                  <a
                    href="/"
                    className="text-zetech-blue underline hover:text-zetech-blue-dark"
                  >
                    Go Back Home
                  </a>
                </div>
              }
            />
          </Routes>
        </IssueProvider>
      </AuthProvider>
    </Router>
  );
}












// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { IssueProvider } from './context/IssueContext';
// import Layout from './components/Layout';
// import HomePage from './pages/HomePage';
// import SubmitIssuePage from './pages/SubmitIssuePage';
// import TrackIssuePage from './pages/TrackIssuePage';
// import AdminLoginPage from './pages/AdminLoginPage';
// import AdminDashboardPage from './pages/AdminDashboardPage';
// import IssueDetailsPage from './pages/IssueDetailsPage';
// import StudentDashboardPage from './pages/StudentDashboardPage';
// import ProtectedRoute from './components/ProtectedRoute';

// export default function App() {
//   return (
//     <AuthProvider>
//       <IssueProvider>
//         <Router>
//           <Layout>
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/submit" element={<SubmitIssuePage />} />
//               <Route path="/track" element={<TrackIssuePage />} />
//               <Route path="/admin/login" element={<AdminLoginPage />} />
//               <Route
//                 path="/admin/dashboard"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <AdminDashboardPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/admin/issues/:id"
//                 element={
//                   <ProtectedRoute requiredRole="admin">
//                     <IssueDetailsPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/student/dashboard"
//                 element={
//                   <ProtectedRoute requiredRole="student">
//                     <StudentDashboardPage />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//           </Layout>
//         </Router>
//       </IssueProvider>
//     </AuthProvider>
//   );
// }
