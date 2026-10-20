# Identidad y redes de Azure

> Haga explícita la identidad, los límites de la red y el acceso servicio a servicio antes de la implementación.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure AI Engineering Fundamentals
**Time:** ~60 minutes

## Objetivos de aprendizaje

- Distinguir la identidad humana, la identidad de la carga de trabajo y la identidad de los recursos.
- Prefiere la identidad gestionada a las credenciales integradas.
- Describa los puntos finales privados, entradas, salidas y menos privilegios.
- Revise un plan de despliegue para filtraciones secretas y de red.
- Prueba una política de negación por defecto.

## Práctica

Usar`code/main.py`Tratar cada llamada externa como un límite que necesita un propietario y una señal de auditoría.
