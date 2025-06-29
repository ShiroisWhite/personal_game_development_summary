import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface ChannelEncodingPageProps {
  onNext: () => void;
  onBack: () => void;
}

const ChannelEncodingPage: React.FC<ChannelEncodingPageProps> = ({ onNext, onBack }) => {
  const [hasError, setHasError] = useState(false);
  const [hasProtection, setHasProtection] = useState(true);
  
  // 示例数据
  const originalData = "10110010";
  const encodedData = "101100101"; // 添加了一个奇偶校验位
  
  const toggleError = () => {
    setHasError(!hasError);
  };
  
  const toggleProtection = () => {
    setHasProtection(!hasProtection);
  };
  
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
        <motion.div
          className="absolute top-8 left-8 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            4
          </div>
          <div className="ml-3 text-xl font-semibold text-blue-700">信道编码</div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-blue-700 mb-6 mt-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          为数据添加保护措施
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          信道编码的目的是增加数据的冗余度，使其在传输过程中更加安全可靠。
          通过添加额外的校验信息，即使在传输过程中出现一些错误，接收方也能检测甚至纠正这些错误。
        </motion.p>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">奇偶校验演示</h3>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={toggleProtection}
              className={`px-4 py-2 rounded ${hasProtection ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {hasProtection ? "使用校验位" : "不使用校验位"}
            </Button>
            <Button
              onClick={toggleError}
              className={`px-4 py-2 rounded ${hasError ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {hasError ? "模拟传输错误" : "正常传输"}
            </Button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-4 md:mb-0">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">发送端</h4>
                <div className="flex items-center">
                  <div className="flex">
                    {originalData.split('').map((bit, index) => (
                      <div 
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center font-mono text-lg font-bold ${bit === '1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded mx-1`}
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                  
                  {hasProtection && (
                    <motion.div 
                      className="ml-2 w-8 h-8 flex items-center justify-center font-mono text-lg font-bold bg-green-500 text-white rounded"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      {encodedData.slice(-1)}
                    </motion.div>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {hasProtection ? "原始数据 + 校验位" : "原始数据"}
                </div>
              </div>
              
              <div className="flex flex-col items-center mx-4">
                <motion.svg 
                  width="100" 
                  height="40" 
                  viewBox="0 0 100 40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.path 
                    d="M0 20 L100 20" 
                    stroke="#3B82F6" 
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                  <motion.path 
                    d="M70 10 L100 20 L70 30" 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                  />
                </motion.svg>
                <div className="text-sm text-gray-600 mt-1">传输</div>
                
                {hasError && (
                  <motion.div 
                    className="mt-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                  >
                    传输过程中出现错误！
                  </motion.div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">接收端</h4>
                <div className="flex items-center">
                  <div className="flex">
                    {originalData.split('').map((bit, index) => {
                      // 如果有错误且没有保护，第3位出错
                      const displayBit = (hasError && !hasProtection && index === 2) ? (bit === '1' ? '0' : '1') : bit;
                      
                      return (
                        <motion.div 
                          key={index}
                          className={`w-8 h-8 flex items-center justify-center font-mono text-lg font-bold 
                            ${(hasError && !hasProtection && index === 2) 
                              ? 'bg-red-500 text-white' 
                              : displayBit === '1' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700'} 
                            rounded mx-1`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.5 + index * 0.1 }}
                        >
                          {displayBit}
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {hasProtection && (
                    <motion.div 
                      className={`ml-2 w-8 h-8 flex items-center justify-center font-mono text-lg font-bold 
                        ${hasError ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.3 }}
                    >
                      {hasError ? '0' : encodedData.slice(-1)}
                    </motion.div>
                  )}
                </div>
                <motion.div 
                  className="mt-2 text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5 }}
                >
                  {hasProtection 
                    ? (hasError 
                        ? "检测到错误！校验位不匹配" 
                        : "校验成功！数据完整") 
                    : (hasError 
                        ? "数据已损坏，但无法检测" 
                        : "接收的数据")}
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className="text-sm text-gray-600 mt-4 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.8 }}
            >
              <p className="mb-2">
                <span className="font-semibold">奇偶校验：</span> 
                这是一种简单的错误检测方法，通过添加一个额外的位（校验位）来确保数据中"1"的总数为奇数（奇校验）或偶数（偶校验）。
              </p>
              <p>
                在这个例子中，我们使用的是奇校验，确保包括校验位在内的所有位中"1"的数量为奇数。
                当传输过程中出现错误时，接收端可以通过重新计算校验值来检测错误。
              </p>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <p className="text-blue-700 font-semibold">生活类比：</p>
          <p className="text-gray-700">
            信道编码就像是给信息添加"保险措施"，使其在传输过程中更加安全可靠。
            就像我们在寄贵重物品时会加入泡沫或气垫保护一样，信道编码通过添加额外的校验信息，
            使得即使在传输过程中出现一些错误，接收方也能检测甚至纠正这些错误。
          </p>
        </motion.div>
        
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
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
            下一步：介质传播 →
          </Button>
        </motion.div>
      </motion.div>
      
      {/* 底部进度指示器 */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default ChannelEncodingPage;
