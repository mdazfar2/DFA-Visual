import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faEnvelope, faCode } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gray-900/95 backdrop-blur-sm border-t border-cyber-400/20 mt-12"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-cyber-400">About DFA Practical</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              An interactive educational platform designed to help students master Deterministic Finite Automata 
              through hands-on visualization and step-by-step simulation.
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-cyber-400 transition-colors"
              >
                <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:azfaralam.ops@gmail.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-cyber-400 transition-colors"
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-cyber-400">Features</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCode} className="w-3 h-3 text-neon-purple" />
                <span>Manual DFA Construction</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCode} className="w-3 h-3 text-neon-purple" />
                <span>Regex to DFA Conversion</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCode} className="w-3 h-3 text-neon-purple" />
                <span>Step-by-step Simulation</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCode} className="w-3 h-3 text-neon-purple" />
                <span>Interactive Visualization</span>
              </li>
              <li className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCode} className="w-3 h-3 text-neon-purple" />
                <span>Educational Examples</span>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-cyber-400">Learning Resources</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <motion.a
                  href="https://en.wikipedia.org/wiki/Deterministic_finite_automaton"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 hover:text-cyber-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="w-3 h-3" />
                  <span>DFA Theory</span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="https://en.wikipedia.org/wiki/Regular_expression"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 hover:text-cyber-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="w-3 h-3" />
                  <span>Regular Expressions</span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="https://en.wikipedia.org/wiki/Thompson%27s_construction"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 hover:text-cyber-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="w-3 h-3" />
                  <span>Thompson's Construction</span>
                </motion.a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Creator credit */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <span className="text-sm">Designed &amp; developed</span>
              <span className="text-sm">by</span>
              <motion.a
                href="https://azfaralam.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Visit Azfar Alam's website"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center"
              >
                <img
                  src="/Azfar-fevico.webp"
                  alt="Azfar Alam"
                  width="28"
                  height="28"
                  className="h-full w-full object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                />
              </motion.a>
            </motion.div>

            {/* Tech Stack */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Built with React + TypeScript + Tailwind CSS</span>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <span>Theory of Computation Educational Tool</span>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500">
              © 2025 DFA Practical. Educational use only.
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-r from-cyber-400/10 to-neon-purple/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 30, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-r from-neon-green/10 to-cyber-400/10 rounded-full blur-xl"
          />
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;