
export enum SimulationMode {
  VIA_A = 'Via A: Einstein (Constant c)',
  VIA_B = 'Via B: R-QNT (Variable c)'
}

export enum AppTab {
  SIMULATOR = 'SIMULATOR',
  PAPER = 'PAPER',
  ASSISTANT = 'ASSISTANT',
  RESEARCHER = 'RESEARCHER'
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface RQNTConfig {
  elasticity: number;
  torsion: number;
  density: number;
  interactionStrength: number;
  maxInteractionDist: number;
  dt: number;
}

export interface Node {
  position: Vector3D;
  velocity: Vector3D;
  force: Vector3D;
}

export interface RQNTString {
  id: string;
  color: string;
  nodes: Node[];
}

export interface ValidationReport {
  coherenceIndex: number;
  residualTorsion: number;
  localTension?: number;
  baryonicMass?: number;
  status: 'ESTABLE' | 'CRÍTICO' | 'FLUJO LAMINAR' | 'SÍNTESIS_NEUTRON' | 'NUDO_ESTABLE' | 'FLUJO_RADIANTE' | 'ENLACE_COHERENTE' | 'REPULSION_TOPOLOGICA' | 'MATERIA_ESTABLE_NEUTRON' | 'REINTENTANDO_SINCRO' | 'ESTRÉS_TOTAL' | 'CRISTALIZACIÓN';
  verdict: string;
  timestamp: string;
  torsionVector?: [number, number, number];
  linkageData?: {
    distance: number;
    force: number;
  };
  stressMetrics?: {
    resilience: number;
    gravitationalMass: number;
  };
}
