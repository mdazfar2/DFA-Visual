import React from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';

interface CustomStateNodeData {
  label: string;
  isStart: boolean;
  isFinal: boolean;
  isActive: boolean;
  isAccepted?: boolean;
  dfaSource?: 'manual' | 'regex';
}

interface CustomStateNodeProps {
  data: CustomStateNodeData;
  isConnectable: boolean;
}

const CustomStateNode: React.FC<CustomStateNodeProps> = ({ data, isConnectable }) => {
  const { label, isStart, isFinal, isActive, isAccepted, dfaSource = 'manual' } = data;

  const getNodeStyle = () => {
    if (isAccepted) {
      return 'bg-gradient-to-br from-green-400 to-green-600 border-green-300';
    }
    if (isActive) {
      const activeColor = dfaSource === 'regex' ? 'from-neon-purple to-purple-500 border-purple-300' : 'from-cyber-400 to-cyan-500 border-cyber-300';
      return `bg-gradient-to-br ${activeColor}`;
    }
    if (isFinal) {
      const finalColor = dfaSource === 'regex' ? 'from-purple-500 to-purple-600 border-purple-300' : 'from-neon-purple to-purple-600 border-purple-300';
      return `bg-gradient-to-br ${finalColor}`;
    }
    const defaultColor = dfaSource === 'regex' ? 'from-purple-600/70 to-purple-700/70 border-purple-400/70' : 'from-gray-600 to-gray-700 border-gray-400';
    return `bg-gradient-to-br ${defaultColor}`;
  };

  const getGlowStyle = () => {
    if (isAccepted) {
      return 'shadow-lg shadow-green-400/50';
    }
    if (isActive) {
      const glowColor = dfaSource === 'regex' ? 'shadow-purple-400/50' : 'shadow-cyber-400/50';
      return `shadow-lg ${glowColor} animate-pulse`;
    }
    return '';
  };

  const getStartIndicatorColor = () => {
    return dfaSource === 'regex' ? 'bg-purple-300' : 'bg-gray-300';
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className={`
          relative w-12 h-12 rounded-full border-2 flex items-center justify-center
          ${getNodeStyle()} ${getGlowStyle()}
          transition-all duration-300
        `}
      >
        {/* Start indicator */}
        {isStart && (
          <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
            <div className={`w-4 h-0.5 ${getStartIndicatorColor()}`}></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
              <div className={`w-0 h-0 border-l-2 border-t border-t-transparent border-b border-b-transparent ${
                dfaSource === 'regex' ? 'border-l-purple-300' : 'border-l-gray-300'
              }`}></div>
            </div>
          </div>
        )}

        {/* Double circle for final states */}
        {isFinal && (
          <div className="absolute inset-1 rounded-full border border-white/50"></div>
        )}

        {/* State label */}
        <span className="text-white font-mono font-bold text-sm">
          {label}
        </span>

        {/* Active pulse effect */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 rounded-full border-2 ${
              dfaSource === 'regex' ? 'border-purple-400' : 'border-cyber-400'
            }`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      <Handle
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ opacity: 0 }}
      />
    </>
  );
};

export default CustomStateNode;