import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface ModulationPageProps {
  onNext: () => void;
  onBack: () => void;
}

const ModulationPage: React.FC<ModulationPageProps> = ({ onNext, onBack }) => {
  const [modulationType, setModulationType] = useState<'amplitude' | 'frequency' | 'phase'>('amplitude');
  const [bitSequence, setBitSequence] = useState('10110010');
  
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
            3
          </div>
          <div className="ml-3 text-xl font-semibold text-blue-700">调制</div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-blue-700 mb-6 mt-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          将数字信号转换为模拟波形
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          调制是将数字信号（0和1）转换为适合在空中传播的模拟信号（如无线电波）的过程。
          通过改变波的特性（振幅、频率或相位），我们可以在波中携带数字信息。
        </motion.p>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">调制方式演示</h3>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={() => setModulationType('amplitude')}
              className={`px-4 py-2 rounded ${modulationType === 'amplitude' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              振幅调制
            </Button>
            <Button
              onClick={() => setModulationType('frequency')}
              className={`px-4 py-2 rounded ${modulationType === 'frequency' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              频率调制
            </Button>
            <Button
              onClick={() => setModulationType('phase')}
              className={`px-4 py-2 rounded ${modulationType === 'phase' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              相位调制
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-center items-center mb-4">
              <div className="text-gray-700 mr-4">比特序列：</div>
              <div className="flex">
                {bitSequence.split('').map((bit, index) => (
                  <div 
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center font-mono text-lg font-bold ${bit === '1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded mx-1`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-600 mb-4">
              {modulationType === 'amplitude' ? '振幅调制 (AM)' : 
               modulationType === 'frequency' ? '频率调制 (FM)' : '相位调制 (PM)'}
            </h4>
            
            <div className="h-40 relative">
              {/* 波形可视化 */}
              <svg width="100%" height="100%" viewBox="0 0 800 150" preserveAspectRatio="none">
                {/* 中心线 */}
                <line x1="0" y1="75" x2="800" y2="75" stroke="#CBD5E0" strokeWidth="1" />
                
                {/* 振幅调制 */}
                {modulationType === 'amplitude' && (
                  <>
                    {bitSequence.split('').map((bit, index) => {
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
                    {bitSequence.split('').map((bit, index) => {
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
                    {bitSequence.split('').map((bit, index) => {
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
              </svg>
              
              {/* 标签 */}
              <div className="absolute top-0 left-4 text-xs text-gray-500">高</div>
              <div className="absolute bottom-0 left-4 text-xs text-gray-500">低</div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              {modulationType === 'amplitude' && 
                '振幅调制：通过改变波的高度（振幅）来表示不同的比特值。振幅高表示"1"，振幅低表示"0"。'}
              {modulationType === 'frequency' && 
                '频率调制：通过改变波的密度（频率）来表示不同的比特值。频率高表示"1"，频率低表示"0"。'}
              {modulationType === 'phase' && 
                '相位调制：通过改变波的时间偏移（相位）来表示不同的比特值。有相位偏移表示"1"，无相位偏移表示"0"。'}
            </div>
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
            调制就像是将我们的信息"翻译"成适合在空中传播的"语言"。就像人类需要发出声波才能说话一样，
            数字信息需要转换成电磁波才能在空中传播。不同的调制方式就像是不同的说话方式，
            可以通过改变声音的大小（振幅）、音调（频率）或节奏（相位）来传达不同的信息。
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
            下一步：信道编码 →
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
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default ModulationPage;
