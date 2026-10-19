#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""内容底座管理器。

用法：
    python tools/base_manager.py list
    python tools/base_manager.py status
    python tools/base_manager.py resolve [id]
    python tools/base_manager.py activate <id>
    python tools/base_manager.py add <path> --id <id> --name <name> [--description ...] [--confidential]
    python tools/base_manager.py create <id> --name <name> [--path <dir>]
    python tools/base_manager.py remove <id>
    python tools/base_manager.py validate
    python tools/base_manager.py index <id> [--write]
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

TOOLS_DIR = Path(__file__).resolve().parent
ROOT = TOOLS_DIR.parent
REGISTRY_PATH = ROOT / "bases" / "registry.json"
ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


# ---------------------------------------------------------------- helpers

def fail(message: str, code: int = 1) -> None:
    print(f"[失败] {message}")
    raise SystemExit(code)


def load_registry() -> dict:
    if not REGISTRY_PATH.exists():
        return {"schemaVersion": 1, "active": "soc-general", "bases": []}
    try:
        data = json.loads(REGISTRY_PATH.read_text(encoding="utf-8-sig"))
    except json.JSONDecodeError as exc:
        fail(f"registry.json 解析失败：{exc}")
    if not isinstance(data, dict):
        fail("registry.json 顶层必须是对象")
    data.setdefault("schemaVersion", 1)
    data.setdefault("active", "")
    data.setdefault("bases", [])
    return data


def save_registry(registry: dict) -> None:
    REGISTRY_PATH.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY_PATH.write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def entry_path(entry: dict) -> Path:
    raw = Path(str(entry.get("path", "")))
    return raw if raw.is_absolute() else (ROOT / raw).resolve()


def find_entry(registry: dict, base_id: str) -> dict | None:
    for entry in registry.get("bases", []):
        if entry.get("id") == base_id:
            return entry
    return None


def active_entry(registry: dict) -> dict | None:
    active = registry.get("active") or ""
    if active:
        return find_entry(registry, active)
    return None


def read_base_json(path: Path) -> dict | None:
    meta = path / "base.json"
    if not meta.exists():
        return None
    try:
        return json.loads(meta.read_text(encoding="utf-8-sig"))
    except json.JSONDecodeError:
        return None


def validate_base_dir(path: Path, expect_id: str | None = None) -> list[str]:
    problems: list[str] = []
    if not path.exists() or not path.is_dir():
        problems.append(f"路径不存在或不是目录：{path}")
        return problems
    meta = read_base_json(path)
    if meta is None:
        problems.append("缺少或无法解析 base.json")
        return problems
    if expect_id and meta.get("id") != expect_id:
        problems.append(f"base.json 的 id='{meta.get('id')}' 与注册 id='{expect_id}' 不一致")
    if not meta.get("name"):
        problems.append("base.json 缺少 name")
    entry = meta.get("entry", "INDEX.md")
    if not (path / entry).exists():
        problems.append(f"入口文件不存在：{entry}")
    for rel in meta.get("knowledge", []) or []:
        if not (path / rel).exists():
            problems.append(f"知识文件不存在：{rel}")
    for rel in meta.get("templates", []) or []:
        if not (path / rel).exists():
            problems.append(f"模板文件不存在：{rel}")
    return problems


# ---------------------------------------------------------------- commands

def cmd_list(_: argparse.Namespace) -> None:
    registry = load_registry()
    active = registry.get("active") or "(未设置)"
    print(f"当前底座：{active}\n")
    print(f"{'':2} {'id':24} {'名称':24} {'路径':40} 状态")
    for entry in registry.get("bases", []):
        path = entry_path(entry)
        marker = "*" if entry.get("id") == active else " "
        state = "ok" if path.exists() else "路径不存在"
        if path.exists() and read_base_json(path) is None:
            state = "缺少 base.json"
        conf = " [涉密]" if entry.get("confidential") else ""
        print(f"{marker:2} {entry.get('id',''):24} {entry.get('name',''):24} {str(path):40} {state}{conf}")
    print("\n* = 当前激活")


def cmd_status(_: argparse.Namespace) -> None:
    registry = load_registry()
    active = active_entry(registry)
    skill_count = len(list((ROOT / "skills").glob("*/SKILL.md")))
    fact_count = len(list((ROOT / "memory" / "facts").glob("*.md")))
    print(f"助手根目录：{ROOT}")
    print(f"注册表：{REGISTRY_PATH}")
    print(f"底座数量：{len(registry.get('bases', []))}")
    print(f"当前底座：{registry.get('active') or '(未设置)'}")
    if active:
        print(f"当前路径：{entry_path(active)}")
        print(f"涉密：{'是' if active.get('confidential') else '否'}")
    print(f"技能数量：{skill_count}")
    print(f"记忆事实：{fact_count}")


