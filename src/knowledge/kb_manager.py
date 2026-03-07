import os
import time
import zipfile
import io

class Classifier:
    def __init__(self, config):
        self.rules = config.get('classifier_rules', {
            'min_length': 20,
            'high_quality_keywords': ["teorema", "ecuación:", "fórmula:", "hipótesis", "ley", "cuántico", "masa", "energía"],
            'basura_keywords': ["error", "malformed", "lorem ipsum"]
        })

    def classify(self, content):
        content_lower = content.lower()
        
        # Basura: muy corto, palabras basura detected
        if len(content.strip()) < self.rules.get('min_length', 20) or \
           any(kw in content_lower for kw in self.rules.get('basura_keywords', [])):
            return "basura"
            
        # Sección 3: Puntos precisos
        if any(kw in content_lower for kw in ["ecuación:", "fórmula:"]):
            return "seccion_3"
            
        # Puntos precisos por palabras clave generales
        if any(kw in content_lower for kw in self.rules.get('high_quality_keywords', [])):
            return "seccion_1"
            
        return "pendiente"

class KBManager:
    def __init__(self, config, logger):
        self.config = config
        self.logger = logger
        self.classifier = Classifier(config)

    def import_from_text(self, text, session_state):
        filename = f"text_import_{int(time.time())}.txt"
        self.logger.info("KB_MANAGER", f"Importando texto directo asigned ID: {filename}")
        item = {
            "id": filename,
            "content": text,
            "timestamp": time.time(),
            "source": "text_direct"
        }
        session_state['files_queue'].append(item)
        session_state['files_queue'].sort(key=lambda x: x['timestamp'])

    def import_from_file_path(self, filepath, session_state):
        filename = os.path.basename(filepath)
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        item = {
            "id": filename,
            "content": content,
            "timestamp": os.path.getmtime(filepath),
            "source": "local_file"
        }
        session_state['files_queue'].append(item)
        session_state['files_queue'].sort(key=lambda x: x['timestamp'])

    def import_from_zip(self, zip_path, session_state):
        self.logger.info("KB_MANAGER", f"Descomprimiendo archivos desde ZIP: {zip_path}")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            for zip_info in zip_ref.infolist():
                if zip_info.is_dir(): continue
                with zip_ref.open(zip_info) as f:
                    content = f.read().decode('utf-8', errors='ignore')
                item = {
                    "id": zip_info.filename,
                    "content": content,
                    "timestamp": time.mktime(zip_info.date_time + (0, 0, -1)),
                    "source": "zip_file"
                }
                session_state['files_queue'].append(item)
        session_state['files_queue'].sort(key=lambda x: x['timestamp'])

    def import_from_url_sim(self, url, session_state):
        # Simulación de importación HTML/URL
        domain = url.split("//")[-1].split("/")[0]
        filename = f"web_import_{domain}_{int(time.time())}.txt"
        content = f"CONTENIDO SIMULADO DE PÁGINA: {url}\n\nHipótesis: La curvatura del espacio tiempo define el desplazamiento de ondas en el vacío.\n\nEcuación: G_uv = 8.pi.G.T_uv"
        item = {
                "id": filename,
                "content": content,
                "timestamp": time.time(),
                "source": "html_url"
            }
        session_state['files_queue'].append(item)
        session_state['files_queue'].sort(key=lambda x: x['timestamp'])

    def import_from_drive_sim(self, drive_link, session_state):
        # Simulación de Google Drive
        doc_id = drive_link.split("/")[-1]
        filename = f"drive_import_{doc_id[:5]}.txt"
        content = f"HIPÓTESIS DE DRIVE ({doc_id}):\n\nPrincipio de incertidumbre refinado por Antigravyti.\n\nFórmula: delta_x * delta_p >= h_barra / 2"
        item = {
                "id": filename,
                "content": content,
                "timestamp": time.time(),
                "source": "google_drive"
            }
        session_state['files_queue'].append(item)
        session_state['files_queue'].sort(key=lambda x: x['timestamp'])

    def import_from_directory(self, dir_path, session_state):
        """Importa todos los archivos de texto de una carpeta como compendio de conocimiento."""
        if not os.path.isdir(dir_path):
            self.logger.error("KB_MANAGER", f"La ruta proporcionada no es una carpeta válida: {dir_path}")
            return False
            
        self.logger.info("KB_MANAGER", f"Importando cerebro/compendio desde carpeta: {dir_path}")
        count = 0
        for root, dirs, files in os.walk(dir_path):
            for file in files:
                if file.endswith(('.txt', '.md', '.tex', '.py')):
                    full_path = os.path.join(root, file)
                    try:
                        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                            content = f.read()
                        item = {
                            "id": os.path.relpath(full_path, dir_path),
                            "content": content,
                            "timestamp": os.path.getmtime(full_path),
                            "source": "directory_import"
                        }
                        session_state['files_queue'].append(item)
                        count += 1
                    except Exception as e:
                        self.logger.error("KB_MANAGER", f"Error leyendo {file}: {str(e)}")
                        
        session_state['files_queue'].sort(key=lambda x: x['timestamp'])
        self.logger.info("KB_MANAGER", f"Importación de carpeta completada: {count} archivos añadidos.")
        return True

    def process_next_batch(self, session_state, batch_size=1):
        """Procesa el siguiente lote de archivos en la cola y los clasifica."""
        processed_items = []
        for _ in range(min(batch_size, len(session_state['files_queue']))):
            file_item = session_state['files_queue'].pop(0)
            category = self.classifier.classify(file_item["content"])
            item = {
                **file_item,
                "category": category
            }
            session_state['items'].append(item)
            processed_items.append(item)
            self.logger.info("KB_MANAGER", f"Item {item['id']} clasificado como: {category}", item['id'])
        return processed_items

# AUTHORITY_ID: 0009-0009-0717-5536
# AUTHOR: Edward P. Lopez (E.P.L)
# 07/03/2026 5:04 a.m.
