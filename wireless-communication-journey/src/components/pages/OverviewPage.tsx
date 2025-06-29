import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface OverviewPageProps {
  onNext: () => void;
  onBack: () => void;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ onNext, onBack }) => {
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
        <motion.h2 
          className="text-3xl font-bold text-blue-700 mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          无线通信的基本流程
        </motion.h2>
        
        <motion.div 
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[800px]">
              {/* 流程图 */}
              <div className="flex flex-col items-center w-20">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">01</span>
                </div>
                <div className="text-sm text-center">比特流</div>
              </div>
              
              <div className="h-0.5 w-12 bg-blue-400"></div>
              
              <div className="flex flex-col items-center w-20">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">02</span>
                </div>
                <div className="text-sm text-center">信源编码</div>
              </div>
              
              <div className="h-0.5 w-12 bg-blue-400"></div>
              
              <div className="flex flex-col items-center w-20">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">03</span>
                </div>
                <div className="text-sm text-center">调制</div>
              </div>
              
              <div className="h-0.5 w-12 bg-blue-400"></div>
              
              <div className="flex flex-col items-center w-20">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">04</span>
                </div>
                <div className="text-sm text-center">信道编码</div>
              </div>
              
              <div className="h-0.5 w-12 bg-blue-400"></div>
              
              <div className="flex flex-col items-center w-20">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">05</span>
                </div>
                <div className="text-sm text-center">介质传播</div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-between min-w-[800px]">
              <div className="flex flex-col items-center w-20">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">09</span>
                </div>
                <div className="text-sm text-center">还原比特流</div>
              </div>
              
              <div className="h-0.5 w-12 bg-blue-400"></div>
              
              <div className="flex flex-col items-center w-20">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">08</span>
                </div>
                <div className="text-sm text-center">信源解码</div>
              </div>
              
              <div className="h-0.5 w-12 bg-blue-400"></div>
              
              <div className="flex flex-col items-center w-20">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">07</span>
                </div>
                <div className="text-sm text-center">解调</div>
              </div>
              
              <div className="h-0.5 w-12 bg-blue-400"></div>
              
              <div className="flex flex-col items-center w-20">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">06</span>
                </div>
                <div className="text-sm text-center">信道解码</div>
              </div>
              
              <div className="h-0.5 w-12 bg-blue-400 invisible"></div>
              
              <div className="w-20 invisible"></div>
            </div>
          </div>
        </motion.div>
        
        <motion.p 
          className="text-lg text-gray-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          无线通信的过程可以分为九个关键步骤，从原始数据（比特流）的产生，到最终数据的还原。
        </motion.p>
        
        <motion.p 
          className="text-lg text-gray-700 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          在接下来的旅程中，我们将逐一探索每个步骤，了解它们如何协同工作，
          让我们能够无线地传输信息。准备好了吗？让我们开始吧！
        </motion.p>
        
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <Button 
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full text-lg transition-all duration-300"
          >
            ← 返回
          </Button>
          <Button 
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-lg transition-all duration-300 hover:shadow-lg"
          >
            开始探索 →
          </Button>
        </motion.div>
      </motion.div>
      
      {/* 底部进度指示器 */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default OverviewPage;
