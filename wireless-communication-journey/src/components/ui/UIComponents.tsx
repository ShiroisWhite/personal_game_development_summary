import React from 'react';
import { Button } from './button';

interface UIComponentsProps {
  // 可以添加任何需要的属性
}

const UIComponents: React.FC<UIComponentsProps> = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">UI组件库</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">按钮</h3>
        <div className="flex space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">主要按钮</Button>
          <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700">次要按钮</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">危险按钮</Button>
        </div>
      </div>
    </div>
  );
};

export default UIComponents;
