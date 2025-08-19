import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';

interface OutputConsoleProps {
  output: string[];
}

const OutputConsole: React.FC<OutputConsoleProps> = ({ output }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-cyber-400/20 rounded-lg overflow-hidden"
    >
      <div className="p-3 border-b border-gray-700/50 flex items-center space-x-2">
  <FontAwesomeIcon icon={faTerminal} className="w-4 h-4 text-cyber-400" />
        <h3 className="text-sm font-display font-bold text-cyber-400">Console Output</h3>
      </div>

      <div
        ref={scrollRef}
        className="p-4 font-mono text-xs leading-relaxed h-64 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
      >
        {output.length === 0 ? (
          <div className="text-gray-500 italic">
            Console ready... Create a DFA and run simulation to see output.
          </div>
        ) : (
          <div className="space-y-1">
            {output.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`
                  ${line.startsWith('✅') ? 'text-green-400' : ''}
                  ${line.startsWith('❌') ? 'text-red-400' : ''}
                  ${line.startsWith('🎯') ? 'text-cyber-400' : ''}
                  ${line.startsWith('Step') ? 'text-gray-300' : ''}
                  ${line.includes('ACCEPTED') ? 'text-green-400 font-bold' : ''}
                  ${line.includes('REJECTED') ? 'text-red-400 font-bold' : ''}
                  ${line.includes('Final state:') ? 'text-yellow-400' : ''}
                  ${!line.startsWith('✅') && !line.startsWith('❌') && !line.startsWith('🎯') && !line.startsWith('Step') && !line.includes('ACCEPTED') && !line.includes('REJECTED') && !line.includes('Final state:') ? 'text-gray-400' : ''}
                `}
              >
                {line || '\u00A0'}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OutputConsole;