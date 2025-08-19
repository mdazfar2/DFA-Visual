export interface DFAState {
  id: string;
  label: string;
  isStart: boolean;
  isFinal: boolean;
  x?: number;
  y?: number;
}

export interface DFATransition {
  from: string;
  to: string;
  symbol: string;
}

export interface DFADefinition {
  states: DFAState[];
  alphabet: string[];
  transitions: DFATransition[];
  startState: string;
  finalStates: string[];
}

export interface SimulationStep {
  step: number;
  currentState: string;
  inputSymbol: string;
  nextState: string;
  remainingInput: string;
}

export interface SimulationResult {
  steps: SimulationStep[];
  accepted: boolean;
  finalState: string;
}

export interface DFAExample {
  name: string;
  description: string;
  definition: DFADefinition;
}