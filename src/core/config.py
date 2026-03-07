import os
import yaml

class Config:
    def __init__(self, config_path="config.yaml"):
        self.config_path = config_path
        self.settings = {
            "mode": "libertad_investigacion", # Modos: libertad_investigacion, coherencia_interna
            "max_iterations_per_hypothesis": 3,
            "data_dirs": {
                "input": "data/input",
                "logs": "data/logs",
                "papers": "data/papers",
                "laws_repo": "data/laws_repo",
                "sim_output": "data/sim_output"
            }
        }
        self.load()
    
    def load(self):
        if os.path.exists(self.config_path):
            with open(self.config_path, "r", encoding="utf-8") as f:
                loaded = yaml.safe_load(f)
                if loaded:
                    self.settings.update(loaded)
    
    def get(self, key):
        return self.settings.get(key)
