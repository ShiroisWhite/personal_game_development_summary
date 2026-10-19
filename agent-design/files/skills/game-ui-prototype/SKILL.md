---
name: game-ui-prototype
description: Build interactive HTML prototypes for Unity game UI systems. Use this skill whenever the user wants to create a UI interaction mockup — including phrases like "做交互示意", "交互原型", "HTML示意", "复现界面", "做个XX的交互", or any request to visualize a game UI module. Always check memory first for existing module knowledge before searching code. After building, save findings to memory so future sessions can skip the search step.
---

# Game UI Prototype Builder

Build standalone HTML prototypes that reproduce in-game UI interactions. The goal is interaction logic and operation flow — visual polish is not important.

## Project context（读 `skills/_project-paths.json`，不要用写死路径）

| 用途 | 字段 | 缺失时 |
|---|---|---|
| Lua 代码 | `code_lua` | 跳过代码检索，只按用户描述做原型 |
| 配置表 | `config_root` | 跳过 |
| 原型输出 | `prototype_out` | 落到 `%TEMP%\ui-proto\` 并告知用户 |
| 记忆 | `memory_root`（通常是本包 `memory/`） | 用本包 `memory/` |
| 归档（只读，不修改） | `prototype_out` 下的 `archive/` | 无则跳过 |

> 换项目只改 `_project-paths.json` 一个文件。字段为 `null` 表示该项目没有这类资源——跳过对应步骤，不要猜路径。

## Workflow

Follow these steps in order. The goal at each step is to start with memory — only search code when memory is insufficient.

### Step 1: Check memory first

Read `MEMORY.md` and `ui-systems-index.md` from the memory directory. If the module being requested already has entries there, read the relevant memory files. This often gives you the exact Lua files, config tables, and data structures without needing to search.

### Step 2: Search code (only if memory is insufficient)

Search Lua code for the module:

```
Grep pattern: "*<ModuleName>*Controller.lua" or "*<ModuleName>*View.lua"
Under: Assets/Lua/GameLua/UI/<ModuleName>/
```

From the View file, extract `ComponentBinds` — this defines every UI element. From the Controller, extract button handlers, server protocol calls, and data flow.

### Step 3: Search config tables

Use the excel_searcher to find relevant config:

```powershell
$env:PYTHONIOENCODING = 'utf-8'
python "<config_root>/excel_searcher.py" --dir "<config_root>" --search "<keyword>" --mode smart
```

Cross-reference config fields with code references to confirm data structures.

### Step 4: Build the HTML

Create a standalone HTML file in `<prototype_out>/`:

**Container**: 1031×575, dark theme (`--bg-deep: #0d0d1a`, `--gold: #c9a96e`, `--text: #c8c8d0`)
**Zero dependencies**: Pure HTML/CSS/JS, no external libraries
**3D models**: Use large emoji as placeholders
**Font**: `"Microsoft YaHei","PingFang SC",sans-serif`

Naming convention: `<module>_v<N>.html` (e.g., `doghouse_v5.html`, `home_build_v1.html`)

### Step 5: Archive previous version

If a previous version of the same module exists in `prototype/`, archive it before modifying:

```bash
cp prototype/<module>_v<N>.html prototype/archive/<module>/<module>_v<N>.html
```

Add the read-only marker as the first line of the archived file:
```
<!-- ARCHIVE: READ-ONLY, DO NOT MODIFY -->
```

Never modify files in `prototype/archive/` — they are historical snapshots.

### Step 6: Write memory

After the prototype is complete, write findings to memory:

1. **Module-specific memory**: Create/update a memory file under the memory directory with:
   - Which Lua files were used (View, Controller)
   - Which config tables are relevant
   - Key data structures and UI components found
   - What the prototype covers

2. **Update `ui-systems-index.md`**: Add the new module with its prototype file, code references, and completion status.

This is the most important step — it means future sessions can skip steps 2-3 entirely when working on the same module.

## Prototype patterns

### Common CSS variables
```css
:root {
  --bg-deep: #0d0d1a; --bg-panel: #141428;
  --gold: #c9a96e; --gold-light: #f0d078;
  --text: #c8c8d0; --text-dim: #888;
  --border: #2a2a4a;
}
```

### Common JS utilities
```javascript
function toast(m) { /* floating message, auto-dismiss */ }
function banner(m) { /* top banner notification */ }
function gConfirm(title, content, callback) { /* confirmation modal */ }
```

### 5-tier quality system (reusable across prototypes)
| Level | Name | Color | CSS class |
|-------|------|-------|-----------|
| 1 | 伴侣级 | #c8c8c8 | `.q1` |
| 2 | 宠物级 | #5cb870 | `.q2` |
| 3 | 血统级 | #5b9ecf | `.q3` |
| 4 | 赛事级 | #b45bcf | `.q4` |
| 5 | 冠军级 | #d4a843 | `.q5` |

### Food card grid pattern (reusable)
For any prototype that needs item/icon selection with count badges:
```css
.food-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
.food-card { /* card with icon, name, count badge, minus button */ }
```

## Remember

- Memory-first, code-search only when needed
- Interaction logic > visual aesthetics
- Every prototype teaches us something — write it down
- Archive before overwrite, never touch archive files
- PC only (1031×575), mobile is a separate request
