# Fonctions Azure pour les charges de travail d'IA

> Utilisez des fonctions basées sur des événements pour des tâches limitées, des déclencheurs d'ingestion et une orchestration légère.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Container Apps, APIs & Keys
**Time:** ~60 minutes

## Objectifs d'apprentissage

- Choisissez des fonctions pour un travail limité et axé sur les événements.
- Définir le déclencheur, réessayer, temps d'arrêt, et comportement de message empoisonné.
- Gardez les manipulateurs indépendant et observable.
- Évitez de placer de longs travaux modèles dans un court parcours de demande.
- Conception d'une remise durable à un travailleur.

## Pratique

Utilisation `code/main.py`Il vérifie l'idempotence, le délai, la réessayer et les décisions en lettre morte.
