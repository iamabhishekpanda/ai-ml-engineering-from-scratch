#  Azure 代理部署

> 部署使用工具的代理,具有明确状态,许可,批准,时间和恢复路径.

**Type:** Build
**Languages:** Python
**Prerequisites:** Azure Functions for AI Workloads, Azure Security and Secrets
**Time:** ~75 minutes

## 学习目标

- 模型一个代理作为一个状态机,有限于过渡.
- 根据任务和用户背景,应用工具权限.
- 加入不可逆行动的批准门.
- 恢复时间缺失,重复事件和部分工具故障.
- 追踪每一个决定,而不存储敏感的有效载荷.

## 实践

使用`code/main.py`每个工具边缘都需要许可,时间限,重新尝试和审计行为.
