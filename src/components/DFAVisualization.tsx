import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DFADefinition, SimulationResult } from '../types/dfa';
import CustomStateNode from './CustomStateNode';

interface DFAVisualizationProps {
  dfa: DFADefinition | null;
  simulationResult: SimulationResult | null;
  currentStep: number;
  dfaSource?: 'manual' | 'regex';
}

const nodeTypes = {
  state: CustomStateNode,
};

const DFAVisualization: React.FC<DFAVisualizationProps> = ({
  dfa,
  simulationResult,
  currentStep,
  dfaSource = 'manual'
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const currentState = useMemo(() => {
    if (!simulationResult || currentStep < 0) {
      return dfa?.startState || null;
    }
    if (currentStep >= simulationResult.steps.length) {
      return simulationResult.finalState;
    }
    return simulationResult.steps[currentStep]?.nextState || dfa?.startState || null;
  }, [simulationResult, currentStep, dfa]);

  const activeTransition = useMemo(() => {
    if (!simulationResult || currentStep < 0 || currentStep >= simulationResult.steps.length) {
      return null;
    }
    const step = simulationResult.steps[currentStep];
    return `${step.currentState}-${step.symbol}-${step.nextState}`;
  }, [simulationResult, currentStep]);

  useEffect(() => {
    if (!dfa) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Position states in a circle or grid based on count
    const stateCount = dfa.states.length;
    const centerX = 250;
    const centerY = 200;
    
    let positions: { x: number; y: number }[];
    
    if (stateCount <= 6) {
      // Circular layout for smaller DFAs
      const radius = Math.max(120, stateCount * 20);
      const angleStep = (2 * Math.PI) / stateCount;
      positions = dfa.states.map((_, index) => {
        const angle = index * angleStep;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
    } else {
      // Grid layout for larger DFAs
      const cols = Math.ceil(Math.sqrt(stateCount));
      const spacing = 150;
      positions = dfa.states.map((_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        return {
          x: centerX + (col - cols / 2) * spacing,
          y: centerY + (row - Math.ceil(stateCount / cols) / 2) * spacing
        };
      });
    }

    const newNodes: Node[] = dfa.states.map((state, index) => {
      const position = positions[index];

      return {
        id: state.id,
        type: 'state',
        position,
        data: {
          label: state.label,
          isStart: state.isStart,
          isFinal: state.isFinal,
          isActive: currentState === state.id,
          isAccepted: simulationResult?.accepted && simulationResult.finalState === state.id && currentStep >= simulationResult.steps.length,
          dfaSource
        },
        draggable: true,
      };
    });

    // Group transitions by from-to pair to handle multiple symbols
    const transitionGroups: Record<string, string[]> = {};
    dfa.transitions.forEach(transition => {
      const key = `${transition.from}-${transition.to}`;
      if (!transitionGroups[key]) {
        transitionGroups[key] = [];
      }
      transitionGroups[key].push(transition.symbol);
    });

    const newEdges: Edge[] = Object.entries(transitionGroups).map(([key, symbols]) => {
      const [from, to] = key.split('-');
      const isActive = activeTransition?.startsWith(`${from}-${symbols[0]}-${to}`);
      const isSelfLoop = from === to;
      
      // Different colors based on DFA source
      const baseColor = dfaSource === 'regex' ? '#8B5CF6' : '#6B7280';
      const activeColor = dfaSource === 'regex' ? '#A855F7' : '#00D9FF';

      return {
        id: key,
        source: from,
        target: to,
        label: symbols.join(', '),
        type: isSelfLoop ? 'default' : 'smoothstep',
        animated: isActive,
        style: {
          stroke: isActive ? activeColor : baseColor,
          strokeWidth: isActive ? 3 : 2,
        },
        labelStyle: {
          fill: isActive ? activeColor : '#D1D5DB',
          fontWeight: isActive ? 'bold' : 'normal',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isActive ? activeColor : baseColor,
          width: 20,
          height: 20,
        },
        ...(isSelfLoop && {
          style: {
            ...((isActive && { stroke: activeColor, strokeWidth: 3 }) || { stroke: baseColor, strokeWidth: 2 }),
          },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: '#1F2937', fillOpacity: 0.8 },
        }),
      };
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [dfa, currentState, activeTransition, simulationResult, currentStep, dfaSource]);

  if (!dfa) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-cyber-400/20 rounded-lg overflow-hidden"
        style={{ height: '500px' }}
      >
        <div className="p-4 border-b border-gray-700/50">
          <h3 className="text-lg font-display font-bold text-cyber-400">State Diagram</h3>
          <p className="text-sm text-gray-400 font-mono mt-1">
            Interactive DFA Visualization
          </p>
        </div>
        
        <div className="flex items-center justify-center h-full relative overflow-hidden">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="text-cyber-400">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Central Content */}
          <div className="text-center z-10 max-w-md mx-auto px-6">
            {/* Animated DFA Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6"
            >
              <div className="relative mx-auto w-32 h-20">
                {/* Sample State Nodes */}
                <motion.div
                  animate={{ 
                    boxShadow: [
                      '0 0 10px rgba(0, 217, 255, 0.3)',
                      '0 0 20px rgba(0, 217, 255, 0.6)',
                      '0 0 10px rgba(0, 217, 255, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-cyber-400 to-cyan-500 rounded-full border-2 border-cyan-300 flex items-center justify-center"
                >
                  <span className="text-white font-mono text-xs font-bold">q0</span>
                </motion.div>
                
                <motion.div
                  animate={{ 
                    boxShadow: [
                      '0 0 10px rgba(139, 92, 246, 0.3)',
                      '0 0 20px rgba(139, 92, 246, 0.6)',
                      '0 0 10px rgba(139, 92, 246, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-neon-purple to-purple-600 rounded-full border-2 border-purple-300 flex items-center justify-center"
                >
                  <span className="text-white font-mono text-xs font-bold">q1</span>
                  {/* Double circle for final state */}
                  <div className="absolute inset-1 rounded-full border border-white/50"></div>
                </motion.div>
                
                {/* Animated Arrow */}
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <svg width="40" height="20" className="text-cyber-400">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                              refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                      </marker>
                    </defs>
                    <line x1="5" y1="10" x2="30" y2="10" 
                          stroke="currentColor" strokeWidth="2" 
                          markerEnd="url(#arrowhead)" />
                    <text x="20" y="8" textAnchor="middle" 
                          className="text-xs font-mono fill-current">a</text>
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-display font-bold bg-gradient-to-r from-cyber-400 to-neon-purple bg-clip-text text-transparent">
                Ready to Visualize DFA
              </h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">
                Create a DFA manually or convert from a regular expression to see the interactive state diagram with animated transitions.
              </p>
              
              {/* Action Hints */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 bg-gray-700/30 px-3 py-2 rounded-lg border border-gray-600/50"
                >
                  <div className="w-2 h-2 bg-cyber-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300 font-mono">Manual DFA</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 bg-gray-700/30 px-3 py-2 rounded-lg border border-gray-600/50"
                >
                  <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300 font-mono">From Regex</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-r from-cyber-400/10 to-neon-purple/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 15, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-8 left-8 w-12 h-12 bg-gradient-to-r from-neon-green/10 to-cyber-400/10 rounded-full blur-xl"
          />
        </div>
      </motion.div>
    );
  }

  const sourceLabel = dfaSource === 'regex' ? 'Generated from Regex' : 'Manual Definition';
  const sourceColor = dfaSource === 'regex' ? 'text-neon-purple' : 'text-cyber-400';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-cyber-400/20 rounded-lg overflow-hidden"
      style={{ height: '500px' }}
    >
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-bold text-cyber-400">State Diagram</h3>
          <div className={`text-xs font-mono px-2 py-1 rounded ${sourceColor} bg-gray-700/30`}>
            {sourceLabel}
          </div>
        </div>
        {simulationResult && (
          <p className="text-sm text-gray-400 font-mono mt-1">
            Current State: <span className="text-cyber-400">{currentState}</span>
            {currentStep >= 0 && simulationResult.steps.length > 0 && (
              <span className="ml-4">
                Step: {Math.min(currentStep + 1, simulationResult.steps.length)} / {simulationResult.steps.length}
              </span>
            )}
          </p>
        )}
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{
          backgroundColor: 'transparent',
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          color="#374151" 
          gap={20} 
          size={1}
          style={{ opacity: 0.3 }}
        />
        <Controls 
          style={{
            background: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            borderRadius: '8px',
          }}
        />
      </ReactFlow>
    </motion.div>
  );
};

export default DFAVisualization;