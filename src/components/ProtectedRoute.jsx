import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * - Blocks unauthenticated access
 * - Enforces role restrictions
 * - Redirects safely to the right page
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [warned, setWarned] = useState(false);

  // 0️⃣ Show nothing (or spinner) while auth state is loading
  if (loading) return null; // or <Spinner />

  // 1️⃣ Not logged in → redirect to login
  if (!isAuthenticated || !user) {
    const isAdminPath = location.pathname.startsWith("/admin");
    return <Navigate to={isAdminPath ? "/login" : "/login"} replace />;
  }

  // 2️⃣ Ensure user has valid role (fallback student)
  const role = (user.role || "student").toLowerCase();

  // 3️⃣ Role-based restriction logic
  if (
    requiredRoles.length > 0 &&
    !requiredRoles.map(r => r.toLowerCase()).includes(role)
  ) {
    if (!warned) {
      console.warn(`🚫 Access denied: ${role} blocked from ${location.pathname}`);
      setWarned(true);
    }

    // Redirect to proper dashboard instead of generic unauthorized page
    return (
      <Navigate
        to={
          role === "admin"
            ? "/admin/dashboard"
            : role === "student"
            ? "/student/dashboard"
            : "/unauthorized"
        }
        replace
      />
    );
  }

  // 4️⃣ Edge case — corrupted session
  if (!user.email) {
    console.warn("⚠️ Invalid user session, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  // ✅ All checks passed
  return <>{children}</>;
};

export default ProtectedRoute;
