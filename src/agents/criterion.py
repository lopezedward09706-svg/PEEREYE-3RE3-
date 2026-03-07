from src.agents.base_agent import BaseAgent

class Criterion(BaseAgent):
    """
    Agente CRITERION (kritērion): Estándar para juzgar.
    Veredicto supremo sobre el destino de la hipótesis.
    """
    def __init__(self, config, logger):
        super().__init__(config, logger)
        self.rules = self.config.get('decision_rules', {
            'min_aciertos_para_publicar': 3,
            'max_errores_leves_para_publicar': 2,
            'permitir_rehacer_con_graves_en_libertad': True
        })

    def decide(self, hipotesis_1, hipotesis_2, informes_ciclo, informes_verificadores, debate, h_id):
        """
        Entradas:
            hipotesis_1, hipotesis_2: strings (H1 y H2)
            informes_ciclo: list con los reportes de ROUND 1 y ROUND 2
            informes_verificadores: dict con los reportes de MATHION, PHYSIS, GEOMETRON
            debate: dict con el debate completo de ZETETES vs EUREKATES
            h_id: ID de la hipótesis para logging
        Retorna:
            dict con decision (string), option (int para compatibilidad), explicacion, recomendaciones
        """
        self.info(f"[CRITERION] Sintetizando telemetría total para decisión final de: {h_id}", h_id)
        
        # 1. Consolidar y Evaluar Gravedad
        errores_graves = self._extraer_errores_graves(informes_verificadores)
        aciertos_destacados = self._extraer_aciertos(informes_verificadores, debate)

        # 2. Aplicar lógica de reglas (según modo de operación)
        decision = self._aplicar_reglas(errores_graves, aciertos_destacados, informes_ciclo, debate)
        
        # Mapeo a opciones de workflow (1: descartar, 2: rehacer, 3: publicar)
        option_map = {"descartar": 1, "rehacer": 2, "publicar": 3}
        option = option_map[decision]
        
        explicacion = self._generar_explicacion(decision, errores_graves, aciertos_destacados)
        recomendaciones = self._generar_recomendaciones(decision, informes_ciclo) if decision == 'rehacer' else []

        # 3. Registrar
        self.info(f"Veredicto CRITERION: {decision.upper()} - {explicacion}", h_id)

        return {
            'decision': decision,
            'option': option, # Para compatibilidad con WorkflowEngine.run_iteration
            'explanation': explicacion,
            'explicacion': explicacion, # Para compatibilidad con la spec
            'recomendaciones': recomendaciones,
            'datos_adicionales': {}
        }

    def _extraer_errores_graves(self, verif):
        graves = []
        for v_name, v in verif.items():
            # Buscamos en errores, conflictos, errores_geometricos...
            items = v.get('errores', []) + v.get('conflictos', []) + v.get('errores_geometricos', [])
            for err in items:
                if err.get('gravedad') in ['grave', 'alta', 'crítica']:
                    graves.append({"agente": v_name, "descripcion": err.get('descripcion') or err.get('error') or err.get('desc')})
        return graves

    def _extraer_aciertos(self, verif, debate):
        # Aciertos extraídos del EUREKATES en el debate
        aciertos = []
        log = debate.get("debate", [])
        for entry in log:
            if entry.get("agente") == "EUREKATES" and "FORTALEZA" in entry.get("texto", ""):
                aciertos.append(entry.get("texto"))
        return aciertos

    def _aplicar_reglas(self, errores_graves, aciertos, ciclo, debate):
        mode = self.config.get('mode', 'coherence')
        
        if len(errores_graves) > 0:
            if mode == 'coherence' or not self._hay_esperanza(errores_graves, ciclo):
                return 'descartar'
            else:
                return 'rehacer'
        
        # Si no hay errores graves, vemos si publicamos o rehacemos por falta de robustez
        min_aciertos = self.rules.get('min_aciertos_para_publicar', 3)
        if len(aciertos) >= min_aciertos:
            return 'publicar'
        else:
            return 'rehacer'

    def _hay_esperanza(self, errores_graves, ciclo):
        # En modo libertad, si PROFUNDUS encontró una vía de corrección
        mode = self.config.get('mode', 'coherence')
        if mode == 'freedom':
            # Buscamos en los reportes de las vueltas
            for round_rep in ciclo:
                prof_rep = round_rep.get('reports', {}).get('profundus', {})
                if prof_rep.get('analysis') and "convergencia" in prof_rep['analysis'].lower():
                    return True
        return False

    def _generar_explicacion(self, decision, errores, aciertos):
        if decision == 'descartar':
            return f"Se descarta por {len(errores)} error(es) grave(s): {[e['descripcion'] for e in errores]}"
        elif decision == 'publicar':
            return f"Aprobado con {len(aciertos)} aciertos destacados y sin errores graves."
        else:
            return "Requiere refinamiento: hay aspectos prometedores pero persisten fallos moderados o falta robustez asintótica."

    def _generar_recomendaciones(self, decision, ciclo):
        recs = []
        for round_rep in ciclo:
            prof_rep = round_rep.get('reports', {}).get('profundus', {})
            if prof_rep.get('analysis'):
                 recs.append(f"Análisis Profundo Round {round_rep.get('round')}: {prof_rep['analysis']}")
        return recs
