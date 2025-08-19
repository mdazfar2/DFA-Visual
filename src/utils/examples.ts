import { DFAExample } from '../types/dfa';

export const dfaExamples: DFAExample[] = [
  {
    name: "Ends with 01",
    description: "Accepts all binary strings that end with '01'",
    definition: {
      states: [
        { id: "q0", label: "q0", isStart: true, isFinal: false },
        { id: "q1", label: "q1", isStart: false, isFinal: false },
        { id: "q2", label: "q2", isStart: false, isFinal: true }
      ],
      alphabet: ["0", "1"],
      transitions: [
        { from: "q0", to: "q1", symbol: "0" },
        { from: "q0", to: "q0", symbol: "1" },
        { from: "q1", to: "q1", symbol: "0" },
        { from: "q1", to: "q2", symbol: "1" },
        { from: "q2", to: "q1", symbol: "0" },
        { from: "q2", to: "q0", symbol: "1" }
      ],
      startState: "q0",
      finalStates: ["q2"]
    }
  },
  {
    name: "Even number of 1s",
    description: "Accepts binary strings with an even number of 1s",
    definition: {
      states: [
        { id: "q0", label: "q0", isStart: true, isFinal: true },
        { id: "q1", label: "q1", isStart: false, isFinal: false }
      ],
      alphabet: ["0", "1"],
      transitions: [
        { from: "q0", to: "q0", symbol: "0" },
        { from: "q0", to: "q1", symbol: "1" },
        { from: "q1", to: "q1", symbol: "0" },
        { from: "q1", to: "q0", symbol: "1" }
      ],
      startState: "q0",
      finalStates: ["q0"]
    }
  },
  {
    name: "Starts with 1 and ends with 0",
    description: "Accepts binary strings that start with '1' and end with '0'",
    definition: {
      states: [
        { id: "q0", label: "q0", isStart: true, isFinal: false },
        { id: "q1", label: "q1", isStart: false, isFinal: false },
        { id: "q2", label: "q2", isStart: false, isFinal: true },
        { id: "q3", label: "q3", isStart: false, isFinal: false }
      ],
      alphabet: ["0", "1"],
      transitions: [
        { from: "q0", to: "q3", symbol: "0" },
        { from: "q0", to: "q1", symbol: "1" },
        { from: "q1", to: "q2", symbol: "0" },
        { from: "q1", to: "q1", symbol: "1" },
        { from: "q2", to: "q2", symbol: "0" },
        { from: "q2", to: "q1", symbol: "1" },
        { from: "q3", to: "q3", symbol: "0" },
        { from: "q3", to: "q3", symbol: "1" }
      ],
      startState: "q0",
      finalStates: ["q2"]
    }
  },
  {
    name: "Contains substring 101",
    description: "Accepts binary strings that contain the substring '101'",
    definition: {
      states: [
        { id: "q0", label: "q0", isStart: true, isFinal: false },
        { id: "q1", label: "q1", isStart: false, isFinal: false },
        { id: "q2", label: "q2", isStart: false, isFinal: false },
        { id: "q3", label: "q3", isStart: false, isFinal: true }
      ],
      alphabet: ["0", "1"],
      transitions: [
        { from: "q0", to: "q0", symbol: "0" },
        { from: "q0", to: "q1", symbol: "1" },
        { from: "q1", to: "q2", symbol: "0" },
        { from: "q1", to: "q1", symbol: "1" },
        { from: "q2", to: "q0", symbol: "0" },
        { from: "q2", to: "q3", symbol: "1" },
        { from: "q3", to: "q3", symbol: "0" },
        { from: "q3", to: "q3", symbol: "1" }
      ],
      startState: "q0",
      finalStates: ["q3"]
    }
  },
  {
    name: "Regex Examples",
    description: "Try these in the Regex tab: (a+b)*abb, a*b*, (a+b)*a(a+b)*",
    definition: {
      states: [
        { id: "q0", label: "q0", isStart: true, isFinal: false },
        { id: "q1", label: "q1", isStart: false, isFinal: true }
      ],
      alphabet: ["a", "b"],
      transitions: [
        { from: "q0", to: "q1", symbol: "a" },
        { from: "q1", to: "q1", symbol: "a" },
        { from: "q1", to: "q1", symbol: "b" }
      ],
      startState: "q0",
      finalStates: ["q1"]
    }
  }
];