
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TransitionPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/craft');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      className="flex-1 flex flex-col bg-[#F3F7FF] py-12"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex-1 flex items-center justify-center pb-24 sm:pb-28">
        <div className="text-center">
          {/* Processing Image Placeholder */}
          <div className="mb-8 flex justify-center">
            <img
              src="https://placehold.co/128x128/8B5CF6/FFFFFF?text=%E2%88%9E"
              alt="Loading..."
              className="w-32 h-32"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              The Magic is Happening...
            </span>
          </h1>
          <div className="flex justify-center items-center mt-4">
            {/* ...existing code for loader... */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
