// src/pages/AccessDenied.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-black text-white">
      <div className="bg-red-700/20 border border-red-500 p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg mb-8">
          Your session has expired or is invalid. Please log in again to continue.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
