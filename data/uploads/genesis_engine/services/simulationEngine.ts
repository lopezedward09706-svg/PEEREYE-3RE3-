
import { ABCNode, Quark, Atom, SimulationParameters, GlobalState, NodeType, PhysicalConstants, Vector3, ParticleClass, CosmicPhase } from '../types';
import { CONSTANTS } from '../constants';

const crossProduct = (v1: Vector3, v2: Vector3): Vector3 => ({
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.y,
    z: v1.x * v2.y - v1.y * v2.x
});

const dotProduct = (v1: Vector3, v2: Vector3): number => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;

const vectorNorm = (v: Vector3): number => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

const normalizeVector = (v: Vector3): Vector3 => {
    const n = vectorNorm(v) || 1;
    return { x: v.x / n, y: v.y / n, z: v.z / n };
};

export class SimulationEngine {
    state: GlobalState;
    private idCounter = 0;
    private atomCounter = 0;
    private quarkCounter = 0;
    private currentRigidity = 1.0;
    private interactionGradientSum = 0;
    private interactionCount = 0;
    private totalStructuralTension = 0;
    private totalRotations = 0;
    private anomaliesDetected = 0;
    private massAuditResidual = 0;
    private experimentalDeviance = 0;
    private standardCompatibility = 1.0;
    private newtonianError = 0;
    private refractiveIndex = 1.0;
    private snellDeviance = 0;
    private initialTotalVorticity = 0;
    private vorticityDeviance = 0;
    private gradientDeviance = 0;

    constructor(params: SimulationParameters) {
        this.currentRigidity = params.initialRigidity || 10.0;
        this.state = {
            nodes: [], atoms: [], quarks: [], time: 0, running: false,
            currentPhase: 'PRIMORDIAL',
            parameters: { ...params, stabilityLimit: params.stabilityLimit || 2.0 },
            constants: { ...CONSTANTS },
            expansionFactor: 1.0,
            statistics: { 
                meanEnergy: 0, entropy: 0, complexity: 0, entanglementIndex: 0, 
                coherenceLevel: 1.0, quantumCoherence: 1.0, hubbleFlow: 0, curvature: 0, avgZeta: 1.0, 
                avgBindingEnergy: 0, totalResidualMass: 0, averageCharge: 0, totalAtoms: 0, 
                currentRigidity: this.currentRigidity, totalVorticity: 0, avgInteractionGradient: 0,
                avgEntangledStability: 1.0, structuralTension: 0, totalRotations: 0, anomaliesDetected: 0,
                massAuditResidual: 0, experimentalDeviance: 0, standardCompatibility: 1.0,
                newtonianError: 0, refractiveIndex: 1.0, snellDeviance: 0, vorticityDeviance: 0,
                gradientDeviance: 0, avgStability: 1.0, totalProtons: 0, lockingDeviance: 0, topologyError: 0
            },
            fabricDeformation: [], entangledPairs: [], recentCollapses: [],
            sharedMemory: { 
                userDeductions: "", evolutionLogs: [], pendingActions: [], physicalViolations: [],
                externalCosmoData: [], peerReports: {}
            }
        };
        this.initializeNodes();
    }

    initializeNodes() {
        this.state.nodes = []; this.state.atoms = []; this.state.quarks = []; this.state.entangledPairs = [];
        this.state.recentCollapses = []; this.state.expansionFactor = 1.0; this.state.time = 0;
        this.currentRigidity = this.state.parameters.initialRigidity;
        this.state.currentPhase = 'PRIMORDIAL';
        
        const p = this.state.parameters;
        for (let i = 0; i < p.n_abc; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = (0.2 + Math.random() * 0.4) / (p.density || 1);
            this.state.nodes.push({
                id: ++this.idCounter, type: 'a', particleClass: 'vacuum',
                x: r * Math.cos(angle), y: r * Math.sin(angle), z: (Math.random()-0.5)*0.1,
                vecA: { x: 1, y: 0, z: 0 }, vecB: { x: -0.5, y: Math.sqrt(3)/2, z: 0 }, vecC: { x: -0.5, y: -Math.sqrt(3)/2, z: 0 },
                topologicalCharge: 0, hamiltonianTension: 0, spinVorticity: 0, stabilityStatus: 1.0,
                bindingEnergy: 0, resonanceFreq: 0.5 + Math.random() * 2, nucleusId: null, zeta: 1.0,
                residualMass: 0, color: '#4fc3f7', velocity: { x: (Math.random()-0.5)*0.01, y: (Math.random()-0.5)*0.01, z: 0 },
                vibrationPhase: Math.random() * Math.PI * 2, isCollapsed: false, accumulatedAction: 0,
                superposition: 0, effectiveMass: 0, spinVector: { x: 0, y: 0, z: 1 }, accumulatedAngle: 0,
                fractionalFlag: false, previousVecB: { x: -0.5, y: Math.sqrt(3)/2, z: 0 }, closureError: 0
            });
        }
        this.calculateUniverseStats();
        this.initialTotalVorticity = this.state.statistics.totalVorticity;
    }

