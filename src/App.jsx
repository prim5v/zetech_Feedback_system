import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SubmitIssuePage from './pages/SubmitIssuePage';
import TrackIssuePage from './pages/TrackIssuePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import IssueDetailsPage from './pages/IssueDetailsPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/submit" element={<SubmitIssuePage />} />
              <Route path="/track" element={<TrackIssuePage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/issues/:id"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <IssueDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </IssueProvider>
    </AuthProvider>
  );
}
