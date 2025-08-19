import { DFADefinition, DFAState, DFATransition } from '../types/dfa';

// Types for NFA construction
interface NFAState {
  id: number;
  isAccepting: boolean;
}

interface NFATransition {
  from: number;
  to: number;
  symbol: string | null; // null represents epsilon transition
}

interface NFA {
  states: NFAState[];
  transitions: NFATransition[];
  startState: number;
  acceptingStates: number[];
}

// Regex AST nodes
interface RegexNode {
  type: 'char' | 'concat' | 'union' | 'star' | 'empty';
  value?: string;
  left?: RegexNode;
  right?: RegexNode;
  child?: RegexNode;
}

let stateCounter = 0;

function createState(isAccepting: boolean = false): NFAState {
  return { id: stateCounter++, isAccepting };
}

function parseRegex(regex: string): { ast: RegexNode; alphabet: Set<string> } {
  // Clean and validate input
  regex = regex.replace(/\s/g, ''); // Remove whitespace
  
  if (!regex) {
    return { ast: { type: 'empty' }, alphabet: new Set() };
  }

  // Validate parentheses
  if (!isValidParentheses(regex)) {
    throw new Error('Unbalanced parentheses in regular expression');
  }

  const alphabet = new Set<string>();
  const ast = parseUnion(regex, { pos: 0 }, alphabet);
  
  if (alphabet.size === 0) {
    alphabet.add('a').add('b'); // Default alphabet for empty expressions
  }
  
  return { ast, alphabet };
}

