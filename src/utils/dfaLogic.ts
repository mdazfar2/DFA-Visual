import { DFADefinition, SimulationStep, SimulationResult } from '../types/dfa';

export function validateDFA(dfa: DFADefinition): string[] {
  const errors: string[] = [];

  // Check if start state exists
  if (!dfa.states.find(s => s.id === dfa.startState)) {
    errors.push('Start state must be one of the defined states');
  }

  // Check if final states exist
  dfa.finalStates.forEach(finalState => {
    if (!dfa.states.find(s => s.id === finalState)) {
      errors.push(`Final state "${finalState}" must be one of the defined states`);
    }
  });

  // Check if all transitions reference valid states and symbols
  dfa.transitions.forEach((transition, index) => {
    if (!dfa.states.find(s => s.id === transition.from)) {
      errors.push(`Transition ${index + 1}: "from" state "${transition.from}" is not defined`);
    }
    if (!dfa.states.find(s => s.id === transition.to)) {
      errors.push(`Transition ${index + 1}: "to" state "${transition.to}" is not defined`);
    }
    if (!dfa.alphabet.includes(transition.symbol)) {
      errors.push(`Transition ${index + 1}: symbol "${transition.symbol}" is not in alphabet`);
    }
  });

  // Check if DFA is complete (each state has transition for each symbol)
  dfa.states.forEach(state => {
    dfa.alphabet.forEach(symbol => {
      const hasTransition = dfa.transitions.some(
        t => t.from === state.id && t.symbol === symbol
      );
      if (!hasTransition) {
        errors.push(`Missing transition from state "${state.id}" on symbol "${symbol}"`);
      }
    });
  });

  return errors;
}

export function simulateDFA(dfa: DFADefinition, input: string): SimulationResult {
  const steps: SimulationStep[] = [];
  let currentState = dfa.startState;
  
  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    
    // Find the transition
    const transition = dfa.transitions.find(
      t => t.from === currentState && t.symbol === symbol
    );
    
    if (!transition) {
      // No transition found - this shouldn't happen in a valid DFA
      return {
        steps,
        accepted: false,
        finalState: currentState
      };
    }
    
    steps.push({
      step: i + 1,
      currentState,
      inputSymbol: symbol,
      nextState: transition.to,
      remainingInput: input.substring(i + 1)
    });
    
    currentState = transition.to;
  }
  
  const accepted = dfa.finalStates.includes(currentState);
  
  return {
    steps,
    accepted,
    finalState: currentState
  };
}

export function getTransitionTable(dfa: DFADefinition): Record<string, Record<string, string>> {
  const table: Record<string, Record<string, string>> = {};
  
  dfa.states.forEach(state => {
    table[state.id] = {};
    dfa.alphabet.forEach(symbol => {
      const transition = dfa.transitions.find(
        t => t.from === state.id && t.symbol === symbol
      );
      table[state.id][symbol] = transition ? transition.to : '';
    });
  });
  
  return table;
}