---
name: skill-first-not-bare-tools
description: 用户偏好先走 skill 再考虑裸 grep/read；机制类问题优先 unity-developer / xlsx 这类成体系的技能
metadata:
  type: feedback
---

用户测过 skill 系统，明确要求：**遇到成体系的任务先走 skill**，不要直接 grep + read 硬搜。

**Why:** skill 里封装的是这个项目的最佳实践与配置约定；绕开 skill 等于绕开项目知识，得到的答案即使字面正确也不落地。

**How to apply:**
- 查 Unity 机制 / gameplay 配置 → 先看 `unity-developer`。
- 查 Excel 配置表 → 先用 `xlsx`（比手搓 Python 读表稳，编码坑少）。
- 查"某个配置在哪里" → `config-finder`；从需求推"要改哪些表" → `config-planner`。
- skill 不覆盖时才退回裸工具，并在回答里说明是手工路径。
