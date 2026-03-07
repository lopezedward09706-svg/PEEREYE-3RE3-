class RigorousReviewer:
    def run(self, paper_es, paper_en, context):
        logger = context.get('logger')
        logger.info("RIGOROUS_REV", "Revisión Inquisitiva: Buscando anomalías lógicas en la tesis redactada.")
        return "Revisor Riguroso [FÍSICA TEÓRICA]: Requiero que la dependencia temporal se defina explícitamente usando Tensores de Rango 2. Falta comprobación empírica en altas energías."
