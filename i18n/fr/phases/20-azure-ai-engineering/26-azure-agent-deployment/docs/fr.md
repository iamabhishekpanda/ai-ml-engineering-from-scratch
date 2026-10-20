# Déploiement d'agents Azure

> Déployer des agents utilisant des outils avec un état explicite, des autorisations, des approbations, des délais et des voies de récupération.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Functions for AI Workloads, Azure Security and Secrets
**Time:** ~75 minutes

## Objectifs d'apprentissage

- Modélisez un agent comme une machine d'état avec des transitions limitées.
- Appliquer les autorisations d'outil par tâche et par contexte d'utilisateur.
- Ajouter des portes d'approbation pour des actions irréversibles.
- Récupérer des temps d'arrêt, des événements dupliqués et des pannes partielles de l'outil.
- Suivre chaque décision sans stocker des charges utiles sensibles.

## Pratique

Utilisation `code/main.py`Chaque bord d'outil a besoin d'autorisation, de temps d'arrêt, de réessayer et de vérifier le comportement.
