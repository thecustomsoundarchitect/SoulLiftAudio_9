import React from 'react';
import { useSoulHug } from '../context/SoulHugContext';
import './CraftPage.css';
import { motion } from 'framer-motion';

const WrittenHugPage: React.FC = () => {
  const { currentSoulHug } = useSoulHug();

  return (
    <div className="flex-1 flex flex-col bg-white">
      <motion.div
        className="w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8 pb-24 sm:pb-28 flex-grow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <img
          src="https://i.imgur.com/hPrvhGW.png"
          alt="Written Hug"
          className="w-full h-auto mb-6"
        />
        <div className="card-editor">
          <div className="card-editor-overlay"></div>
          <div className="card-editor-inner">
            <div
              className="editor-content w-full p-5 text-base shadow-none min-h-[405px] font-sans"
              dangerouslySetInnerHTML={{ __html: currentSoulHug.message || '' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WrittenHugPage;