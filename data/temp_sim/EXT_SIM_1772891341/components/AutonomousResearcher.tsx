
import React, { useState } from 'react';
import { SimulationMode, ValidationReport } from '../types';
import { validateSimulation, askGemini } from '../services/geminiService';
import { COLORS } from '../constants';

const AutonomousResearcher: React.FC<{ 
    mode: SimulationMode;
    synthesisActive: boolean;
    setSynthesisActive: (active: boolean) => void;
    onReportUpdate: (report: ValidationReport | null) => void;
}> = ({ mode, synthesisActive, setSynthesisActive, onReportUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [report, setReport] = useState<ValidationReport | null>(null);

  const updateReport = (newReport: ValidationReport | null) => {
    setReport(newReport);
    onReportUpdate(newReport);
  };

  const runResearchLoop = async () => {
    if (loading) return;
    setLoading(true);
    setLogs(["[SYSTEM] Initializing Evolutionary Simulation Loop...", "[DATA] Calibrating Triada A-B-C sensors..."]);
    
    await new Promise(r => setTimeout(r, 1000));
    setLogs(prev => [...prev, "[ALGO] Scanning Borromean linkage probability...", "[ALGO] Calculating Cartan Torsion Tensors..."]);
    
    await new Promise(r => setTimeout(r, 1000));
    setLogs(prev => [...prev, "[IA] Comparing with Minkowski metric constants...", "[IA] Generating final stability verdict..."]);

    const coherence = mode === SimulationMode.VIA_B ? Math.floor(Math.random() * 40) + 55 : Math.floor(Math.random() * 20) + 10;
    const verdict = await validateSimulation({ coherence, mode });

    const newReport: ValidationReport = {
      coherenceIndex: coherence,
      residualTorsion: 100 - coherence,
      status: coherence > 50 ? 'ESTABLE' : 'CRÍTICO',
      verdict: verdict || "Analysis failed.",
      timestamp: new Date().toLocaleTimeString()
    };

    updateReport(newReport);
    setLoading(false);
  };

  const runCrystallization = async () => {
    if (loading) return;
    setLoading(true);
    setLogs([
        "[LAB] MÓDULO DE CRISTALIZACIÓN R-QNT: SEQ-09 INITIATED.",
        "[DATA] Aplicando factor de Tensión c_local = 1.277685...",
        "[SYSTEM] Activando Link Sharing (Compartir hilos A-B-C)..."
    ]);

    await new Promise(r => setTimeout(r, 1500));

    // SEQ-09 Precise Logic from Python Script
    const precisionTension = 1.277685;
    const finalCoherence = 99.0;
    const simulatedBaryonicMass = 0.93827; // Normalized Baryonic Mass
    
    setLogs(prev => [...prev, 
        "[PHASE 1] Estabilizando núcleos mediante 'Longitud Consumida'.",
        "[PHASE 2] Aplicando Operador enlace_borromeo(n[i], n[i+1])...",
        `[PHASE 3] Coherencia global establecida en ${finalCoherence}%.`
    ]);

    await new Promise(r => setTimeout(r, 1000));

    setLogs(prev => [...prev, 
        "IA: RED DE MATERIA CRISTALIZADA. ESTABILIDAD BORROMEA TOTAL.",
        "[SUCCESS] SEQ-09: Baryonic lattice is now in Solid-State."
    ]);

    const verdict = await askGemini(`Technical Analysis: SEQ-09 Crystallization successful. 
    Metrics: Tension=1.277685, Coherence=99.0%. 
    Mechanism: Link Sharing and Borromean Interlock. 
    Explain the transition from separate A-B-C threads to a unified 'Solid-State' baryonic network where mass is defined by network length consumption.`);

    const newReport: ValidationReport = {
      coherenceIndex: finalCoherence,
      residualTorsion: 0.001,
      localTension: precisionTension,
      baryonicMass: simulatedBaryonicMass,
      status: 'CRISTALIZACIÓN',
      verdict: verdict || "Baryonic crystallization achieved. Stability Borromea Total.",
      timestamp: new Date().toLocaleTimeString()
    };
    updateReport(newReport);
    setLoading(false);
  };

  const runDualStressTest = async () => {
    if (loading) return;
    setLoading(true);
    setLogs([
        "[LAB] PROTOCOLO DE VALIDACIÓN DUAL: IMPACTO + GRAVEDAD INITIATED.",
        "[PHASE A] Iniciando pulso de choque. Energía: 500 Tera-Planck...",
        "[DATA] Triada A-B-C: absorbción de energía activada."
    ]);

    await new Promise(r => setTimeout(r, 1500));
    
    setLogs(prev => [...prev, 
        "[PHASE B] Midiendo deformación por consumo de longitud L...",
        "[DATA] IA: Calculando gradiente de tensión y radio de atracción..."
    ]);

    await new Promise(r => setTimeout(r, 1500));

    const resilience = 85 + Math.random() * 10; 
    const deltaL = 0.045 + Math.random() * 0.02; 

    setLogs(prev => [...prev, 
        `[SUCCESS] Resiliencia post-impacto: ${resilience.toFixed(2)}%`,
        `[GRAVITY] Masa Gravitatoria (Delta L): ${deltaL.toFixed(5)} units.`,
        `[STATUS] ESTRÉS_TOTAL: Validation complete.`
    ]);

    const verdict = await askGemini(`Technical Analysis: Dual Stress Protocol 'ejecutar_estres_total' results are in. Energy Pulse: 500 Tera-Planck. Resilience: ${resilience.toFixed(2)}%. Gravitational Mass (Delta L): ${deltaL.toFixed(5)}. Explain how resilience at high Planck energies validates the A-B-C Triada knot's structural integrity.`);

    const newReport: ValidationReport = {
      coherenceIndex: resilience,
      residualTorsion: 100 - resilience,
      status: 'ESTRÉS_TOTAL',
      stressMetrics: {
        resilience,
        gravitationalMass: deltaL
      },
      verdict: verdict || "Dual validation successful. Structural integrity confirmed.",
      timestamp: new Date().toLocaleTimeString()
    };
    updateReport(newReport);
    setLoading(false);
  };

  const runCartanAnalysis = async () => {
    if (loading) return;
    setLoading(true);
    setLogs([
        "[LAB] INITIALIZING CARTAN TORSION ANALYSIS...",
        "[DATA] Mapping local tension vectors for Triada A-B-C...",
    ]);

    await new Promise(r => setTimeout(r, 1200));

    const mockA = Math.random() * 1.5;
    const mockB = Math.random() * 1.5;
    const mockC = Math.random() * 1.5;
    const tensionN = Math.sqrt(mockA**2 + mockB**2 + mockC**2);
    
    setLogs(prev => [...prev, `[SENSORS] Local Tension Detected: ${tensionN.toFixed(4)}`]);

    if (tensionN > 0.5) {
        const tx = (mockB * 0.5) - (mockC * 0.5);
        const ty = (mockC * 0.5) - (mockA * 0.5);
        const tz = (mockA * 0.5) - (mockB * 0.5);

        setLogs(prev => [...prev, 
            `[CARTAN] Torsion threshold exceeded (>0.5).`,
            `[GEOMETRY] Generating topological volume via Cartan Cross Product.`,
            `[STATUS] TRANSFORMATION: NUDO_ESTABLE (Matter Synthesis)`
        ]);

        const verdict = await askGemini(`Analyze the transition from laminar flow to a 'Nudo Estable' (Stable Knot) in R-QNT where tension is ${tensionN} and the torsion vector is [${tx}, ${ty}, ${tz}]. Focus on the emergence of matter from pure network friction.`);

        const newReport: ValidationReport = {
            coherenceIndex: 94,
            residualTorsion: 6,
            status: 'NUDO_ESTABLE',
            torsionVector: [tx, ty, tz],
            verdict: verdict || "Topological knot confirmed as stable matter.",
            timestamp: new Date().toLocaleTimeString()
        };
        updateReport(newReport);
    } else {
        setLogs(prev => [...prev, 
            `[CARTAN] Tension below vacuum threshold. Space remains flat.`,
            `[STATUS] STATE: FLUJO_RADIANTE (Pure Radiant Energy)`
        ]);

        const newReport: ValidationReport = {
            coherenceIndex: 25,
            residualTorsion: 75,
            status: 'FLUJO_RADIANTE',
            verdict: "Energy remains in a radiant laminar flow. No matter synthesis detected.",
            timestamp: new Date().toLocaleTimeString()
        };
        updateReport(newReport);
    }

    setLoading(false);
  };

  const runPhaseCorrection = async () => {
    if (!report || report.status !== 'REPULSION_TOPOLOGICA' || loading) return;

    setLoading(true);
    setLogs(prev => [...prev, 
        "[IA] Detectada colisión de fase. Ajustando Quiralidad Z...",
        "[PROTOCOL] Invirtiendo el spin del Nodo B para buscar condición de 'Engranaje'...",
        "[SYSTEM] Bajando tensión global (-0.05) para permitir estiramiento de red (L)...",
        "[STATUS] REINTENTANDO_SINCRO..."
    ]);

    await new Promise(r => setTimeout(r, 1500));
    
    const dist = report.linkageData?.distance || 0.45;
    const coherence = 0.98; 
    const forceLink = 2.334;

    setLogs(prev => [...prev, 
        "[SUCCESS] Z-Chirality inverted successfully.",
        "[REPORT] ENLACE COHERENTE FORMADO (Post-Correction).",
        "[PHYSICS] Matter density locking achieved."
    ]);

    const verdict = await askGemini(`Technical Analysis: Phase correction module 'corregir_fase_topologica' successfully resolved a topological repulsion. Explain the mechanism of Z-Chirality inversion as a 'gear-locking' analogy for A-B-C Triada linkage.`);

    const newReport: ValidationReport = {
      coherenceIndex: 98.2,
      residualTorsion: 0.1,
      status: 'ENLACE_COHERENTE',
      linkageData: { distance: dist, force: forceLink },
      verdict: verdict || "Coherent linkage established after topological phase correction.",
      timestamp: new Date().toLocaleTimeString()
    };
    updateReport(newReport);
    setLoading(false);
  };

  const runLinkageAnalysis = async () => {
    if (loading) return;
    setLoading(true);
    setLogs([
      "[LAB] INITIALIZING LINKAGE PROTOCOL (verificar_enlace_coherente)...",
      "[DATA] Evaluating Alpha-Beta node proximity...",
      "[SYSTEM] Monitoring phase synchronization..."
    ]);

    await new Promise(r => setTimeout(r, 1500));

    const dist = Math.random() * 1.2; 
    const coherence = Math.random(); 

    setLogs(prev => [...prev, `[SENSORS] Inter-node distance: ${dist.toFixed(3)}m (Threshold: 0.65m)`]);
    setLogs(prev => [...prev, `[DATA] Phase Coherence: ${coherence.toFixed(4)} (Threshold: 0.95)`]);

    if (dist <= 0.65) {
      if (coherence > 0.95) {
        const forceLink = 2.334;
        setLogs(prev => [...prev, 
          `[REPORT] ENLACE COHERENTE FORMADO.`,
          `[VÍNCULO] Link Force: ${forceLink} (Standard R-QNT).`,
          `[GRAVITY] Applying Delta L length consumption...`
        ]);
        
        const verdict = await askGemini(`Scientific Report: COHERENT LINKAGE FORMED (Force: 2.334). Explain how the consumption of network length (Delta L) generates mass in the R-QNT model.`);

        const newReport: ValidationReport = {
          coherenceIndex: 99.8,
          residualTorsion: 0.2,
          status: 'ENLACE_COHERENTE',
          linkageData: { distance: dist, force: forceLink },
          verdict: verdict || "Coherent linkage established.",
          timestamp: new Date().toLocaleTimeString()
        };
        updateReport(newReport);
      } else {
        setLogs(prev => [...prev, 
          `[WARNING] Phase sync failed (Coherence < 0.95).`,
          `[REPULSION] Topological turbulence prevents locking.`,
          `[STATUS] REPULSION_TOPOLOGICA.`
        ]);

        const newReport: ValidationReport = {
          coherenceIndex: 34,
          residualTorsion: 66,
          status: 'REPULSION_TOPOLOGICA',
          linkageData: { distance: dist, force: -0.5 },
          verdict: "Incoherent phase alignment. Topological repulsion detected. Use 'Phase Correction' module.",
          timestamp: new Date().toLocaleTimeString()
        };
        updateReport(newReport);
      }
    } else {
      setLogs(prev => [...prev, "[DATA] Nodes too distant for coherent locking. Radius > 0.65m."]);
      updateReport(null);
    }
    setLoading(false);
  };

  const runSynthesis = async () => {
    if (loading) return;
    setLoading(true);
    setLogs([
        "[LAB] PROTOCOLO DE SÍNTESIS DE NEUTRÓN R-QNT-004 INITIATED.",
        "[DATA] Verificando Coherencia (Umbral 91%)...",
        "[SYSTEM] Monitoring net torsion cancellation..."
    ]);

    await new Promise(r => setTimeout(r, 2000));
    
    const simulatedCoherence = mode === SimulationMode.VIA_B ? 91 + Math.random() * 8 : 45 + Math.random() * 20;
    setLogs(prev => [...prev, `[SENSORS] Red Coherencia: ${simulatedCoherence.toFixed(2)}%`]);

    if (simulatedCoherence >= 91 && mode === SimulationMode.VIA_B) {
        setLogs(prev => [...prev, 
            "[SUCCESS] Coherencia validada (>= 91%).",
            "[SYSTEM] Cancelación de Torsión Macroscópica exitosa.",
            "[GRAVITY] Incremento de Tensión detectado. Elasticidad local (c_local) = 1.4726.",
            "[REPORT] SÍNTESIS EXITOSA. MASA GENERADA POR POTENCIAL ELÁSTICO."
        ]);
        setSynthesisActive(true);
        
        const verdict = await askGemini("R-QNT-004 Report: Successful Neutron Synthesis. Explain the heavier mass of the neutron through relational network tension.");
        
        const newReport: ValidationReport = {
            coherenceIndex: simulatedCoherence,
            residualTorsion: 0.05,
            localTension: 1.4726,
            status: 'MATERIA_ESTABLE_NEUTRON',
            verdict: verdict || "Neutron crystallization confirmed.",
            timestamp: new Date().toLocaleTimeString()
        };
        updateReport(newReport);
    } else {
        setLogs(prev => [...prev, 
            "[FAILURE] Synthesis aborted. Torsion remains non-zero or Mode Via A active."
        ]);
        setSynthesisActive(false);
        updateReport(null);
    }
    setLoading(false);
  };

  const downloadReport = () => {
    if (!report) return;
    const content = `--- INFORME AUTO-GENERADO R-QNT ---
Fecha Simulación: ${new Date().toLocaleDateString()} ${report.timestamp}
Coherencia: ${report.coherenceIndex.toFixed(2)}%
Estado: ${report.status}
Veredicto IA: ${report.verdict}
-----------------------------------
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rqnt_research_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-atom text-amber-500"></i>
              Autonomous Research Lab
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-tighter">AI Core // Multimodal Physics Validation</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={runResearchLoop} disabled={loading} className={`px-3 py-2 rounded-lg font-bold text-[9px] uppercase transition-all ${loading ? 'bg-zinc-800 text-zinc-600' : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'}`}>
                Stability
            </button>
            <button onClick={runCartanAnalysis} disabled={loading} className={`px-3 py-2 rounded-lg font-bold text-[9px] uppercase transition-all ${loading ? 'bg-zinc-800 text-zinc-600' : 'bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-400 border border-cyan-700'}`}>
                Cartan
            </button>
            <button onClick={runLinkageAnalysis} disabled={loading} className={`px-3 py-2 rounded-lg font-bold text-[9px] uppercase transition-all ${loading ? 'bg-zinc-800 text-zinc-600' : 'bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/10'}`}>
                Linkage
            </button>
            <button onClick={runDualStressTest} disabled={loading} className={`px-3 py-2 rounded-lg font-bold text-[9px] uppercase transition-all ${loading ? 'bg-zinc-800 text-zinc-600' : 'bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-700 shadow-lg shadow-red-900/20'}`}>
                Dual Stress
            </button>
            <button onClick={runCrystallization} disabled={loading} className={`px-3 py-2 rounded-lg font-bold text-[9px] uppercase transition-all ${loading ? 'bg-zinc-800 text-zinc-600' : 'bg-white border-2 border-white hover:bg-zinc-200 text-black shadow-xl animate-pulse'}`}>
                Crystallize (SEQ-09)
            </button>
            <button onClick={runSynthesis} disabled={loading} className={`px-4 py-2 rounded-lg font-bold text-[9px] uppercase transition-all ${loading ? 'bg-zinc-800 text-zinc-600' : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20'}`}>
                Synthesis
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black rounded-lg border border-zinc-800 p-4 h-64 overflow-y-auto font-mono text-[10px] text-green-500 scrollbar-thin scrollbar-thumb-zinc-800">
            {logs.length === 0 && <span className="text-zinc-700 italic">Laboratorio listo para órdenes...</span>}
            {logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
            {loading && <div className="animate-pulse">_</div>}
          </div>

          <div className="bg-zinc-800/30 rounded-lg border border-zinc-700/50 p-6 flex flex-col justify-center gap-4">
             {report ? (
               <>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <p className="text-[10px] text-zinc-500 uppercase">Coherence Index</p>
                        <p className={`text-3xl font-mono ${report.coherenceIndex >= 90 ? 'text-green-500' : 'text-red-500'}`}>{report.coherenceIndex.toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-zinc-500 uppercase">Residual Torsion</p>
                        <p className="text-3xl font-mono text-white">{report.residualTorsion.toFixed(3)}Δ</p>
                    </div>
                </div>
                <div className={`mt-2 py-1 px-3 rounded-full text-[10px] font-bold text-center border transition-all ${
                    report.status === 'CRISTALIZACIÓN' ? 'bg-zinc-100 text-black border-white shadow-lg shadow-white/20' :
                    report.status === 'MATERIA_ESTABLE_NEUTRON' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' :
                    report.status === 'REPULSION_TOPOLOGICA' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    report.status === 'ESTRÉS_TOTAL' ? 'bg-red-600/20 text-red-400 border-red-500/30' :
                    'bg-green-500/10 text-green-500 border-green-500/20'
                }`}>
                    STATUS: {report.status} {report.status === 'CRISTALIZACIÓN' && ' (SOLID-STATE)'}
                </div>

                {report.localTension && (
                    <div className="mt-2 p-2 bg-black/40 rounded border border-zinc-700/50">
                        <p className="text-[9px] text-zinc-500 font-mono uppercase mb-1">SEQ-09 Tension Global</p>
                        <p className="text-[10px] font-mono text-white">Value: {report.localTension} Δ_c</p>
                    </div>
                )}

                {report.baryonicMass && (
                    <div className="mt-2 p-2 bg-black/40 rounded border border-zinc-700/50">
                        <p className="text-[9px] text-zinc-500 font-mono uppercase mb-1">Nucleon Mass (Consumo de L)</p>
                        <p className="text-[10px] font-mono text-cyan-400">{report.baryonicMass} GeV/c² (Equivalent)</p>
                    </div>
                )}

                {report.stressMetrics && (
                    <div className="mt-2 p-2 bg-black/40 rounded border border-zinc-700/50 space-y-2">
                        <p className="text-[9px] text-zinc-500 font-mono uppercase border-b border-zinc-800 pb-1">Dual Stress Results</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-[8px] text-zinc-500 uppercase">Resilience</p>
                                <p className="text-[10px] font-mono text-white">{report.stressMetrics.resilience.toFixed(2)}%</p>
                            </div>
                            <div>
                                <p className="text-[8px] text-zinc-500 uppercase">Grav. Mass (ΔL)</p>
                                <p className="text-[10px] font-mono text-amber-500">{report.stressMetrics.gravitationalMass.toFixed(5)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {report.status === 'REPULSION_TOPOLOGICA' && (
                    <button 
                        onClick={runPhaseCorrection}
                        disabled={loading}
                        className="mt-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold uppercase shadow-lg animate-pulse disabled:opacity-50"
                    >
                        <i className="fas fa-wrench mr-2"></i> Correct Phase (Z-Chirality)
                    </button>
                )}
               </>
             ) : (
               <div className="text-center text-zinc-600 italic py-10">
                 No active validation session. Launch Stability, Linkage, Stress, Crystallize or Synthesis.
               </div>
             )}
          </div>
        </div>
      </div>

      {report && (
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-8 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500 scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <i className="fas fa-file-alt"></i>
                Veredicto del Agente Validador
            </h3>
            <button onClick={downloadReport} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded border border-zinc-700 transition-colors">
              <i className="fas fa-download mr-1"></i> Exportar
            </button>
          </div>
          <div className="prose prose-invert max-w-none text-zinc-300 font-light leading-relaxed text-sm italic">
            {report.verdict}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutonomousResearcher;
