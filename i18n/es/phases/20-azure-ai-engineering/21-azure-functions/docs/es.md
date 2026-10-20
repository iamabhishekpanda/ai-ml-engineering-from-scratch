# Funciones de Azure para cargas de trabajo de IA

> Utilice funciones basadas en eventos para tareas limitadas, disparadores de ingestión y orquestación ligera.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Container Apps, APIs & Keys
**Time:** ~60 minutes

## Objetivos de aprendizaje

- Elige funciones para el trabajo limitado y basado en eventos.
- Definir el desencadenante, volver a intentar, tiempo de espera y comportamiento de mensaje venenoso.
- Mantenga a los manipuladores idempotentes y observables.
- Evite colocar trabajos de modelo largos en un camino corto de solicitud.
- Diseñar una entrega duradera a un trabajador.

## Práctica

Usar`code/main.py`Para validar un plan de activación de la función, comprueba la idempotencia, el tiempo de espera, la reutilización y las decisiones de letra muerta.
