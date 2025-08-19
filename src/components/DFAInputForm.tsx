import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faUpload, faDownload, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { DFADefinition, DFAState, DFATransition } from '../types/dfa';

interface DFAInputFormProps {
  onSubmit: (dfa: DFADefinition) => void;
  errors: string[];
}

const DFAInputForm: React.FC<DFAInputFormProps> = ({ onSubmit, errors }) => {
  const [states, setStates] = useState<string>('q0,q1,q2');
  const [alphabet, setAlphabet] = useState<string>('0,1');
  const [startState, setStartState] = useState<string>('q0');
  const [finalStates, setFinalStates] = useState<string>('q2');
  const [transitions, setTransitions] = useState<DFATransition[]>([
    { from: 'q0', to: 'q1', symbol: '0' },
    { from: 'q0', to: 'q0', symbol: '1' },
    { from: 'q1', to: 'q1', symbol: '0' },
    { from: 'q1', to: 'q2', symbol: '1' },
    { from: 'q2', to: 'q1', symbol: '0' },
    { from: 'q2', to: 'q0', symbol: '1' }
  ]);

  const stateList = states.split(',').map(s => s.trim()).filter(s => s);
  const alphabetList = alphabet.split(',').map(s => s.trim()).filter(s => s);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const dfaStates: DFAState[] = stateList.map(stateId => ({
      id: stateId,
      label: stateId,
      isStart: stateId === startState,
      isFinal: finalStates.split(',').map(s => s.trim()).includes(stateId)
    }));

    const dfa: DFADefinition = {
      states: dfaStates,
      alphabet: alphabetList,
      transitions,
      startState,
      finalStates: finalStates.split(',').map(s => s.trim()).filter(s => s)
    };

    onSubmit(dfa);
  }, [states, alphabet, startState, finalStates, transitions, stateList, alphabetList, onSubmit]);

  const addTransition = () => {
    setTransitions([...transitions, { from: '', to: '', symbol: '' }]);
  };

  const removeTransition = (index: number) => {
    setTransitions(transitions.filter((_, i) => i !== index));
  };

  const updateTransition = (index: number, field: keyof DFATransition, value: string) => {
    const updated = transitions.map((transition, i) => 
      i === index ? { ...transition, [field]: value } : transition
    );
    setTransitions(updated);
  };

  const resetForm = () => {
    setStates('q0,q1,q2');
    setAlphabet('0,1');
    setStartState('q0');
    setFinalStates('q2');
    setTransitions([
      { from: 'q0', to: 'q1', symbol: '0' },
      { from: 'q0', to: 'q0', symbol: '1' },
      { from: 'q1', to: 'q1', symbol: '0' },
      { from: 'q1', to: 'q2', symbol: '1' },
      { from: 'q2', to: 'q1', symbol: '0' },
      { from: 'q2', to: 'q0', symbol: '1' }
    ]);
  };

  const exportDFA = () => {
    const dfaStates: DFAState[] = stateList.map(stateId => ({
      id: stateId,
      label: stateId,
      isStart: stateId === startState,
      isFinal: finalStates.split(',').map(s => s.trim()).includes(stateId)
    }));

    const dfa: DFADefinition = {
      states: dfaStates,
      alphabet: alphabetList,
      transitions,
      startState,
      finalStates: finalStates.split(',').map(s => s.trim()).filter(s => s)
    };

    const blob = new Blob([JSON.stringify(dfa, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dfa-definition.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDFA = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dfa: DFADefinition = JSON.parse(event.target?.result as string);
        setStates(dfa.states.map(s => s.id).join(','));
        setAlphabet(dfa.alphabet.join(','));
        setStartState(dfa.startState);
        setFinalStates(dfa.finalStates.join(','));
        setTransitions(dfa.transitions);
      } catch (error) {
        console.error('Failed to import DFA:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-cyber-400/20 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-cyber-400">DFA Definition</h2>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetForm}
            className="p-2 text-gray-400 hover:text-cyber-400 transition-colors"
            title="Reset Form"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="w-4 h-4" />
          </motion.button>
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-cyber-400 transition-colors cursor-pointer"
            title="Import DFA"
          >
            <FontAwesomeIcon icon={faUpload} className="w-4 h-4" />
            <input
              type="file"
              accept=".json"
              onChange={importDFA}
              className="hidden"
            />
          </motion.label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportDFA}
            className="p-2 text-gray-400 hover:text-cyber-400 transition-colors"
            title="Export DFA"
          >
            <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-900/20 border border-red-400/30 rounded-lg"
        >
          <div className="text-red-400 text-sm space-y-1">
            {errors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            States (comma-separated)
          </label>
          <input
            type="text"
            value={states}
            onChange={(e) => setStates(e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-cyber-400 focus:ring-1 focus:ring-cyber-400"
            placeholder="q0,q1,q2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alphabet (comma-separated)
          </label>
          <input
            type="text"
            value={alphabet}
            onChange={(e) => setAlphabet(e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-cyber-400 focus:ring-1 focus:ring-cyber-400"
            placeholder="0,1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start State
            </label>
            <select
              value={startState}
              onChange={(e) => setStartState(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-cyber-400 focus:ring-1 focus:ring-cyber-400"
            >
              {stateList.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Final States
            </label>
            <input
              type="text"
              value={finalStates}
              onChange={(e) => setFinalStates(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 font-mono focus:outline-none focus:border-cyber-400 focus:ring-1 focus:ring-cyber-400"
              placeholder="q2,q3"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Transitions
            </label>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTransition}
              className="p-1 text-cyber-400 hover:text-cyber-300 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transitions.map((transition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-4 gap-2 items-center"
              >
                <select
                  value={transition.from}
                  onChange={(e) => updateTransition(index, 'from', e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-gray-100 font-mono text-sm focus:outline-none focus:border-cyber-400"
                >
                  <option value="">From</option>
                  {stateList.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                
                <input
                  type="text"
                  value={transition.symbol}
                  onChange={(e) => updateTransition(index, 'symbol', e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-gray-100 font-mono text-sm focus:outline-none focus:border-cyber-400"
                  placeholder="Symbol"
                />
                
                <select
                  value={transition.to}
                  onChange={(e) => updateTransition(index, 'to', e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-gray-100 font-mono text-sm focus:outline-none focus:border-cyber-400"
                >
                  <option value="">To</option>
                  {stateList.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeTransition(index)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyber-400 to-neon-purple text-white font-medium py-3 rounded-lg hover:from-cyber-500 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-cyber-400/25"
        >
          Create DFA
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DFAInputForm;