
import React, { useState, useEffect } from 'react';
import { AppTab, SimulationMode, ValidationReport } from './types';
import Simulation3D from './components/Simulation3D';
import PaperView from './components/PaperView';
import GeminiAssistant from './components/GeminiAssistant';
import AutonomousResearcher from './components/AutonomousResearcher';

// Extending the existing AIStudio interface to avoid conflict on Window
// The platform provides an existing declaration for 'aistudio' on Window with the type 'AIStudio'.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SIMULATOR);
  const [simMode, setSimMode] = useState<SimulationMode>(SimulationMode.VIA_B);
  const [synthesisActive, setSynthesisActive] = useState(false);
  const [currentReport, setCurrentReport] = useState<ValidationReport | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
    // Check periodically or on focus
    window.addEventListener('focus', checkKey);
    return () => window.removeEventListener('focus', checkKey);
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success as per instructions to avoid race conditions
      setHasKey(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-black">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center">
            <i className="fas fa-network-wired text-white text-xs"></i>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase">R-QNT Lab Platform</h1>
            <p className="text-[9px] text-zinc-500 uppercase font-mono">Relational Quantum Network v2.6 // Synthesis Protocol</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button 
            onClick={() => setActiveTab(AppTab.SIMULATOR)}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${activeTab === AppTab.SIMULATOR ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <i className="fas fa-microscope"></i>Sim
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.RESEARCHER)}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${activeTab === AppTab.RESEARCHER ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <i className="fas fa-robot"></i>Researcher
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.PAPER)}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${activeTab === AppTab.PAPER ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <i className="fas fa-scroll"></i>Paper
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.ASSISTANT)}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${activeTab === AppTab.ASSISTANT ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <i className="fas fa-brain"></i>Oracle
          </button>
        </nav>

        <div className="flex items-center gap-4">
           <button 
             onClick={handleSelectKey}
             className={`flex flex-col items-end px-3 py-1 rounded border transition-colors ${hasKey ? 'border-green-900/30 hover:bg-green-900/10' : 'border-amber-900/50 hover:bg-amber-900/10'}`}
             title="Click to manage API Key for higher quotas"
           >
             <span className={`text-[10px] font-mono ${hasKey ? 'text-green-500' : 'text-amber-500'}`}>
               <i className={`fas ${hasKey ? 'fa-key' : 'fa-plug'} mr-1`}></i>
               {hasKey ? 'PRIVATE KEY ACTIVE' : 'SHARED QUOTA'}
             </span>
             <span className="text-[9px] text-zinc-600 font-mono uppercase">API Connection</span>
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Persistent Simulator View to avoid WebGL context loss */}
        <div className={`flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden ${activeTab === AppTab.SIMULATOR ? 'flex' : 'hidden'}`}>
            {/* Control Panel Sidebar */}
            <aside className="w-full md:w-80 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 flex flex-col gap-6 overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-widest">Global Constants</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1 uppercase tracking-tighter font-mono">Sim Theory</label>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => { setSimMode(SimulationMode.VIA_A); setSynthesisActive(false); setCurrentReport(null); }}
                        className={`text-left px-3 py-2 rounded border text-[10px] font-bold transition-all ${simMode === SimulationMode.VIA_A ? 'bg-amber-600 border-amber-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                      >
                        {SimulationMode.VIA_A}
                      </button>
                      <button 
                        onClick={() => setSimMode(SimulationMode.VIA_B)}
                        className={`text-left px-3 py-2 rounded border text-[10px] font-bold transition-all ${simMode === SimulationMode.VIA_B ? 'bg-amber-600 border-amber-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                      >
                        {SimulationMode.VIA_B}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Physics Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700/50 text-center">
                    <p className="text-[9px] text-zinc-500 uppercase">Cartan Torsion</p>
                    <p className="text-sm font-mono text-white">{synthesisActive ? '0.005' : '1.024'} τ</p>
                  </div>
                  <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700/50 text-center">
                    <p className="text-[9px] text-zinc-500 uppercase">Flow Resonance</p>
                    <p className="text-sm font-mono text-amber-500">
                      {currentReport?.status === 'MATERIA_ESTABLE_NEUTRON' ? 'Crystal' : (synthesisActive ? 'Neutral' : 'Phase+')}
                    </p>
                  </div>
                  <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700/50 text-center col-span-2">
                    <p className="text-[9px] text-zinc-500 uppercase">System Density</p>
                    <p className={`text-lg font-mono ${synthesisActive ? 'text-amber-500' : 'text-green-500'}`}>
                        {currentReport?.status === 'MATERIA_ESTABLE_NEUTRON' ? 'CRYSTAL_LATTICE' : (synthesisActive ? 'COMPRESSED_MAX' : '92.4%')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                <p className="text-[10px] text-amber-500 font-bold mb-2 uppercase tracking-widest"><i className="fas fa-info-circle mr-1"></i> Researcher Insight</p>
                <div className="text-[10px] text-zinc-400 leading-tight space-y-2">
                    <p>
                        {currentReport?.status === 'MATERIA_ESTABLE_NEUTRON' 
                          ? "Neutron Synthesis R-QNT-004 complete. Mass generation by elastic potential verified. Knot crystallized in Gold phase."
                          : (synthesisActive 
                            ? "A neutral state has been reached. Local time dilatation at maximum." 
                            : "Switch to 'Researcher' tab to launch the collision protocol and attempt Neutron Synthesis.")
                        }
                    </p>
                    {!hasKey && (
                        <p className="text-amber-600/80 italic border-t border-amber-900/20 pt-1">
                          Tip: Use the 'API Connection' button above to avoid 429 quota errors by using your own project key.
                        </p>
                    )}
                </div>
                {synthesisActive && (
                    <button 
                        onClick={() => { setSynthesisActive(false); setCurrentReport(null); }}
                        className="mt-3 w-full py-1.5 bg-zinc-800 text-[9px] font-bold text-white uppercase rounded border border-zinc-700 hover:bg-zinc-700"
                    >
                        Reset Protocol
                    </button>
                )}
              </div>
            </aside>

            {/* Viewport */}
            <div className="flex-1 min-h-[400px]">
              <Simulation3D mode={simMode} synthesisActive={synthesisActive} status={currentReport?.status} />
            </div>
        </div>

        {activeTab === AppTab.RESEARCHER && (
          <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
            <AutonomousResearcher 
                mode={simMode} 
                synthesisActive={synthesisActive} 
                setSynthesisActive={setSynthesisActive} 
                onReportUpdate={setCurrentReport}
            />
          </div>
        )}

        {activeTab === AppTab.PAPER && (
          <div className="flex-1 overflow-y-auto bg-zinc-950">
            <PaperView />
          </div>
        )}

        {activeTab === AppTab.ASSISTANT && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
            <div className="w-full h-full max-h-[700px]">
                <GeminiAssistant />
            </div>
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 text-[10px] text-zinc-600 font-mono">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> NETWORK ACTIVE</span>
          <span className="flex items-center gap-1 uppercase">
            {currentReport?.status === 'MATERIA_ESTABLE_NEUTRON' ? 'NEUTRON_CRYSTALLIZATION_ACTIVE' : (synthesisActive ? 'NEUTRON_STABLE_FIELD' : 'LOCATION: DEEP TOPOLOGICAL CORE')}
          </span>
        </div>
        <div className="flex gap-4">
          <span className={`${!hasKey ? 'text-amber-500 animate-pulse' : ''}`}>{!hasKey ? 'SHARED QUOTA LIMITS MAY APPLY' : 'AI VALIDATOR READY'}</span>
          <span>© 2025 EDWARD PÉREZ LÓPEZ // R-QNT RESEARCH</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
