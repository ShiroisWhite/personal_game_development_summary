import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export interface WelcomePageProps {
  onNext: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 relative overflow-hidden">
      {/* 背景网络图案 */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#3b82f6" />
              <path d="M50 50 L100 100" stroke="#3b82f6" strokeWidth="0.5" />
              <path d="M50 50 L0 100" stroke="#3b82f6" strokeWidth="0.5" />
              <path d="M50 50 L100 0" stroke="#3b82f6" strokeWidth="0.5" />
              <path d="M50 50 L0 0" stroke="#3b82f6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network)" />
        </svg>
      </div>

      <motion.div 
        className="z-10 text-center p-8 max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-5xl font-bold text-blue-700 mb-6"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          无线通信之旅
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-700 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          探索数据如何通过无线方式从一个设备传输到另一个设备
        </motion.p>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mb-12"
        >
          <div className="w-64 h-64 mx-auto relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 8.5C2 5 4 3 7.5 3H16.5C20 3 22 5 22 8.5V15.5C22 19 20 21 16.5 21H7.5C4 21 2 19 2 15.5V8.5Z" stroke="white" strokeWidth="1.5"/>
                  <path d="M7 8H17M7 12H17M7 16H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            
            <motion.div 
              className="absolute inset-0"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="50" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="100" cy="100" r="75" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="5,5" />
                <circle cx="100" cy="100" r="100" stroke="#3B82F6" strokeWidth="1" strokeDasharray="5,5" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Button 
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg transition-all duration-300 hover:shadow-lg"
          >
            开始探索
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
