import React, { useEffect, useState, createContext, useContext } from "react";

const AuthContext = createContext();
const API_BASE = "https://feedback4293.pythonanywhere.com"; // your backend base URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔑 Real login (calls backend /login)
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login failed:", data.error);
        return false;
      }

      // Save backend user to state + localStorage
      setUser(data.user);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error("Error logging in:", err);
      return false;
    }
  };

  // 🟢 Optional compatibility: loginAsStudent (maps to backend admin login too)
  const loginAsStudent = (name, email) => {
    const newUser = {
      id: Date.now(),
      username: name,
      email,
      role: "admin", // force admin role for all
    };
    setUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsStudent,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};




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
