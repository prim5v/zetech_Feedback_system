import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircleIcon, LockIcon } from 'lucide-react';
// Zetech University logo URL
const ZETECH_LOGO = "https://i.pinimg.com/736x/b9/76/2d/b9762d2d8f581d0111317f04e460b152.jpg";
const AdminLoginPage = () => {
  const navigate = useNavigate();
  const {
    login,
    isAuthenticated
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <img src={ZETECH_LOGO} alt="Zetech University" className="h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-zetech-blue-dark">Admin Login</h1>
        <p className="text-gray-600 mt-2">
          Login to access the admin dashboard
        </p>
      </div>
      <div className="zetech-card p-6">
        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
              <AlertCircleIcon size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>}
          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="admin@zetech.ac.ke" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" />
          </div>
          <button type="submit" disabled={isLoading} className={`w-full btn-zetech flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </> : <>
                <LockIcon size={18} className="mr-2" />
                Login
              </>}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo credentials:</p>
          <p>Email: admin@zetech.ac.ke</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>;
};
export default AdminLoginPage;



// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { AlertCircleIcon, LockIcon } from 'lucide-react';

// // Zetech University logo
// const ZETECH_LOGO = "https://i.pinimg.com/736x/b9/76/2d/b9762d2d8f581d0111317f04e460b152.jpg";

// const AdminLoginPage = () => {
//   const navigate = useNavigate();
//   const { login, isAuthenticated } = useAuth();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/admin/dashboard');
//     }
//   }, [isAuthenticated, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       setError('Please enter both email and password');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const success = await login(email, password);
//       if (success) {
//         navigate('/admin/dashboard');
//       } else {
//         setError('Invalid email or password');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('An error occurred during login');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <div className="text-center mb-8">
//         <img
//           src={ZETECH_LOGO}
//           alt="Zetech University"
//           className="h-16 mx-auto mb-4"
//         />
//         <h1 className="text-3xl font-bold text-zetech-blue-dark">
//           Admin Login
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Login to access the admin dashboard
//         </p>
//       </div>

//       <div className="zetech-card p-6">
//         <form onSubmit={handleSubmit}>
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
//               <AlertCircleIcon
//                 size={20}
//                 className="mr-2 mt-0.5 flex-shrink-0"
//               />
//               <p>{error}</p>
//             </div>
//           )}

//           <div className="mb-4">
//             <label htmlFor="email" className="form-label">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="form-input"
//               placeholder="admin@zetech.ac.ke"
//             />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="form-input"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full btn-zetech flex items-center justify-center ${
//               isLoading ? 'opacity-70 cursor-not-allowed' : ''
//             }`}
//           >
//             {isLoading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
//                        3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Logging in...
//               </>
//             ) : (
//               <>
//                 <LockIcon size={18} className="mr-2" />
//                 Login
//               </>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLoginPage;
