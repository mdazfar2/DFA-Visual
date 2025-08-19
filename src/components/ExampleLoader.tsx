import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBookOpen, faBolt } from '@fortawesome/free-solid-svg-icons';
import { dfaExamples } from '../utils/examples';
import { DFADefinition } from '../types/dfa';

interface ExampleLoaderProps {
  onLoadExample: (dfa: DFADefinition) => void;
}

const ExampleLoader: React.FC<ExampleLoaderProps> = ({ onLoadExample }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-cyber-400/20 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5 text-cyber-400" />
          <h3 className="text-lg font-display font-bold text-cyber-400">Examples</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 hover:text-cyber-400 transition-colors"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {dfaExamples.map((example, index) => (
              <motion.button
                key={example.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onLoadExample(example.definition)}
                className="w-full text-left p-3 bg-gray-700/30 hover:bg-cyber-400/10 border border-gray-600 hover:border-cyber-400/50 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-cyber-400 mt-0.5 group-hover:text-cyan-400 transition-colors" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-200 group-hover:text-cyber-400 transition-colors">
                      {example.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      {example.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-400 font-mono"
        >
          Click to load pre-built DFA examples
        </motion.p>
      )}
    </motion.div>
  );
};

export default ExampleLoader;