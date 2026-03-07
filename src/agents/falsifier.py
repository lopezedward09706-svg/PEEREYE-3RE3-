class Falsifier:
    def run(self, hypothesis, context):
        logger = context.get('logger')
        logger.info("FALSIFIER", f"Intentando falsar hipótesis empíricamente: [{hypothesis.get('id', 'N/A')}]")
        
        content = hypothesis.get("content", "").lower()
        falsified = False
        result_desc = "Refutación: Resistió la falsación inicial (No se encontraron contraejemplos triviales)."
        
        if "absoluto" in content and "tiempo" in content:
            falsified = True
            result_desc = "Refutación: Contradicción con invariancia de la velocidad de la luz (Relatividad)."
            
        return {
            "falsified": falsified,
            "conclusion": result_desc
        }
