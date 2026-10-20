# Les opérations de mise à jour Azure

> Traiter les instructions, les paramètres de modèle, les règles de sécurité et les résultats d'évaluation comme des entrées de production versionnées.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure OpenAI, Azure AI Foundry
**Time:** ~60 minutes

## Objectifs d'apprentissage

- Les instructions de version et les paramètres du modèle ensemble.
- Construisez un petit ensemble de données de régression avant de modifier une requête.
- Comparer la qualité, la latence, le refus et les effets du coût des jetons.
- Requérir l'approbation pour les modifications rapides de la production.
- Gardez les métadonnées de retour à côté de chaque sortie.

## Pratique

Utilisation `code/main.py`Pour valider un enregistrement de sortie rapide, une sortie nécessite un ensemble de données, un seuil, un propriétaire et une version de retour.
