import os
import requests
import zipfile
import subprocess
import sys

# AUTHORITY_ID: 0009-0009-0717-5536
# AUTHOR: Edward P. Lopez (E.P.L)
# PROJECT: PEEREYE-3RE3- (°∟Æÿ3RE3¶)

def install_peereye():
    repo_url = "https://github.com/lopezedward09706-svg/PEEREYE-3RE3-/archive/refs/heads/main.zip"
    zip_name = "peereye_matrix.zip"
    extract_dir = "PEEREYE_DEPLOYED"

    print("--- INICIANDO PROTOCOLO DE DESPLIEGUE PEEREYE-3RE3- (°∟Æÿ3RE3¶) ---")
    print(f"Descargando núcleo desde: {repo_url}")

    # 1. Descarga del ZIP
    try:
        r = requests.get(repo_url)
        with open(zip_name, 'wb') as f:
            f.write(r.content)
    except Exception as e:
        print(f"ERROR: No se pudo conectar con el servidor de PEEREYE. {e}")
        return

    # 2. Extracción
    print("Extrayendo matriz de validación...")
    with zipfile.ZipFile(zip_name, 'r') as zip_ref:
        zip_ref.extractall(".")
    
    # Renombrar carpeta extraída (GitHub la nombra repo-main)
    old_folder = "PEEREYE-3RE3--main"
    if os.path.exists(old_folder):
        if os.path.exists(extract_dir):
            import shutil
            shutil.rmtree(extract_dir)
        os.rename(old_folder, extract_dir)

    # 3. Instalación de Dependencias
    print("Instalando dependencias científicas (NumPy, SciPy, Flask)...")
    req_path = os.path.join(extract_dir, "requirements.txt")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", req_path])

    # 4. Lanzamiento
    print("\n--- DESPLIEGUE COMPLETADO ---")
    print(f"Entrando en el directorio: {extract_dir}")
    print("Iniciando PEEREYE Matrix...")
    
    main_path = os.path.join(extract_dir, "main.py")
    subprocess.Popen([sys.executable, main_path], cwd=extract_dir)
    
    print("\n[ÉXITO] Servidor activo en: http://localhost:5000")
    print("Accede ahora para iniciar la validación científica.")

if __name__ == "__main__":
    # Asegurar que requests esté instalado para el instalador
    try:
        import requests
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
        import requests
    
    install_peereye()
