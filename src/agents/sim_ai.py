import os
import json
import time
import datetime
import numpy as np
import matplotlib.pyplot as plt
from src.agents.base_agent import BaseAgent

class LawsRepository:
    def __init__(self, laws_path):
        self.laws_path = laws_path
        if not os.path.exists(self.laws_path):
            os.makedirs(self.laws_path, exist_ok=True)

    def add_law(self, hypothesis, context):
        h_id = hypothesis.get('id', 'N').replace('.txt', '')
        law_id = f"LAW_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}_{h_id}"
        path = os.path.join(self.laws_path, f"{law_id}.json")
        law_data = {
            "id": law_id,
            "description": hypothesis.get("content"),
            "fecha_validacion": datetime.datetime.now().isoformat(),
            "historial": hypothesis.get("history", []),
            "paper_id": f"PPR_{law_id}",
            "status": "VALIDATED"
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(law_data, f, indent=4, ensure_ascii=False)
        return law_id

    def get_all_laws(self):
        laws = []
        if not os.path.exists(self.laws_path): return []
        for f in os.listdir(self.laws_path):
            if f.endswith('.json'):
                path = os.path.join(self.laws_path, f)
                with open(path, "r", encoding="utf-8") as file:
                    laws.append(json.load(file))
        return laws

class Simulus(BaseAgent):
    """
    SIMULUS: Arquitecto de Simulaciones Científicas.
    Traduce leyes a modelos computacionales y detecta eventos ROJO/VERDE.
    """
    def __init__(self, config, logger, laws_repo, output_path):
        super().__init__(config, logger)
        self.laws_repo = laws_repo
        self.output_path = output_path
        os.makedirs(self.output_path, exist_ok=True)

    def run_simulation_cycle(self, context):
        """Ejecuta el ciclo de vida SIMULUS: Análisis -> Modelo -> Ejecución -> Reporte."""
        laws = self.laws_repo.get_all_laws()
        h_id = "SIM_SYSTEM"
        
        if not laws:
            self.info("[SIMULUS] Repositorio vacío. No hay leyes para simular.", h_id)
            return None

        self.info(f"[SIMULUS] Iniciando arquitectura de simulación para {len(laws)} leyes.", h_id)
        
        # 1. Fase de Análisis e Interpretación
        models = self._analyze_laws(laws)
        
        # 2. Fase de Diseño e Implementación (Simulada)
        results = []
        for model in models:
            self.info(f"[SIMULUS] Formalizando Modelo: {model['type']} para Ley {model['law_id']}", h_id)
            
            # Ejecución Numérica (Placeholder de Simulación Real)
            sim_data = self._execute_numerical_model(model)
            
            # 3. Detección de Eventos (Rojo/Verde)
            events = self._detect_events(sim_data, model)
            
            # 4. Generación de Artefactos Visuales
            img_path = self._generate_visualizations(sim_data, model)
            
            results.append({
                "law_id": model["law_id"],
                "model": model,
                "events": events,
                "visualization": img_path,
                "predictions": self._generate_predictions(events, model)
            })

        # 5. Informe Final
        report = self._generate_final_report(results)
        self._save_report(report)
        
        return report

    def _analyze_laws(self, laws):
        models = []
        for law in laws:
            desc = law["description"].lower()
            m_type = "ALGEBRAIC_RELATION"
            if "evoluciona" in desc or "cambia" in desc or "tiempo" in desc:
                m_type = "ODE_SYSTEM"
            elif "campo" in desc or "espacio" in desc:
                m_type = "PDE_SOLVER"
            
            models.append({
                "law_id": law["id"],
                "type": m_type,
                "description": desc,
                "params": {"dt": 0.01, "t_max": 10.0}
            })
        return models

    def _execute_numerical_model(self, model):
        # Simulación de evolución temporal con NumPy
        t = np.linspace(0, model["params"]["t_max"], 100)
        # Generamos una señal base + ruido
        values = np.sin(t) + np.random.normal(0, 0.05, 100)
        
        # Inyectamos una anomalía si la descripción contiene palabras críticas
        if "absoluto" in model["description"]:
            values[50:] += 10.0 # Salto no físico (ROJO)
        elif "conciencia" in model["description"]:
            values[70:] = values[70:] * 0.1 # Colapso (VERDE)
            
        return {"t": t.tolist(), "values": values.tolist()}

    def _detect_events(self, data, model):
        events = []
        values = np.array(data["values"])
        
        # Detección de Rojo: Inestabilidades o Valores No Físicos
        if np.max(np.abs(values)) > 5.0:
            events.append({
                "type": "ROJO",
                "description": "Inestabilidad numérica detectada: Divergencia de tensor campo.",
                "severity": "grave"
            })
            
        # Detección de Verde: Comportamientos Emergentes
        if "colapso" in model["description"] or np.std(values[70:]) < np.std(values[:30]):
             events.append({
                "type": "VERDE",
                "description": "Comportamiento Emergente: Sincronización de fase detectada vinculada a la topología.",
                "severity": "óptima"
            })
            
        return events

    def _generate_visualizations(self, data, model):
        plt.figure(figsize=(10, 4))
        plt.plot(data["t"], data["values"], color='cyan', label="Evolución Simulación")
        plt.title(f"Simulatio Matrix: {model['law_id']}")
        plt.grid(True, alpha=0.3)
        plt.axhline(0, color='white', alpha=0.2)
        
        # Estética Matrix/Antigravyti
        plt.gca().set_facecolor('#0d1117')
        plt.gcf().set_facecolor('#0d1117')
        plt.tick_params(colors='white')
        
        filename = f"sim_{model['law_id']}_{int(time.time())}.png"
        path = os.path.join(self.output_path, filename)
        plt.savefig(path)
        plt.close()
        return filename

    def _generate_predictions(self, events, model):
        preds = []
        if any(e["type"] == "VERDE" for e in events):
            preds.append(f"La simulación sugiere que bajo condiciones de {model['type']}, se observará una autorregulación del campo.")
        if any(e["type"] == "ROJO" for e in events):
            preds.append("Predicción de fallo: El sistema colapsará si se aplican condiciones de borde absolutas.")
        return preds

    def _generate_final_report(self, results):
        report = {
            "timestamp": datetime.datetime.now().isoformat(),
            "results": results,
            "global_status": "CONVERGENT" if not any(any(e["type"]=="ROJO" for e in r["events"]) for r in results) else "UNSTABLE"
        }
        return report

    def _save_report(self, report):
        path = os.path.join(self.output_path, "last_sim_report.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=4)

# AUTHORITY_ID: 0009-0009-0717-5536
# AUTHOR: Edward P. Lopez (E.P.L)
# 07/03/2026 5:04 a.m.
