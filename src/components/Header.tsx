import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/95 backdrop-blur-sm border-b border-cyber-400/20 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="p-2 bg-gradient-to-r from-cyber-400 to-neon-purple rounded-lg">
              <FontAwesomeIcon icon={faMicrochip} className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-cyber-400 to-neon-purple bg-clip-text text-transparent">
                DFA Practical
              </h1>
              <p className="text-gray-400 text-sm font-mono">Interactive Automata Learning</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.a
              href="https://github.com/mdazfar2/DFA-Visual"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-cyber-400 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://en.wikipedia.org/wiki/Deterministic_finite_automaton"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-cyber-400 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;