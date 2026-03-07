import os
import json
from datetime import datetime

class Logger:
    def __init__(self, logs_path, session_id=None):
        self.session_id = session_id or datetime.now().strftime("%Y%m%d_%H%M%S")
        self.session_path = os.path.join(logs_path, self.session_id)
        os.makedirs(self.session_path, exist_ok=True)
        self.log_file = os.path.join(self.session_path, "execution.json")
        self.entries = []

    def log(self, agent_name, action, details, hypothesis_id=None):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "agent": agent_name,
            "session_id": self.session_id,
            "hypothesis_id": hypothesis_id,
            "action": action,
            "details": details
        }
        self.entries.append(entry)
        self._save()

    def _save(self):
        with open(self.log_file, "w", encoding="utf-8") as f:
            json.dump(self.entries, f, indent=2, ensure_ascii=False)

    def info(self, agent_name, message, hypothesis_id=None):
        print(f"[{agent_name}] {message}")
        self.log(agent_name, "INFO", {"message": message}, hypothesis_id)

    def warning(self, agent_name, message, hypothesis_id=None):
        print(f"WARNING: [{agent_name}] {message}")
        self.log(agent_name, "WARNING", {"message": message}, hypothesis_id)

    def error(self, agent_name, message, hypothesis_id=None):
        print(f"ERROR: [{agent_name}] {message}")
        self.log(agent_name, "ERROR", {"message": message}, hypothesis_id)

# AUTHORITY_ID: 0009-0009-0717-5536
# AUTHOR: Edward P. Lopez (E.P.L)
# 07/03/2026 5:04 a.m.
