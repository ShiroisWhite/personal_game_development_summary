import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface DemodulationPageProps {
  onNext: () => void;
  onBack: () => void;
}

const DemodulationPage: React.FC<DemodulationPageProps> = ({ onNext, onBack }) => {
  const [modulationType, setModulationType] = useState<'amplitude' | 'frequency' | 'phase'>('amplitude');
  const [isDemodulating, setIsDemodulating] = useState(false);
  const [demodulationComplete, setDemodulationComplete] = useState(false);
  
  const startDemodulation = () => {
    setIsDemodulating(true);
    setTimeout(() => {
      setDemodulationComplete(true);
    }, 3000);
  };
  
  const resetDemo = () => {
    setIsDemodulating(false);
    setDemodulationComplete(false);
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
            7
          </div>
          <div className="ml-3 text-xl font-semibold text-blue-700">解调</div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-blue-700 mb-6 mt-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          从波形中提取数字信息
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          解调是将接收到的模拟信号（如无线电波）重新转换回数字信号（0和1）的过程。
          这是调制的逆过程，通过分析波的特性（振幅、频率或相位）来判断其代表的是0还是1。
        </motion.p>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">解调演示</h3>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={() => setModulationType('amplitude')}
              className={`px-4 py-2 rounded ${modulationType === 'amplitude' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              disabled={isDemodulating}
            >
              振幅解调
            </Button>
            <Button
              onClick={() => setModulationType('frequency')}
              className={`px-4 py-2 rounded ${modulationType === 'frequency' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              disabled={isDemodulating}
            >
              频率解调
            </Button>
            <Button
              onClick={() => setModulationType('phase')}
              className={`px-4 py-2 rounded ${modulationType === 'phase' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              disabled={isDemodulating}
            >
              相位解调
            </Button>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={startDemodulation}
              className="px-4 py-2 rounded bg-blue-600 text-white"
              disabled={isDemodulating}
            >
              开始解调
            </Button>
            <Button
              onClick={resetDemo}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700"
              disabled={!demodulationComplete}
            >
              重置演示
            </Button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="h-40 relative mb-6">
              {/* 波形可视化 */}
              <svg width="100%" height="100%" viewBox="0 0 800 150" preserveAspectRatio="none">
                {/* 中心线 */}
                <line x1="0" y1="75" x2="800" y2="75" stroke="#CBD5E0" strokeWidth="1" />
                
                {/* 振幅调制 */}
                {modulationType === 'amplitude' && (
                  <>
                    {['1', '0', '1', '1', '0', '0', '1', '0'].map((bit, index) => {
                      const startX = index * 100;
                      const amplitude = bit === '1' ? 60 : 20;
                      return (
                        <motion.path
                          key={index}
                          d={`M ${startX} 75 
                             C ${startX + 25} ${75 - amplitude}, ${startX + 50} ${75 + amplitude}, ${startX + 100} 75`}
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        />
                      );
                    })}
                  </>
                )}
                
                {/* 频率调制 */}
                {modulationType === 'frequency' && (
                  <>
                    {['1', '0', '1', '1', '0', '0', '1', '0'].map((bit, index) => {
                      const startX = index * 100;
                      const frequency = bit === '1' ? 4 : 2; // 波的数量
                      const path = [];
                      
                      for (let i = 0; i <= frequency; i++) {
                        const x = startX + (i * 100) / frequency;
                        const y = i % 2 === 0 ? 75 - 40 : 75 + 40;
                        path.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
                      }
                      
                      return (
                        <motion.path
                          key={index}
                          d={path.join(' ')}
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        />
                      );
                    })}
                  </>
                )}
                
                {/* 相位调制 */}
                {modulationType === 'phase' && (
                  <>
                    {['1', '0', '1', '1', '0', '0', '1', '0'].map((bit, index) => {
                      const startX = index * 100;
                      const phaseShift = bit === '1' ? 50 : 0; // 相位偏移
                      
                      return (
                        <motion.path
                          key={index}
                          d={`M ${startX} 75 
                             C ${startX + 25 - phaseShift} ${75 - 40}, ${startX + 50 - phaseShift} ${75 + 40}, ${startX + 100} 75`}
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        />
                      );
                    })}
                  </>
                )}
                
                {/* 解调过程中的分析线 */}
                {isDemodulating && !demodulationComplete && (
                  <motion.line 
                    x1="0" 
                    y1="75" 
                    x2="0" 
                    y2="75"
                    stroke="#FF0000"
                    strokeWidth="2"
                    initial={{ x2: 0 }}
                    animate={{ x2: 800 }}
                    transition={{ duration: 3 }}
                  />
                )}
              </svg>
              
              {/* 标签 */}
              <div className="absolute top-0 left-4 text-xs text-gray-500">高</div>
              <div className="absolute bottom-0 left-4 text-xs text-gray-500">低</div>
            </div>
            
            {isDemodulating && (
              <motion.div
                className="my-6 p-4 border border-blue-200 rounded-lg bg-blue-50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-blue-700 mb-2">解调过程</h4>
                
                <motion.div 
                  className="flex items-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <div className="text-sm text-gray-700">分析接收到的波形...</div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="text-sm text-gray-700">
                    {modulationType === 'amplitude' ? '检测波形振幅变化...' : 
                     modulationType === 'frequency' ? '检测波形频率变化...' : 
                     '检测波形相位变化...'}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                >
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm text-gray-700">将模拟信号转换为数字比特...</div>
                </motion.div>
              </motion.div>
            )}
            
            {demodulationComplete && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-gray-600 mb-2">解调结果（提取的比特）</h4>
                <div className="flex justify-center">
                  {['1', '0', '1', '1', '0', '0', '1', '0'].map((bit, index) => (
                    <motion.div 
                      key={index}
                      className={`w-8 h-8 flex items-center justify-center font-mono text-lg font-bold 
                        ${bit === '1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} 
                        rounded mx-1`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.5 + index * 0.1 }}
                    >
                      {bit}
                    </motion.div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-green-500">
                  解调成功！已从波形中提取出原始比特序列
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
                <span className="font-semibold">解调原理：</span> 
                {modulationType === 'amplitude' ? 
                  '振幅解调通过检测波的高度（振幅）来判断其代表的比特值。振幅高表示"1"，振幅低表示"0"。' : 
                 modulationType === 'frequency' ? 
                  '频率解调通过检测波的密度（频率）来判断其代表的比特值。频率高表示"1"，频率低表示"0"。' : 
                  '相位解调通过检测波的时间偏移（相位）来判断其代表的比特值。有相位偏移表示"1"，无相位偏移表示"0"。'}
              </p>
              <p>
                <span className="font-semibold">解调挑战：</span> 
                在实际通信中，信号可能会受到噪声和干扰的影响，使解调变得困难。
                现代通信系统使用复杂的算法和技术来提高解调的准确性，即使在恶劣的信道条件下也能正确提取信息。
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
            解调就像是将接收到的"无线语言"重新"翻译"回数字信息的过程。
            就像听者需要将声波转换为大脑能理解的信息一样，接收设备需要将调制后的模拟信号（如无线电波）
            转换回数字信号（0和1）。这就像是阅读摩尔斯电码，通过分析长短信号的模式来理解传递的信息。
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
            下一步：信源解码 →
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
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default DemodulationPage;
