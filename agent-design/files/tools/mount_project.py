#!/usr/bin/env python3
"""mount_project.py — 把任意项目资料目录挂成内容底座（填路径即激活）。

用法：
    python tools/mount_project.py <路径> [--id ID] [--name NAME] [--public] [--no-activate]
    python tools/mount_project.py --off            # 切回 soc-general
    python tools/mount_project.py --list           # 列出所有底座
    python tools/mount_project.py --unmount ID     # 从注册表移除（不删文件）

行为：
    1. 校验路径存在且是目录；
    2. 该目录没有 base.json 就按底座契约生成一个（confidential 默认 true）；
    3. 没有 INDEX.md 就扫描 knowledge/ templates/ cases/ 生成入口目录，
       并扫描 Excel/CSV 生成「配置表清单」（sheet 名、行数、第 2 行表头）；
    4. 若该目录有 paths.json，合并进 skills/_project-paths.json（技能统一从这里取路径）；
    5. 注册进 bases/registry.json，并把 active 指向它（除非 --no-activate）。

项目内容永远留在项目目录里，包本身保持干净、可随身带走。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

TOOLS_DIR = Path(__file__).resolve().parent
ROOT = TOOLS_DIR.parent
REGISTRY_PATH = ROOT / "bases" / "registry.json"
SKILL_PATHS_PATH = ROOT / "skills" / "_project-paths.json"
DEFAULT_BASE = "soc-general"

PATH_FIELDS = (
    "engine",
    "unity_project",
    "code_csharp",
    "code_lua",
    "prefab_root",
    "config_root",
    "language_table",
    "prototype_out",
    "memory_root",
)


# --------------------------------------------------------------------------- utils

def fail(message: str, code: int = 1) -> None:
    print(f"[失败] {message}", file=sys.stderr)
    raise SystemExit(code)


def slugify(text: str, fallback: str = "project") -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.strip().lower()).strip("-")
    if not slug:
        slug = fallback
    return re.sub(r"-{2,}", "-", slug)


def load_registry() -> dict:
    if not REGISTRY_PATH.is_file():
        return {"schemaVersion": 1, "active": DEFAULT_BASE, "bases": []}
    try:
        data = json.loads(REGISTRY_PATH.read_text(encoding="utf-8-sig"))
    except json.JSONDecodeError as exc:
        fail(f"registry.json 解析失败：{exc}")
    data.setdefault("schemaVersion", 1)
    data.setdefault("active", DEFAULT_BASE)
    data.setdefault("bases", [])
    return data


def save_registry(registry: dict) -> None:
    REGISTRY_PATH.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY_PATH.write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def stored_path(target: Path) -> str:
    try:
        return target.relative_to(ROOT).as_posix()
    except ValueError:
        return target.as_posix()


def find_entry(registry: dict, base_id: str) -> dict | None:
    for entry in registry.get("bases", []):
        if entry.get("id") == base_id:
            return entry
    return None


def upsert_entry(registry: dict, entry: dict) -> None:
    bases = registry.setdefault("bases", [])
    for index, existing in enumerate(bases):
        if existing.get("id") == entry["id"]:
            bases[index] = entry
            return
    bases.append(entry)


# ------------------------------------------------------------------ project scanning

SKIP_DIRS = {"__pycache__", ".git", ".svn", "node_modules", ".obsidian"}
TEXT_SUFFIXES = {".md", ".markdown", ".txt"}
EXCEL_SUFFIXES = {".xlsx", ".xlsm", ".csv"}
MAX_INDEXED = 200
MAX_TABLES = 200
MAX_TABLE_ROWS_IN_INDEX = 300
MAX_HEADER_COLS = 10
MAX_TABLE_BYTES = 40 * 1024 * 1024


def scan_files(base_dir: Path, subdir: str) -> list[Path]:
    root = base_dir / subdir
    if not root.is_dir():
        return []
    found: list[Path] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() in TEXT_SUFFIXES:
            found.append(path)
        if len(found) >= MAX_INDEXED:
            break
    return found


def read_csv_sheets(path: Path) -> list[dict]:
    header: list[str] = []
    rows = 0
    try:
        with path.open("r", encoding="utf-8-sig", errors="replace", newline="") as handle:
            for index, line in enumerate(handle):
                rows = index + 1
                if index == 1:
                    header = [c.strip() for c in line.rstrip("\r\n").split(",") if c.strip()]
                    header = header[:MAX_HEADER_COLS]
    except OSError:
        return []
    return [{"name": "(csv)", "rows": rows, "header": header}]


def read_excel_sheets(path: Path) -> list[dict]:
    try:
        from openpyxl import load_workbook
    except ImportError:
        return []
    try:
        workbook = load_workbook(path, read_only=True, data_only=True)
    except Exception:
        return []
    sheets: list[dict] = []
    try:
        for sheet in workbook.worksheets:
            header: list[str] = []
            for row in sheet.iter_rows(min_row=2, max_row=2, max_col=MAX_HEADER_COLS, values_only=True):
                header = [str(cell).strip() for cell in row if cell not in (None, "")]
                break
            sheets.append(
                {"name": sheet.title, "rows": int(sheet.max_row or 0), "header": header[:MAX_HEADER_COLS]}
            )
    finally:
        workbook.close()
    return sheets


def scan_tables(base_dir: Path) -> list[dict]:
    """扫描整个项目目录下的 Excel/CSV，返回 [{file, sheets:[{name,rows,header}]}]。"""
    tables: list[dict] = []
    for path in sorted(base_dir.rglob("*")):
        if len(tables) >= MAX_TABLES:
            break
        if not path.is_file() or path.suffix.lower() not in EXCEL_SUFFIXES:
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        try:
            if path.stat().st_size > MAX_TABLE_BYTES:
                continue
        except OSError:
            continue
        sheets = read_csv_sheets(path) if path.suffix.lower() == ".csv" else read_excel_sheets(path)
        if not sheets:
            continue
        tables.append({"file": path.relative_to(base_dir).as_posix(), "sheets": sheets})
    return tables


def build_index(
    base_dir: Path, base_id: str, name: str, confidential: bool, with_tables: bool = True
) -> str:
    lines = [
        f"# {name} · 项目底座",
        "",
        f"- 底座 id：`{base_id}`",
        f"- 挂载路径：`{base_dir}`",
        f"- 涉密：{'是（仅本地使用，禁止导出对外）' if confidential else '否'}",
        f"- 生成时间：{date.today().isoformat()}",
        "",
        "> 这是一个项目底座：只放**这个项目的事实**。通用方法论请用 `soc-general`。",
        "",
    ]
    sections = (
        ("knowledge", "项目知识", "系统说明、配置约定、已确认决策"),
        ("templates", "项目模板", "该项目专用的文档/表格模板"),
        ("cases", "案例", "实际发生的拆解、复盘、评审记录"),
    )
    for subdir, title, hint in sections:
        lines += [f"## {title}（{subdir}/）", ""]
        files = scan_files(base_dir, subdir)
        if not files:
            lines += [f"*还没有内容。把{hint}放进来即可。*", ""]
            continue
        lines += ["| 文件 | 相对路径 |", "| --- | --- |"]
        for path in files:
            rel = path.relative_to(base_dir).as_posix()
            stem = path.relative_to(base_dir / subdir).with_suffix("").as_posix()
            lines.append(f"| {stem} | `{rel}` |")
        lines.append("")
    tables = scan_tables(base_dir) if with_tables else []
    lines += ["## 配置表清单（自动扫描 Excel/CSV）", ""]
    if not tables:
        lines += [
            "*没扫到配置表。把 `.xlsx` / `.csv` 放进项目目录后重跑 mount 即可；只支持 openpyxl 能读的格式。*",
            "",
        ]
    else:
        rows_budget = MAX_TABLE_ROWS_IN_INDEX
        lines += ["| 文件 | Sheet | 行数 | 第 2 行表头（前 10 列） |", "| --- | --- | --- | --- |"]
        for table in tables:
            for sheet in table["sheets"]:
                if rows_budget <= 0:
                    break
                header = "、".join(sheet["header"]) if sheet["header"] else "*（空）*"
                lines.append(
                    f"| `{table['file']}` | {sheet['name']} | {sheet['rows']} | {header[:160]} |"
                )
                rows_budget -= 1
            if rows_budget <= 0:
                break
        total_sheets = sum(len(t["sheets"]) for t in tables)
        lines += ["", f"共 {len(tables)} 个文件 / {total_sheets} 个 sheet。", ""]

    lines += [
        "## 维护",
        "",
        "```bash",
        f"python tools/mount_project.py \"{base_dir}\"   # 重扫索引并重新激活",
        "python tools/mount_project.py --off            # 切回 soc-general",
        "```",
        "",
    ]
    return "\n".join(lines)


def write_base_json(base_dir: Path, base_id: str, name: str, confidential: bool, build_tables: bool = True) -> dict:
    knowledge = [
        p.relative_to(base_dir).as_posix()
        for p in scan_files(base_dir, "knowledge")
    ]
    templates = [
        p.relative_to(base_dir).as_posix()
        for p in scan_files(base_dir, "templates")
    ]
    tables = []
    if build_tables:
        tables = [
            {
                "file": t["file"],
                "sheets": [{"name": s["name"], "rows": s["rows"]} for s in t["sheets"]],
            }
            for t in scan_tables(base_dir)
        ]
    data = {
        "schemaVersion": 1,
        "id": base_id,
        "name": name,
        "version": "1.0.0",
        "domain": name,
        "description": f"{name} 的项目底座，由 mount_project.py 生成",
        "entry": "INDEX.md",
        "knowledge": knowledge,
        "templates": templates,
        "cases": "cases",
        "tables": tables,
        "confidential": confidential,
    }
    paths_file = base_dir / "paths.json"
    if paths_file.is_file():
        try:
            data["paths"] = json.loads(paths_file.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError as exc:
            fail(f"paths.json 解析失败：{exc}")
    (base_dir / "base.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return data


# ------------------------------------------------------------------ skill paths

def _load_skill_paths() -> dict:
    if SKILL_PATHS_PATH.is_file():
        try:
            return json.loads(SKILL_PATHS_PATH.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError:
            pass
    return {"schemaVersion": 1, "project_id": None}


def _save_skill_paths(data: dict) -> None:
    SKILL_PATHS_PATH.parent.mkdir(parents=True, exist_ok=True)
    SKILL_PATHS_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def sync_skill_paths(target: Path, base_id: str) -> list[str]:
    """把 <项目>/paths.json 合并进 skills/_project-paths.json。"""
    source = target / "paths.json"
    if not source.is_file():
        return []
    try:
        incoming = json.loads(source.read_text(encoding="utf-8-sig"))
    except json.JSONDecodeError as exc:
        fail(f"paths.json 解析失败：{exc}")
    data = _load_skill_paths()
    applied = []
    for field in PATH_FIELDS:
        if field in incoming:
            data[field] = incoming[field]
            applied.append(field)
    data["project_id"] = base_id
    _save_skill_paths(data)
    return applied


def reset_skill_paths() -> None:
    data = _load_skill_paths()
    data["project_id"] = None
    for field in PATH_FIELDS:
        data[field] = None
    _save_skill_paths(data)



# --------------------------------------------------------------------- commands

def cmd_mount(args: argparse.Namespace) -> None:
    raw = Path(args.path).expanduser()
    target = raw if raw.is_absolute() else (Path.cwd() / raw)
    target = target.resolve()
    if not target.is_dir():
        fail(f"路径不存在或不是目录：{target}")

    existing: dict = {}
    base_json = target / "base.json"
    if base_json.is_file():
        try:
            existing = json.loads(base_json.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError as exc:
            fail(f"已有 base.json 解析失败：{exc}")

    base_id = args.id or existing.get("id") or slugify(target.name)
    base_id = slugify(base_id, fallback="project")
    name = args.name or existing.get("name") or target.name
    confidential = (not args.public) if args.public is not None or "confidential" not in existing else existing["confidential"]
    if args.public:
        confidential = False
    elif args.confidential or "confidential" not in existing:
        confidential = True

    created: list[str] = []
    if not base_json.is_file():
        write_base_json(target, base_id, name, confidential, build_tables=not args.no_excel)
        created.append("base.json")
    else:
        data = dict(existing)
        data.update({"id": base_id, "name": name, "confidential": confidential})
        data.setdefault("schemaVersion", 1)
        data.setdefault("entry", "INDEX.md")
        if not args.no_excel:
            data["tables"] = [
                {
                    "file": t["file"],
                    "sheets": [{"name": s["name"], "rows": s["rows"]} for s in t["sheets"]],
                }
                for t in scan_tables(target)
            ]
        if (target / "paths.json").is_file():
            data["paths"] = json.loads((target / "paths.json").read_text(encoding="utf-8-sig"))
        base_json.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )

    index_md = target / "INDEX.md"
    if not index_md.is_file() or args.reindex:
        index_md.write_text(
            build_index(target, base_id, name, confidential, with_tables=not args.no_excel),
            encoding="utf-8",
        )
        created.append("INDEX.md")

    for subdir in ("knowledge", "templates", "cases"):
        (target / subdir).mkdir(parents=True, exist_ok=True)

    registry = load_registry()
    entry = {
        "id": base_id,
        "name": name,
        "version": "1.0.0",
        "description": f"{name} 项目底座（外部挂载）",
        "path": stored_path(target),
        "tags": ["project"],
        "confidential": confidential,
    }
    upsert_entry(registry, entry)
    if not args.no_activate:
        registry["active"] = base_id
    save_registry(registry)
    applied = sync_skill_paths(target, base_id)

    print(f"[完成] 已挂载底座 {base_id} → {target}")
    if created:
        print(f"       新建：{', '.join(created)}")
    print(f"       涉密：{'是' if confidential else '否'}")
    if applied:
        print(f"       技能路径已同步：{', '.join(applied)}")
    elif (target / "paths.json").is_file():
        print("       paths.json 里没有可识别的路径字段（见 skills/_project-paths.schema.md）")
    else:
        print("       提示：放一个 paths.json 可让四个技能自动拿到本项目路径")
    print(f"       当前激活：{registry['active']}")
    if args.no_activate:
        print("       （未激活；用 python tools/base_manager.py activate %s 启用）" % base_id)


def cmd_off(_: argparse.Namespace) -> None:
    registry = load_registry()
    registry["active"] = DEFAULT_BASE
    save_registry(registry)
    reset_skill_paths()
    print(f"[完成] 已切回通用底座：{DEFAULT_BASE}")
    print("       技能路径已清空（skills/_project-paths.json 全部置 null）")


def cmd_list(_: argparse.Namespace) -> None:
    registry = load_registry()
    active = registry.get("active") or "(未设置)"
    print(f"当前底座：{active}\n")
    for entry in registry.get("bases", []):
        marker = "*" if entry.get("id") == active else " "
        flag = " [涉密]" if entry.get("confidential") else ""
        print(f" {marker} {entry.get('id'):<18} {entry.get('name', '')}{flag}")
        print(f"     {entry.get('path', '')}")


def cmd_unmount(args: argparse.Namespace) -> None:
    registry = load_registry()
    entry = find_entry(registry, args.unmount)
    if not entry:
        fail(f"找不到底座：{args.unmount}")
    registry["bases"] = [e for e in registry["bases"] if e.get("id") != args.unmount]
    if registry.get("active") == args.unmount:
        registry["active"] = DEFAULT_BASE
    save_registry(registry)
    print(f"[完成] 已从注册表移除 {args.unmount}（文件未删除）")
    print(f"       当前激活：{registry['active']}")


# ------------------------------------------------------------------------ parser

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="mount_project.py",
        description="把任意项目资料目录挂成内容底座并激活",
    )
    parser.add_argument("path", nargs="?", help="项目资料目录")
    parser.add_argument("--id", help="底座 id（默认取目录名转 kebab-case）")
    parser.add_argument("--name", help="底座显示名（默认取目录名）")
    parser.add_argument("--public", action="store_true", help="标记为不涉密（默认为涉密）")
    parser.add_argument("--confidential", action="store_true", help="显式标记为涉密")
    parser.add_argument("--no-activate", action="store_true", help="只注册，不切换 active")
    parser.add_argument("--reindex", action="store_true", help="强制重建 INDEX.md")
    parser.add_argument("--no-excel", action="store_true", help="跳过 Excel/CSV 扫描（大目录或没装 openpyxl 时用）")
    parser.add_argument("--off", action="store_true", help="切回 soc-general")
    parser.add_argument("--list", action="store_true", help="列出所有底座")
    parser.add_argument("--unmount", metavar="ID", help="从注册表移除某底座")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.off:
        cmd_off(args)
        return
    if args.list:
        cmd_list(args)
        return
    if args.unmount:
        cmd_unmount(args)
        return
    if not args.path:
        parser.print_help()
        raise SystemExit(2)
    cmd_mount(args)


if __name__ == "__main__":
    main()
