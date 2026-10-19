# 项目路径文件说明

`skills/_project-paths.json` 是**唯一**的项目路径来源。四个依赖项目目录的技能（config-finder、config-planner、game-ui-prototype、manage-game-development）只读这个文件，不写死路径。

## 字段

| 字段 | 含义 | 找不到时的行为 |
|---|---|---|
| `project_id` | 当前挂载的底座 id；null 表示通用底座 | 只答通用方法论 |
| `engine` | `unity` / `ue` / `custom` | 问用户 |
| `unity_project` | 工程根目录 | 跳过工程类检索 |
| `code_csharp` | C# 代码根 | 跳过 |
| `code_lua` | Lua 代码根 | 跳过 |
| `prefab_root` | 预制体 / ScriptableObject 根 | 跳过 |
| `config_root` | Excel 配置表根 | 跳过，并提示用户补路径 |
| `language_table` | 多语言表目录 | 跳过 |
| `prototype_out` | 原型输出目录 | 落到 `%TEMP%` 或问用户 |
| `memory_root` | 记忆目录 | 用本包 `memory/` |

## 两种填法

**A. 由 mount 同步（推荐）**：在项目目录放一个 `paths.json`（字段同上，可只写部分），然后

```bash
python tools/mount_project.py "D:\某项目"
```

`mount_project.py` 会把 `paths.json` 合并进本文件，并写入 `project_id`。

**B. 直接手改**：只改这一个文件，四个技能同时生效。

## 约定

- `null` 表示"这个项目没有这类资源"，技能必须跳过，**不得**用猜测路径代替。
- 路径失效（目录不存在）时，先报告"路径配置失效"，再问用户，不要静默换路径。
- `--off` 切回 `soc-general` 时，本文件的这些字段会被清空为 `null`。
