import os
import zipfile
import subprocess
import shutil
import time
import json
from src.agents.base_agent import BaseAgent

class ExternalSimValidator(BaseAgent):
    """
    ExternalSimValidator: Validador de Simulaciones Externas (ZIP).
    Ejecuta código externo en sandbox (simulado) y compara resultados con leyes validadas.
    """
    def __init__(self, config, logger, laws_repo):
        super().__init__(config, logger)
        self.laws_repo = laws_repo
        self.temp_dir = "./data/temp_sim"
        os.makedirs(self.temp_dir, exist_ok=True)

    def validate_zip(self, zip_path):
        h_id = f"EXT_SIM_{int(time.time())}"
        self.info(f"[EXT_VALIDATOR] Iniciando validación de simulación externa: {zip_path}", h_id)
        
        # 1. Extracción
        extract_path = os.path.join(self.temp_dir, h_id)
        os.makedirs(extract_path, exist_ok=True)
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_path)
        except Exception as e:
            self.error(f"Error extrayendo ZIP: {str(e)}", h_id)
            return {"status": "error", "message": "Archivo ZIP corrupto."}

        # 2. Búsqueda de punto de entrada
        entry_point = self._find_entry_point(extract_path)
        if not entry_point:
            return {"status": "inválida", "message": "No se encontró un archivo simulación.py o main.py."}

        # 3. Ejecución (Simulada para el blueprint, real usaría subprocess)
        self.info(f"Ejecutando simulación externa: {entry_point}", h_id)
        execution_results = self._simulate_execution(entry_point)

        # 4. Comparación con Leyes locales
        laws = self.laws_repo.get_all_laws()
        coherence_score = self._check_coherence(execution_results, laws)

        # 5. Resultado
        status = "válida" if coherence_score > 0.8 else "inválida"
        if coherence_score > 0.6 and coherence_score <= 0.8: status = "requiere revisión"

        report = {
            "id": h_id,
            "status": status,
            "coherence": coherence_score,
            "output_logs": execution_results["logs"],
            "visualizations": execution_results["plots"]
        }
        
        self.info(f"Veredicto Simulación Externa: {status.upper()} (S:{coherence_score})", h_id)
        
        # Limpieza
        # shutil.rmtree(extract_path) # Comentado para bitácora
        
        return report

    def _find_entry_point(self, path):
        for f in ["main.py", "simulacion.py", "sim.py"]:
            if os.path.exists(os.path.join(path, f)):
                return os.path.join(path, f)
        return None

    def _simulate_execution(self, path):
        # Simula la captura de stdout y artefactos
        time.sleep(1) # Simulación de cómputo
        return {
            "logs": "Iniciando integración numérica... Convergencia alcanzada. E_total = Constant.",
            "plots": ["ext_sim_result_1.png"],
            "data_summary": {"energy_loss": 0.0001, "particles": 1000}
        }

    def _check_coherence(self, res, laws):
        # Lógica heurística de comparación
        if not laws: return 1.0 # Si no hay leyes, todo es coherente (libertad)
        
        # Simulación de choque con leyes conocidas
        if "Constant" in res["logs"]:
            return 0.95
        return 0.4
