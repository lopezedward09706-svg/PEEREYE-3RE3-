
export type NodeType = 'a' | 'b' | 'c';
export type ParticleClass = 'proton' | 'neutron' | 'electron-node' | 'vacuum';
export type CosmicPhase = 'PRIMORDIAL' | 'HADRONIC' | 'ATOMIC' | 'MOLECULAR' | 'STELLAR' | 'COSMIC';
export type Severity = 'INFO' | 'WARN' | 'ERROR';
export type TaskType = 'ANALYSIS' | 'GENERATION' | 'CORRECTION' | 'CODE_SCAN' | 'ENTANGLEMENT' | 'OBSERVATION' | 'OPTIMIZATION' | 'COLLAPSE' | 'QUANTUM_SYNC' | 'VALIDATION' | 'DATA_SYNC' | 'STRUCTURAL_SURVEY' | 'TOPOLOGICAL_AUDIT' | 'MASS_AUDIT' | 'EMPIRICAL_VALIDATION' | 'STANDARD_AUDIT' | 'CORE_AUDIT' | 'PEER_REVIEW' | 'FINAL_SYNTHESIS';

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface PhysicalConstants {
    G: number;      // Gravitación
    c: number;      // Velocidad luz
    hbar: number;   // Planck reducida
    alpha: number;  // Estructura fina
    k_B: number;    // Boltzmann
}

export interface LogEntry {
    timestamp: string;
    text: string;
    severity: Severity;
    taskType: TaskType;
    tag: string;
    iaId: string;
}

export interface ABCNode {
    id: number;
    type: NodeType;
    particleClass: ParticleClass;
    x: number;
    y: number;
    z: number;
    vecA: Vector3;
    vecB: Vector3;
    vecC: Vector3;
    topologicalCharge: number; 
    hamiltonianTension: number; 
    spinVorticity: number;     
    stabilityStatus: number;   
    bindingEnergy: number;     
    resonanceFreq: number;     
    nucleusId: number | null;  
    zeta: number; 
    residualMass: number; 
    color: string;
    velocity: { x: number; y: number; z: number };
    vibrationPhase: number;
    isCollapsed: boolean;
    accumulatedAction: number;
    superposition: number; 
    effectiveMass: number;
    spinVector: Vector3;
    accumulatedAngle: number;
    fractionalFlag: boolean;
    previousVecB: Vector3;
    closureError: number;
}

export interface Quark {
    id: number;
    type: 'up' | 'down';
    charge: number; 
    mass: number;
    nodes: number[]; 
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    bindingEnergy: number;
    nucleonId: number | null; 
}

export interface Atom {
    id: number;
    type: 'proton' | 'neutron';
    mass: number;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    quarks: number[]; 
    stability: number;
}

export interface SimulationParameters {
    scale: number;
    n_abc: number;
    centralMass: number;
    timeSpeed: number;
    density: number;
    strongEnergy: number;
    darkEnergy: number; 
    hubbleConstant: number;
    curvatureK: number;
    planckConstant: number;
    radioPi: number;
    dimensionCount: number;
    couplingLambda: number; 
    rigidityK: number; 
    stabilityLimit: number; 
    atomicLockingStrength: number; 
    initialRigidity: number; 
    customEquations: string; 
}

export interface GlobalState {
    nodes: ABCNode[];
    atoms: Atom[];
    quarks: Quark[];
    time: number;
    currentPhase: CosmicPhase;
    running: boolean;
    parameters: SimulationParameters;
    constants: PhysicalConstants;
    expansionFactor: number; 
    statistics: {
        meanEnergy: number;
        entropy: number; 
        complexity: number;
        entanglementIndex: number;
        coherenceLevel: number;
        quantumCoherence: number; 
        hubbleFlow: number;
        curvature: number;
        avgZeta: number;
        avgBindingEnergy: number;
        totalResidualMass: number;
        averageCharge: number; 
        totalAtoms: number;
        currentRigidity: number; 
        totalVorticity: number;
        avgInteractionGradient: number;
        avgEntangledStability: number;
        structuralTension: number;
        totalRotations: number;
        anomaliesDetected: number;
        massAuditResidual: number;
        experimentalDeviance: number;
        standardCompatibility: number;
        newtonianError: number;
        refractiveIndex: number; 
        snellDeviance: number;   
        vorticityDeviance: number; 
        gradientDeviance: number;  
        avgStability: number; 
        totalProtons: number; 
        lockingDeviance: number; 
        topologyError: number; 
    };
    fabricDeformation: number[][];
    entangledPairs: {id1: number, id2: number, strength: number, frequency: number}[];
    recentCollapses: { x: number; y: number; time: number; id: number }[];
    sharedMemory: {
        userDeductions: string;
        evolutionLogs: string[];
        pendingActions: string[];
        physicalViolations: string[];
        externalCosmoData: string[];
        peerReports: Record<string, string>; 
    };
}

export interface ChatMessage {
    sender: string;
    message: string;
    color: string;
    timestamp: Date;
}

export interface IAState {
    confidence: number;
    running: boolean;
    lastResponse?: string;
    status: 'idle' | 'scanning' | 'repairing' | 'error' | 'evolving' | 'collapsing' | 'validating' | 'fetching' | 'reviewing';
}
