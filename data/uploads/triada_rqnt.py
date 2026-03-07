import numpy as np
import matplotlib.pyplot as plt

# ======================================================================
# SIMULADOR R-QNT 2.0: PROTOCOLO DE TRÍADAS Y CIZALLADURA PRIMORDIAL
# Basado en el Manifiesto R-QNT (Paper I)
# ======================================================================

class TriadaABC:
    def __init__(self, id_triada):
        self.id = id_triada
        self.nodos = {'a': 0.0, 'b': 0.0, 'c': 0.0} # Torsión nodal
        self.estado = "Frío" # Estado inicial (Fase 0)
        self.dimension = 3
        self.saturada = False

    def aplicar_tornado(self, error):
        """Aplica la cizalladura relacional del Tornado Cuántico"""
        # El error -1/+1 genera giros opuestos en la tríada
        self.nodos['a'] += error  # Expansión (+1)
        self.nodos['b'] -= error  # Contracción (-1)
        self.nodos['c'] += abs(error) * 0.1 # Estabilización mínima
        
    def calcular_torsion_neta(self):
        # La torsión neta (Omega) es la suma de las tensiones relacionales
        return sum(abs(v) for v in self.nodos.values())

class SimuladorCientificoRQNT:
    def __init__(self, n_triadas=50, pasos=100000):
        self.n_triadas = n_triadas
        self.pasos = pasos
        self.k_max = 4.2  # Límite de Banda Ancha Modular
        self.universo = [TriadaABC(i) for i in range(n_triadas)]
        self.log_rupturas = []
        self.residuos_epsilon = []

    def ejecutar(self):
        print(f"--- INICIANDO SIMULACIÓN CIENTÍFICA R-QNT 2.0 ---")
        for paso in range(self.pasos):
            # 1. Fluctuación Primordial (El Error -1/+1 del Paper I)
            error_primordial = np.random.choice([-0.05, 0.05])
            
            # 2. Selección de Tríada afectada por el Tornado
            triada = np.random.choice(self.universo)
            
            if not triada.saturada:
                triada.aplicar_tornado(error_primordial)
                omega = triada.calcular_torsion_neta()
                
                # 3. Verificación de Saturación y Salto Dimensional
                if omega >= self.k_max:
                    triada.saturada = True
                    triada.dimension = 4
                    epsilon = omega - self.k_max
                    self.residuos_epsilon.append(epsilon)
                    self.log_rupturas.append(paso)
                    
                    if len(self.log_rupturas) == 1:
                        print(f"[*] PASO {paso}: Tríada {triada.id} en Fase 2 (Tornado Crítico).")
                        print(f"    -> Torsión Nodal ABC superó k_max ({self.k_max}).")
                        print(f"    -> Extrusión a 4D detectada (+1).")

        self.finalizar()

    def finalizar(self):
        print("\n--- RESULTADOS FINALES ---")
        print(f"Tríadas evolucionadas a 4D: {len([t for t in self.universo if t.saturada])}")
        if self.residuos_epsilon:
            print(f"Constante Epsilon Promedio (Fricción): {np.mean(self.residuos_epsilon):.5f}")
            print(f"Estabilidad de la Barrera 10k: {np.mean(self.log_rupturas):.0f} pasos.")

if __name__ == '__main__':
    # EJECUCIÓN DEL EXPERIMENTO
    sim = SimuladorCientificoRQNT(n_triadas=100, pasos=100000)
    sim.ejecutar()
