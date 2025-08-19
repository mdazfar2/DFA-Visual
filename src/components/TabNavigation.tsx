import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBolt } from '@fortawesome/free-solid-svg-icons';

interface TabNavigationProps {
  activeTab: 'manual' | 'regex';
  onTabChange: (tab: 'manual' | 'regex') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'manual' as const,
      label: 'Manual DFA',
  icon: faCog,
      description: 'Build DFA manually'
    },
    {
      id: 'regex' as const,
      label: 'From Regex',
  icon: faBolt,
      description: 'Convert regex to DFA'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-cyber-400/20 rounded-lg p-4"
    >
      <div className="flex space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                transition-all duration-300 relative overflow-hidden
                ${isActive 
                  ? 'bg-gradient-to-r from-cyber-400 to-neon-purple text-white shadow-lg shadow-cyber-400/25' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-cyber-400'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyber-400 to-neon-purple"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <div className="relative flex items-center space-x-2">
                <FontAwesomeIcon icon={Icon} className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-sm font-medium">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TabNavigation;