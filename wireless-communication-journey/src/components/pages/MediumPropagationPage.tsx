import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface MediumPropagationPageProps {
  onNext: () => void;
  onBack: () => void;
}

const MediumPropagationPage: React.FC<MediumPropagationPageProps> = ({ onNext, onBack }) => {
  const [environment, setEnvironment] = useState<'urban' | 'rural' | 'indoor'>('urban');
  const [obstacleCount, setObstacleCount] = useState(2);
  
  const getSignalStrength = (): number => {
    // 基础信号强度
    let strength = 100;
    
    // 根据环境调整
    if (environment === 'urban') strength -= 20;
    else if (environment === 'indoor') strength -= 30;
    
    // 根据障碍物数量调整
    strength -= obstacleCount * 10;
    
    // 确保不小于10
    return Math.max(10, strength);
  };
  
  const signalStrength = getSignalStrength();
  
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
            5
          </div>
          <div className="ml-3 text-xl font-semibold text-blue-700">介质传播</div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold text-blue-700 mb-6 mt-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          信号的旅行
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          介质传播是信号实际"旅行"的过程。无线信号需要通过空气（或其他介质）从发送设备传播到接收设备。
          在这个过程中，信号可能会遇到各种干扰和衰减，如墙壁阻挡、其他设备干扰等。
        </motion.p>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">信号传播模拟</h3>
          
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">选择环境：</h4>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setEnvironment('rural')}
                  className={`px-4 py-2 rounded ${environment === 'rural' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  乡村
                </Button>
                <Button
                  onClick={() => setEnvironment('urban')}
                  className={`px-4 py-2 rounded ${environment === 'urban' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  城市
                </Button>
                <Button
                  onClick={() => setEnvironment('indoor')}
                  className={`px-4 py-2 rounded ${environment === 'indoor' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  室内
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2">障碍物数量：</h4>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setObstacleCount(Math.max(0, obstacleCount - 1))}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700"
                  disabled={obstacleCount === 0}
                >
                  -
                </Button>
                <span className="w-8 text-center">{obstacleCount}</span>
                <Button
                  onClick={() => setObstacleCount(Math.min(5, obstacleCount + 1))}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700"
                  disabled={obstacleCount === 5}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="h-64 relative">
              {/* 传播可视化 */}
              <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8.5C2 5 4 3 7.5 3H16.5C20 3 22 5 22 8.5V15.5C22 19 20 21 16.5 21H7.5C4 21 2 19 2 15.5V8.5Z" stroke="white" strokeWidth="1.5"/>
                    <path d="M7 8H17M7 12H17M7 16H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="mt-2 text-center text-sm">发送设备</div>
              </div>
              
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8.5C2 5 4 3 7.5 3H16.5C20 3 22 5 22 8.5V15.5C22 19 20 21 16.5 21H7.5C4 21 2 19 2 15.5V8.5Z" stroke="white" strokeWidth="1.5"/>
                    <path d="M7 8H17M7 12H17M7 16H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="mt-2 text-center text-sm">接收设备</div>
              </div>
              
              {/* 障碍物 */}
              {Array.from({ length: obstacleCount }).map((_, index) => {
                const position = 30 + (index * 15);
                return (
                  <motion.div
                    key={index}
                    className="absolute top-1/2 transform -translate-y-1/2"
                    style={{ left: `${position}%` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  >
                    {environment === 'urban' ? (
                      <div className="w-12 h-20 bg-gray-400 rounded"></div>
                    ) : environment === 'indoor' ? (
                      <div className="w-2 h-20 bg-gray-600 rounded"></div>
                    ) : (
                      <div className="w-8 h-16 bg-green-800 rounded-t-full"></div>
                    )}
                  </motion.div>
                );
              })}
              
              {/* 信号波 */}
              <svg width="100%" height="100%" className="absolute top-0 left-0">
                {Array.from({ length: 5 }).map((_, index) => {
                  const delay = 1 + index * 0.2;
                  const opacity = 1 - index * 0.2;
                  return (
                    <motion.circle
                      key={index}
                      cx="70"
                      cy="50%"
                      r="10"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      initial={{ r: 10, opacity: 0 }}
                      animate={{ 
                        r: [10, 300],
                        opacity: [opacity, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        delay,
                        repeat: Infinity,
                        repeatDelay: 0
                      }}
                    />
                  );
                })}
              </svg>
            </div>
            
            <div className="mt-4 flex items-center justify-center">
              <div className="text-sm font-semibold mr-2">信号强度：</div>
              <div className="w-64 h-6 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${
                    signalStrength > 70 ? 'bg-green-500' : 
                    signalStrength > 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${signalStrength}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <div className="ml-2 font-mono">{signalStrength}%</div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <span className="font-semibold">环境影响：</span> 
                {environment === 'rural' ? '乡村环境开阔，信号传播较少受阻。' : 
                 environment === 'urban' ? '城市环境中的建筑物会反射和吸收信号，造成信号衰减。' : 
                 '室内环境中，墙壁和家具会严重阻碍信号传播。'}
              </p>
              <p className="mt-2">
                <span className="font-semibold">障碍物影响：</span> 
                障碍物会吸收、反射或散射信号，导致信号强度下降。障碍物越多，信号衰减越严重。
              </p>
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
            介质传播就像是信息实际"旅行"的过程。就像信件需要通过邮政系统从寄件人传递到收件人一样，
            无线信号需要通过空气（或其他介质）从发送设备传播到接收设备。在这个过程中，
            信号可能会遇到各种干扰和衰减，就像邮件在运输过程中可能会遇到恶劣天气或其他延误因素。
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
            下一步：信道解码 →
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
        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default MediumPropagationPage;
