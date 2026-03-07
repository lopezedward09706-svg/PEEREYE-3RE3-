
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SimulationEngine } from './services/simulationEngine';
import ControlPanel from './components/ControlPanel';
import SimulationPanel from './components/SimulationPanel';
import IAPanel from './components/IAPanel';
import ResultsPanel from './components/ResultsPanel';
import QuantumPaper from './components/QuantumPaper';
import { INITIAL_PARAMETERS } from './constants';
import { GlobalState, ChatMessage, SimulationParameters, IAState, LogEntry, Severity, TaskType } from './types';

const App: React.FC = () => {
    const engineRef = useRef<SimulationEngine>(new SimulationEngine(INITIAL_PARAMETERS));
    const simulationStateRef = useRef<GlobalState>(engineRef.current.state);

    const [params, setParams] = useState<SimulationParameters>(simulationStateRef.current.parameters);
    const [metrics, setMetrics] = useState(engineRef.current.getMetrics());
    const [iaLogs, setIaLogs] = useState<Record<string, LogEntry[]>>({});
    const [iaStates, setIaStates] = useState<Record<string, IAState>>({});
    const [notifications, setNotifications] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [showPaper, setShowPaper] = useState(false);
    const [generatedPaper, setGeneratedPaper] = useState<string | null>(null);

    useEffect(() => {
        const initStates: Record<string, IAState> = {};
        ['core', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(id => {
            initStates[id] = { confidence: 0.5, running: false, status: 'idle' };
        });
        setIaStates(initStates);
        simulationStateRef.current.sharedMemory.peerReports = {};
    }, []);

    useEffect(() => {
        let id: number;
        const loop = () => {
            if (running) {
                engineRef.current.update();
                const m = engineRef.current.getMetrics();
                setMetrics(m);
                simulationStateRef.current = engineRef.current.state;
                const logs = simulationStateRef.current.sharedMemory.evolutionLogs;
                while (logs.length > 0) {
                    const l = logs.shift();
                    if (l) setNotifications(n => [l, ...n].slice(0, 15));
                }
            }
            id = requestAnimationFrame(loop);
        };
        id = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(id);
    }, [running]);

    const addLog = (iaId: string, text: string, severity: Severity, taskType: TaskType, tag: string) => {
        const entry: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            text, severity, taskType, tag, iaId
        };
        setIaLogs(prev => ({ ...prev, [iaId]: [...(prev[iaId] || []), entry].slice(-50) }));
    };

    const runCoreAuditor = async () => {
        setIaStates(s => ({ ...s, core: { ...s.core, running: true, status: 'scanning' } }));
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const m = metrics;
        const p = params;
        const prompt = `AUDITORÍA CENTRAL R-QNT UNIFICADA (Alpha, Beta, Gamma, Delta, Epsilon).
        Ecuaciones del Usuario: ${p.customEquations}
        Estado Actual: Tensión=${m.structuralTension.toFixed(4)}, Masa Residual=${m.massAuditResidual.toFixed(4)}, Estabilidad=${m.avgStability.toFixed(4)}, Zeta=${m.avgZeta.toFixed(4)}.
        TAREA: Valida las ecuaciones y leyes personalizadas. Genera el Reporte de Base para la cadena de revisión por pares.`;
        try {
            const resp = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            simulationStateRef.current.sharedMemory.peerReports['core'] = resp.text || "";
            addLog('core', resp.text || "Reporte generado.", 'INFO', 'CORE_AUDIT', 'UNIFIED');
            setIaStates(s => ({ ...s, core: { ...s.core, running: false, status: 'idle' } }));
        } catch (e) { setIaStates(s => ({ ...s, core: { ...s.core, running: false, status: 'error' } })); }
    };

    const runPeerStep = async (sourceId: string, targetId: string, context: string) => {
        setIaStates(s => ({ ...s, [sourceId]: { ...s[sourceId], running: true, status: 'reviewing' }, [targetId]: { ...s[targetId], running: true, status: 'reviewing' } }));
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const coreReport = simulationStateRef.current.sharedMemory.peerReports['core'] || "";
        const prompt = `PEER REVIEW: IA${sourceId} -> IA${targetId}. Contexto: ${context}. Auditoría Core: ${coreReport.slice(0, 500)}... Métricas: ${JSON.stringify(metrics)}. TAREA: IA${sourceId} analiza y IA${targetId} valida.`;
        try {
            const resp = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            simulationStateRef.current.sharedMemory.peerReports[`${sourceId}-${targetId}`] = resp.text || "";
            addLog(sourceId, `Análisis enviado a IA${targetId}`, 'INFO', 'PEER_REVIEW', 'CHAIN');
            addLog(targetId, `Validación de IA${sourceId} completada: ${resp.text?.slice(0, 100)}...`, 'INFO', 'PEER_REVIEW', 'CHAIN');
            setIaStates(s => ({ ...s, [sourceId]: { ...s[sourceId], running: false, status: 'idle' }, [targetId]: { ...s[targetId], running: false, status: 'idle' } }));
        } catch (e) { setIaStates(s => ({ ...s, [sourceId]: { ...s[sourceId], running: false, status: 'error' }, [targetId]: { ...s[targetId], running: false, status: 'error' } })); }
    };

    const runFullChain = async () => {
        setRunning(true);
        await runCoreAuditor();
        await runPeerStep("1", "2", "Experimental Validation, Node Stability & Zeta Ratio");
        await runPeerStep("3", "4", "Cosmological Grounding & Empiricism");
        await runPeerStep("5", "6", "Standard Physics Laws vs Emergent ABC Laws");
        await runPeerStep("7", "8", "Quantum Integrity & Entanglement Code Scan");
        
        // Final Synthesis by IA9
        setIaStates(s => ({ ...s, "9": { ...s["9"], running: true, status: 'evolving' } }));
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const allReports = Object.values(simulationStateRef.current.sharedMemory.peerReports).join("\n\n");
        const prompt = `FINAL SYNTHESIS IA9. Recibes todos los informes de pares. TAREA: Genera 'THE GENESIS MANIFESTO' con rigor científico extremo basándote en los hallazgos de IA1-IA8 y el Auditor Core.`;
        try {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey) await (window as any).aistudio.openSelectKey();
            const resp = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt, config: { thinkingConfig: { thinkingBudget: 16384 } } });
            setGeneratedPaper(resp.text || ""); setShowPaper(true);
            addLog("9", "PAPER FINAL GENERADO CON ÉXITO.", "INFO", "FINAL_SYNTHESIS", "SUCCESS");
            setIaStates(s => ({ ...s, "9": { ...s["9"], running: false, status: 'idle' } }));
        } catch (e) { setIaStates(s => ({ ...s, "9": { ...s["9"], running: false, status: 'error' } })); }
    };

    return (
        <div className="flex h-screen bg-[#02020a] text-white p-2 gap-2 overflow-hidden font-sans relative">
            {showPaper && generatedPaper && <QuantumPaper content={generatedPaper} onClose={() => setShowPaper(false)} />}
            <div className="w-80 flex flex-col gap-2">
                <div className="bg-glass backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col h-[60%] overflow-y-auto custom-scrollbar shadow-2xl">
                    <ControlPanel 
                        params={params} 
                        onParamChange={(k, v) => { engineRef.current.updateParams({[k]: v}); setParams({...params, [k]: v}); }} 
                        onStart={() => setRunning(true)} 
                        onPause={() => setRunning(false)} 
                        onReset={() => engineRef.current.reset()} 
                        onRunAllIAs={runFullChain} 
                        onLoadPreset={p => { setParams(p); engineRef.current.updateParams(p); }} 
                        onSaveDeduction={(text) => { simulationStateRef.current.sharedMemory.userDeductions = text; }} 
                    />
                </div>
                <ResultsPanel iaStates={iaStates} globalConsensus={metrics.coherenceLevel} notifications={notifications} onExport={() => {}} />
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1">
                    <SimulationPanel metrics={metrics} simulationStateRef={simulationStateRef} />
                </div>
                <div className="mt-2 bg-black/60 border border-white/10 rounded-lg p-3 text-[10px] font-mono flex items-center justify-between shadow-2xl">
                    <div className="flex gap-6 overflow-x-auto whitespace-nowrap z-10 custom-scrollbar-h">
                        <span className="text-cyan-400 font-black uppercase">Fase: {metrics.phase}</span>
                        <span className="text-ia5 font-bold">ε Compatibility: {(metrics.standardCompatibility*100).toFixed(1)}%</span>
                        <span className="text-blue-400">ζ Zeta: {metrics.avgZeta.toFixed(3)}</span>
                        <span className="text-green-400">Stability: {(metrics.avgStability*100).toFixed(1)}%</span>
                        {generatedPaper && <button onClick={() => setShowPaper(true)} className="px-3 py-1 bg-ia9/20 border border-ia9/40 rounded text-ia9 font-black animate-pulse shadow-glow-ia9">📜 LEER PAPER FINAL</button>}
                    </div>
                </div>
            </div>
            <div className="w-80">
                <IAPanel onRunIA={runFullChain} iaLogs={iaLogs} />
            </div>
        </div>
    );
};

export default App;
