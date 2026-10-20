# Despliegue de Agentes de Azure

> Implemente agentes que utilicen herramientas con estado explícito, permisos, aprobaciones, tiempos de espera y vías de recuperación.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Functions for AI Workloads, Azure Security and Secrets
**Time:** ~75 minutes

## Objetivos de aprendizaje

- Modela un agente como una máquina de estado con transiciones limitadas.
- Aplicar permisos de herramienta por tarea y contexto de usuario.
- Añadir puertas de aprobación para acciones irreversibles.
- Recupera de los tiempos de espera, eventos duplicados y fallos parciales de la herramienta.
- Rastrear cada decisión sin almacenar cargas útiles sensibles.

## Práctica

Usar`code/main.py`Cada borde de herramienta necesita permiso, tiempo de espera, retoma y comportamiento de auditoría.
