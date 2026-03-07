# PEEREYE-3RE3- (°∟Æÿ3RE3¶)
**Validación por Pares Mediante IA - Escrutinio Científico de Alta Fidelidad**

---

## 🚀 INTRODUCCIÓN
PEEREYE (°∟Æÿ3RE3¶) es una matriz de validación científica multi-agente diseñada para procesar, refinar y validar hipótesis físicas mediante un ciclo dialéctico de falsación y validación matética.

**Autoría:** Edward P. Lopez | **ID:** 0009-0009-0717-5536
**Ubicación:** Ciudad Juárez, Chihuahua, México.

---

## 🛠️ INSTRUCCIONES DE DESPLIEGUE (MÚLTIPLES MÉTODOS)

PEEREYE ofrece diferentes métodos de instalación para adaptarse a cualquier usuario. Elige el que te resulte más cómodo:

### MODO 1: Instalación de 1 Click (Recomendado)
No necesitas saber usar Git. Solo descarga y ejecuta un archivo script que hará todo por ti.

1. Descarga el archivo [PEEREYE_INSTALLER.py](https://raw.githubusercontent.com/lopezedward09706-svg/PEEREYE-3RE3-/main/PEEREYE_INSTALLER.py).
2. Guárdalo en una carpeta vacía.
3. Abre tu terminal de comandos en esa carpeta y ejecuta:
```bash
python PEEREYE_INSTALLER.py
```
*El script descargará, extraerá, configurará las dependencias y lanzará el servidor de forma automática.*

### MODO 2: Método Clásico (Git Clone)
Si eres desarrollador y prefieres tener el repositorio conectado para futuras actualizaciones:

1. Clona el repositorio:
```bash
git clone https://github.com/lopezedward09706-svg/PEEREYE-3RE3-.git
cd PEEREYE-3RE3-
```
2. (Opcional) Crea un entorno virtual: `python -m venv venv` y actívalo.
3. Instala los requerimientos:
```bash
pip install -r requirements.txt
```
4. Inicia el servidor:
```bash
python main.py
```

### MODO 3: Descarga Manual (Archivo ZIP)
Si no quieres usar la terminal para la descarga:

1. Ve a la página del repositorio en GitHub: [Ir al Repositorio](https://github.com/lopezedward09706-svg/PEEREYE-3RE3-).
2. Haz clic en el botón verde **"Code"** y luego en **"Download ZIP"**.
3. Extrae el ZIP en tu computadora.
4. Abre la carpeta extraída en tu terminal, instala las dependencias (`pip install -r requirements.txt`) y ejecuta el archivo principal (`python main.py`).

Una vez iniciado mediante cualquier método, el sistema estará disponible en tu navegador en: `http://localhost:5000`

---

## 🧪 GUÍA DE USO (MODOS DE INTERACCIÓN)

### A. Gestión de Conocimiento (Input)
Puedes inyectar hipótesis de tres formas:
1. **Texto Directo**: Pega tu teoría en el cuadro de texto.
2. **URL/Drive**: Encola enlaces a documentos públicos.
3. **Cerebro (Carpeta)**: Proporciona una ruta local para importar un compendio de archivos `.txt`, `.md` o `.py` recursivamente.

### B. Panel de Control de Agentes
Antes de lanzar el ciclo, activa/desactiva los agentes según el nivel de rigor deseado:
- **MATHION/PHYSIS**: Verificación formal.
- **SIMULUS**: Ejecución de simulaciones NumPy.
- **DR_HARDT**: Activa el filtro del "Escéptico Nobel" para un escrutinio final implacable.

### C. Ciclo de Validación
Presiona **"Lanzar Ciclo de Validación"**. El sistema tomará el primer ítem de la cola y ejecutará:
1. Doble vuelta de validación (Aletheia vs Elenchus).
2. Generación de informes de verificación.
3. Debate de fallos.
4. Oráculo de decisión.
5. (Si es aceptado) Generación de Paper LaTeX y Simulación.

### D. Repositorio de Leyes
Accede al botón **"Ver Repositorio de Leyes"** para explorar las leyes validadas en una interfaz académica premium con visualizaciones dinámicas.

---

## 📁 ESTRUCTURA DEL PROYECTO
- `/src/agents`: Lógica de los agentes (Aletheia, DrHardt, Simulus, etc).
- `/src/core`: Motor de flujo y ciclo de validación.
- `/src/web`: Interfaz de usuario y servidor Flask.
- `/data`: Almacenamiento persistente de leyes, papers y logs.

---
© 2026 Edward P. Lopez | PEEREYE-3RE3- | °∟Æÿ3RE3¶ PROTECTED
