import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedGuy = () => {
  const [animationState, setAnimationState] = useState("enter");

  // State transitions
  useEffect(() => {
    if (animationState === "enter") {
      const timer = setTimeout(() => setAnimationState("jump"), 1500);
      return () => clearTimeout(timer);
    } else if (animationState === "jump") {
      const timer = setTimeout(() => setAnimationState("lean"), 700);
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  // Variants for the whole guy
  const guyVariants = {
    enter: { x: "-100vw", rotate: 0, transition: { duration: 1.5, ease: "easeOut" } },
    jump: {
      x: 0,
      y: [0, -60, 0],
      transition: { y: { duration: 0.5, ease: "easeOut" } },
    },
    lean: {
      x: 0,
      y: 0,
      rotate: [-2, 2, -2],
      transition: { duration: 4, ease: "easeInOut", repeat: Infinity },
    },
  };

  // Briefcase swing animation
  const briefcaseVariants = {
    lean: {
      rotate: [0, -15, 15, -15, 0],
      transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
    },
  };

  return (
    <motion.div
      className="relative flex justify-center items-end h-[70vh]"
      variants={guyVariants}
      initial="enter"
      animate={animationState}
    >
      {/* Body */}
      <motion.div
        className="relative flex flex-col items-center"
        variants={animationState === "lean" ? guyVariants : {}}
      >
        {/* Head */}
        <div className="w-12 h-12 bg-blue-400 rounded-full shadow-md" />
        {/* Body */}
        <div className="w-6 h-28 bg-blue-500 rounded-md mt-1" />
        {/* Legs */}
        <div className="flex gap-3 mt-1">
          <div className="w-3 h-16 bg-blue-600 rounded-md" />
          <div className="w-3 h-16 bg-blue-600 rounded-md" />
        </div>
        {/* Briefcase */}
        <motion.div
          className="absolute bottom-4 right-[-30px] w-10 h-8 bg-yellow-400 border-2 border-yellow-600 rounded-sm shadow-md"
          variants={briefcaseVariants}
          animate={animationState === "lean" ? "lean" : ""}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedGuy;