def cmd_resolve(args: argparse.Namespace) -> None:
    registry = load_registry()
    entry = find_entry(registry, args.id) if args.id else active_entry(registry)
    if not entry:
        fail(f"找不到底座：{args.id or registry.get('active')}")
    print(entry_path(entry))


def cmd_activate(args: argparse.Namespace) -> None:
    registry = load_registry()
    entry = find_entry(registry, args.id)
    if not entry:
        fail(f"找不到底座：{args.id}；先运行 list 查看")
    path = entry_path(entry)
    if not path.exists():
        fail(f"底座路径不存在：{path}")
    registry["active"] = args.id
    save_registry(registry)
    print(f"[完成] 当前底座已切换为：{args.id}")
    print(f"路径：{path}")


def cmd_add(args: argparse.Namespace) -> None:
    if not ID_RE.match(args.id):
        fail("id 必须是小写 kebab-case（字母/数字/连字符）")
    registry = load_registry()
    existing = find_entry(registry, args.id)
    if existing and not args.update:
        fail(f"id 已存在：{args.id}；使用 --update 覆盖元数据")
    path = Path(args.path).expanduser()
    if not path.is_absolute() and not path.exists():
        candidate = ROOT / path
        if candidate.exists():
            path = candidate
    path = path.resolve()
    if not path.exists():
        fail(f"路径不存在：{path}")
    if not (path / "base.json").exists():
        if args.no_init:
            fail("目标目录缺少 base.json；去掉 --no-init 可自动生成")
        meta = {
            "schemaVersion": 1,
            "id": args.id,
            "name": args.name or args.id,
            "version": "0.1.0",
            "domain": args.domain or "",
            "description": args.description or "",
            "entry": "INDEX.md",
            "knowledge": [],
            "templates": [],
            "cases": "cases",
            "confidential": bool(args.confidential),
        }
        (path / "base.json").write_text(
            json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        if not (path / "INDEX.md").exists():
            (path / "INDEX.md").write_text(
                f"# {meta['name']} · 入口\n\n## 知识文件\n\n（待补充）\n",
                encoding="utf-8",
            )
        print(f"[初始化] 已生成 base.json 与 INDEX.md：{path}")
    meta = read_base_json(path) or {}
    try:
        stored_path = str(path.relative_to(ROOT)).replace("\\", "/")
    except ValueError:
        stored_path = str(path)
    entry = {
        "id": args.id,
        "name": args.name or meta.get("name") or args.id,
        "version": meta.get("version", "0.1.0"),
        "description": args.description or meta.get("description", ""),
        "path": stored_path,
        "tags": meta.get("tags", []),
        "confidential": bool(args.confidential or meta.get("confidential", False)),
    }
    if existing:
        existing.update(entry)
        print(f"[更新] {args.id}")
    else:
        registry.setdefault("bases", []).append(entry)
        print(f"[新增] {args.id}")
    save_registry(registry)
    print(f"路径：{path}")
    print("下一步：python tools/base_manager.py activate " + args.id)


def cmd_remove(args: argparse.Namespace) -> None:
    registry = load_registry()
    if registry.get("active") == args.id:
        fail("不能删除当前激活的底座；先 activate 到其他底座")
    before = len(registry.get("bases", []))
    registry["bases"] = [e for e in registry.get("bases", []) if e.get("id") != args.id]
    if len(registry["bases"]) == before:
        fail(f"找不到底座：{args.id}")
    save_registry(registry)
    print(f"[移除] {args.id}（目录未删除）")


def cmd_create(args: argparse.Namespace) -> None:
    if not ID_RE.match(args.id):
        fail("id 必须是小写 kebab-case（字母/数字/连字符）")
    base_dir = Path(args.path).expanduser().resolve() if args.path else (ROOT / "bases" / args.id)
    if base_dir.exists() and any(base_dir.iterdir()):
        fail(f"目录已存在且非空：{base_dir}")
    (base_dir / "knowledge").mkdir(parents=True, exist_ok=True)
    (base_dir / "templates").mkdir(parents=True, exist_ok=True)
    (base_dir / "cases").mkdir(parents=True, exist_ok=True)
    meta = {
        "schemaVersion": 1,
        "id": args.id,
        "name": args.name,
        "version": "0.1.0",
        "domain": args.domain or "",
        "description": args.description or "",
        "entry": "INDEX.md",
        "knowledge": ["knowledge/01_overview.md"],
        "templates": [],
        "cases": "cases",
        "confidential": bool(args.confidential),
    }
    (base_dir / "base.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (base_dir / "knowledge" / "01_overview.md").write_text(
        f"# {args.name} · 概览\n\n"
        "## 1. 项目/品类定位\n\n"
        "## 2. 核心循环\n\n"
        "## 3. 系统清单\n\n"
        "## 4. 关键约束\n\n"
        "## 5. 已知风险与未知\n",
        encoding="utf-8",
    )
    (base_dir / "INDEX.md").write_text(
        f"# {args.name} · 入口\n\n"
        "## 这个底座回答什么\n\n"
        "- \n\n"
        "## 知识文件\n\n"
        "| 文件 | 内容 |\n| --- | --- |\n"
        "| [knowledge/01_overview.md](knowledge/01_overview.md) | 概览 |\n\n"
        "## 模板\n\n（待补充）\n\n"
        "## 案例\n\n（待补充）\n\n"
        "## 边界与时效\n\n- \n",
        encoding="utf-8",
    )
    print(f"[创建] {base_dir}")
    try:
        stored = str(base_dir.relative_to(ROOT)).replace("\\", "/")
    except ValueError:
        stored = str(base_dir)
    print("下一步：")
    print(f"  python tools/base_manager.py add \"{stored}\" --id {args.id} --name \"{args.name}\"")


def cmd_validate(_: argparse.Namespace) -> None:
    registry = load_registry()
    problems: list[str] = []
    warnings: list[str] = []
    if not isinstance(registry.get("bases"), list):
        problems.append("bases 必须是数组")
    seen: set[str] = set()
    for entry in registry.get("bases", []):
        base_id = entry.get("id", "")
        if not base_id:
            problems.append("存在缺少 id 的底座条目")
            continue
        if not ID_RE.match(base_id):
            problems.append(f"id 不是 kebab-case：{base_id}")
        if base_id in seen:
            problems.append(f"id 重复：{base_id}")
        seen.add(base_id)
        path = entry_path(entry)
        for item in validate_base_dir(path, base_id):
            problems.append(f"[{base_id}] {item}")
        meta = read_base_json(path) or {}
        if meta.get("confidential") and not entry.get("confidential"):
            warnings.append(f"[{base_id}] base.json 标了 confidential，registry 未标")
    active = registry.get("active")
    if active and active not in seen:
        problems.append(f"active 指向不存在的底座：{active}")
    if warnings:
        print("警告：")
        for w in warnings:
            print("  - " + w)
    if problems:
        print("校验失败：")
        for p in problems:
            print("  - " + p)
        raise SystemExit(1)
    print(f"[通过] {len(seen)} 个底座，active={active or '(未设置)'}")


def cmd_index(args: argparse.Namespace) -> None:
    registry = load_registry()
    entry = find_entry(registry, args.id)
    if not entry:
        fail(f"找不到底座：{args.id}")
    base_dir = entry_path(entry)
    sys.path.insert(0, str(TOOLS_DIR))
    from md_index import build_index  # noqa: WPS433

    output = base_dir / "INDEX.md" if args.write else base_dir / "INDEX.generated.md"
    build_index(base_dir, output)
    print(f"[完成] 已生成：{output}")


# ---------------------------------------------------------------- entry

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="内容底座管理器")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("list", help="列出所有底座")
    p.set_defaults(func=cmd_list)

    p = sub.add_parser("status", help="显示助手状态")
    p.set_defaults(func=cmd_status)

    p = sub.add_parser("resolve", help="输出底座绝对路径")
    p.add_argument("id", nargs="?")
    p.set_defaults(func=cmd_resolve)

    p = sub.add_parser("activate", help="切换当前底座")
    p.add_argument("id")
    p.set_defaults(func=cmd_activate)

    p = sub.add_parser("add", help="接入一个已存在的底座目录")
    p.add_argument("path")
    p.add_argument("--id", required=True)
    p.add_argument("--name", default="")
    p.add_argument("--description", default="")
    p.add_argument("--domain", default="")
    p.add_argument("--confidential", action="store_true")
    p.add_argument("--update", action="store_true", help="覆盖已存在的 id")
    p.add_argument("--no-init", action="store_true", help="不要在目标目录生成 base.json")
    p.set_defaults(func=cmd_add)

    p = sub.add_parser("create", help="新建空底座目录")
    p.add_argument("id")
    p.add_argument("--name", required=True)
    p.add_argument("--path", default="")
    p.add_argument("--description", default="")
    p.add_argument("--domain", default="")
    p.add_argument("--confidential", action="store_true")
    p.set_defaults(func=cmd_create)

    p = sub.add_parser("remove", help="从注册表移除底座（不删目录）")
    p.add_argument("id")
    p.set_defaults(func=cmd_remove)

    p = sub.add_parser("validate", help="校验注册表与底座目录")
    p.set_defaults(func=cmd_validate)

    p = sub.add_parser("index", help="生成底座索引")
    p.add_argument("id")
    p.add_argument("--write", action="store_true", help="直接覆盖 INDEX.md")
    p.set_defaults(func=cmd_index)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
