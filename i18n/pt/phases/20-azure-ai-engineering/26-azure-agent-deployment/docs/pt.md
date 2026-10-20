# A implementação de Agentes do Azure

> Deploie agentes que utilizam ferramentas com estado explícito, permissões, aprovações, temporadas e caminhos de recuperação.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Functions for AI Workloads, Azure Security and Secrets
**Time:** ~75 minutes

## Objetivos de aprendizagem

- Modela um agente como uma máquina de estado com transições limitadas.
- Aplicar permissões de ferramenta por tarefa e contexto de usuário.
- Adicionar portas de aprovação para ações irreversíveis.
- Recuperar de temporadas, eventos duplicados e falhas parciais da ferramenta.
- Rastrear todas as decisões sem armazenar cargas úteis sensíveis.

## Prática

Utilização`code/main.py`Cada ferramenta precisa de permissão, tempo de espera, retestamento e comportamento de auditoria.
