# Operações de Azure Prompt

> Tratar as instruções, configurações de modelo, regras de segurança e resultados de avaliação como entradas de produção versão.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure OpenAI, Azure AI Foundry
**Time:** ~60 minutes

## Objetivos de aprendizagem

- As instruções de versão e os parâmetros do modelo juntos.
- Construir um pequeno conjunto de dados de regressão antes de alterar um prompt.
- Comparar qualidade, latência, recusa e efeitos de custo de token.
- Requer aprovação para alterações imediatas da produção.
- Mantenha os metadados de retrocesso ao lado de cada lançamento.

## Prática

Utilização`code/main.py`Para validar um registro de lançamento imediato. Uma versão de lançamento precisa de um conjunto de dados, limiar, proprietário e versão de volta.
