
import React, { useState, useRef, useEffect } from 'react';
import { LogEntry, Severity, TaskType } from '../types';

interface IAPanelProps {
    onRunIA: (id: string) => void;
    iaLogs: Record<string, LogEntry[]>;
}

const IAPanel: React.FC<IAPanelProps> = ({ onRunIA, iaLogs }) => {
    const [activeTab, setActiveTab] = useState<string>('core');
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [iaLogs, activeTab]);

    const Tabs = [
        { id: 'core', label: '🛡️ AUDITOR CORE', desc: 'Unificación Alpha-Epsilon y Leyes Personalizadas.' },
        { id: '1', label: '🔗 PARES 1-2', desc: 'Validación Experimental y Teórica.' },
        { id: '3', label: '📡 PARES 3-4', desc: 'Sincronización Cosmo-Empírica.' },
        { id: '5', label: '⚖️ PARES 5-6', desc: 'Mediación Lógica Estándar vs ABC.' },
        { id: '7', label: '🛠️ PARES 7-8', desc: 'Integridad de Código y Cuántica.' },
        { id: '9', label: '📑 SÍNTESIS FINAL', desc: 'Generación del Paper Científico.' },
    ];

    const getSeverityColor = (sev: Severity) => {
        switch(sev) {
            case 'ERROR': return 'text-red-500 border-red-500/50 bg-red-500/5';
            case 'WARN': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/5';
            default: return 'text-blue-400 border-blue-400/50 bg-blue-400/5';
        }
    };

    return (
        <div className="bg-glass backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col h-full overflow-hidden shadow-2xl">
             <div className="flex flex-col gap-1 mb-4">
                {Tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`text-left px-3 py-2 text-[10px] font-bold rounded border transition-all ${activeTab === tab.id ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 shadow-glow' : 'bg-black/30 border-white/10 text-gray-400'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <h4 className="text-sm font-black mb-1 text-cyan-400 uppercase">{Tabs.find(t => t.id === activeTab)?.label}</h4>
                <p className="text-[10px] text-gray-500 mb-3 italic">{Tabs.find(t => t.id === activeTab)?.desc}</p>
                
                <button onClick={() => onRunIA(activeTab)} className="w-full py-2 mb-3 rounded font-black text-[9px] bg-cyan-400 hover:bg-cyan-300 transition-all uppercase text-black">
                    {activeTab === '9' ? 'Generar Paper Final' : 'Iniciar Proceso'}
                </button>

                <div className="flex-1 bg-black/40 rounded-lg p-2 border border-white/10 overflow-y-auto font-mono text-[9px] space-y-2 custom-scrollbar">
                    {(iaLogs[activeTab] || []).map((log, i) => (
                        <div key={i} className="p-2 bg-white/[0.02] border border-white/5 rounded">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-500 text-[8px]">{log.timestamp}</span>
                                <span className={`px-1 rounded-[2px] text-[7px] border uppercase ${getSeverityColor(log.severity)}`}>{log.severity}</span>
                            </div>
                            <div className="text-gray-300 leading-relaxed pl-1 border-l border-white/10">{log.text}</div>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>
            </div>
        </div>
    );
};

export default IAPanel;
