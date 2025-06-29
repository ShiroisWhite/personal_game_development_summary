import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface FinalBitStreamPageProps {
  onNext: () => void;
  onBack: () => void;
}

const FinalBitStreamPage: React.FC<FinalBitStreamPageProps> = ({ onNext, onBack }) => {
  const [isComparing, setIsComparing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // 示例数据
  const originalBits = "10110010";
  const receivedBits = "10110010";
  
  const startComparison = () => {
    setIsComparing(true);
    setTimeout(() => {
      setShowResult(true);
    }, 2500);
  };
  
  const resetDemo = () => {
    setIsComparing(false);
    setShowResult(false);
  };
  
  // 计算比特错误率
  const calculateBER = () => {
    let errors = 0;
    for (let i = 0; i < originalBits.length; i++) {
      if (originalBits[i] !== receivedBits[i]) {
        errors++;
      }
    }
    return (errors / originalBits.length * 100).toFixed(1);
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
            9
          </div>
          <div className="ml-3 text-xl font-semibold text-blue-700">还原后的比特流</div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-blue-700 mb-6 mt-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          旅程的终点：完整的信息
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          还原后的比特流就是成功接收到的"原始信息"，与发送端的比特流理想情况下应该完全一致。
          这标志着无线通信的整个过程已经成功完成，信息被准确地从发送方传递到了接收方。
        </motion.p>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">比特流对比</h3>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={startComparison}
              className="px-4 py-2 rounded bg-blue-600 text-white"
              disabled={isComparing}
            >
              开始对比
            </Button>
            <Button
              onClick={resetDemo}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700"
              disabled={!showResult}
            >
              重置演示
            </Button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-4 md:mb-0">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">发送的原始比特流</h4>
                <div className="flex">
                  {originalBits.split('').map((bit, index) => (
                    <div 
                      key={index}
                      className={`w-8 h-8 flex items-center justify-center font-mono text-lg font-bold 
                        ${bit === '1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} 
                        rounded mx-1`}
                    >
                      {bit}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-center mx-4">
                {isComparing && (
                  <motion.svg 
                    width="40" 
                    height="100" 
                    viewBox="0 0 40 100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.path 
                      d="M20 0 L20 100" 
                      stroke="#3B82F6" 
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <motion.path 
                      d="M10 50 L30 50" 
                      stroke="#3B82F6" 
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 1.5 }}
                    />
                  </motion.svg>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">接收到的比特流</h4>
                <div className="flex">
                  {receivedBits.split('').map((bit, index) => (
                    <motion.div 
                      key={index}
                      className={`w-8 h-8 flex items-center justify-center font-mono text-lg font-bold 
                        ${bit === '1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} 
                        ${showResult && originalBits[index] === receivedBits[index] ? 'ring-2 ring-green-500' : ''} 
                        rounded mx-1`}
                      initial={isComparing ? { opacity: 0 } : { opacity: 1 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: isComparing ? 1 + index * 0.2 : 0 }}
                    >
                      {bit}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {showResult && (
              <motion.div
                className="mt-6 p-4 border border-green-200 rounded-lg bg-green-50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-green-700 mb-2">对比结果</h4>
                
                <div className="flex items-center justify-center mb-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm text-gray-700">
                    比特错误率 (BER): {calculateBER()}%
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm text-gray-700">
                    传输成功！接收到的比特流与原始比特流完全一致。
                  </div>
                </div>
              </motion.div>
            )}
            
            <motion.div 
              className="text-sm text-gray-600 mt-6 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="mb-2">
                <span className="font-semibold">比特错误率 (BER)：</span> 
                比特错误率是衡量通信系统性能的重要指标，它表示接收到的比特中有多少比特出现了错误。
                BER越低，通信质量越好。在理想情况下，BER应该为0，表示完全无错误传输。
              </p>
              <p>
                <span className="font-semibold">通信质量：</span> 
                现代通信系统通过各种技术（如信道编码、调制方式选择、自适应均衡等）来降低BER，
                即使在恶劣的信道条件下也能保证较高的通信质量。这就是为什么我们能在嘈杂的环境中
                仍然进行清晰的手机通话，或在远距离处获得稳定的WiFi连接。
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
            还原后的比特流就像是收件人最终读到的信件内容，理想情况下应该与寄件人写的完全一样。
            整个无线通信过程就像是一封信从写作、封装、邮寄到最终被收件人阅读的完整旅程。
            尽管中间经历了多个复杂的步骤和可能的干扰，但最终目标是确保信息的准确传递。
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
            完成旅程 →
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
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
      </div>
    </div>
  );
};

export default FinalBitStreamPage;