function isValidParentheses(regex: string): boolean {
  let count = 0;
  for (const char of regex) {
    if (char === '(') count++;
    if (char === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

function parseUnion(regex: string, ctx: { pos: number }, alphabet: Set<string>): RegexNode {
  let left = parseConcat(regex, ctx, alphabet);
  
  while (ctx.pos < regex.length && regex[ctx.pos] === '+') {
    ctx.pos++; // consume '+'
    const right = parseConcat(regex, ctx, alphabet);
    left = { type: 'union', left, right };
  }
  
  return left;
}

function parseConcat(regex: string, ctx: { pos: number }, alphabet: Set<string>): RegexNode {
  let left = parsePostfix(regex, ctx, alphabet);
  
  while (ctx.pos < regex.length && 
         regex[ctx.pos] !== '+' && 
         regex[ctx.pos] !== ')') {
    const right = parsePostfix(regex, ctx, alphabet);
    left = { type: 'concat', left, right };
  }
  
  return left;
}

function parsePostfix(regex: string, ctx: { pos: number }, alphabet: Set<string>): RegexNode {
  let node = parseAtom(regex, ctx, alphabet);
  
  while (ctx.pos < regex.length && regex[ctx.pos] === '*') {
    ctx.pos++; // consume '*'
    node = { type: 'star', child: node };
  }
  
  return node;
}

function parseAtom(regex: string, ctx: { pos: number }, alphabet: Set<string>): RegexNode {
  if (ctx.pos >= regex.length) {
    throw new Error('Unexpected end of regular expression');
  }
  
  const char = regex[ctx.pos];
  
  if (char === '(') {
    ctx.pos++; // consume '('
    const node = parseUnion(regex, ctx, alphabet);
    if (ctx.pos >= regex.length || regex[ctx.pos] !== ')') {
      throw new Error('Missing closing parenthesis');
    }
    ctx.pos++; // consume ')'
    return node;
  } else if (isValidSymbol(char)) {
    ctx.pos++;
    alphabet.add(char);
    return { type: 'char', value: char };
  } else {
    throw new Error(`Invalid character in regular expression: '${char}'`);
  }
}

function isValidSymbol(char: string): boolean {
  // Allow alphanumeric characters
  return /^[a-zA-Z0-9]$/.test(char);
}

function buildNFA(node: RegexNode): NFA {
  switch (node.type) {
    case 'empty':
      return buildEmptyNFA();
    case 'char':
      return buildCharNFA(node.value!);
    case 'concat':
      return buildConcatNFA(buildNFA(node.left!), buildNFA(node.right!));
    case 'union':
      return buildUnionNFA(buildNFA(node.left!), buildNFA(node.right!));
    case 'star':
      return buildStarNFA(buildNFA(node.child!));
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function buildEmptyNFA(): NFA {
  const state = createState(true);
  return {
    states: [state],
    transitions: [],
    startState: state.id,
    acceptingStates: [state.id]
  };
}

function buildCharNFA(char: string): NFA {
  const start = createState();
  const accept = createState(true);
  
  return {
    states: [start, accept],
    transitions: [{ from: start.id, to: accept.id, symbol: char }],
    startState: start.id,
    acceptingStates: [accept.id]
  };
}

function buildConcatNFA(nfa1: NFA, nfa2: NFA): NFA {
  // Connect accepting states of nfa1 to start state of nfa2 with epsilon transitions
  const epsilonTransitions: NFATransition[] = nfa1.acceptingStates.map(state => ({
    from: state,
    to: nfa2.startState,
    symbol: null
  }));
  
  // Make accepting states of nfa1 non-accepting
  const updatedStates1 = nfa1.states.map(state => ({
    ...state,
    isAccepting: false
  }));
  
  return {
    states: [...updatedStates1, ...nfa2.states],
    transitions: [...nfa1.transitions, ...nfa2.transitions, ...epsilonTransitions],
    startState: nfa1.startState,
    acceptingStates: nfa2.acceptingStates
  };
}

function buildUnionNFA(nfa1: NFA, nfa2: NFA): NFA {
  const newStart = createState();
  const newAccept = createState(true);
  
  // Epsilon transitions from new start to both NFAs
  const startTransitions: NFATransition[] = [
    { from: newStart.id, to: nfa1.startState, symbol: null },
    { from: newStart.id, to: nfa2.startState, symbol: null }
  ];
  
  // Epsilon transitions from both NFAs to new accept state
  const endTransitions: NFATransition[] = [
    ...nfa1.acceptingStates.map(state => ({ from: state, to: newAccept.id, symbol: null })),
    ...nfa2.acceptingStates.map(state => ({ from: state, to: newAccept.id, symbol: null }))
  ];
  
  // Make all old accepting states non-accepting
  const updatedStates1 = nfa1.states.map(state => ({ ...state, isAccepting: false }));
  const updatedStates2 = nfa2.states.map(state => ({ ...state, isAccepting: false }));
  
  return {
    states: [newStart, ...updatedStates1, ...updatedStates2, newAccept],
    transitions: [...nfa1.transitions, ...nfa2.transitions, ...startTransitions, ...endTransitions],
    startState: newStart.id,
    acceptingStates: [newAccept.id]
  };
}

function buildStarNFA(nfa: NFA): NFA {
  const newStart = createState(true); // Accept empty string
  const newAccept = createState(true);
  
  const transitions: NFATransition[] = [
    // Can go directly to accept (empty string)
    { from: newStart.id, to: newAccept.id, symbol: null },
    // Can start the NFA
    { from: newStart.id, to: nfa.startState, symbol: null },
    // From accepting states, can go to final accept
    ...nfa.acceptingStates.map(state => ({ from: state, to: newAccept.id, symbol: null })),
    // From accepting states, can loop back to start
    ...nfa.acceptingStates.map(state => ({ from: state, to: nfa.startState, symbol: null }))
  ];
  
  // Make old accepting states non-accepting
  const updatedStates = nfa.states.map(state => ({ ...state, isAccepting: false }));
  
  return {
    states: [newStart, ...updatedStates, newAccept],
    transitions: [...nfa.transitions, ...transitions],
    startState: newStart.id,
    acceptingStates: [newAccept.id]
  };
}

function epsilonClosure(states: Set<number>, nfa: NFA): Set<number> {
  const closure = new Set(states);
  const stack = Array.from(states);
  
  while (stack.length > 0) {
    const state = stack.pop()!;
    
    // Find all epsilon transitions from this state
    for (const transition of nfa.transitions) {
      if (transition.from === state && transition.symbol === null) {
        if (!closure.has(transition.to)) {
          closure.add(transition.to);
          stack.push(transition.to);
        }
      }
    }
  }
  
  return closure;
}

function convertNFAToDFA(nfa: NFA, alphabet: string[]): DFADefinition {
  const dfaStates: Map<string, Set<number>> = new Map();
  const dfaTransitions: DFATransition[] = [];
  
  // Start with epsilon closure of NFA start state
  const startClosure = epsilonClosure(new Set([nfa.startState]), nfa);
  const startKey = Array.from(startClosure).sort((a, b) => a - b).join(',');
  dfaStates.set(startKey, startClosure);
  
  const unprocessed = [startKey];
  const processed = new Set<string>();
  
  while (unprocessed.length > 0) {
    const currentKey = unprocessed.shift()!;
    if (processed.has(currentKey)) continue;
    processed.add(currentKey);
    
    const currentStates = dfaStates.get(currentKey)!;
    
    for (const symbol of alphabet) {
      const reachable = new Set<number>();
      
      // Find all states reachable by this symbol
      for (const state of currentStates) {
        for (const transition of nfa.transitions) {
          if (transition.from === state && transition.symbol === symbol) {
            reachable.add(transition.to);
          }
        }
      }
      
      if (reachable.size > 0) {
        // Get epsilon closure of reachable states
        const targetClosure = epsilonClosure(reachable, nfa);
        const targetKey = Array.from(targetClosure).sort((a, b) => a - b).join(',');
        
        // Add transition
        dfaTransitions.push({
          from: currentKey,
          to: targetKey,
          symbol
        });
        
        // Add new state if not seen before
        if (!dfaStates.has(targetKey)) {
          dfaStates.set(targetKey, targetClosure);
          unprocessed.push(targetKey);
        }
      }
    }
  }
  
  // Create readable state names
  const stateKeys = Array.from(dfaStates.keys());
  const stateMapping = new Map<string, string>();
  
  // Ensure start state gets q0
  stateMapping.set(startKey, 'q0');
  let stateIndex = 1;
  
  for (const key of stateKeys) {
    if (key !== startKey) {
      stateMapping.set(key, `q${stateIndex++}`);
    }
  }
  
  // Create DFA states
  const states: DFAState[] = stateKeys.map(key => {
    const nfaStates = dfaStates.get(key)!;
    const isAccepting = Array.from(nfaStates).some(s => nfa.acceptingStates.includes(s));
    const stateId = stateMapping.get(key)!;
    
    return {
      id: stateId,
      label: stateId,
      isStart: key === startKey,
      isFinal: isAccepting
    };
  });
  
  // Update transitions with readable names
  const updatedTransitions = dfaTransitions.map(t => ({
    from: stateMapping.get(t.from)!,
    to: stateMapping.get(t.to)!,
    symbol: t.symbol
  }));
  
  const finalStates = states.filter(s => s.isFinal).map(s => s.id);
  const startStateId = stateMapping.get(startKey)!;
  
  return {
    states,
    alphabet,
    transitions: updatedTransitions,
    startState: startStateId,
    finalStates
  };
}

export function convertRegexToDFA(regex: string): DFADefinition {
  try {
    // Reset state counter for each conversion
    stateCounter = 0;
    
    // Parse regex and extract alphabet
    const { ast, alphabet } = parseRegex(regex);
    const alphabetArray = Array.from(alphabet).sort();
    
    // Handle empty regex
    if (ast.type === 'empty' && alphabetArray.length === 0) {
      return {
        states: [{ id: 'q0', label: 'q0', isStart: true, isFinal: true }],
        alphabet: ['a', 'b'],
        transitions: [],
        startState: 'q0',
        finalStates: ['q0']
      };
    }
    
    // Build NFA from AST using Thompson's construction
    const nfa = buildNFA(ast);
    
    // Convert NFA to DFA using subset construction
    const dfa = convertNFAToDFA(nfa, alphabetArray);
    
    // Validate the result
    if (dfa.states.length === 0) {
      throw new Error('Generated DFA has no states');
    }
    
    return dfa;
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to convert regex "${regex}": ${message}`);
  }
}