    update() {
        if (!this.state.parameters) return;
        const dt = 0.016 * this.state.parameters.timeSpeed;
        const p = this.state.parameters;
        this.state.time += dt;

        this.updatePhases();
        this.updateParticlePhysics(dt);
        this.updateStructuralIntegrity(dt);
        this.updateTopologicalIntegrity(dt);
        this.updateMassAudit(dt);
        this.updateEmpiricalValidation(dt); 
        this.updateStandardAudit(dt); 
        this.updateInteractions(dt);
        this.updateQuarkDynamics(dt);
        this.updateNucleonSynthesis(dt);
        this.updateSnellValidation(dt); 
        this.updateEntanglement(dt);
        this.calculateUniverseStats();
    }

    private updateSnellValidation(dt: number) {
        const p = this.state.parameters;
        this.refractiveIndex = Math.sqrt(this.currentRigidity * p.density) / (p.radioPi + 0.1);
        const theta1 = 45 * (Math.PI / 180);
        const sinTheta2 = (1.0 / (this.refractiveIndex + 0.001)) * Math.sin(theta1);
        if (sinTheta2 <= 1.0) {
            this.snellDeviance = Math.abs(Math.asin(sinTheta2) - (theta1 * 0.8));
        }
    }

    private updateQuarkDynamics(dt: number) {
        const p = this.state.parameters;
        this.state.quarks.forEach(q => {
            q.position.x += q.velocity.x * dt;
            q.position.y += q.velocity.y * dt;
            q.velocity.x *= 0.98; q.velocity.y *= 0.98;
        });
    }

    private updateNucleonSynthesis(dt: number) {
        const p = this.state.parameters;
        const freeQuarks = this.state.quarks.filter(q => q.nucleonId === null);
        if (freeQuarks.length >= 3) {
            const cluster = freeQuarks.slice(0, 3);
            const nucleon: Atom = {
                id: ++this.atomCounter, type: 'proton', mass: 1.0,
                position: { x: cluster[0].position.x, y: cluster[0].position.y },
                velocity: { x: 0, y: 0 }, quarks: cluster.map(q => q.id), stability: 1.0
            };
            cluster.forEach(q => q.nucleonId = nucleon.id);
            this.state.atoms.push(nucleon);
        }
    }

    private updateStandardAudit(dt: number) {
        const nodes = this.state.nodes.filter(n => !n.isCollapsed);
        if (nodes.length < 2) return;
        let err = 0;
        for (let i = 0; i < Math.min(nodes.length, 20); i++) {
            const acc = vectorNorm(nodes[i].velocity) / (dt || 0.001);
            err += Math.abs(acc - 0.05 / (nodes[i].effectiveMass + 0.01));
        }
        this.newtonianError = err / 20;
        this.standardCompatibility = Math.max(0, 1.0 - (this.newtonianError * 0.1));
    }

    private updatePhases() {
        const complexity = this.state.statistics.complexity;
        if (complexity > 50) this.state.currentPhase = 'COSMIC';
        else if (complexity > 20) this.state.currentPhase = 'STELLAR';
        else if (this.state.atoms.length > 0) this.state.currentPhase = 'ATOMIC';
        else this.state.currentPhase = 'PRIMORDIAL';
    }

    private updateEmpiricalValidation(dt: number) {
        const protons = this.state.atoms.filter(n => n.type === 'proton');
        this.experimentalDeviance = protons.length > 0 ? Math.abs(protons[0].mass - 1.0) : 0;
    }

    private updateMassAudit(dt: number) {
        let total = 0;
        this.state.nodes.forEach(n => {
            if (n.isCollapsed) return;
            const sumV = { x: n.vecA.x + n.vecB.x + n.vecC.x, y: n.vecA.y + n.vecB.y + n.vecC.y, z: n.vecA.z + n.vecB.z + n.vecC.z };
            n.closureError = vectorNorm(sumV);
            total += n.closureError;
            n.residualMass = n.closureError * 0.1;
        });
        this.massAuditResidual = total;
    }

    private updateTopologicalIntegrity(dt: number) {
        this.state.nodes.forEach(n => {
            if (n.isCollapsed) return;
            const dot = dotProduct(normalizeVector(n.vecB), normalizeVector(n.previousVecB));
            n.accumulatedAngle += Math.acos(Math.max(-1, Math.min(1, dot)));
            n.previousVecB = { ...n.vecB };
            if (n.accumulatedAngle > 2 * Math.PI) { this.totalRotations++; n.accumulatedAngle -= 2 * Math.PI; }
        });
    }

    private updateStructuralIntegrity(dt: number) {
        const nodes = this.state.nodes.filter(n => !n.isCollapsed);
        const target = 0.1 * this.state.parameters.radioPi;
        let tension = 0;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < Math.min(i + 5, nodes.length); j++) {
                const d = Math.sqrt(Math.pow(nodes[i].x-nodes[j].x, 2) + Math.pow(nodes[i].y-nodes[j].y, 2));
                tension += Math.abs(d - target);
            }
        }
        this.totalStructuralTension = tension / (nodes.length * 5 || 1);
    }

    private updateParticlePhysics(dt: number) {
        const p = this.state.parameters;
        this.state.nodes.forEach(n => {
            if (n.isCollapsed) return;
            const crossBC = crossProduct(n.vecB, n.vecC);
            n.vecA.x += p.couplingLambda * crossBC.x * dt;
            n.vecA.y += p.couplingLambda * crossBC.y * dt;
            n.vecA.z += p.couplingLambda * crossBC.z * dt;
            const triple = dotProduct(n.vecA, crossBC);
            n.topologicalCharge = Math.tanh(triple);
            n.zeta = vectorNorm(n.vecC) / (vectorNorm(n.vecA) + 1e-9);
            n.hamiltonianTension = (this.currentRigidity / 2) * (Math.pow(vectorNorm(n.vecA)*vectorNorm(n.vecB), 2) - 1);
            n.effectiveMass = Math.max(0.01, Math.abs(n.hamiltonianTension) * 0.1);
            n.stabilityStatus = Math.max(0, 1.0 - (Math.abs(n.topologicalCharge) * n.effectiveMass * 0.1));
            n.vibrationPhase += (n.resonanceFreq + n.spinVorticity) * dt;
        });
    }

    private updateInteractions(dt: number) {
        const nodes = this.state.nodes.filter(n => !n.isCollapsed);
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x; const dy = nodes[i].y - nodes[j].y;
                const d2 = dx*dx + dy*dy + 0.001;
                const force = (nodes[i].topologicalCharge * nodes[j].topologicalCharge) / d2 * 0.001;
                nodes[i].velocity.x += (dx/Math.sqrt(d2)) * force * dt;
                nodes[i].velocity.y += (dy/Math.sqrt(d2)) * force * dt;
                nodes[j].velocity.x -= (dx/Math.sqrt(d2)) * force * dt;
                nodes[j].velocity.y -= (dy/Math.sqrt(d2)) * force * dt;
            }
        }
        nodes.forEach(n => { n.x += n.velocity.x * dt; n.y += n.velocity.y * dt; n.velocity.x *= 0.95; n.velocity.y *= 0.95; });
    }

    private updateEntanglement(dt: number) {
        const nodes = this.state.nodes.filter(n => !n.isCollapsed);
        if (this.state.entangledPairs.length < 5 && nodes.length >= 2) {
            this.state.entangledPairs.push({ id1: nodes[0].id, id2: nodes[1].id, strength: 1.0, frequency: 1.0 });
        }
        this.state.entangledPairs.forEach(p => p.strength = Math.max(0, p.strength - 0.001 * dt));
        this.state.entangledPairs = this.state.entangledPairs.filter(p => p.strength > 0);
    }

    private calculateUniverseStats() {
        const nodes = this.state.nodes;
        const activeNodes = nodes.filter(n => !n.isCollapsed);
        const avgStability = activeNodes.length > 0 ? activeNodes.reduce((a, b) => a + b.stabilityStatus, 0) / activeNodes.length : 1.0;
        const avgZeta = nodes.reduce((a, b) => a + b.zeta, 0) / nodes.length;
        this.state.statistics = {
            ...this.state.statistics, totalAtoms: this.state.atoms.length, avgStability, avgZeta,
            complexity: (nodes.length / 100) + (this.state.atoms.length * 10),
            structuralTension: this.totalStructuralTension, totalRotations: this.totalRotations,
            massAuditResidual: this.massAuditResidual, standardCompatibility: this.standardCompatibility,
            snellDeviance: this.snellDeviance, coherenceLevel: avgStability * (1.0 - this.snellDeviance),
            totalVorticity: nodes.reduce((a, b) => a + b.spinVorticity, 0)
        };
    }

    updateParams(p: Partial<SimulationParameters>) { this.state.parameters = { ...this.state.parameters, ...p }; }
    reset() { this.initializeNodes(); }
    getMetrics() { return { ...this.state.statistics, phase: this.state.currentPhase }; }
}
