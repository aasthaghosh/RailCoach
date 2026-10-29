import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-black text-white">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center p-8 rounded-2xl backdrop-blur-md bg-white/10 shadow-2xl"
      >
        <motion.h1
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          transition={{ type: "spring" }}
          className="text-8xl font-extrabold text-purple-400"
        >
          404
        </motion.h1>

        <p className="text-xl mt-4 text-gray-300">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/home"
            className="inline-block mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-lg transition"
          >
            Go Back Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
