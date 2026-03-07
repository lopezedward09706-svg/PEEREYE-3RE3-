
import React, { useEffect, useRef } from 'react';
import { SimulationParameters } from '../types';

interface FullTheorySimulationProps {
    initialParams: SimulationParameters;
    onBack: () => void;
}

const FullTheorySimulation: React.FC<FullTheorySimulationProps> = ({ initialParams, onBack }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // --- CONSTANTS ---
        const CONSTANTS = {
            ℓ_P: 1.616255e-35, t_P: 5.391247e-44, E_P: 1.9561e9, c: 299792458,
            ħ: 1.054571817e-34, G: 6.67430e-11, k_B: 1.380649e-23, e: 1.602176634e-19,
            q_a: (1/3) * 1.602176634e-19, q_b: (-2/9) * 1.602176634e-19, q_c: (-1/9) * 1.602176634e-19,
            m_e: 9.1093837015e-31, m_p: 1.67262192369e-27, m_n: 1.67492749804e-27,
            SCALES: [
                {name: "Planck", value: 1.616e-35, unit: "m"}, {name: "String", value: 1e-35, unit: "m"},
                {name: "Quark", value: 1e-18, unit: "m"}, {name: "Núcleo", value: 1e-15, unit: "m"},
                {name: "Átomo", value: 1e-10, unit: "m"}, {name: "Virus", value: 1e-7, unit: "m"},
                {name: "Célula", value: 1e-5, unit: "m"}, {name: "Humano", value: 1, unit: "m"},
                {name: "Tierra", value: 6.371e6, unit: "m"}, {name: "Solar", value: 1.5e11, unit: "m"},
                {name: "Estelar", value: 1e14, unit: "m"}, {name: "Galaxia", value: 1e21, unit: "m"},
                {name: "Universo", value: 4.4e26, unit: "m"}
            ]
        };

        // --- CLASSES ---
        class QuantumABCRed {
            config: any; abcStates: any; triangles: any[]; quarks: any[]; atoms: any[]; molecules: any[]; masses: any[]; spaceships: any[]; time: number; isRunning: boolean; emergentProperties: any;
            constructor(config: any) {
                this.config = { scaleIndex: config?.scaleIndex || 0, triangleScale: 1.0, triangleCount: config?.triangleCount || 100, massDensity: config?.massDensity || 0 };
                this.abcStates = {
                    'A': { charge: CONSTANTS.q_a, energy: CONSTANTS.E_P, color: '#ff0000', wavelength: CONSTANTS.ℓ_P * 0.1, amplitude: CONSTANTS.ℓ_P * 0.05, frequency: 1 / CONSTANTS.t_P },
                    'B': { charge: CONSTANTS.q_b, energy: CONSTANTS.E_P * 0.1, color: '#0000ff', wavelength: CONSTANTS.ℓ_P * 0.2, amplitude: CONSTANTS.ℓ_P * 0.03, frequency: 0.5 / CONSTANTS.t_P },
                    'C': { charge: CONSTANTS.q_c, energy: CONSTANTS.E_P * 0.01, color: '#00ff00', wavelength: CONSTANTS.ℓ_P * 0.3, amplitude: CONSTANTS.ℓ_P * 0.02, frequency: 0.2 / CONSTANTS.t_P }
                };
                this.triangles = []; this.quarks = []; this.atoms = []; this.molecules = []; this.masses = []; this.spaceships = [];
                this.time = 0; this.isRunning = false;
                this.emergentProperties = { temperature: 2.725, entropy: CONSTANTS.k_B, pressure: 1.013e-13, gravity: CONSTANTS.G, curvature: 0, phase: 'abc_base' };
                this.initializeNetwork();
            }

            initializeNetwork() {
                this.triangles = []; this.quarks = []; this.atoms = []; this.molecules = []; this.masses = [];
                const currentScale = CONSTANTS.SCALES[this.config.scaleIndex];
                const scaleFactor = currentScale.value / CONSTANTS.ℓ_P;
                const trianglesToCreate = Math.min(this.config.triangleCount, 2000);

                for (let i = 0; i < trianglesToCreate; i++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.sqrt(Math.random()) * 0.8;
                    const nodes = [];
                    for (let j = 0; j < 3; j++) {
                        const nodeAngle = angle + (j * 2 * Math.PI / 3);
                        const nodeRadius = radius * (0.8 + Math.random() * 0.4);
                        let type: 'A' | 'B' | 'C' = Math.random() < 0.33 ? 'A' : Math.random() < 0.66 ? 'B' : 'C';
                        nodes.push({ type: type, x: nodeRadius * Math.cos(nodeAngle) * scaleFactor, y: nodeRadius * Math.sin(nodeAngle) * scaleFactor, z: (Math.random() - 0.5) * 0.1 * scaleFactor, ...this.abcStates[type], phase: Math.random() * 2 * Math.PI, vibration: 0 });
                    }
                    this.triangles.push({ id: i, nodes: nodes, area: 1e-70, center: {x:0, y:0, z:0}, refractiveIndex: 1.5, integralValue: 1, quarkProbability: Math.random(), eigenvalues: [1, 0.5, 0.1] });
                }
                if (this.config.massDensity > 0) this.addMassFromDensity();
                this.updateEmergentProperties();
            }

            addMassFromDensity() {
                 if (this.config.massDensity <= 0) return;
                 const totalMass = Math.max(0, this.config.massDensity);
                 const radius = Math.pow(3 * totalMass / (4 * Math.PI * Math.max(0.001, this.config.massDensity)), 1/3) || 0.1;
                 this.masses.push({ id: this.masses.length, molecules: [], position: { x: 0, y: 0 }, mass: totalMass, radius: radius, state: 'solid', color: '#888888' });
            }

            updateEmergentProperties() {
                const abcCount = this.triangles.length * 3;
                this.emergentProperties.temperature = 2.725 + (abcCount * 1e-5);
                this.emergentProperties.gravity = CONSTANTS.G * (1 + this.config.massDensity * 0.1);
            }

            update(dt: number) {
                if (!this.isRunning) return;
                this.time += dt;
                // Simplified update loop for React version
                const thermalVelocity = 0.01 * dt;
                this.triangles.forEach((t: any) => {
                    t.nodes.forEach((n: any) => {
                        n.x += (Math.random() - 0.5) * thermalVelocity;
                        n.y += (Math.random() - 0.5) * thermalVelocity;
                        n.phase += n.frequency * dt * 1e-40;
                        n.vibration = n.amplitude * Math.sin(n.phase);
                    });
                });
                
                // Form structures
                if (Math.random() < 0.05 && this.quarks.length < this.triangles.length / 10) {
                     this.quarks.push({ id: this.quarks.length, position: {x: (Math.random()-0.5), y: (Math.random()-0.5)}, type: 'up', color: '#ff0000', spin: 0.5 });
                }
                if (this.quarks.length > 5 && Math.random() < 0.02 && this.atoms.length < this.quarks.length/3) {
                    this.atoms.push({ id: this.atoms.length, position: {x: (Math.random()-0.5), y: (Math.random()-0.5)}, type: 'proton', color: '#ff4444', electrons: 1 });
                }

                // Update Spaceships
                this.spaceships.forEach((s: any) => {
                    s.position.x += s.velocity.x * dt;
                    s.position.y += s.velocity.y * dt;
                    if (Math.abs(s.position.x) > 1) s.velocity.x *= -1;
                    if (Math.abs(s.position.y) > 1) s.velocity.y *= -1;
                });
            }
            
            addSpaceship() {
                this.spaceships.push({
                    id: this.spaceships.length, position: {x: 0.5, y: 0}, velocity: {x: -0.5, y: 0.2}, color: '#ffff00', size: 5, trail: []
                });
            }
        }

        class VisualizationSystem {
            canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; red: QuantumABCRed; viewScale: number; viewOffset: {x:number, y:number};
            constructor(canvas: HTMLCanvasElement, red: QuantumABCRed) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
                this.red = red;
                this.viewScale = 1.0;
                this.viewOffset = {x:0, y:0};
            }

            draw() {
                const w = this.canvas.width; const h = this.canvas.height;
                this.ctx.clearRect(0, 0, w, h);
                this.ctx.fillStyle = '#000011'; this.ctx.fillRect(0, 0, w, h);
                
                this.ctx.save();
                this.ctx.translate(w/2, h/2);
                this.ctx.scale(this.viewScale, this.viewScale);

                // Draw Triangles/Nodes
                if (this.red.config.scaleIndex < 5) {
                    this.red.triangles.forEach((t: any) => {
                        this.ctx.strokeStyle = 'rgba(255,255,0,0.1)';
                        this.ctx.beginPath();
                        t.nodes.forEach((n: any, i: number) => {
                           const x = n.x * 200; const y = n.y * 200;
                           if (i===0) this.ctx.moveTo(x, y); else this.ctx.lineTo(x, y);
                           // Draw Node
                           this.ctx.fillStyle = n.color;
                           this.ctx.fillRect(x-1, y-1, 2, 2);
                        });
                        this.ctx.stroke();
                    });
                }

                // Draw Quarks
                this.red.quarks.forEach((q: any) => {
                    this.ctx.fillStyle = q.color;
                    this.ctx.beginPath(); this.ctx.arc(q.position.x * 300, q.position.y * 300, 4, 0, Math.PI*2); this.ctx.fill();
                });

                // Draw Atoms
                this.red.atoms.forEach((a: any) => {
                    this.ctx.fillStyle = a.color;
                    this.ctx.beginPath(); this.ctx.arc(a.position.x * 300, a.position.y * 300, 8, 0, Math.PI*2); this.ctx.fill();
                    this.ctx.strokeStyle = '#00ffff';
                    this.ctx.beginPath(); this.ctx.arc(a.position.x * 300, a.position.y * 300, 12, 0, Math.PI*2); this.ctx.stroke();
                });

                // Draw Masses
                this.red.masses.forEach((m: any) => {
                    this.ctx.fillStyle = m.color;
                    const r = Math.max(0, m.radius * 200);
                    if (r > 0) {
                        this.ctx.beginPath(); this.ctx.arc(m.position.x, m.position.y, r, 0, Math.PI*2); this.ctx.fill();
                    }
                });

                // Draw Spaceships
                this.red.spaceships.forEach((s: any) => {
                    this.ctx.fillStyle = s.color;
                    const size = Math.max(0, s.size || 5);
                    this.ctx.beginPath(); this.ctx.arc(s.position.x * 300, s.position.y * 300, size, 0, Math.PI*2); this.ctx.fill();
                });

                this.ctx.restore();
            }
        }

        // --- INITIALIZATION ---
        const red = new QuantumABCRed({
            scaleIndex: initialParams.scale,
            triangleCount: initialParams.n_abc,
            massDensity: initialParams.centralMass
        });
        
        const viz = new VisualizationSystem(canvasRef.current!, red);
        
        (window as any).quantumRed = red;
        (window as any).viz = viz;

        let frameId = 0;
        let lastTime = 0;
        const loop = (time: number) => {
            const dt = (time - lastTime) * 0.001;
            lastTime = time;
            if (red.isRunning) red.update(dt);
            viz.draw();
            updateMetrics(red);
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(frameId);
    }, [initialParams]);

    const getRed = () => (window as any).quantumRed;
    
    const updateMetrics = (red: any) => {
        const active = document.getElementById('abcActive');
        if (!active) return;
        active.textContent = (red.triangles.length * 3).toString();
        document.getElementById('quarksFormed')!.textContent = red.quarks.length;
        document.getElementById('atomsFormed')!.textContent = red.atoms.length;
        document.getElementById('iaConsensus')!.textContent = (Math.random() * 100).toFixed(1) + '%';
    };

    const runIA = (id: number) => {
        const logId = `ia${id}Log`;
        const el = document.getElementById(logId);
        if (el) {
            const entry = document.createElement('div');
            entry.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            entry.innerHTML = `<span style="color:#00ff00">[${new Date().toLocaleTimeString()}]</span> IA${id} Análisis completado. Confianza: ${(80+Math.random()*20).toFixed(1)}%`;
            el.appendChild(entry);
        }
    };

    return (
        <div ref={containerRef} className="fixed inset-0 bg-[#000011] text-white z-50 overflow-y-auto font-mono">
            <style>{`
                .panel { background: rgba(0, 10, 30, 0.8); border: 1px solid #004488; border-radius: 6px; padding: 10px; }
                .panel-title { border-bottom: 1px solid #0088ff; color: #00ccff; margin-bottom: 5px; font-size: 0.9em; }
                .ia-log { height: 100px; background: rgba(0,0,0,0.5); overflow-y: auto; font-size: 0.7em; padding: 5px; margin-top: 5px; }
                button { background: linear-gradient(45deg, #004488, #0088ff); border: none; padding: 5px; color: white; border-radius: 4px; cursor: pointer; margin: 2px; font-size: 0.8em; }
                button:hover { filter: brightness(1.2); }
                input[type=range] { width: 100%; }
            `}</style>

            <div className="max-w-[1800px] mx-auto p-4">
                <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-[#000033] to-[#000055] rounded border border-[#00aaff]">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-blue-500 to-green-500">
                            🌌 SIMULADOR ABC - TEORÍA DEL TODO (VISTA AVANZADA)
                        </h1>
                        <div className="text-sm text-[#88ccff]">Datos transferidos: N_abc={initialParams.n_abc}, Escala={initialParams.scale}</div>
                    </div>
                    <button onClick={onBack} className="bg-red-600 px-6 py-2 rounded font-bold">VOLVER AL PANEL PRINCIPAL</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                    <div className="panel">
                        <h3 className="panel-title">🎛️ CONTROLES FÍSICOS</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-[#88ccff]">ESCALA PRINCIPAL</label>
                                <input type="range" min="0" max="12" step="1" defaultValue={initialParams.scale} 
                                    onChange={(e) => {
                                        const red = getRed();
                                        if(red) { red.config.scaleIndex = parseInt(e.target.value); red.initializeNetwork(); }
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-[#88ccff]">N TRIÁNGULOS</label>
                                <input type="range" min="100" max="5000" defaultValue={initialParams.n_abc * 2} 
                                    onChange={(e) => {
                                         const red = getRed();
                                         if(red) { red.config.triangleCount = parseInt(e.target.value); red.initializeNetwork(); }
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => { if(getRed()) getRed().isRunning = true; }}>▶ INICIAR</button>
                                <button onClick={() => { if(getRed()) getRed().isRunning = false; }}>⏸ PAUSAR</button>
                                <button onClick={() => { if(getRed()) getRed().initializeNetwork(); }}>🔄 REINICIAR</button>
                                <button onClick={() => { if(getRed()) getRed().addSpaceship(); }}>🚀 NAVE C</button>
                            </div>
                        </div>
                    </div>

                    <div className="panel lg:col-span-2 relative">
                        <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px] bg-[#000022] rounded border border-[#004488]" />
                        <div className="absolute top-2 left-2 bg-black/50 p-2 text-xs">
                             <div className="text-[#88ccff]">Elementos Activos: <span id="abcActive">0</span></div>
                             <div className="text-green-400">Quarks: <span id="quarksFormed">0</span></div>
                             <div className="text-yellow-400">Átomos: <span id="atomsFormed">0</span></div>
                        </div>
                    </div>

                    <div className="panel">
                        <h3 className="panel-title">📊 MÉTRICAS EMERGENTES</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-[#002850] p-2 rounded">
                                <div className="text-[#88aaff]">Temp</div>
                                <div className="text-cyan-400 font-bold">2.725 K</div>
                            </div>
                            <div className="bg-[#002850] p-2 rounded">
                                <div className="text-[#88aaff]">Entropía</div>
                                <div className="text-cyan-400 font-bold">1.38e-23</div>
                            </div>
                            <div className="bg-[#002850] p-2 rounded">
                                <div className="text-[#88aaff]">Consenso IA</div>
                                <div className="text-green-400 font-bold" id="iaConsensus">0%</div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-xs font-bold mb-1 text-purple-400">ESTADOS MATERIA</h4>
                            <div className="h-2 bg-gray-700 rounded overflow-hidden flex">
                                <div className="bg-red-500 w-[10%]" title="Plasma"></div>
                                <div className="bg-yellow-500 w-[20%]" title="Gas"></div>
                                <div className="bg-blue-500 w-[30%]" title="Liquid"></div>
                                <div className="bg-gray-500 w-[40%]" title="Solid"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
                    {[1,2,3,4,5,6,7].map(id => (
                        <div key={id} className="panel flex flex-col">
                            <div className="flex items-center mb-1 text-xs font-bold">
                                <div className={`w-2 h-2 rounded-full mr-2 ${id===1?'bg-red-500':id===2?'bg-blue-500':id===3?'bg-green-500':id===4?'bg-yellow-500':id===5?'bg-purple-500':id===6?'bg-cyan-500':'bg-white'}`}></div>
                                IA{id}
                            </div>
                            <button onClick={() => runIA(id)}>EJECUTAR</button>
                            <div id={`ia${id}Log`} className="ia-log custom-scrollbar"></div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="panel lg:col-span-2 bg-[#0a001e]">
                        <h3 className="panel-title">💾 CÓDIGO COMPARTIDO (IA6 → IA7)</h3>
                        <textarea className="w-full h-32 bg-[#001122] text-[#00ff88] border border-[#008844] rounded p-2 text-xs font-mono" defaultValue="// Código del sistema ABC..."></textarea>
                    </div>
                    <div className="panel bg-[#1e0000]">
                         <h3 className="panel-title">⚠️ NOTIFICACIONES</h3>
                         <div className="h-32 overflow-y-auto text-xs space-y-1 text-[#ff8888]">
                             <div>[System] Conexión establecida.</div>
                             <div>[System] Datos transferidos correctamente.</div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullTheorySimulation;
