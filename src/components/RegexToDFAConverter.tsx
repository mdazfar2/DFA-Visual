import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faRotateLeft, faBookOpen, faExclamationCircle, faInfoCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { DFADefinition } from '../types/dfa';
import { convertRegexToDFA } from '../utils/regexToDFA';

interface RegexToDFAConverterProps {
  onDFAGenerated: (dfa: DFADefinition) => void;
}

const RegexToDFAConverter: React.FC<RegexToDFAConverterProps> = ({ onDFAGenerated }) => {
  const [regex, setRegex] = useState<string>('(a+b)*abb');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const exampleRegexes = [
    { pattern: '(a+b)*abb', description: 'Strings ending with "abb"' },
    { pattern: 'a*b*', description: 'Zero or more a\'s followed by zero or more b\'s' },
    { pattern: '(a+b)*a(a+b)*', description: 'Strings containing at least one "a"' },
    { pattern: 'a(a+b)*a', description: 'Strings starting and ending with "a"' },
    { pattern: '(aa+bb)*', description: 'Even length strings of paired characters' },
    { pattern: 'a*+b*', description: 'All a\'s or all b\'s' },
    { pattern: '(01+10)*', description: 'Binary strings with alternating pairs' },
    { pattern: '0*1*0*', description: 'At most one block of 1s' },
    { pattern: '(0+1)*00(0+1)*', description: 'Contains substring "00"' },
    { pattern: '1(01*0+1)*1', description: 'Starts and ends with 1' },
    { pattern: 'a*', description: 'Zero or more a\'s' },
    { pattern: 'ab*c', description: 'a followed by zero or more b\'s then c' },
    { pattern: '(abc)*', description: 'Zero or more repetitions of "abc"' },
    { pattern: 'x+y*z', description: 'One or more x\'s, zero or more y\'s, then z' }
  ];

  const handleConvert = useCallback(async () => {
    if (!regex.trim()) {
      setError('Please enter a regular expression');
      setSuccess('');
      return;
    }

    setIsConverting(true);
    setError('');
    setSuccess('');

    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dfa = convertRegexToDFA(regex.trim());
      
      // Validate the generated DFA
      if (!dfa.states || dfa.states.length === 0) {
        throw new Error('Generated DFA is empty');
      }
      
      onDFAGenerated(dfa);
      setSuccess(`Successfully converted regex to DFA with ${dfa.states.length} states!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert regular expression';
      setError(errorMessage);
      console.error('Regex conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  }, [regex, onDFAGenerated]);

  const handleExampleClick = (pattern: string) => {
    setRegex(pattern);
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setRegex('(a+b)*abb');
    setError('');
    setSuccess('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isConverting && regex.trim()) {
      handleConvert();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-cyber-400/20 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-cyber-400">Regex to DFA</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetForm}
          className="p-2 text-gray-400 hover:text-cyber-400 transition-colors"
          title="Reset Form"
        >
          <FontAwesomeIcon icon={faRotateLeft} className="w-4 h-4" />
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-900/20 border border-red-400/30 rounded-lg flex items-start space-x-2"
        >
          <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="text-red-400 text-sm">{error}</div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-900/20 border border-green-400/30 rounded-lg flex items-start space-x-2"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
          <div className="text-green-400 text-sm">{success}</div>
        </motion.div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Regular Expression
          </label>
          <div className="relative">
            <input
              type="text"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter regex (e.g., (a+b)*abb, 0*1*, abc*)"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-cyber-400 focus:ring-1 focus:ring-cyber-400"
            />
            {isConverting && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-cyber-400 border-t-transparent rounded-full"
                />
              </div>
            )}
          </div>
          
          <div className="mt-2 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
            <div className="flex items-start space-x-2">
              <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-blue-400 text-xs">
                <div className="font-medium mb-1">Supported operators:</div>
                <div className="font-mono space-y-1">
                  <div>• <span className="text-cyan-400">+</span> (union/or) - Example: a+b</div>
                  <div>• <span className="text-cyan-400">*</span> (Kleene star) - Example: a*</div>
                  <div>• <span className="text-cyan-400">( )</span> (grouping) - Example: (ab)*</div>
                  <div>• <span className="text-cyan-400">concatenation</span> - Example: abc</div>
                  <div>• <span className="text-cyan-400">Alphanumeric symbols</span> - a-z, A-Z, 0-9</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: isConverting ? 1 : 1.02 }}
          whileTap={{ scale: isConverting ? 1 : 0.98 }}
          onClick={handleConvert}
          disabled={isConverting || !regex.trim()}
          className="w-full bg-gradient-to-r from-neon-purple to-purple-600 text-white font-medium py-3 rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-purple-400/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <FontAwesomeIcon icon={faBolt} className="w-4 h-4" />
          <span>{isConverting ? 'Converting...' : 'Convert to DFA'}</span>
        </motion.button>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <FontAwesomeIcon icon={faBookOpen} className="w-4 h-4 text-cyber-400" />
            <label className="text-sm font-medium text-gray-300">
              Example Patterns
            </label>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {exampleRegexes.map((example, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExampleClick(example.pattern)}
                className="w-full text-left p-3 bg-gray-700/30 hover:bg-purple-400/10 border border-gray-600 hover:border-purple-400/50 rounded-lg transition-all duration-200 group"
              >
                <div className="font-mono text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                  {example.pattern}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {example.description}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
          <div className="text-xs text-gray-400">
            <div className="font-medium text-gray-300 mb-1">Conversion Process:</div>
            <div>1. Parse regular expression into Abstract Syntax Tree (AST)</div>
            <div>2. Extract alphabet from regex symbols automatically</div>
            <div>3. Build NFA using Thompson's construction algorithm</div>
            <div>4. Convert NFA to DFA using subset construction</div>
            <div>5. Generate readable state names (q0, q1, q2, ...)</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegexToDFAConverter;