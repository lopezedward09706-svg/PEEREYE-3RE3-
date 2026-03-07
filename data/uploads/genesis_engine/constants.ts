
import { SimulationParameters, PhysicalConstants } from './types';

export const CONSTANTS: PhysicalConstants = {
    G: 6.67430e-11,
    c: 299792458,
    hbar: 1.0545718e-34,
    alpha: 0.00729735,
    k_B: 1.380649e-23
};

export const IA_COLORS = {
    ia1: '#FF4444',
    ia2: '#4444FF',
    ia3: '#44FF44',
    ia4: '#FF44FF',
    ia5: '#FFFF44',
    ia6: '#44FFFF',
    ia7: '#FF8844',
    ia8: '#00FF9D', 
    ia9: '#C0C0C0', 
    system: '#4fc3f7',
    user: '#ffffff'
};

export const INITIAL_PARAMETERS: SimulationParameters = {
    scale: 6,
    n_abc: 180,
    centralMass: 1.0,
    timeSpeed: 1.0,
    density: 1.0,
    strongEnergy: 1.0,
    darkEnergy: 0.7, 
    hubbleConstant: 0.02,
    curvatureK: 0.0,
    planckConstant: 1.0,
    radioPi: 1.0,
    dimensionCount: 3.0,
    couplingLambda: 0.1,
    rigidityK: 1.0,
    stabilityLimit: 2.5,
    atomicLockingStrength: 8.0,
    initialRigidity: 10.0,
    customEquations: "Eb < 0\nZ_charge = Sum(q_node)\nZeta_Ratio = Norm(C)/Norm(A) -> 1.0"
};

export const PRESETS: Record<string, SimulationParameters> = {
    primordialSoup: { ...INITIAL_PARAMETERS, scale: 0, rigidityK: 10.0, density: 2.0, timeSpeed: 2.0 },
    standardModel: { ...INITIAL_PARAMETERS, scale: 2 },
    neutronStar: { ...INITIAL_PARAMETERS, scale: 8, density: 10, strongEnergy: 15 },
    planckSoup: { ...INITIAL_PARAMETERS, scale: 0, planckConstant: 2.0 },
    standardCosmos: { ...INITIAL_PARAMETERS, scale: 6 },
    atomicCrystal: { ...INITIAL_PARAMETERS, scale: 2, rigidityK: 5.0, density: 2.0, strongEnergy: 5.0 }
};

export const SCALE_LABELS = [
    'Planck', 'Subatómico', 'Atómico', 'Molecular', 'Micro', 'Celular', 
    'Humano', 'Planetario', 'Estelar', 'Galáctico', 'Cúmulo', 'Universo'
];
