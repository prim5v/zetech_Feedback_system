// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "../../utils/ApiSocket";

const AuthContext = createContext();

// ✅ Helper: Get or generate a unique device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = "DEV-" + Math.random().toString(36).substr(2, 16).toUpperCase();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // 🔥 Auto re-login or logout on expiry
  useEffect(() => {
    if (!token) return;

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("❌ Invalid token format:", err);
      logout("/access-denied");
      return;
    }

    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      console.warn("⚠️ Token expired — logging out");
      logout("/access-denied");
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get("/profile");
        if (data?.user) {
          setUser(data.user);
          console.log("✅ User profile loaded:", data.user);
        } else throw new Error("Invalid profile data");
      } catch (err) {
        console.error("❌ Token invalid:", err);
        logout("/access-denied");
      }
    };

    fetchUser();

    // 🕒 Auto logout when token expires
    const expTime = (decoded.exp * 1000) - Date.now();
    const timer = setTimeout(() => {
      console.warn("⚠️ Token expired by timeout");
      logout("/access-denied");
    }, expTime);

    return () => clearTimeout(timer);
  }, [token]);

  const login = async (email, password) => {
    const device_id = getDeviceId();

    try {
      const { data } = await api.post("/login", { email, password, device_id });
      if (!data?.token) throw new Error("No token received from backend");

      localStorage.setItem("token", data.token);
      setToken(data.token);

      // Fetch user profile
      const profile = await api.get("/profile");
      const userData = profile.data.user;
      setUser(userData);

      // Redirect based on role
      if (userData.role === "admin") navigate("/admin/dashboard");
      else if (userData.role === "student") navigate("/student/dashboard");
      else navigate("/unauthorized");
    } catch (err) {
      console.error("❌ Login failed:", err);
      throw err;
    }
  };

  const logout = (redirect = "/login") => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate(redirect);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};




// import React, { createContext, useState, useEffect, useContext } from "react";

// const AuthContext = createContext();

// const ADMIN_API = "https://feedback4293.pythonanywhere.com/login"; // your Flask admin API
// const STUDENT_API = "https://schoolapi.zetech.ac.ke/verify"; // replace with actual student API endpoint

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("currentUser");
//     const savedToken = localStorage.getItem("token");
//     if (savedUser) setUser(JSON.parse(savedUser));
//     if (savedToken) setToken(savedToken);
//   }, []);

//   const normalize = (data, source) => {
//     if (!data) throw new Error("Empty API response");
//     return {
//       source,
//       user: {
//         email: data.email || data.user?.email,
//         name: data.name || data.user?.name || "Unknown",
//         role: source,
//       },
//       token: data.token || data.access_token || null,
//     };
//   };

//   const login = async (email, password) => {
//     const payload = { email, password };

//     const adminLogin = async () => {
//       const res = await fetch(ADMIN_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error("Admin login failed");
//       const data = await res.json();
//       return normalize(data, "admin");
//     };

//     const studentLogin = async () => {
//       const res = await fetch(STUDENT_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error("Student login failed");
//       const data = await res.json();
//       return normalize(data, "student");
//     };

//     try {
//       // Admin priority — try admin, else student
//       const result = await adminLogin().catch(() => studentLogin());

//       setUser(result.user);
//       setToken(result.token);

//       localStorage.setItem("currentUser", JSON.stringify(result.user));
//       if (result.token) localStorage.setItem("token", result.token);

//       return result.user;
//     } catch (error) {
//       console.error("Login error:", error);
//       return null;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("currentUser");
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };





















// import React, { useEffect, useState, createContext, useContext } from "react";

// const AuthContext = createContext();
// const API_BASE = "https://feedback4293.pythonanywhere.com"; // your backend base URL

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("currentUser");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // 🔑 Real login (calls backend /login)
//   const login = async (email, password) => {
//     try {
//       const res = await fetch(`${API_BASE}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         console.error("Login failed:", data.error);
//         return false;
//       }

//       // Save backend user to state + localStorage
//       setUser(data.user);
//       localStorage.setItem("currentUser", JSON.stringify(data.user));
//       return true;
//     } catch (err) {
//       console.error("Error logging in:", err);
//       return false;
//     }
//   };

//   // 🟢 Optional compatibility: loginAsStudent (maps to backend admin login too)
//   const loginAsStudent = (name, email) => {
//     const newUser = {
//       id: Date.now(),
//       username: name,
//       email,
//       role: "admin", // force admin role for all
//     };
//     setUser(newUser);
//     localStorage.setItem("currentUser", JSON.stringify(newUser));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("currentUser");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         login,
//         loginAsStudent,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };





// import React, { useEffect, useState, createContext, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Restore from localStorage on load
//   useEffect(() => {
//     const storedUser = localStorage.getItem('currentUser');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // ------------------ LOGIN ------------------
//   const login = async (email, password) => {
//     try {
//       const res = await fetch("https://feedback4293.pythonanywhere.com/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || "Login failed");

//       // Save returned user object
//       setUser(data.user);
//       localStorage.setItem("currentUser", JSON.stringify(data.user));

//       return true;
//     } catch (err) {
//       console.error("Login error:", err.message);
//       return false;
//     }
//   };

//   // ------------------ SIGNUP ------------------
//   const signup = async (username, email, password) => {
//     try {
//       const res = await fetch("https://feedback4293.pythonanywhere.com/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || "Signup failed");

//       // After signup, call login immediately so we get the same shape
//       return await login(email, password);
//     } catch (err) {
//       console.error("Signup error:", err.message);
//       return false;
//     }
//   };

//   // ------------------ LOGOUT ------------------
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("currentUser");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         login,
//         signup,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
