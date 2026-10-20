# Aplicações do Azure Container

> Envie uma API de IA e um operador com verificações de saúde, revisões, sinais de escalagem e um caminho de retorno.

**Type:** Build
**Languages:** Python
**Prerequisites:** Docker for AI, Azure Identity and Networking
**Time:** ~60 minutes

## Objetivos de aprendizagem

- API separado, trabalhador e contêineres de trabalho programados.
- Defina os controlos de prontidão e de vida.
- Escolha os sinais de escala para cargas de trabalho de modelo e recuperação.
- Usar revisões para implantação controlada e retrocesso.
- Mantenha a configuração e os segredos fora da imagem.

## Prática

Utilização`code/main.py`Verifica as sondas de saúde, a estratégia de revisão e a configuração não secreta.
