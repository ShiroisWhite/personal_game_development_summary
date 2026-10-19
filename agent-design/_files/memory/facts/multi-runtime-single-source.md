---
name: multi-runtime-single-source
description: 助手包结构决策——一份内容多 runtime 导出；项目事实留在项目底座，填路径即激活；通用层才随包走
metadata:
  type: reference
---

2026-10 与用户拍板：不要"每个 runtime 一套副本"，要**一份内容、多 runtime 导出**。

**分层**
- 通用层（随包走）：人格与规则、技能、通用方法论、用户级记忆。
- 项目层（不随包走）：项目事实、配置约定、涉密材料。用 `python tools/mount_project.py <路径> --id <id> --name <名称>` 把任意目录挂成底座并激活；`--off` 切回通用。
- 导出层：`python tools/export_runtime.py --target claude-code|codex|all` → `integrations/<target>/`，只含通用层，自动跳过 confidential 项目底座。

**为什么**
- 包要能随身带走、跨机器可用；项目事实随时会变且涉密，不能固化进包。
- 换 runtime（dsh / Claude Code / Codex）时不复制内容，只换形状。

**共享池**：技能与方法论不分来源、不分作者，全部技能对任何 runtime 一律可用，导出时全量带上；只对"内容/案例"做去标识化（§8：不把公司资产写进对外材料）。
