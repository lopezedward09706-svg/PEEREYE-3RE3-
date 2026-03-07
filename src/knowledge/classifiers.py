class Preprocessor:
    def classify(self, content):
        """
        Reglas heurísticas para el preprocesamiento de postulados.
        Simula clasificación NLP:
        - Basura: Expresiones demasiado cortas o inválidas para el rigor metodológico.
        - Sección 3: Formulación matemática altamente estructurada (ecuaciones, derivaciones).
        - Sección 1: Formulación conceptual generalista.
        """
        if len(content.strip()) < 10:
            return "basura"
        
        lower_content = content.lower()
        if "=" in content or "ecuación" in lower_content or "teorema" in lower_content:
            return "seccion_3" 
            
        return "seccion_1"
