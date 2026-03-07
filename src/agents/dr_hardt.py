import time
from .base_agent import BaseAgent

class DrHardt(BaseAgent):
    """
    Agente que representa al Dr. Ernst Von Hardt, un físico escéptico y riguroso.
    Evalúa todo el expediente y emite un veredicto final.
    """
    def __init__(self, config, logger):
        super().__init__(config, logger)
        self.established_laws = config.get('established_laws', [])  # leyes ya confirmadas

    def run(self, expediente: dict, context: dict) -> dict:
        """
        expediente contiene:
          - hypothesis: str
          - h1, h2: str
          - cycle_reports: list
          - verifier_reports: dict
          - debate_flaw_success: dict
          - paper: dict (contenido del paper)
          - peer_review: dict (recomendaciones de RIGOR y ADVOCATUS)
          - simulations: list (resultados de SIMULUS)
        """
        h_id = context.get('hypothesis_id', 'N/A')
        self.log("DR_HARDT", f"Iniciando escrutinio final del expediente para {h_id}", h_id)

        # 1. Revisar consistencia matemática
        mathion_rep = expediente['verifier_reports'].get('mathion', {})
        math_errors = mathion_rep.get('errores', [])
        math_graves = [e for e in math_errors if e.get('gravedad') == 'grave']
        
        if math_graves:
            return self._veredicto("RECHAZADA", f"Errores matemáticos graves detectados por MATHION: {math_graves}", h_id)

        # 2. Revisar si hay predicciones y simulaciones
        sims = expediente.get('simulations')
        if not sims or (isinstance(sims, dict) and not sims.get('results')):
            return self._veredicto("EN CUARENTENA", "Ausencia de simulación dinámica. No hay base empírica computacional.", h_id)

        # 3. Coherencia con leyes establecidas
        for ley in self.established_laws:
            if self._contradice(expediente['hypothesis'], ley):
                return self._veredicto("RECHAZADA", f"Contradice la ley fundamental establecida: {ley}", h_id)

        # 4. Evaluar simplicidad (navaja de Occam)
        complejidad = self._calcular_complejidad(expediente['hypothesis'])
        if complejidad > self.config.get('max_complejidad', 25):
            return self._veredicto("EN CUARENTENA", f"Complejidad excesiva ({complejidad}). La elegancia es requerida.", h_id)

        # 5. Veredicto basado en los revisores (RIGOR y ADVOCATUS)
        # Nota: peer_review puede ser el resultado de la simulación de revisión
        peer_rev = expediente.get('peer_review', {})
        rec = peer_rev.get('recommendation', '').upper()

        if rec == 'ACEPTAR' or 'ACEPTADA' in rec:
            return self._veredicto("CONFIRMADA, NO HAY EXCUSAS", "Evidencia abrumadora. El paper sobrevive al escrutinio del Nobel.", h_id)
        elif 'CAMBIOS' in rec or 'PROVISIONAL' in rec:
            return self._veredicto("ACEPTADA PROVISIONALMENTE", "Prometedora, pero sujeta a confirmación experimental real.", h_id)
        else:
            return self._veredicto("EN CUARENTENA", "El proceso de revisión por pares no es concluyente.", h_id)

    def _contradice(self, hypothesis, ley):
        # Placeholder semántico
        return False

    def _calcular_complejidad(self, hypothesis):
        # Número de palabras como métrica de complejidad inicial
        return len(hypothesis.split())

    def _veredicto(self, decision, explicacion, h_id):
        self.info(f"VEREDICTO DR_HARDT: {decision} - {explicacion}", h_id)
        return {
            'agente': 'DrHardt',
            'decision': decision,
            'explicacion': explicacion,
            'timestamp': datetime.datetime.now().isoformat() if 'datetime' in globals() else time.ctime()
        }
