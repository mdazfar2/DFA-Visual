import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStepForward, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

interface SimulationPanelProps {
  onSimulate: (input: string, stepMode?: boolean) => void;
  onNextStep: () => void;
  onReset: () => void;
  disabled: boolean;
  isStepMode: boolean;
  canStepForward: boolean;
  inputString: string;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  onSimulate,
  onNextStep,
  onReset,
  disabled,
  isStepMode,
  canStepForward,
  inputString
}) => {
  const [input, setInput] = useState<string>('101');

  const handleRunAll = () => {
    if (input.trim()) {
      onSimulate(input.trim(), false);
    }
  };

  const handleStepByStep = () => {
    if (input.trim()) {
      onSimulate(input.trim(), true);
    }
  };

  const quickTests = ['0', '1', '01', '10', '101', '1010', '1001', '11001'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-cyber-400/20 rounded-lg p-6"
    >
      <h3 className="text-lg font-display font-bold text-cyber-400 mb-4">Simulation</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Input String
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter binary string (e.g., 101)"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-cyber-400 focus:ring-1 focus:ring-cyber-400"
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={handleRunAll}
            disabled={disabled || !input.trim()}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyber-400 to-cyan-500 text-white font-medium py-2 px-3 rounded-lg hover:from-cyber-500 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
            <span className="text-sm">Run All</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={handleStepByStep}
            disabled={disabled || !input.trim()}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-purple to-purple-600 text-white font-medium py-2 px-3 rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faStepForward} className="w-4 h-4" />
            <span className="text-sm">Step Mode</span>
          </motion.button>
        </div>

        {isStepMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-2"
          >
            <motion.button
              whileHover={{ scale: canStepForward ? 1.02 : 1 }}
              whileTap={{ scale: canStepForward ? 0.98 : 1 }}
              onClick={onNextStep}
              disabled={!canStepForward}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-green to-green-600 text-white font-medium py-2 px-3 rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faStepForward} className="w-4 h-4" />
              <span className="text-sm">Next Step</span>
            </motion.button>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="w-full flex items-center justify-center space-x-2 bg-gray-700 text-gray-300 font-medium py-2 px-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faRotateLeft} className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </motion.button>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quick Tests
          </label>
          <div className="grid grid-cols-4 gap-1">
            {quickTests.map((test) => (
              <motion.button
                key={test}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setInput(test)}
                className="bg-gray-700/50 hover:bg-cyber-400/20 border border-gray-600 hover:border-cyber-400 text-gray-300 hover:text-cyber-400 font-mono text-xs py-1 px-2 rounded transition-all duration-200"
              >
                {test}
              </motion.button>
            ))}
          </div>
        </div>

        {inputString && (
          <div className="text-xs text-gray-400 font-mono bg-gray-900/50 p-2 rounded">
            <span className="text-gray-500">Current:</span> "{inputString}"
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SimulationPanel;