
import React, { useState, useEffect } from 'react';
import { SimulationParameters } from '../types';
import { SCALE_LABELS, PRESETS } from '../constants';

interface SavedNote {
    id: string;
    title: string;
    content: string;
    date: string;
}

interface ControlPanelProps {
    params: SimulationParameters;
    onParamChange: (key: keyof SimulationParameters, value: any) => void;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onRunAllIAs: () => void;
    onLoadPreset: (preset: SimulationParameters) => void;
    onSaveDeduction: (text: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
    params, onParamChange, onStart, onPause, onReset, onRunAllIAs, onLoadPreset, onSaveDeduction
}) => {
    const [draft, setDraft] = useState("");
    const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('genesis_deductions');
        if (stored) {
            try {
                setSavedNotes(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse saved notes", e);
            }
        }
    }, []);

    const saveToLocalStorage = (notes: SavedNote[]) => {
        localStorage.setItem('genesis_deductions', JSON.stringify(notes));
        setSavedNotes(notes);
    };

    const handleSaveNote = () => {
        if (!draft.trim()) return;
        const title = prompt("Título para esta deducción:", `Deducción ${new Date().toLocaleDateString()}`);
        if (title === null) return;

        const newNote: SavedNote = {
            id: Date.now().toString(),
            title: title || "Sin título",
            content: draft,
            date: new Date().toLocaleString()
        };

        const updated = [newNote, ...savedNotes];
        saveToLocalStorage(updated);
        setDraft("");
        onSaveDeduction("");
    };

    const deleteNote = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("¿Eliminar esta deducción?")) {
            const updated = savedNotes.filter(n => n.id !== id);
            saveToLocalStorage(updated);
        }
    };

    const loadNote = (note: SavedNote) => {
        setDraft(note.content);
        onSaveDeduction(note.content);
    };

    const slider = (label: string, key: keyof SimulationParameters, min: number, max: number, step: number, color: string, isScale = false) => (
        <div className="mb-3">
            <div className="flex justify-between text-[10px] mb-1">
                <span className="text-gray-400 uppercase font-black">{label}</span>
                <span className={`font-bold text-${color}-400`}>
                    {isScale ? SCALE_LABELS[Math.round(params[key] as number)] : params[key]}
                </span>
            </div>
            <input 
                type="range" 
                min={min} 
                max={max} 
                step={step} 
                value={params[key] as number} 
                onChange={(e) => onParamChange(key, parseFloat(e.target.value))} 
                className={`w-full h-1 bg-gray-800 rounded appearance-none cursor-pointer accent-${color}-500`} 
            />
        </div>
    );

    return (
        <div className="flex flex-col gap-1">
            <h3 className="text-xs font-black border-b border-cyan-500/30 pb-2 mb-4 text-cyan-400 uppercase tracking-widest">🔭 Observador & Zoom</h3>
            {slider('Nivel de Escala', 'scale', 0, 11, 1, 'cyan', true)}
            {slider('Velocidad Tiempo', 'timeSpeed', 0.1, 5, 0.1, 'blue')}
            
            <h3 className="text-xs font-black border-b border-purple-500/30 pb-2 mb-4 mt-2 text-purple-400 uppercase tracking-widest">📐 LEYES Y ECUACIONES</h3>
            <textarea 
                value={params.customEquations}
                onChange={(e) => onParamChange('customEquations', e.target.value)}
                placeholder="Eb < 0; Z = Sum(q)..."
                className="w-full h-24 bg-black/40 border border-white/10 rounded p-2 text-[10px] font-mono focus:outline-none focus:border-cyan-500 text-cyan-200 custom-scrollbar mb-4"
            />

            <h3 className="text-xs font-black border-b border-green-500/30 pb-2 mb-4 mt-2 text-green-400 uppercase tracking-widest">✍️ DEDUCCIONES</h3>
            <div className="flex flex-col gap-2 mb-4">
                <textarea 
                    value={draft}
                    onChange={(e) => { setDraft(e.target.value); onSaveDeduction(e.target.value); }}
                    placeholder="Escribe tus hallazgos teóricos aquí..."
                    className="w-full h-24 bg-black/40 border border-white/10 rounded p-2 text-[10px] font-mono focus:outline-none focus:border-green-500 text-green-100 custom-scrollbar"
                />
                <button 
                    onClick={handleSaveNote}
                    disabled={!draft.trim()}
                    className="py-1.5 bg-green-600/40 hover:bg-green-600/60 disabled:opacity-30 border border-green-500/50 rounded font-black text-[9px] uppercase transition-all tracking-wider"
                >
                    💾 Guardar Deducción
                </button>

                {savedNotes.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                        <div className="text-[8px] text-gray-500 font-bold uppercase mb-1">Archivadas:</div>
                        {savedNotes.map(note => (
                            <div 
                                key={note.id} 
                                onClick={() => loadNote(note)}
                                className="group p-2 bg-white/5 border border-white/10 rounded cursor-pointer hover:bg-white/10 transition-colors flex justify-between items-center"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-green-400 leading-none">{note.title}</span>
                                    <span className="text-[7px] text-gray-500 mt-1">{note.date}</span>
                                </div>
                                <button 
                                    onClick={(e) => deleteNote(note.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-gray-500 transition-all"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-1">
                 <button onClick={onStart} className="flex-1 py-2 bg-cyan-600/80 rounded font-black text-[9px] hover:bg-cyan-500 transition-all uppercase">Iniciar</button>
                 <button onClick={onPause} className="flex-1 py-2 bg-yellow-600/80 rounded font-black text-[9px] hover:bg-yellow-500 transition-all uppercase">Pausar</button>
                 <button onClick={onReset} className="flex-1 py-2 bg-red-600/80 rounded font-black text-[9px] hover:bg-red-500 transition-all uppercase">Reset</button>
            </div>

            <div className="mt-4 p-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-white/10">
                <button onClick={onRunAllIAs} className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded font-black text-[10px] tracking-widest transition-all active:scale-95 uppercase text-white shadow-glow">🧬 CADENA DE VALIDACIÓN IA</button>
            </div>

            <div className="grid grid-cols-2 gap-1 mt-4">
                <button onClick={() => onLoadPreset(PRESETS.atomicCrystal)} className="p-1.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold uppercase">Cristal Atómico</button>
                <button onClick={() => onLoadPreset(PRESETS.standardCosmos)} className="p-1.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold uppercase">Macrocosmos</button>
            </div>
        </div>
    );
};

export default ControlPanel;
