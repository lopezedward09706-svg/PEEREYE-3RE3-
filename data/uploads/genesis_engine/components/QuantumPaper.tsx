
import React from 'react';

interface QuantumPaperProps {
    content: string;
    onClose: () => void;
}

const QuantumPaper: React.FC<QuantumPaperProps> = ({ content, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex justify-center p-4 lg:p-10 animate-in fade-in zoom-in-95">
            <div className="max-w-4xl w-full bg-white text-black rounded-lg shadow-2xl flex flex-col overflow-hidden border-[10px] border-gray-200">
                {/* Header Estilo Académico */}
                <div className="bg-gray-100 p-6 border-b border-gray-300 flex justify-between items-start">
                    <div>
                        <div className="text-[10px] font-serif font-bold text-gray-500 uppercase tracking-widest mb-1">
                            Technical Publication • Unified Physics Series
                        </div>
                        <h1 className="text-2xl font-serif font-black uppercase leading-tight tracking-tight">
                            The Unified R-QNT Framework
                        </h1>
                        <div className="text-sm font-serif italic text-gray-600 mt-1">
                            A Geometric Study of Cosmogénesis and Emergent Matter
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido del Paper */}
                <div className="flex-1 overflow-y-auto p-12 font-serif leading-relaxed text-justify custom-scrollbar-paper">
                    <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:uppercase prose-headings:tracking-tighter prose-headings:border-b prose-headings:border-gray-100">
                        {content.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black mt-8 mb-4">{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                            if (line.trim() === '') return <br key={i} />;
                            
                            // Reemplazo simple para visualización de ecuaciones (simulando LaTeX)
                            let processedLine = line.replace(/\$(.*?)\$/g, '<span class="font-mono bg-gray-100 px-1 rounded">$1</span>');
                            
                            return (
                                <p 
                                    key={i} 
                                    className="mb-4 text-gray-800"
                                    dangerouslySetInnerHTML={{ __html: processedLine }}
                                />
                            );
                        })}
                    </div>

                    <div className="mt-20 border-t pt-10 text-[10px] text-gray-400 font-sans uppercase tracking-widest flex justify-between">
                        <span>Genesis Engine Simulation Artifact</span>
                        <span>Doc ID: RQNT-ALPHA-2025</span>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar-paper::-webkit-scrollbar { width: 12px; }
                .custom-scrollbar-paper::-webkit-scrollbar-track { background: #f1f1f1; }
                .custom-scrollbar-paper::-webkit-scrollbar-thumb { background: #ccc; border-radius: 6px; border: 3px solid #f1f1f1; }
                .custom-scrollbar-paper::-webkit-scrollbar-thumb:hover { background: #999; }
                
                @media print {
                    .fixed { position: absolute; }
                    button { display: none; }
                }
            `}</style>
        </div>
    );
};

export default QuantumPaper;
