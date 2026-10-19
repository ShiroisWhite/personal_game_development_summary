---
name: content-base-router
description: 查看、切换、新增、移除或校验内容底座。用户说“当前用的是哪个底座”“切到某游戏”“新建一个底座”“把这个资料目录接进来”“底座里有什么”时使用。产出：底座状态 + 操作结果 + 下一步。
whenToUse: 需要在不同游戏/品类的内容底座之间切换或维护底座时。
---

# 内容底座路由

## 概念

- **核心包**：方法论、技能、记忆协议（本包）
- **内容底座**：某个游戏/品类的具体事实、配置、案例
- **registry.json**：记录所有底座与当前激活项

核心包永远不写具体项目事实；所有项目内容都在底座里。

## 常用命令

```bash
# 查看
python tools/base_manager.py list
python tools/base_manager.py status
python tools/base_manager.py resolve

# 切换
python tools/base_manager.py activate soc-general
python tools/base_manager.py activate my-game

# 新增已有目录
python tools/base_manager.py add "D:\资料\某游戏" --id my-game --name "某游戏"

# 新建空底座
python tools/base_manager.py create my-game --name "某游戏"

# 校验
python tools/base_manager.py validate
python tools/validate_package.py

# 重建索引
python tools/base_manager.py index my-game
```

## 切换流程

1. 先 `list` 确认目标底座存在且路径有效。
2. `activate <id>`。
3. 读取目标底座的 `INDEX.md`，确认知识范围。
4. 告诉用户：当前底座、入口文件、是否涉密。
5. 若当前会话已经加载了旧底座内容，明确说明“旧底座内容仅作历史上下文，不再作为当前事实来源”。

## 新增底座

目录结构：

```
my-game/
├── base.json
├── INDEX.md
├── knowledge/
│   ├── 01_overview.md
│   ├── 02_systems.md
│   └── ...
├── templates/
└── cases/
```

`base.json` 最小示例：

```json
{
  "schemaVersion": 1,
  "id": "my-game",
  "name": "某游戏",
  "version": "0.1.0",
  "domain": "SOC / 生存建造",
  "description": "某游戏的设计事实与案例",
  "entry": "INDEX.md",
  "knowledge": ["knowledge/01_overview.md"],
  "templates": [],
  "cases": "cases",
  "confidential": true
}
```

## 规则

- 底座 id 用小写 kebab-case，全局唯一。
- 路径可以是包内相对路径，也可以是绝对路径。
- `confidential: true` 的底座：只本地使用，不上传、不外发、不写进对外材料。
- 不同底座的数值不可混用；跨底座比较必须标注来源。
- 删除底座前先 `activate` 到其他底座；不能删除当前激活项。
- 底座内容变更后运行 `index` 重建入口。

## 输出

```markdown
## 当前底座
- id：
- 名称：
- 路径：
- 涉密：
- 入口：

## 本次操作
（做了什么，结果如何）

## 下一步
（需要用户确认或继续的事）
```

## 质量门槛

- 不擅自切换底座；切换是用户可见的状态变更。
- 不把两个底座的内容合并成“一个事实”。
- 路径不存在时明确报错，不静默回退（回退时说明）。
