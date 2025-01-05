// Tabs.js
import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext({
  activeTab: '',
  setActiveTab: () => {},
});

export const Tabs = ({ children, defaultValue, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }) => (
  <div className={`flex space-x-2 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({ children, value, className = '' }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        px-4 py-2 text-sm font-medium rounded-t-lg
        ${isActive 
          ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-600 hover:text-blue-600'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value, className = '' }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
};
