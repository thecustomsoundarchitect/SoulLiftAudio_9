import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React from "react";

// Re-define the props interface with the 'active' property
interface FloatingDockProps {
  items: { title: string; icon: React.ReactNode; href: string; active?: boolean }[];
  className?: string; // Keep className for custom styling if needed
}

export const FloatingDock = ({
  items,
  className,
}: FloatingDockProps) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }} // Initial animation for the bar
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 100 }}
      // *** UPDATED STYLING FOR FIXED BOTTOM BAR (MATCHING SCREENSHOT EXACTLY) ***
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50", // Fixed at the bottom, full width
        "flex items-center justify-around", // Distribute items evenly across the bar
        "h-16 sm:h-20", // Consistent height for the bar (adjust as needed to visually match the screenshot)
        "bg-white border-t border-gray-200", // White background with a subtle top border, like the screenshot
        "px-2 sm:px-4", // Horizontal padding for content inside the bar
        className // Allows for any additional custom classes
      )}
    >
      {items.map((item) => {
        const isActive = item.active; // Use the active prop
        return (
          <Link to={item.href} key={item.title} className="flex-1 flex flex-col items-center justify-center h-full">
            <motion.div
              className={cn(
                "relative flex flex-col items-center justify-center p-1.5 sm:p-2",
                "rounded-md transition-all duration-200",
                isActive
                  ? "text-purple-600" // Active icon/text color
                  : "text-gray-600 hover:text-purple-500" // Inactive icon/text color on hover
              )}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              title={item.title}
            >
              <div className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center">
                {item.icon}
              </div>
              <span className={cn(
                "text-xs sm:text-sm font-medium mt-1 whitespace-nowrap", // Ensure text doesn't wrap
                isActive ? "text-purple-600" : "text-gray-600"
              )}>
                {item.title}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </motion.div>
  );
};