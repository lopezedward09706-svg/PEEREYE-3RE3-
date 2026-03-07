from src.agents.base_agent import BaseAgent
import datetime

class Zetetes(BaseAgent):
    """BUSCADOR (ζητητής): Identifica fallos, riesgos e inconsistencias."""
    def identificar(self, informes_verificadores, resultados_ciclo):
        puntos_debiles = []
        for v_name, rep in informes_verificadores.items():
            # Extraer errores de cada verificador
            errores = rep.get("errores", [])
            conflictos = rep.get("conflictos", [])
            err_geom = rep.get("errores_geometricos", [])
            
            for e in errores + conflictos + err_geom:
                puntos_debiles.append({
                    "agente": v_name,
                    "descripcion": e.get("descripcion") or e.get("desc") or e.get("error"),
                    "gravedad": e.get("gravedad", "media")
                })
        
        # También chequear puntuaciones bajas
        for v_name, rep in informes_verificadores.items():
            if rep.get("score", 1.0) < 0.8:
                puntos_debiles.append({
                    "agente": v_name,
                    "descripcion": f"Puntuación de coherencia crítica detectada ({rep.get('score')})",
                    "gravedad": "alta"
                })
        
        return puntos_debiles

    def intervenir(self, punto, debate, contexto):
        msg = f"CRÍTICA (ZETETES): Señalo una falla en el informe de {punto['agente']}: {punto['descripcion']} (Prioridad: {punto['gravedad']})."
        return {
            "agente": "ZETETES",
            "texto": msg,
            "referencia": punto,
            "timestamp": datetime.datetime.now().isoformat()
        }

class Eurekates(BaseAgent):
    """EL QUE ENCUENTRA: Destaca aciertos, robustez y coherencia."""
    def identificar(self, informes_verificadores, resultados_ciclo):
        puntos_fuertes = []
        for v_name, rep in informes_verificadores.items():
            if rep.get("score", 0) >= 0.85:
                puntos_fuertes.append({
                    "agente": v_name,
                    "descripcion": rep.get("comparacion") or rep.get("analisis") or "Estructura formal validada.",
                    "score": rep.get("score")
                })
        return puntos_fuertes

    def responder(self, ultimo_punto_debate, puntos_fuertes, i_fuerte, contexto):
        if ultimo_punto_debate and ultimo_punto_debate['agente'] == "ZETETES":
            ref = ultimo_punto_debate['referencia']
            msg = f"DEFENSA (EUREKATES): Reconozco la observación sobre {ref['descripcion']}, pero el marco general de H2 compensa esta divergencia mediante su estructura de campo."
        else:
            if i_fuerte < len(puntos_fuertes):
                pf = puntos_fuertes[i_fuerte]
                msg = f"FORTALEZA (EUREKATES): Debemos resaltar que {pf['agente']} confirma: {pf['descripcion']}."
            else:
                msg = "EUREKATES: La hipótesis mantiene una simetría asintótica que no puede ser ignorada."

        return {
            "agente": "EUREKATES",
            "texto": msg,
            "uso_punto_fuerte": True,
            "timestamp": datetime.datetime.now().isoformat()
        }

class FlawSuccessDebate(BaseAgent):
    """MÓDULO DE DEBATE: ZETETES vs EUREKATES."""
    def __init__(self, config, logger):
        super().__init__(config, logger)
        self.zetetes = Zetetes(config, logger)
        self.eurekates = Eurekates(config, logger)

    def run(self, informes_verificadores, resultados_ciclo, contexto, hypothesis_id):
        self.info(f"--- Iniciando Debate Observador: ZETETES vs EUREKATES ---", hypothesis_id)
        
        puntos_debiles = self.zetetes.identificar(informes_verificadores, resultados_ciclo)
        puntos_fuertes = self.eurekates.identificar(informes_verificadores, resultados_ciclo)
        
        debate_log = []
        max_turns = self.config.get('max_debate_turns', 6)
        
        i_d = 0
        i_f = 0
        for turn in range(max_turns):
            if i_d >= len(puntos_debiles) and i_f >= len(puntos_fuertes):
                break
                
            if turn % 2 == 0 and i_d < len(puntos_debiles):
                intervencion = self.zetetes.intervenir(puntos_debiles[i_d], debate_log, contexto)
                debate_log.append(intervencion)
                i_d += 1
            elif i_f < len(puntos_fuertes) or (debate_log and debate_log[-1]['agente'] == "ZETETES"):
                intervencion = self.eurekates.responder(debate_log[-1] if debate_log else None, puntos_fuertes, i_f, contexto)
                debate_log.append(intervencion)
                i_f += 1

        conclusion = self._generar_conclusion(debate_log, puntos_debiles, puntos_fuertes)
        
        return {
            "debate": debate_log,
            "conclusion": conclusion
        }

    def _generar_conclusion(self, debate_log, p_debiles, p_fuertes):
        res = "RESUMEN DE DEBATE: "
        if len(p_debiles) > len(p_fuertes) * 1.5:
             res += "Prevalecen las dudas estructurales sobre la coherencia del modelo."
        elif len(p_fuertes) > len(p_debiles):
             res += "La robustez de los aciertos eclipsa las fallas menores detectadas."
        else:
             res += "Equilibrio crítico. Los fallos son manejables si se acota el dominio de validez."
        
        return res
