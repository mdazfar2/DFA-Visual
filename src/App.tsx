import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import DFAInputForm from './components/DFAInputForm';
import RegexToDFAConverter from './components/RegexToDFAConverter';
import DFAVisualization from './components/DFAVisualization';
import SimulationPanel from './components/SimulationPanel';
import OutputConsole from './components/OutputConsole';
import ExampleLoader from './components/ExampleLoader';
import TabNavigation from './components/TabNavigation';
import { DFADefinition, SimulationResult } from './types/dfa';
import { validateDFA, simulateDFA } from './utils/dfaLogic';

type TabType = 'manual' | 'regex';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [dfa, setDfa] = useState<DFADefinition | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isStepMode, setIsStepMode] = useState<boolean>(false);
  const [inputString, setInputString] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dfaSource, setDfaSource] = useState<'manual' | 'regex'>('manual');

  const handleDFASubmit = useCallback((dfaDefinition: DFADefinition, source: 'manual' | 'regex' = 'manual') => {
    const validationErrors = validateDFA(dfaDefinition);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setConsoleOutput([
        '❌ DFA Validation Failed:',
        ...validationErrors.map(error => `  • ${error}`)
      ]);
      return;
    }

    setDfa(dfaDefinition);
    setDfaSource(source);
    setErrors([]);
    
    const sourceText = source === 'regex' ? 'Generated from Regular Expression' : 'Manual Definition';
    setConsoleOutput([
      `✅ DFA ${sourceText} Valid`,
      `States: {${dfaDefinition.states.map(s => s.id).join(', ')}}`,
      `Alphabet: {${dfaDefinition.alphabet.join(', ')}}`,
      `Start State: ${dfaDefinition.startState}`,
      `Final States: {${dfaDefinition.finalStates.join(', ')}}`,
      'Ready for simulation!'
    ]);
    setSimulationResult(null);
    setCurrentStep(-1);
  }, []);

  const handleSimulation = useCallback((input: string, stepMode: boolean = false) => {
    if (!dfa) return;

    setInputString(input);
    setIsStepMode(stepMode);
    
    const result = simulateDFA(dfa, input);
    setSimulationResult(result);
    
    if (stepMode) {
      setCurrentStep(-1);
      setConsoleOutput([
        `🎯 Starting simulation with input: "${input}"`,
        `Initial state: ${dfa.startState}`,
        'Press "Next Step" to continue...'
      ]);
    } else {
      setCurrentStep(result.steps.length - 1);
      const output = [
        `🎯 Simulating input: "${input}"`,
        `Initial state: ${dfa.startState}`,
        ''
      ];
      
      result.steps.forEach((step, index) => {
        output.push(`Step ${step.step}: ${step.currentState} --${step.inputSymbol}--> ${step.nextState}`);
      });
      
      output.push('');
      output.push(`Final state: ${result.finalState}`);
      output.push(result.accepted ? '✅ ACCEPTED' : '❌ REJECTED');
      
      setConsoleOutput(output);
    }
  }, [dfa]);

  const handleNextStep = useCallback(() => {
    if (!simulationResult || !isStepMode) return;
    
    const nextStep = currentStep + 1;
    if (nextStep < simulationResult.steps.length) {
      setCurrentStep(nextStep);
      const step = simulationResult.steps[nextStep];
      setConsoleOutput(prev => [
        ...prev,
        `Step ${step.step}: ${step.currentState} --${step.inputSymbol}--> ${step.nextState}`
      ]);
    } else if (nextStep === simulationResult.steps.length) {
      setCurrentStep(nextStep);
      setConsoleOutput(prev => [
        ...prev,
        '',
        `Final state: ${simulationResult.finalState}`,
        simulationResult.accepted ? '✅ ACCEPTED' : '❌ REJECTED'
      ]);
    }
  }, [simulationResult, currentStep, isStepMode]);

  const handleReset = useCallback(() => {
    setSimulationResult(null);
    setCurrentStep(-1);
    setInputString('');
    setIsStepMode(false);
    setConsoleOutput([]);
  }, []);

  const handleLoadExample = useCallback((exampleDfa: DFADefinition) => {
    setActiveTab('manual');
    handleDFASubmit(exampleDfa, 'manual');
  }, [handleDFASubmit]);

  const handleRegexDFA = useCallback((dfaDefinition: DFADefinition) => {
    handleDFASubmit(dfaDefinition, 'regex');
  }, [handleDFASubmit]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 xl:grid-cols-12 gap-6"
        >
          {/* Left Panel - DFA Definition and Examples */}
          <div className="xl:col-span-4 space-y-6">
            <ExampleLoader onLoadExample={handleLoadExample} />
            
            <TabNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
            />
            
            {activeTab === 'manual' ? (
              <DFAInputForm onSubmit={(dfa) => handleDFASubmit(dfa, 'manual')} errors={errors} />
            ) : (
              <RegexToDFAConverter onDFAGenerated={handleRegexDFA} />
            )}
          </div>

          {/* Main Panel - Visualization */}
          <div className="xl:col-span-5 space-y-6">
            <DFAVisualization 
              dfa={dfa}
              simulationResult={simulationResult}
              currentStep={currentStep}
              dfaSource={dfaSource}
            />
          </div>

          {/* Right Panel - Simulation and Console */}
          <div className="xl:col-span-3 space-y-6">
            <SimulationPanel
              onSimulate={handleSimulation}
              onNextStep={handleNextStep}
              onReset={handleReset}
              disabled={!dfa}
              isStepMode={isStepMode}
              canStepForward={simulationResult && currentStep < simulationResult.steps.length}
              inputString={inputString}
            />
            
            <OutputConsole output={consoleOutput} />
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;