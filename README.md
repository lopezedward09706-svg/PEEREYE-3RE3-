# ANTIGRAVYTI SVS - Sistema de Validación Científica Multi-Agente

## Descripción General
Este es un blueprint técnico diseñado por Antigravyti para la validación teórica de postulados físicos mediante un proceso riguroso multi-agente, implementado 100% en Python determinista.

## Arquitectura
- **/src/knowledge**: Gestión de ingesta y clasificación inicial de hipótesis (Sec1, Sec3, Basura).
- **/src/core**: Bucle principal de validación y control de flujo telemetral.
- **/src/agents**: Orquestación de Agentes Verificadores (Matemáticas, Filosofía, BOOS, etc).
- **/data**: Repositorios de logs de decisión (`/logs`), Output LaTeX (`/papers`), y Repositorio Fundamental (`/laws_repo`).

## Requisitos
Python 3.8+ 
```bash
pip install pyyaml
```

## Ejecución
Ejecutar el pipeline de demostración:
```bash
python main.py
```
> La ejecución injectará datos en `data/input`, los procesará secuencialmente, debatirá las fallas a nivel de tensores y emitirá Papers completos en inglés y español.
