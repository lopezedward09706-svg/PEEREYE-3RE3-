
import React, { useRef, useEffect } from 'react';
import { GlobalState } from '../types';

interface SimulationPanelProps {
    metrics: any; 
    simulationStateRef: React.MutableRefObject<GlobalState>;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ metrics, simulationStateRef }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let frameId: number;
        const render = () => {
            const state = simulationStateRef.current;
            if (!state || !state.parameters) { frameId = requestAnimationFrame(render); return; }

            const { width: w, height: h } = canvas;
            const cx = w / 2; const cy = h / 2;
            const zoom = 300 * Math.pow(0.7, state.parameters.scale - 6);

            ctx.fillStyle = '#010108'; ctx.fillRect(0, 0, w, h);

            // --- IA8: ENHANCED ENTANGLEMENT VISUALIZATION ---
            ctx.save();
            state.entangledPairs.forEach(pair => {
                const n1 = state.nodes.find(n => n.id === pair.id1);
                const n2 = state.nodes.find(n => n.id === pair.id2);
                if (n1 && n2 && !n1.isCollapsed && !n2.isCollapsed) {
                    const x1 = cx + n1.x * zoom; const y1 = cy + n1.y * zoom;
                    const x2 = cx + n2.x * zoom; const y2 = cy + n2.y * zoom;
                    
                    const dx = x2 - x1; const dy = y2 - y1;
                    const strength = pair.strength;
                    const pulse = Math.sin(state.time * pair.frequency * 8) * 0.5 + 0.5;
                    const hue = 180 + (100 * (1 - strength)); 
                    
                    // 1. Aura Shimmer
                    ctx.shadowBlur = 15 * strength * pulse;
                    ctx.shadowColor = `hsla(${hue}, 100%, 50%, ${0.5 * strength})`;
                    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.1 * strength * pulse})`;
                    ctx.lineWidth = 10 * strength;
                    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                    ctx.shadowBlur = 0;

                    // 2. Pulsating Core String
                    ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${0.4 * strength})`;
                    ctx.lineWidth = 1 + 2 * strength * pulse;
                    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

                    // 3. Resonance Nodes (Pulsating ends)
                    ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${strength * pulse})`;
                    ctx.beginPath(); ctx.arc(x1, y1, 4 * strength * pulse, 0, Math.PI*2); ctx.fill();
                    ctx.beginPath(); ctx.arc(x2, y2, 4 * strength * pulse, 0, Math.PI*2); ctx.fill();
                }
            });
            ctx.restore();

            // --- RED ESTRUCTURAL ALPHA ---
            const nodesVisible = state.nodes.filter(n => !n.isCollapsed);
            ctx.save();
            nodesVisible.forEach((n1, i) => {
                const x1 = cx + n1.x * zoom; const y1 = cy + n1.y * zoom;
                ctx.fillStyle = n1.color;
                ctx.beginPath(); ctx.arc(x1, y1, 2, 0, Math.PI * 2); ctx.fill();
                
                // Stability Aura
                if (n1.stabilityStatus < 0.7) {
                    ctx.strokeStyle = `rgba(255, 0, 0, ${(1 - n1.stabilityStatus) * 0.3})`;
                    ctx.beginPath(); ctx.arc(x1, y1, 5, 0, Math.PI*2); ctx.stroke();
                }
            });
            ctx.restore();

            // --- NUCLEONS ---
            state.atoms.forEach(n => {
                const nx = cx + n.position.x * zoom; const ny = cy + n.position.y * zoom;
                ctx.fillStyle = n.type === 'proton' ? 'rgba(255,100,100,0.5)' : 'rgba(100,100,255,0.5)';
                ctx.beginPath(); ctx.arc(nx, ny, 10, 0, Math.PI*2); ctx.fill();
            });

            frameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(frameId);
    }, [simulationStateRef]);

    return (
        <div className="bg-glass backdrop-blur-md border border-white/10 rounded-xl p-4 h-full relative overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={800} height={500} className="w-full h-full bg-[#00000a] rounded-lg shadow-inner" />
        </div>
    );
};

export default SimulationPanel;
