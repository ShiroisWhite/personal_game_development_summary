# SOC 游戏设计助手 v2.0.5

一份内容，多 runtime 导出。通用层随包走，项目事实留在项目底座，填个路径就能激活。

面向 **SOC（Survival / Open-world / Crafting，生存建造开放世界）** 游戏设计的个人助手，服务对象是系统策划。它同时提供两种视角：**顾问**（跨游戏通用的设计判断）与**系统策划**（具体项目的配置、验收、排期）。

```
核心包（本目录）            内容底座（bases/）              运行时
AGENTS.md / skills / memory  ← 某个项目的事实（本地、可涉密）   dsh / Claude Code / Codex
```

本包不含任何前公司项目内容。要分析具体项目时，把项目目录挂成底座，用完可以摘掉。

## 现在有什么

| 项 | 内容 |
| --- | --- |
| 上手 | `ONBOARDING.md`：三条命令、能力表、项目三件套；`python tools/onboard.py` 自检并给下一步 |
| 总纲 | `AGENTS.md` v2.0.5，13 节：双人格、启动流程、信息分层、项目插槽、记忆协议、涉密边界、多 runtime 导出 |
| 技能 | `skills/` 20 个（SOC 拆解/循环/配置/竞品/文档/原型 + 顾问 persona + 工程辅助） |
| 知识 | `bases/soc-general/knowledge/` 26 个文件：通用框架 5 篇 + 题材方法论 7 篇 + 2026-10 新增 7 篇 |
| 记忆 | `memory/facts/` 8 条用户级记忆（项目事实不在这里） |
| 工具 | `tools/` 9 个：自检、底座管理、项目挂载、runtime 导出、检索、Excel 检视、索引、PDF、校验 |
| 模板 | `bases/soc-general/templates/` 4 个：拆解报告、策划案、配置说明、竞品矩阵 |

## 日常怎么用

```bash
# 新环境先自检：现在什么状态、下一步做什么
python tools/onboard.py

# 挂一个项目资料目录（填路径即激活；默认涉密，只在本地用）
python tools/mount_project.py "D:\资料\某项目" --id my-game --name "某项目"

# 切回通用方法论
python tools/mount_project.py --off

# 看看当前有哪些底座
python tools/mount_project.py --list
```

```bash
# 导出给别的 runtime
python tools/export_runtime.py --target claude-code   # → integrations/claude-code/
python tools/export_runtime.py --target codex         # → integrations/codex/
```

日常提问示例：

```
帮我拆一下这个建造系统，重点看它有没有成环
诊断一下这个 PvP 掠夺循环，问题在结构还是数值
按这个策划案，推导需要哪些配置表和字段
用 HTML 做一个家园交互原型，带三态
对这套方案做一次 grill
```

## 目录

| 路径 | 作用 |
| --- | --- |
| `AGENTS.md` | 助手总纲，dsh 自动读取 |
| `skills/` | 20 个技能，dsh 技能格式（`SKILL.md`） |
| `bases/registry.json` | 底座注册表，`active` 决定当前底座 |
| `bases/soc-general/` | 通用 SOC 方法论底座（不涉密，可导出） |
| `bases/_template-project/` | 项目底座的形状示例 |
| `memory/` | 用户级记忆索引与事实文件 |
| `tools/` | 底座管理、项目挂载、runtime 导出、检索、Excel、PDF、校验 |
| `integrations/` | 导出产物（生成后出现） |
| `bootstrap/` | 安装、恢复、卸载脚本 |
| `acceptance/` | 5 个验收任务 |
| `MIGRATION.md` | 迁移记录（Claude Code → dsh，v2 合并说明） |
| `CHANGELOG.md` | 版本变更 |

## 安装与自检

本机已经把 dsh 指向本目录（`~/.dsh/soc-assistant.json` 的 `root`，`mode=linked`），`~/.dsh/skills/*` 是指向 `skills/*` 的 Junction，改源包即生效。

```bash
python tools/validate_package.py     # 技能格式 + 底座契约 + 脚本可编译
python tools/base_manager.py list    # 当前底座
```

重新安装到别的机器：

```bash
python bootstrap/restore.py          # 只改指针（开发模式）
python bootstrap/install_dsh.py      # 自包含安装（会在 ~/.dsh/soc-assistant 复制一份）
```

> 注意：`install_dsh.py` 是 v1 的自包含安装逻辑，重跑会重建副本目录。只想链接源码时用 `restore.py`。

卸载：

```bash
python bootstrap/uninstall.py --yes            # 移除技能/AGENTS 区块/指针
python bootstrap/uninstall.py --yes --purge    # 同时删除自包含安装目录
```

## 记忆与来源

- 记忆只在三种情况写入：用户明确要求、可验证事实、会反复使用的设计判断。项目配置事实写入项目底座，不写通用记忆。
- 每条记忆带 `type`（user / feedback / project / reference）与 `Why` / `How to apply`。
- 技能与方法论不分来源，导出时全量带上。
- 前公司资料去标识化后只保留"设计判断"与"方法"，不保留项目名、表名、数值、内部链接。

## 与 Claude Code 的关系

- 不改动现有 `~/.claude`、REX 大脑、策划资料库。
- 本包是独立目录，可随时删除或搬走。
- 迁移取舍见 `MIGRATION.md`。
