import os
import json

class UIReportGenerator:
    def __init__(self, data_path, output_path, static_path):
        self.data_path = data_path
        self.output_path = output_path
        self.static_path = static_path
        os.makedirs(output_path, exist_ok=True)

    def generate(self, session_id):
        session_data_path = os.path.join(self.data_path, session_id, "execution.json")
        if not os.path.exists(session_data_path):
            print(f"Error: No se encontró data para la sesión {session_id}")
            return

        with open(session_data_path, "r", encoding="utf-8") as f:
            logs = json.load(f)

        # Cargar template base
        template_path = os.path.join(os.path.dirname(__file__), "templates", "index.html")
        with open(template_path, "r", encoding="utf-8") as f:
            html = f.read()

        # Inyección de logs estática
        log_html = ""
        for log in logs:
            level = log.get("level", "INFO")
            agent = log.get("agent", "UNKNOWN")
            timestamp = log.get("timestamp", "0000-00-00T00:00:00")
            # Manejo seguro de message y data si message no existe
            details = log.get("details", {})
            message = log.get("message")
            if message is None:
                message = details.get("message", str(details))
            
            level_cls = "badge-success" if level == "INFO" else "badge-danger"
            log_html += f"""
            <div class="log-entry">
                <span class="badge {level_cls}">{level}</span>
                <strong>[{timestamp[11:19]}] {agent}:</strong> {message}
            </div>
            """
        
        # Inyección de debate
        debate_html = ""
        for log in logs:
            details = log.get("details", {})
            message = log.get("message")
            if message is None:
                message = details.get("message", str(details))
            
            msg_lower = message.lower()
            action = log.get("action", "")
            if "DEBATE" in action or "debate" in msg_lower:
                cls = "flaw-msg" if "fallo" in msg_lower or "FLAW" in log.get("agent", "") else "success-msg"
                debate_html += f'<div class="debate-message {cls}">{message}</div>'

        # Reemplazos en el HTML
        html = html.replace('<!-- Inyectado dinámicamente -->', log_html)
        html = html.replace('<div id="debate-viewer">', f'<div id="debate-viewer">{debate_html}')
        
        report_file = os.path.join(self.output_path, f"dashboard_{session_id}.html")
        with open(report_file, "w", encoding="utf-8") as f:
            f.write(html)
        
        print(f"[UI] Informe estático generado en: {report_file}")
        return report_file
