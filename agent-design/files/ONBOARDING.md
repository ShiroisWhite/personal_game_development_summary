# 上手（ONBOARDING）

> 在**任何新环境**里第一次打开这个包，先读这一页，或直接问助手："**你能干什么 / 我该从哪开始**"。
> 助手会跑一次自检（`python tools/onboard.py`），按真实状态告诉你下一步，而不是背目录。

---

## 1. 这是什么

一个 **SOC（生存 / 开放世界 / 建造）游戏设计助手**，给系统策划用：

- 通用层（人格、方法、技能、记忆）**随包走**，换机器、换 runtime 都能用；
- 项目事实（配置表、系统文档、数值）**留在项目底座**，填个路径就激活；
- 没有项目也能用一半的能力（见下表第一列）。

---

## 2. 三条命令

```bash
python tools/onboard.py                    # 我是谁、现在什么状态、下一步做什么
python tools/mount_project.py <项目目录>    # 把一个项目挂成底座（填路径即激活）
python tools/validate_package.py           # 包本身没坏（技能 / 记忆 / 底座契约）
```

只想聊方法论、不接项目：跳过第二条。

---

## 3. 它能干什么

| 能力 | 需要项目底座吗 | 一句话 |
|---|---|---|
| 顾问判断 | 不需要 | 这套系统该怎么设计、值不值得抄、能不能迁移 |
| 拆系统 | 不需要 | 定位三问 → 循环图 → 三轴判定 → 失败模式 |
| 查循环 | 不需要 | 核心循环、成长链、经济链、PvP、赛季节奏 |
| 配置落地 | **需要** | 要改哪些表、字段怎么定、引用链与验收 |
| 写文档 | 不需要 | 策划案、需求文档、系统说明 |
| 做原型 | 不需要 | 单文件 HTML 可点击原型 + 截图 / PDF |
| 管知识 | 不需要 | 挂载底座、检索、记忆维护、多 runtime 导出 |

---

## 4. 接一个项目（三分钟）

```
<项目目录>/
  paths.json          # 可选：engine / code_csharp / config_root / prototype_out
  配置表/*.xlsx       # 放哪儿都行，会全目录扫描
  knowledge/*.md      # 系统说明、术语、已确认决策
```

```bash
python tools/mount_project.py D:\资料\my-game --id my-game --name "某项目"
```

挂完之后：

- `INDEX.md` 里有配置表清单（文件 / Sheet / 行数 / 第 2 行表头）；
- 问"XX 配置在哪"能直接定位到 `文件.xlsx::Sheet!行号`；
- 退出项目：`python tools/mount_project.py --off`，回 `soc-general`。

---

## 5. 目录地图

| 路径 | 是什么 |
|---|---|
| `AGENTS.md` | 核心规则（人格、启动流程、信息分层、底座与记忆协议） |
| `skills/` | 技能池，`SKILL.md` 是路由入口，执行时读全文 |
| `bases/soc-general/` | 通用方法论：核心框架 + 题材手册（家园 / 载具 / 采集 / 射击 / 宠物 / 种植 / 交互） |
| `bases/<项目>/` | 项目底座（挂载时生成，默认 confidential） |
| `memory/` | 长期记忆：索引 + facts |
| `tools/` | 自检、挂载、检索、导出、校验 |
| `integrations/` | 导出给 Claude Code / Codex 的产物 |
| `acceptance/` | 验收任务，改完包跑一遍 |

---

## 6. 常见问题

| 现象 | 处理 |
|---|---|
| 助手说"没有技能" | 技能应被 `~/.dsh/skills/` 发现；检查目录下是否有 20 个 Junction/目录，重启 runtime |
| 说"当前底座未收录" | 正常：项目没挂，或问题超出通用方法论。先挂项目，或换问法 |
| 找不到配置表 | 跑 `python tools/mount_project.py <目录> --reindex`，再 `python tools/kb_search.py <关键词>` |
| xlsx 无法扫描 | 缺 openpyxl：`pip install openpyxl` |
| 想换电脑 / 换 runtime | `python tools/export_runtime.py --target all`，把 `integrations/<target>/` 搬过去 |

---

## 7. 边界（它会明确说不）

- 不替你决定"哪个更好玩"——只给事实、选项、代价；
- 不编项目事实：底座没有就说"当前底座未收录"；
- `confidential` 底座不出现在任何导出物里；
- 项目路径在导出时一律抹空，不会把本地目录结构带出去。
