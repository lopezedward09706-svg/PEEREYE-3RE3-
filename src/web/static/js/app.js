document.addEventListener('DOMContentLoaded', function() {
    const importBtnText = document.getElementById('btn-import-text');
    const importBtnUrl = document.getElementById('btn-import-url');
    const importBtnDir = document.getElementById('btn-import-dir');
    const validateBtn = document.getElementById('btn-validate');
    const resetBtn = document.getElementById('btn-reset');
    const uploadSimBtn = document.getElementById('btn-upload-sim');
    
    // 1. CARGA INICIAL
    refreshLogs();

    // 2. TOGGLE DE AGENTES
    document.querySelectorAll('.agent-toggle').forEach(toggle => {
        toggle.onchange = (e) => {
            const agent = e.target.getAttribute('data-agent');
            const formData = new FormData();
            formData.append('agent', agent);
            fetch('/toggle_agent', { method: 'POST', body: formData })
              .then(r => r.json());
        };
    });

    // 3. IMPORTACIONES (Texto, Dirichlet, URL)
    if(importBtnText) importBtnText.onclick = () => {
        const text = document.getElementById('import-text').value;
        if (!text) return;
        const formData = new FormData();
        formData.append('content', text);
        fetch('/import_text', { method: 'POST', body: formData }).then(() => {
            document.getElementById('import-text').value = '';
            refreshLogs();
        });
    };

    if(importBtnDir) importBtnDir.onclick = () => {
        const path = document.getElementById('import-dir').value;
        if (!path) return;
        const formData = new FormData();
        formData.append('path', path);
        fetch('/import_dir', { method: 'POST', body: formData }).then(() => {
            document.getElementById('import-dir').value = '';
            refreshLogs();
        });
    };

    // 4. SUBIDA DE SIMULACIÓN EXTERNA
    uploadSimBtn.onclick = () => {
        const fileInput = document.getElementById('sim-zip');
        if (!fileInput.files.length) return;
        
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        uploadSimBtn.disabled = true;
        uploadSimBtn.innerText = "Validando ZIP...";
        
        fetch('/upload_sim', { method: 'POST', body: formData })
          .then(r => r.json())
          .then(res => {
              uploadSimBtn.disabled = false;
              uploadSimBtn.innerText = "Validar Sim Externa";
              if (res.status === 'success') {
                  alert("Veredicto: " + res.report.status.toUpperCase() + "\nCoherencia: " + res.report.coherence);
                  refreshLogs();
              }
          });
    };

    // 5. VALIDACIÓN (ITERACIÓN)
    validateBtn.onclick = () => {
        validateBtn.disabled = true;
        validateBtn.innerText = "EJECUTANDO SISTEMA...";
        
        fetch('/validate', { method: 'POST' })
          .then(r => r.json())
          .then(res => {
              validateBtn.disabled = false;
              validateBtn.innerText = "Lanzar Ciclo de Validación";
              
              if (res.status === 'success') {
                  refreshLogs();
                  
                  // Manejo de SIMULUS e Internal Dialogue
                  if (res.results && res.results.simulation) {
                      displaySim('EUREKA', 'Simulación de Ley: ' + res.results.h_id);
                      if (res.results.sim_debate) {
                          console.log("Debate de Simulación Detectado");
                      }
                  }
              }
          });
    };

    // 6. LOGS POLLING (Simulado por ahora con refresco en acciones)
    function refreshLogs() {
        fetch('/logs')
          .then(r => r.json())
          .then(logs => {
              const container = document.getElementById('log-container');
              container.innerHTML = '';
              logs.forEach(log => {
                  const div = document.createElement('div');
                  div.className = 'p-2 border-bottom log-row small';
                  const timestamp = log.timestamp ? log.timestamp.split('T')[1].split('.')[0] : 'Time';
                  const agentClass = log.agent === 'SIMULUS' ? 'text-success' : 'text-primary';
                  div.innerHTML = `
                    <span class="${agentClass} fw-bold">[${timestamp}] ${log.agent}</span>: 
                    <span class="text-secondary">${log.message || log.action}</span>
                  `;
                  container.appendChild(div);
              });
              container.scrollTop = container.scrollHeight;
          });
    }

    function displaySim(status, msg) {
        const el = document.getElementById('sim-status');
        if(el) {
            el.innerText = status;
            el.className = 'h1 fw-black text-success';
            document.getElementById('sim-details').innerText = msg;
        }
    }
});
