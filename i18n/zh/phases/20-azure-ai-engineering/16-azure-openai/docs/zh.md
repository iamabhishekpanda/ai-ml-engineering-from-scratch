#  Azure OpenAI

> 设计模型的访问围绕部署名称,配额,重试,安全和评估证据.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Identity and Networking
**Time:** ~60 minutes

## 学习目标

- 单独从模型部署名称中分开Azure OpenAI资源.
- 预算代币,延迟,吞吐量,以及失败的重试.
- 在应用程序代码之前验证结构化输出.
- 加入内容安全和拒绝处理模型边界.
- 保持模型配置在源代码之外.

## 实践

使用`code/main.py`无需联系提供商,可验证模型请求计划.
