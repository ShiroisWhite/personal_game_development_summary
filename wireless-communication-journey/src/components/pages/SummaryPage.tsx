import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface SummaryPageProps {
  onRestart: () => void;
  onBack: () => void;
}

const SummaryPage: React.FC<SummaryPageProps> = ({ onRestart, onBack }) => {
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
          className="text-4xl font-bold text-blue-700 mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          恭喜！你已完成无线通信之旅
        </motion.h2>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">无线通信的九个关键步骤</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                1
              </div>
              <h4 className="font-semibold mb-1">比特流</h4>
              <p className="text-sm text-gray-600">原始数字信息的二进制表示</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                2
              </div>
              <h4 className="font-semibold mb-1">信源编码</h4>
              <p className="text-sm text-gray-600">压缩数据，减少冗余</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                3
              </div>
              <h4 className="font-semibold mb-1">调制</h4>
              <p className="text-sm text-gray-600">将数字信号转换为模拟波形</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                4
              </div>
              <h4 className="font-semibold mb-1">信道编码</h4>
              <p className="text-sm text-gray-600">添加冗余保护，提高可靠性</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                5
              </div>
              <h4 className="font-semibold mb-1">介质传播</h4>
              <p className="text-sm text-gray-600">信号通过空间传输</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                6
              </div>
              <h4 className="font-semibold mb-1">信道解码</h4>
              <p className="text-sm text-gray-600">检测并修复传输错误</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                7
              </div>
              <h4 className="font-semibold mb-1">解调</h4>
              <p className="text-sm text-gray-600">从波形中提取数字信息</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                8
              </div>
              <h4 className="font-semibold mb-1">信源解码</h4>
              <p className="text-sm text-gray-600">解压缩数据</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                9
              </div>
              <h4 className="font-semibold mb-1">还原比特流</h4>
              <p className="text-sm text-gray-600">完整接收原始信息</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            通过这个互动游戏，你已经了解了无线通信的基本原理和流程。这些技术支撑着我们日常使用的手机、WiFi、蓝牙等无线设备，
            让我们能够随时随地地进行信息交流。
          </p>
          
          <p className="text-gray-700">
            无线通信技术在不断发展，从1G到5G，从简单的语音通话到高清视频流，从短距离蓝牙到全球卫星通信，
            但基本原理和流程始终如一。希望这次旅程能帮助你更好地理解这些看似复杂的技术背后的简单逻辑。
          </p>
        </motion.div>
        
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full text-lg transition-all duration-300"
          >
            ← 返回
          </Button>
          <Button 
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-lg transition-all duration-300 hover:shadow-lg"
          >
            重新开始
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SummaryPage;
