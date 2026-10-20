# Operaciones de Azure Prompt

> Tratar las instrucciones, la configuración del modelo, las reglas de seguridad y los resultados de evaluación como entradas de producción versionadas.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure OpenAI, Azure AI Foundry
**Time:** ~60 minutes

## Objetivos de aprendizaje

- Las instrucciones de versión y los parámetros del modelo juntos.
- Construir un pequeño conjunto de datos de regresión antes de cambiar una solicitud.
- Comparar la calidad, la latencia, la negativa y los efectos de costo de token.
- Requerir la aprobación para cambios rápidos en la producción.
- Mantenga los metadatos de retroceso junto a cada liberación.

## Práctica

Usar`code/main.py`Para validar un registro de liberación inmediata. Una liberación necesita un conjunto de datos, umbral, propietario y versión de retroceso.
