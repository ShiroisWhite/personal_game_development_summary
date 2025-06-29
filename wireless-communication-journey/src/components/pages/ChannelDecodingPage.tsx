import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface ChannelDecodingPageProps {
  onNext: () => void;
  onBack: () => void;
}

const ChannelDecodingPage: React.FC<ChannelDecodingPageProps> = ({ onNext, onBack }) => {
  const [hasError, setHasError] = useState(true);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  
  const startDecoding = () => {
    setIsDecoding(true);
    setTimeout(() => {
      setIsFixed(true);
    }, 3000);
  };
  
  const resetDemo = () => {
    setIsDecoding(false);
    setIsFixed(false);
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
            6
          </div>
          <div className="ml-3 text-xl font-semibold text-blue-700">信道解码</div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-blue-700 mb-6 mt-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          检测并修复传输错误
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          信道解码是"拆除保护措施"并检查信息是否完好的过程。通过分析接收到的信号及其附带的校验信息，
          接收方可以检测并纠正传输过程中可能出现的错误。
        </motion.p>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">错误检测与纠正演示</h3>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={startDecoding}
              className="px-4 py-2 rounded bg-blue-600 text-white"
              disabled={isDecoding}
            >
              开始解码
            </Button>
            <Button
              onClick={resetDemo}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700"
              disabled={!isFixed}
            >
              重置演示
            </Button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-4 md:mb-0">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">接收到的数据（含错误）</h4>
                <div className="flex">
                  <div className="flex">
                    {['1', '0', '1', '0', '0', '1', '1', '0'].map((bit, index) => (
                      <div 
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center font-mono text-lg font-bold 
                          ${index === 3 && hasError ? 'bg-red-500 text-white' : 
                            bit === '1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} 
                          rounded mx-1`}
                      >
                        {index === 3 && hasError ? '1' : bit}
                      </div>
                    ))}
                  </div>
                  
                  <div className="ml-2 w-8 h-8 flex items-center justify-center font-mono text-lg font-bold bg-green-500 text-white rounded">
                    1
                  </div>
                </div>
                <div className="mt-2 text-xs text-red-500">
                  {hasError ? "数据中存在错误！" : "数据完好无损"}
                </div>
              </div>
            </div>
            
            {isDecoding && (
              <motion.div
                className="my-6 p-4 border border-blue-200 rounded-lg bg-blue-50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-blue-700 mb-2">解码过程</h4>
                
                <motion.div 
                  className="flex items-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <div className="text-sm text-gray-700">计算校验和...</div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <div className="text-sm text-gray-700">检测到校验和不匹配！</div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                >
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="text-sm text-gray-700">定位错误位置...</div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.4 }}
                >
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm text-gray-700">错误位置：第4位</div>
                </motion.div>
              </motion.div>
            )}
            
            {isFixed && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-gray-600 mb-2">修复后的数据</h4>
                <div className="flex">
                  <div className="flex">
                    {['1', '0', '1', '0', '0', '1', '1', '0'].map((bit, index) => (
                      <div 
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center font-mono text-lg font-bold 
                          ${index === 3 ? 'bg-green-500 text-white' : 
                            bit === '1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} 
                          rounded mx-1`}
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                  
                  <div className="ml-2 w-8 h-8 flex items-center justify-center font-mono text-lg font-bold bg-green-500 text-white rounded">
                    1
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-500">
                  错误已修复！校验和匹配
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
                <span className="font-semibold">信道解码过程：</span> 
                接收方使用与发送方相同的编码规则，检查接收到的数据是否符合这些规则。
                如果发现不符合，就说明传输过程中出现了错误。
              </p>
              <p>
                <span className="font-semibold">纠错能力：</span> 
                不同的编码方案有不同的纠错能力。简单的奇偶校验只能检测错误，而不能纠正错误。
                更复杂的编码方案，如汉明码、BCH码或LDPC码，不仅能检测错误，还能纠正一定数量的错误。
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
            信道解码就像是收件人拆开包装，检查物品是否在运输过程中损坏一样。
            如果发现损坏，根据包装上的说明（校验信息），收件人可能能够修复轻微的损坏，
            或者至少知道哪些部分出了问题。这就像是拼图中缺了一块，但根据周围的图案，
            你可以推断出缺失部分的样子。
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
            下一步：解调 →
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
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default ChannelDecodingPage;
