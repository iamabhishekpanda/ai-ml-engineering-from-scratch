# Funções do Azure para cargas de trabalho de IA

> Use funções orientadas por eventos para tarefas limitadas, gatilhos de ingestão e orquestração leve.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Container Apps, APIs & Keys
**Time:** ~60 minutes

## Objetivos de aprendizagem

- Escolha funções para um trabalho limitado e orientado a eventos.
- Defina o gatilho, retoma, tempo de espera e comportamento de mensagem venenosa.
- Mantém os manipuladores idempotentes e observáveis.
- Evite colocar longos trabalhos de modelo em um curto caminho de solicitação.
- Desenhar uma entrega duradoura para um trabalhador.

## Prática

Utilização`code/main.py`Verifica a idempotencia, o tempo de espera, a retomada e as decisões de letra morta.
