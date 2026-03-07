# AUTHORITY_ID: 0009-0009-0717-5536
# AUTHOR: Edward lopez, E.P.L, Edward P. Lopez & Edward Perez Lopez
# LOCATION: ciudad juarez/chihuahua/Mexico. 2026-03-07 05:04 a. m.
# _RESONANCE_METADATA = "MDAwOS0wMDA5LTA3MTctNTUzNihFZHdhcmQgbG9wZXosIEUuUC5MLCBFZHdhcmQgUC4gTG9wZXogJiBFZHdhcmQgUGVyZXogTG9wZXouIChjdWFrcXVpZXJhIGVzIHZhbGlkbyk7ICkgY2l1ZGFkIGp1YXJlei9jaGlodWFodWEvTWV4aWNvLiAwNy8wMy8yMDI2IDU6MDQgYS4gbS4="

from flask import Flask, render_template, request, jsonify, session, send_file
import os
import time
import json
import yaml
import zipfile
import io
import sys

# Agregando ruta base para módulos
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.core.logger import Logger
from src.knowledge.kb_manager import KBManager
from src.core.workflow import WorkflowEngine
from src.agents.external_validator import ExternalSimValidator
from src.agents.sim_ai import LawsRepository

app = Flask(__name__, 
            template_folder='src/web/templates',
            static_folder='src/web/static')
app.secret_key = 'ANTIGRAVYTI_SVS_MATRIX_KEY'

# Configuración Base
config = {
    "mode": "freedom",
    "max_iterations_per_hypothesis": 3,
    "logs_path": "./data/logs",
    "papers_path": "./data/papers",
    "laws_repo_path": "./data/laws_repo",
    "sim_output_path": "./data/sim_output",
    "uploads_path": "./data/uploads",
    "classifier_rules": {"min_length": 25},
    "max_complejidad": 20
}

def init_svs_session():
    if 'session_id' not in session:
        session['session_id'] = f"SVS_SESSION_{int(time.time())}"
        session['files_queue'] = []
        session['items'] = []
        session['iteration_count'] = 0
        session['laws'] = []
        session['active_agents'] = ["MATHION", "PHYSIS", "GEOMETRON", "DEBATE", "SIMULUS", "DR_HARDT"]
        session['logs_count'] = 0

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    if email:
        session['user_email'] = email
        session['drive_sync'] = True
        return jsonify({"status": "success", "user": email})
    return jsonify({"status": "error", "message": "Email requerido"}), 400

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_email', None)
    session.pop('drive_sync', None)
    return jsonify({"status": "success"})

@app.route('/')
def index():
    if 'items' not in session:
        init_svs_session()
    
    user = session.get('user_email', None)
    
    session_data = {
        'queue_length': len(session['items']),
        'iteration': session['iteration_count'],
        'laws_count': len(session['laws']),
        'active_agents': session['active_agents']
    }
    return render_template('index.html', session_data=session_data, user=user)

@app.route('/toggle_agent', methods=['POST'])
def toggle_agent():
    init_svs_session()
    agent = request.form.get('agent')
    if agent:
        active = session['active_agents']
        if agent in active: active.remove(agent)
        else: active.append(agent)
        session['active_agents'] = active
        return jsonify({"status": "success", "active": active})
    return jsonify({"status": "error"})

@app.route('/import_text', methods=['POST'])
def import_text():
    init_svs_session()
    text = request.form.get('content')
    if text:
        logger = Logger(config.get("logs_path"), session['session_id'])
        kb = KBManager(config, logger)
        kb.import_from_text(text, session)
        return jsonify({"status": "success"})
    return jsonify({"status": "error"})

@app.route('/import_dir', methods=['POST'])
def import_dir():
    init_svs_session()
    path = request.form.get('path')
    if path:
        logger = Logger(config.get("logs_path"), session['session_id'])
        kb = KBManager(config, logger)
        kb.import_from_directory(path, session)
        return jsonify({"status": "success"})
    return jsonify({"status": "error"})

@app.route('/validate', methods=['POST'])
def validate():
    init_svs_session()
    logger = Logger(config.get("logs_path"), session['session_id'])
    kb = KBManager(config, logger)
    workflow = WorkflowEngine(config, logger, active_agents=session['active_agents'])
    
    items = kb.process_next_batch(session, batch_size=1)
    if not items:
        return jsonify({"status": "empty"})
    
    item = items[0]
    session['iteration_count'] += 1
    
    # Control de Iteraciones por Hipótesis
    item_iters = item.get("h_iters", 0) + 1
    item["h_iters"] = item_iters
    
    results = workflow.run_iteration(item, session)
    
    # Lógica de REHACER (Opción 2)
    if results.get("decision", {}).get("option") == 2:
        if item_iters < config["max_iterations_per_hypothesis"]:
            logger.info("MAIN", f"REHACER: Re-encolando {item['id']} (Intento {item_iters})")
            # Re-encolar con prioridad alta (al inicio)
            session['files_queue'].insert(0, item)
        else:
            logger.info("MAIN", f"Límite de iteraciones alcanzado para {item['id']}. Descartando.")

    return jsonify({"status": "success", "results": results, "iteration": session['iteration_count']})

@app.route('/upload_sim', methods=['POST'])
def upload_sim():
    init_svs_session()
    if 'file' not in request.files: return jsonify({"status": "error"})
    file = request.files['file']
    if file.filename == '': return jsonify({"status": "error"})
    
    upload_path = os.path.join(config["uploads_path"], file.filename)
    os.makedirs(config["uploads_path"], exist_ok=True)
    file.save(upload_path)
    
    logger = Logger(config.get("logs_path"), session['session_id'])
    laws_repo = LawsRepository(config.get("laws_repo_path"))
    validator = ExternalSimValidator(config, logger, laws_repo)
    
    report = validator.validate_zip(upload_path)
    return jsonify({"status": "success", "report": report})

@app.route('/repository')
def repository():
    if 'items' not in session:
        init_svs_session()
    user = session.get('user_email', None)
    return render_template('repository.html', laws=session.get('laws', []), user=user)

@app.route('/logs')
def get_logs():
    init_svs_session()
    log_file = os.path.join(config.get("logs_path"), session['session_id'], "execution.json")
    if os.path.exists(log_file):
        with open(log_file, "r", encoding="utf-8") as f:
            return jsonify(json.load(f))
    return jsonify([])

@app.route('/reset', methods=['POST'])
def reset():
    session.clear()
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
