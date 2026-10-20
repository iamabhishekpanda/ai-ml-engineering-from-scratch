# L'identité et le réseautage Azure

> Faites clairement identifier les identités, les limites du réseau et l'accès service à service avant le déploiement.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure AI Engineering Fundamentals
**Time:** ~60 minutes

## Objectifs d'apprentissage

- Distinguer l'identité humaine, l'identité de la charge de travail et l'identité des ressources.
- Préférer l'identité gérée aux informations d'identification intégrées.
- Décrivez les points de départ privés, les entrées et les sorties et les privilèges les plus minces.
- Réviser un plan de déploiement pour les fuites de secrets et de réseau.
- Testez une politique de déni par défaut.

## Pratique

Utilisation `code/main.py`Traiter chaque appel externe comme une limite qui nécessite un propriétaire et un signal d'audit.
