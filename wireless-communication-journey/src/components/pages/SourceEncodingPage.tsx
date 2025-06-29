import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface SourceEncodingPageProps {
  onNext: () => void;
  onBack: () => void;
}

const SourceEncodingPage: React.FC<SourceEncodingPageProps> = ({ onNext, onBack }) => {
  const [isCompressed, setIsCompressed] = useState(false);
  
  // 示例数据
  const originalData = "AAAABBBCCDAA";
  const compressedData = "4A3B2C1D2A";
  
  // 计算压缩率
  const compressionRatio = ((originalData.length - compressedData.length) / originalData.length * 100).toFixed(1);
  
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
            2
          </div>
          <div className="ml-3 text-xl font-semibold text-blue-700">信源编码</div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-blue-700 mb-6 mt-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          压缩数据，提高效率
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          信源编码的目的是减少数据中的冗余，使得相同的信息可以用更少的比特表示，
          从而提高传输效率。这就像是我们在寄信前，会尽量精简内容，去掉不必要的词语。
        </motion.p>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">游程编码示例</h3>
            <p className="text-gray-700 mb-4">
              游程编码是一种简单的压缩方法，它通过记录连续重复字符的数量来减少数据量。
              例如，字符串"AAAABBBCCDAA"可以被编码为"4A3B2C1D2A"。
            </p>
            
            <div className="flex justify-center mb-6">
              <Button
                onClick={() => setIsCompressed(!isCompressed)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isCompressed ? "查看原始数据" : "压缩数据"}
              </Button>
            </div>
            
            <div className="flex justify-center items-center space-x-4">
              <motion.div 
                className="bg-gray-100 p-4 rounded-lg"
                animate={{ 
                  opacity: isCompressed ? 0.5 : 1,
                  scale: isCompressed ? 0.9 : 1
                }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-gray-600 mb-2">原始数据</h4>
                <div className="font-mono text-2xl">
                  {originalData.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      className={`inline-block ${char === 'A' ? 'text-red-500' : char === 'B' ? 'text-blue-500' : char === 'C' ? 'text-green-500' : 'text-purple-500'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <div className="mt-2 text-gray-600">12个字符</div>
              </motion.div>
              
              <motion.div
                animate={{ 
                  x: isCompressed ? 0 : 20,
                  opacity: isCompressed ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              
              <motion.div 
                className="bg-blue-50 p-4 rounded-lg"
                animate={{ 
                  opacity: isCompressed ? 1 : 0.5,
                  scale: isCompressed ? 1 : 0.9
                }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-gray-600 mb-2">压缩后数据</h4>
                <div className="font-mono text-2xl">
                  {compressedData.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      className={`inline-block ${
                        isNaN(parseInt(char)) 
                          ? (char === 'A' ? 'text-red-500' : char === 'B' ? 'text-blue-500' : char === 'C' ? 'text-green-500' : 'text-purple-500')
                          : 'text-gray-700 font-bold'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isCompressed ? 1 : 0 }}
                      transition={{ delay: isCompressed ? 1.3 + index * 0.1 : 0 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <div className="mt-2 text-gray-600">7个字符</div>
              </motion.div>
            </div>
            
            {isCompressed && (
              <motion.div
                className="mt-4 text-center text-green-600 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                压缩率：{compressionRatio}%
              </motion.div>
            )}
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
            信源编码就像是行李打包。当你要出远门时，不会把所有衣服都松散地放进箱子，
            而是会折叠整理，甚至用真空袋压缩，这样同样大小的箱子可以装下更多物品。
            信源编码就是在"打包"数据，让有限的传输带宽能够传递更多信息。
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
            下一步：调制 →
          </Button>
        </motion.div>
      </motion.div>
      
      {/* 底部进度指示器 */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
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

export default SourceEncodingPage;
