import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MenuIcon, XIcon, LogOutIcon } from "lucide-react";

// ✅ Since image is in public/, we just reference it directly
const ZETECH_LOGO = "/download.jpeg";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const renderLinks = () => {
    if (!isAuthenticated) return null;

    // ✅ ADMIN VIEW
    if (user?.role === "admin") {
      return (
        <>
          <Link
            to="/admin/dashboard"
            className="hover:text-blue-200 transition-all"
          >
            Admin Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-all"
          >
            <LogOutIcon size={16} className="mr-1" />
            Logout
          </button>
        </>
      );
    }

    // ✅ STUDENT VIEW (removed “My Issues”)
    return (
      <>
        <Link to="/" className="hover:text-blue-200 transition-all">
          Home
        </Link>
        <Link to="/submit" className="hover:text-blue-200 transition-all">
          Submit Issue
        </Link>
        <Link to="/track" className="hover:text-blue-200 transition-all">
          Track Issue
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-all"
        >
          <LogOutIcon size={16} className="mr-1" />
          Logout
        </button>
      </>
    );
  };

  return (
    <nav className="bg-zetech-blue-dark text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* ✅ Logo Fix */}
          <Link to="/" className="flex items-center">
            <img
              src={ZETECH_LOGO}
              alt="Zetech University"
              className="h-10 mr-3"
            />
            <span className="text-xl font-bold hidden md:block">
              University Feedback Portal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {renderLinks()}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
            >
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* ✅ Mobile Navigation */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden pb-4 space-y-2">
            {user?.role === "admin" ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-all"
                >
                  <LogOutIcon size={16} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/submit"
                  className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Submit Issue
                </Link>
                <Link
                  to="/track"
                  className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Track Issue
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-all"
                >
                  <LogOutIcon size={16} className="mr-1" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;





// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { MenuIcon, XIcon, LogOutIcon } from 'lucide-react';

// const ZETECH_LOGO = "download.jpeg";

// const Navbar = () => {
//   const { user, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Redirect unauthenticated users to login page
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login', { replace: true });
//     }
//   }, [isAuthenticated, navigate]);

//   const handleLogout = () => {
//     logout();
//     navigate('/login', { replace: true });
//   };

//   const renderLinks = () => {
//     if (!isAuthenticated) return null;

//     // ADMIN VIEW: dashboard only + logout
//     if (user?.role === 'admin') {
//       return (
//         <>
//           <Link to="/admin/dashboard" className="hover:text-blue-200 transition-all">
//             Admin Dashboard
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-all"
//           >
//             <LogOutIcon size={16} className="mr-1" />
//             Logout
//           </button>
//         </>
//       );
//     }

//     // STUDENT VIEW: normal site navigation + logout
//     return (
//       <>
//         <Link to="/" className="hover:text-blue-200 transition-all">
//           Home
//         </Link>
//         <Link to="/submit" className="hover:text-blue-200 transition-all">
//           Submit Issue
//         </Link>
//         <Link to="/track" className="hover:text-blue-200 transition-all">
//           Track Issue
//         </Link>
//         <Link to="/student/dashboard" className="hover:text-blue-200 transition-all">
//           My Issues
//         </Link>

//         <button
//           onClick={handleLogout}
//           className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-all"
//         >
//           <LogOutIcon size={16} className="mr-1" />
//           Logout
//         </button>
//       </>
//     );
//   };

//   return (
//     <nav className="bg-zetech-blue-dark text-white shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="flex items-center">
//             <img src={ZETECH_LOGO} alt="Zetech University" className="h-10 mr-3" />
//             <span className="text-xl font-bold hidden md:block">
//               University Feedback Portal
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             {renderLinks()}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="focus:outline-none"
//             >
//               {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && isAuthenticated && (
//           <div className="md:hidden pb-4 space-y-2">
//             {user?.role === 'admin' ? (
//               <>
//                 <Link
//                   to="/admin/dashboard"
//                   className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Admin Dashboard
//                 </Link>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setIsMenuOpen(false);
//                   }}
//                   className="flex items-center w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-all"
//                 >
//                   <LogOutIcon size={16} className="mr-1" />
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/"
//                   className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Home
//                 </Link>
//                 <Link
//                   to="/submit"
//                   className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Submit Issue
//                 </Link>
//                 <Link
//                   to="/track"
//                   className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Track Issue
//                 </Link>
//                 <Link
//                   to="/student/dashboard"
//                   className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   My Issues
//                 </Link>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setIsMenuOpen(false);
//                   }}
//                   className="flex items-center w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-all"
//                 >
//                   <LogOutIcon size={16} className="mr-1" />
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { MenuIcon, XIcon, LogOutIcon } from 'lucide-react';
// // Zetech University logo URL
// const ZETECH_LOGO = "download.jpeg";
// const Navbar = () => {
//   const {
//     user,
//     isAuthenticated,
//     logout
//   } = useAuth();
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };
//   return <nav className="bg-zetech-blue-dark text-white shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="flex items-center">
//             {/* Zetech University Logo */}
//             <img src={ZETECH_LOGO} alt="Zetech University" className="h-10 mr-3" />
//             <span className="text-xl font-bold hidden md:block">Univesity Feedback Portal</span>
//           </Link>
//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/" className="hover:text-blue-200 transition-all">
//               Home
//             </Link>
//             <Link to="/submit" className="hover:text-blue-200 transition-all">
//               Submit Issue
//             </Link>
//             <Link to="/track" className="hover:text-blue-200 transition-all">
//               Track Issue
//             </Link>
//             {isAuthenticated ? <>
//                 {user?.role === 'admin' ? <Link to="/admin/dashboard" className="hover:text-blue-200 transition-all">
//                     Admin Dashboard
//                   </Link> : <Link to="/student/dashboard" className="hover:text-blue-200 transition-all">
//                     My Issues
//                   </Link>}
//                 <button onClick={handleLogout} className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-all">
//                   <LogOutIcon size={16} className="mr-1" />
//                   Logout
//                 </button>
//               </> : <Link to="/admin/login" className="hover:text-blue-200 transition-all">
//                 Admin Login
//               </Link>}
//           </div>
//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
//               {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
//             </button>
//           </div>
//         </div>
//         {/* Mobile Navigation */}
//         {isMenuOpen && <div className="md:hidden pb-4 space-y-2">
//             <Link to="/" className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
//               Home
//             </Link>
//             <Link to="/submit" className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
//               Submit Issue
//             </Link>
//             <Link to="/track" className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
//               Track Issue
//             </Link>
//             {isAuthenticated ? <>
//                 {user?.role === 'admin' ? <Link to="/admin/dashboard" className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
//                     Admin Dashboard
//                   </Link> : <Link to="/student/dashboard" className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
//                     My Issues
//                   </Link>}
//                 <button onClick={() => {
//             handleLogout();
//             setIsMenuOpen(false);
//           }} className="flex items-center w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-all">
//                   <LogOutIcon size={16} className="mr-1" />
//                   Logout
//                 </button>
//               </> : <Link to="/admin/login" className="block py-2 hover:bg-zetech-blue-dark px-2 rounded transition-all" onClick={() => setIsMenuOpen(false)}>
//                 Admin Login
//               </Link>}
//           </div>}
//       </div>
//     </nav>;
// };
// export default Navbar;