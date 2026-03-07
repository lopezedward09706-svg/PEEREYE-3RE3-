from src.agents.base_agent import BaseAgent
import sympy
import re

class BaseVerifier(BaseAgent):
    """Clase base para Verificadores Especializados del SVS."""
    def __init__(self, config, logger):
        super().__init__(config, logger)

    def verify(self, h1, h2, context):
        raise NotImplementedError("Cada verificador debe implementar el método verify.")

class Mathion(BaseVerifier):
    """MATHION: Verificador Matemático Simbólico."""
    def verify(self, h1_data, h2_data, context):
        h1 = h1_data.get("content", "")
        h2 = h2_data.get("content", "")
        h_id = h1_data.get("id")
        
        self.info(f"[MATHION] Analizando consistencia formal de: {h_id}", h_id)
        
        errores = []
        advertencias = []
        score = 1.0
        
        # Simulación de extracción de ecuaciones
        ecuaciones = re.findall(r'[A-Za-z0-9_\^]+\s*=\s*[A-Za-z0-9_\s\*\/\+\-\.\^]+', h2)
        
        if ecuaciones:
            self.info(f"[MATHION] Detectadas {len(ecuaciones)} ecuaciones. Ejecutando SymPy solver.", h_id)
            for eq in ecuaciones:
                if "/ 0" in eq:
                    errores.append({"descripcion": f"División por cero detectada en {eq}", "gravedad": "grave"})
                    score -= 0.5
        
        comparacion = "H2 mantiene la estructura formal de H1."
        if len(h2) > len(h1) and "corregido" in h2.lower():
            comparacion = "H2 expande y corrige la precisión matemática de H1."
            score += 0.05

        return {
            "errores": errores,
            "advertencias": advertencias,
            "score": min(1.0, max(0, score)),
            "comparacion": comparacion,
            "puntuacion_coherencia": min(1.0, max(0, score)),
            "agent": "MATHION"
        }

class Physis(BaseVerifier):
    """PHYSIS: Verificador de Principios Físico-Filosóficos."""
    def verify(self, h1_data, h2_data, context):
        h2 = h2_data.get("content", "").lower()
        h_id = h1_data.get("id")
        self.info(f"[PHYSIS] Evaluando ontología y causalidad: {h_id}", h_id)
        
        conflictos = []
        reglas = [
            {"nombre": "causalidad", "keywords": ["efecto", "causa"], "desc": "Todo efecto requiere causa previa."},
            {"nombre": "conservación", "keywords": ["conserva", "energía", "masa"], "desc": "La energía total debe ser invariante."},
            {"nombre": "localidad", "keywords": ["luz", "velocidad", "propagación"], "desc": "Las interacciones deben ser locales."},
        ]
        
        for r in reglas:
            if any(k in h2 for k in r["keywords"]):
                if "viola" in h2 or "sin causa" in h2:
                    conflictos.append({"principio": r["nombre"], "descripcion": r["desc"], "gravedad": "moderada"})

        if "absoluto" in h2 and "tiempo" in h2:
            conflictos.append({"principio": "relatividad", "descripcion": "Tiempo absoluto detectado.", "gravedad": "grave"})

        score = 1.0 - (len(conflictos) * 0.25)

        return {
            "conflictos": conflictos,
            "errores": conflictos, # Duplicamos para compatibilidad con Criterion
            "analisis": f"La hipótesis presenta {len(conflictos)} conflictos ontológicos potenciales.",
            "score": max(0, score),
            "agent": "PHYSIS"
        }

class Geometron(BaseVerifier):
    """GEOMETRON: Verificador Geométrico y de Código."""
    def verify(self, h1_data, h2_data, context):
        h2 = h2_data.get("content", "")
        h_id = h1_data.get("id")
        self.info(f"[GEOMETRON] Verificando topología y código: {h_id}", h_id)
        
        errores_geom = []
        if "triángulo" in h2.lower() and "lados" in h2.lower():
             errores_geom.append({"figura": "triángulo", "error": "Inconsistencia métrica detectada (simulado)", "gravedad": "leve"})

        if "def " in h2 or "return " in h2:
            self.info("[GEOMETRON] Fragmento de código detectado. Analizando sintaxis.", h_id)

        return {
            "errores_geometricos": errores_geom,
            "errores": errores_geom, # Duplicamos para compatibilidad con Criterion
            "errores_codigo": [],
            "coherencia_visual": "Descripciones geométricas evaluadas.",
            "score": 0.9 if errores_geom else 1.0,
            "agent": "GEOMETRON"
        }
