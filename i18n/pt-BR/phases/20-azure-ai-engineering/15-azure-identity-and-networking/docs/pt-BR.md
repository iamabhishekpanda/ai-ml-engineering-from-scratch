# Identidade e Rede do Azure

> Tornar a identidade, os limites da rede e o acesso de serviço a serviço explícitos antes da implantação.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure AI Engineering Fundamentals
**Time:** ~60 minutes

## Objetivos de aprendizagem

- Distinguir a identidade humana, a identidade da carga de trabalho e a identidade dos recursos.
- Preferir identidade gerenciada a credenciais incorporadas.
- Descreva os pontos finais privados, entrada, saída e menos privilégio.
- Revisar um plano de implantação para vazamentos secretos e de rede.
- Teste uma política de negação por defeito.

## Prática

Utilização`code/main.py`Tratar todas as chamadas externas como um limite que precisa de um proprietário e um sinal de auditoria.
