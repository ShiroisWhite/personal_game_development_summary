import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface SourceDecodingPageProps {
  onNext: () => void;
  onBack: () => void;
}

const SourceDecodingPage: React.FC<SourceDecodingPageProps> = ({ onNext, onBack }) => {
  const [isDecoding, setIsDecoding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // 示例数据
  const compressedData = "4A3B2C1D2A";
  const decompressedData = "AAAABBBCCDAA";
  
  const startDecoding = () => {
    setIsDecoding(true);
    setTimeout(() => {
      setIsComplete(true);
    }, 3000);
  };
  
  const resetDemo = () => {
    setIsDecoding(false);
    setIsComplete(false);
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
            8
          </div>
          <div className="ml-3 text-xl font-semibold text-blue-700">信源解码</div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-blue-700 mb-6 mt-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          解压缩数据
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          信源解码是"解压缩"的过程，将压缩后的数据恢复为原始形式。
          这是信源编码的逆过程，通过解析压缩数据，恢复原始的信息内容。
        </motion.p>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">游程解码演示</h3>
          
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
              disabled={!isComplete}
            >
              重置演示
            </Button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">压缩数据</h4>
              <div className="font-mono text-2xl bg-blue-50 p-3 rounded-lg inline-block">
                {compressedData.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    className={`inline-block ${
                      isNaN(parseInt(char)) 
                        ? (char === 'A' ? 'text-red-500' : char === 'B' ? 'text-blue-500' : char === 'C' ? 'text-green-500' : 'text-purple-500')
                        : 'text-gray-700 font-bold'
                    }`}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">7个字符</div>
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
                  <div className="text-sm text-gray-700">分析压缩数据格式...</div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="text-sm text-gray-700">识别重复模式和计数...</div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                >
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm text-gray-700">展开压缩数据...</div>
                </motion.div>
              </motion.div>
            )}
            
            {isComplete && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-gray-600 mb-2">解码结果（原始数据）</h4>
                <div className="font-mono text-2xl bg-green-50 p-3 rounded-lg inline-block">
                  {decompressedData.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      className={`inline-block ${char === 'A' ? 'text-red-500' : char === 'B' ? 'text-blue-500' : char === 'C' ? 'text-green-500' : 'text-purple-500'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 + index * 0.05 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  12个字符 <span className="text-green-500 ml-2">成功恢复原始数据！</span>
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
                <span className="font-semibold">游程解码原理：</span> 
                游程解码是游程编码的逆过程，它通过解析数字和字符的组合，将压缩数据展开为原始形式。
                例如，"4A"表示连续4个字符"A"，"3B"表示连续3个字符"B"，以此类推。
              </p>
              <p>
                <span className="font-semibold">解码挑战：</span> 
                在实际通信中，如果压缩数据在传输过程中出现错误，可能会导致解码失败或结果不正确。
                因此，信源解码通常与信道解码配合使用，确保数据的完整性和准确性。
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
            信源解码就像是解压缩文件或打开压缩包。当你收到一个ZIP文件时，
            需要先解压才能看到里面的完整内容。同样，接收设备需要对压缩过的数据进行解码，
            才能恢复出原始的信息内容。这就像是阅读速记笔记，需要将简写的符号和缩写展开为完整的文字。
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
            下一步：还原比特流 →
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
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
      </div>
    </div>
  );
};

export default SourceDecodingPage;
