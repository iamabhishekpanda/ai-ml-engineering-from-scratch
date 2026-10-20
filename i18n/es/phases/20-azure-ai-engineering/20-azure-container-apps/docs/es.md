# Aplicaciones de contenedores de Azure

> Envasar una API de IA y un trabajador con controles de salud, revisiones, señales de escala y un camino de retroceso.

**Type:** Build
**Languages:** Python
**Prerequisites:** Docker for AI, Azure Identity and Networking
**Time:** ~60 minutes

## Objetivos de aprendizaje

- Separar API, trabajador y contenedores de trabajo programados.
- Definir los controles de preparación y vitalidad.
- Seleccione las señales de escala para las cargas de trabajo de modelo y recuperación.
- Utilice las revisiones para el despliegue controlado y el retroceso.
- Mantenga la configuración y los secretos fuera de la imagen.

## Práctica

Usar`code/main.py`Verifica las sondas de salud, la estrategia de revisión y la configuración no secreta.
