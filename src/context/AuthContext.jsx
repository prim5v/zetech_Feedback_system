import React, { useEffect, useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Create context
const AuthContext = createContext();
// Sample admin users
const ADMIN_USERS = [{
  id: '1',
  name: 'Admin User',
  email: 'admin@zetech.ac.ke',
  password: 'admin123',
  role: 'admin'
}];
export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null);
  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  // Login function for admins
  const login = async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Check if user exists
    const foundUser = ADMIN_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const {
        password,
        ...userWithoutPassword
      } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };
  // Login function for students (simplified, no password)
  const loginAsStudent = (name, email) => {
    const newUser = {
      id: uuidv4(),
      name,
      email,
      role: 'student'
    };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    // Also store in students array for persistence
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    if (!students.find(s => s.email === email)) {
      students.push(newUser);
      localStorage.setItem('students', JSON.stringify(students));
    }
  };
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };
  return <AuthContext.Provider value={{
    user,
    isAuthenticated: !!user,
    login,
    loginAsStudent,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
};
// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
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
