// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LockIcon, AlertCircleIcon } from "lucide-react";

import BG_IMAGE from "../assets/download.jpeg";
import ZETECH_LOGO from "../assets/download.jpeg";

const POINTING_GIF =
  "https://i.pinimg.com/originals/9c/49/9b/9c499b2dffb610e932e1a6bc8c69e152.gif";

// Particle animation background
const ParticleBackground = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const numParticles =
      window.innerWidth < 768 ? 20 : window.innerWidth < 1200 ? 35 : 50;

    const particles = Array.from({ length: numParticles }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.r * 5
        );
        gradient.addColorStop(0, `rgba(0,150,255,${p.opacity})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      requestAnimationFrame(draw);
    };
    draw();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

// Overlay Spinner
const LoadingOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70">
    <div className="flex flex-col items-center gap-4">
      <svg
        className="animate-spin h-12 w-12 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-white text-lg font-semibold">Checking session...</span>
    </div>
  </div>
);

const LoginPage = () => {
  const { login, token, user, isChecking } = useAuth(); // isChecking added to AuthContext
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if user already logged in
  useEffect(() => {
    if (!isChecking && token && user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "student") navigate("/student/dashboard");
      else navigate("/unauthorized");
    }
  }, [token, user, isChecking, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials or failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const floatAnimation = {
    y: [0, -15, 0],
    transition: { duration: 4, ease: "easeInOut", repeat: Infinity },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#001F3F] to-black overflow-hidden font-poppins">
      {isChecking && <LoadingOverlay />}

      <div className="absolute inset-0 z-0">
        <img
          src={BG_IMAGE}
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-sm"></div>
      </div>

      <ParticleBackground />

      <div className="relative z-20 container mx-auto flex flex-col lg:flex-row items-center justify-center px-6 gap-10 md:gap-14">
        <motion.div
          className="hidden lg:flex w-full lg:w-1/2 justify-center items-center mb-6 md:mb-0"
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.img
            src={POINTING_GIF}
            alt="Pointing Guy"
            className="h-auto max-h-[70vh] object-contain bg-white rounded-2xl shadow-lg"
            animate={floatAnimation}
          />
        </motion.div>

        <motion.div
          className="w-full lg:w-[50%] max-w-2xl"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative bg-white/10 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-2xl border border-white/20 hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-xl"></div>

            <div className="relative text-center mb-10">
              <img
                src={ZETECH_LOGO}
                alt="Zetech Logo"
                className="h-16 md:h-20 mx-auto mb-4 rounded-full shadow-lg"
              />
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide drop-shadow-lg">
                Login to Portal
              </h1>
              <p className="text-blue-200 mt-2 text-base">
                Zetech University Feedback Portal
              </p>
              <p className="text-red-400 mt-1 text-sm italic">
                Use your student email & password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-7">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2 text-red-200">
                  <AlertCircleIcon size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@zetech.ac.ke"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-200/50 text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-200/50 text-base pr-10"
                  />
                  <LockIcon className="absolute right-3 top-3.5 text-blue-200 h-5 w-5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-700/50 flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 
                        0 5.373 0 12h4zm2 
                        5.291A7.962 7.962 0 
                        014 12H0c0 
                        3.042 1.135 5.824 3 
                        7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LockIcon size={20} className="mr-2" />
                    Login
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
