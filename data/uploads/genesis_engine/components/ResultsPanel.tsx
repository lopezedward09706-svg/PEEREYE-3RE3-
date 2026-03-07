import React, { useState } from 'react';
import { IAState } from '../types';
import { IA_COLORS } from '../constants';

interface ResultsPanelProps {
    iaStates: Record<number, IAState>;
    globalConsensus: number;
    notifications: string[];
    onExport: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ iaStates, globalConsensus, notifications, onExport }) => {
    const [expandedIA, setExpandedIA] = useState<number | null>(null);

    return (
        <div className="bg-glass backdrop-blur-md border border-white/10 rounded-xl p-6 mt-5">
            <h3 className="text-xl font-bold border-b-2 border-white/20 pb-3 mb-5 flex items-center">
                📊 RESULTADOS COMBINADOS & DESCUBRIMIENTOS
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                     <div>
                        <div className="text-sm font-semibold mb-2">🎯 CONSENSO GLOBAL:</div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
                            <div 
                                className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-green-500 transition-all duration-1000"
                                style={{ width: `${globalConsensus * 100}%` }}
                            />
                            <div className="absolute top-0 w-full text-center text-xs font-bold text-shadow leading-4 text-white">
                                {(globalConsensus * 100).toFixed(1)}% Stable
                            </div>
                        </div>
                     </div>

                     <div className="bg-black/30 rounded-lg p-4 min-h-[150px] space-y-2">
                        <div className="text-cyan-400 font-bold text-sm mb-2 flex justify-between items-center">
                            <span>📊 ANÁLISIS DETALLADO (Click para expandir):</span>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {Object.entries(iaStates).map(([key, state]) => {
                                const id = parseInt(key);
                                const s = state as IAState;
                                const conf = (s.confidence * 100).toFixed(0);
                                const color = s.confidence > 0.7 ? 'text-green-400' : s.confidence > 0.4 ? 'text-orange-400' : 'text-red-400';
                                const iaColor = IA_COLORS[`ia${id}` as keyof typeof IA_COLORS];
                                const isExpanded = expandedIA === id;
                                
                                return (
                                    <div key={key} className="border border-white/5 rounded bg-black/20 overflow-hidden">
                                        <div 
                                            className="p-2 text-sm flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                                            onClick={() => setExpandedIA(isExpanded ? null : id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: iaColor }}></span>
                                                <span style={{ color: iaColor }} className="font-bold">IA{id}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {s.running && <span className="text-yellow-400 text-xs animate-pulse">Procesando...</span>}
                                                <span className={color}>{conf}%</span>
                                                <span className="text-gray-500 text-xs">{isExpanded ? '▼' : '▶'}</span>
                                            </div>
                                        </div>
                                        
                                        {isExpanded && s.lastResponse && (
                                            <div className="p-3 text-xs font-mono text-gray-300 bg-black/40 border-t border-white/5 whitespace-pre-wrap leading-relaxed">
                                                {s.lastResponse}
                                            </div>
                                        )}
                                        {isExpanded && !s.lastResponse && !s.running && (
                                            <div className="p-3 text-xs text-gray-500 italic">
                                                Sin datos de análisis recientes. Ejecute esta IA para generar un reporte.
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                     </div>
                     
                     <button 
                        onClick={onExport}
                        className="px-6 py-2 bg-gradient-to-r from-teal-600 to-green-600 rounded font-bold hover:shadow-lg transition-transform hover:-translate-y-0.5 text-sm w-full sm:w-auto"
                     >
                        📥 EXPORTAR RESULTADOS (.txt)
                     </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-4">
                         <div className="text-sm font-bold mb-3">⚡ ESTADO DEL NÚCLEO:</div>
                         {Object.entries(iaStates).map(([key, state]) => {
                             const id = parseInt(key);
                             const s = state as IAState;
                             const status = s.running ? '🟡 Ejecutando...' : s.confidence > 0.7 ? '🟢 Óptimo' : '🔴 Inestable';
                             return (
                                 <div key={key} className="flex justify-between text-xs mb-1.5 items-center">
                                     <span style={{ color: IA_COLORS[`ia${id}` as keyof typeof IA_COLORS] }}>IA{id}:</span>
                                     <span className={s.running ? 'text-yellow-300' : 'text-gray-300'}>{status}</span>
                                 </div>
                             );
                         })}
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 flex flex-col h-60">
                        <div className="text-sm font-bold mb-2">🔔 REGISTRO DEL SISTEMA:</div>
                        <div className="flex-1 overflow-y-auto text-xs space-y-1 text-orange-400 font-mono custom-scrollbar">
                            {notifications.map((note, i) => (
                                <div key={i} className="border-b border-orange-500/10 pb-1">{note}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPanel;