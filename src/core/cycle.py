from src.agents.cycle_agents import Aletheia, Elenchus, Correctio, Profundus, Synthesis

class ValidationCycle:
    def __init__(self, config, logger):
        self.config = config
        self.logger = logger
        self.aletheia = Aletheia(config, logger)
        self.elenchus = Elenchus(config, logger)
        self.correctio = Correctio(config, logger)
        self.profundus = Profundus(config, logger)
        self.synthesis = Synthesis(config, logger)

    def run_cycle(self, hypothesis_data, context, vuelta=1):
        """Ejecuta una vuelta completa del proceso central de validación."""
        h_id = hypothesis_data.get("id")
        self.logger.info("CYCLE", f"--- Iniciando ROUND {vuelta} de la hipótesis: {h_id} ---", h_id)
        
        current_content = hypothesis_data.get("content")
        
        # 1. ALETHEIA (Validar)
        val_result = self.aletheia.validate(hypothesis_data, context)
        
        # 2. ELENCHUS (Falsar)
        fals_result = self.elenchus.falsify(val_result['hypothesis'], context)
        
        # 3. División en Secciones (si hay fallos)
        if fals_result.get('fallos'):
            # CORRECTIO (Re-trabajar)
            corr_result = self.correctio.rework(val_result['hypothesis'], fals_result['fallos'])
            # PROFUNDUS (Profundizar)
            deep_result = self.profundus.dive(fals_result['fallos'], context)
        else:
            corr_result = {"hypothesis": val_result['hypothesis']}
            deep_result = {"analysis": "No se requirió análisis profundo (Sin fallos)."}
        
        # 4. SYNTHESIS (Unir conclusiones)
        synth_result = self.synthesis.unify(
            val_result['hypothesis'],
            corr_result.get('hypothesis'),
            deep_result.get('analysis'),
            fals_result.get('fallos')
        )
        
        new_hypothesis_data = {
            "id": h_id,
            "content": synth_result["hypothesis"],
            "history": hypothesis_data.get("history", []) + [{
                "vuelta": vuelta,
                "val_res": val_result,
                "fal_res": fals_result,
                "synth_res": synth_result
            }]
        }
        
        self.logger.info("CYCLE", f"--- ROUND {vuelta} completado para: {h_id} ---", h_id)
        
        return new_hypothesis_data, {
            "round": vuelta,
            "hypothesis": new_hypothesis_data["content"],
            "reports": {
                "aletheia": val_result,
                "elenchus": fals_result,
                "correctio": corr_result,
                "profundus": deep_result,
                "synthesis": synth_result
            }
        }

    # El método run ya está orquestado en WorkflowEngine pero lo implementamos aquí como helper
    def run_full_process(self, hypothesis_data, context):
        """Ejecuta el ciclo de vueltas configurado (por defecto 2)."""
        round_results = []
        current_data = hypothesis_data
        
        max_vueltas = self.config.get("max_rounds", 2)
        
        for i in range(1, max_vueltas + 1):
            current_data, round_rep = self.run_cycle(current_data, context, vuelta=i)
            round_results.append(round_rep)
            
        return {
            "h1": round_results[0]["hypothesis"] if len(round_results) > 0 else None,
            "h2": round_results[1]["hypothesis"] if len(round_results) > 1 else None,
            "rounds": round_results
        }
