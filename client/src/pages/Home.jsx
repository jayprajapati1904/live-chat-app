import React from "react";
import { motion } from "framer-motion";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50, damping: 10 },
    },
  };

  return (
    <div className="mt-10 min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 px-6 lg:px-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl text-center md:text-left"
      >
        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-16">
          {/* Left Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Welcome to <span className="text-yellow-300">Live Chat App</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-gray-200">
              Stay connected with friends and family through our fast, secure,
              and modern live chat app.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Link to="/signup">
                <Button
                  size="large"
                  className="w-full sm:w-auto bg-yellow-300 text-gray-800 hover:bg-yellow-400 px-6 py-3 rounded-lg"
                >
                  SignUp
                </Button>
              </Link>
              <Link to="/signin">
                <Button
                  size="large"
                  className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 rounded-lg"
                >
                  SignIn
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            className="flex-1 max-w-md lg:max-w-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <img
              src="/images/chat.jpg"
              alt="Chat Illustration"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
