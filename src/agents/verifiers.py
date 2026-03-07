from src.agents.base_agent import BaseAgent
import sympy
import re

class BaseVerifier(BaseAgent):
    """Clase base para Verificadores Especializados del SVS."""
    def __init__(self, config, logger):
        super().__init__(config, logger)

    def verify(self, h1, h2, context):
        raise NotImplementedError("Cada verificador debe implementar el método verify.")

class Mathematica(BaseVerifier):
    """MATHEMATICA: Verificador Matemático Simbólico usando SymPy."""
    def verify(self, h1_data, h2_data, context):
        h1 = h1_data.get("content", "")
        h2 = h2_data.get("content", "")
        h_id = h1_data.get("id")
        
        self.info(f"[MATHEMATICA] Analizando consistencia formal de: {h_id}", h_id)
        
        errores = []
        advertencias = []
        score = 1.0
        
        # Extracción de ecuaciones simples para SymPy
        ecuaciones = re.findall(r'([A-Za-z0-9_\^]+)\s*=\s*([A-Za-z0-9_\s\*\/\+\-\.\^\(\)]+)', h2)
        
        if ecuaciones:
            self.info(f"[MATHEMATICA] Detectadas {len(ecuaciones)} ecuaciones. Ejecutando SymPy solver.", h_id)
            for izq, der in ecuaciones:
                try:
                    expr_izq = sympy.sympify(izq)
                    expr_der = sympy.sympify(der)
                    # Comprobaciones básicas matemáticas en SymPy
                    if expr_der.has(sympy.zoo) or expr_der.has(sympy.nan) or "/ 0" in der:
                        errores.append({"descripcion": f"Fallo al sympify o indeterminación en {izq} = {der}", "gravedad": "grave"})
                        score -= 0.5
                except Exception as e:
                    advertencias.append({"descripcion": f"Error de sintaxis matemática de SymPy en {izq} = {der}: {str(e)}", "gravedad": "leve"})
                    score -= 0.1
        
        comparacion = "H2 mantiene la estructura formal simétrica."
        if len(h2) > len(h1):
            comparacion = "H2 expande y corrige la precisión matemática."
            score += 0.05

        return {
            "errores": errores,
            "advertencias": advertencias,
            "score": min(1.0, max(0, score)),
            "comparacion": comparacion,
            "puntuacion_coherencia": min(1.0, max(0, score)),
            "agent": "MATHEMATICA"
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

import ast

class Geometria(BaseVerifier):
    """GEOMETRIA (anteriormente Geometron): Verificador Geométrico y Analizador Sintáctico de Código."""
    def verify(self, h1_data, h2_data, context):
        h2 = h2_data.get("content", "")
        h_id = h1_data.get("id")
        self.info(f"[GEOMETRIA] Verificando métricas (triángulos/esferas) y syntax de código en: {h_id}", h_id)
        
        errores_geom = []
        score = 1.0
        
        # 1. Chequeos Geométricos: Desigualdad Triangular
        if "triángulo" in h2.lower() or "triangulo" in h2.lower():
            lados_match = re.findall(r'lados?\s*(?:son|:|=)\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:y|,)\s*(\d+(?:\.\d+)?)', h2.lower())
            for l1, l2, l3 in lados_match:
                a, b, c = float(l1), float(l2), float(l3)
                if a + b <= c or a + c <= b or b + c <= a:
                    errores_geom.append({"figura": "triángulo", "error": f"Falla en la desigualdad triangular para lados ({a}, {b}, {c})", "gravedad": "grave"})
                    score -= 0.3
                    
        # 2. Fórmula de volumen de la esfera
        if "esfera" in h2.lower() and "volumen" in h2.lower():
            if "4/3" not in h2 and "1.33" not in h2:
                errores_geom.append({"figura": "esfera", "error": "Fórmula del volumen de la esfera es incorrecta (falta factor 4/3)", "gravedad": "grave"})
                score -= 0.3

        # 3. Validación de bloque de código Python sintáctico
        errores_codigo = []
        if "```" in h2:
            codigo_blocks = re.findall(r'```(?:python)?\n(.*?)```', h2, re.DOTALL)
            for bloque in codigo_blocks:
                try:
                    ast.parse(bloque)
                except SyntaxError as e:
                    errores_codigo.append({"error": f"Error de sintaxis en el bloque de código provisto (línea {e.lineno}): {e.msg}", "gravedad": "grave"})
                    score -= 0.3

        return {
            "errores_geometricos": errores_geom,
            "errores": errores_geom + errores_codigo,
            "errores_codigo": errores_codigo,
            "coherencia_visual": f"Verificados {len(errores_geom)} errores geométricos y {len(errores_codigo)} errores de código.",
            "score": max(0.0, score),
            "agent": "GEOMETRIA"
        }

# AUTHORITY_ID: 0009-0009-0717-5536
# AUTHOR: Edward P. Lopez (E.P.L)
# 07/03/2026 5:04 a.m.
