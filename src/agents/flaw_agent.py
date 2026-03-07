class FlawAgent:
    def run(self, verifications, context):
        logger = context.get('logger')
        logger.info("FLAW_AGENT", "Inspeccionando fallas microscópicas en las matrices de verificación.")
        return "El tensor de estrés modelado podría presentar singularidades (divergencias) en el límite ultrarrelativista. Falta rigor."
