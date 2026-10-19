#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""onboard.py — 自检 + 上手引导。

任何新环境（新机器、新 runtime、别人第一次用）打开这个包时，
先跑这一条，就能知道自己现在处于什么状态、下一步该做什么。

用法：
    python tools/onboard.py            # 人看的完整版
    python tools/onboard.py --brief    # 模型看的短版（回答“你能干什么”时用这个）
    python tools/onboard.py --json     # 机器读

只读，不改任何文件。
"""

from __future__ import annotations

import argparse
import json
import platform
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

TOOLS_DIR = Path(__file__).resolve().parent
ROOT = TOOLS_DIR.parent

CAPABILITIES = [
    "顾问判断：这套系统该怎么设计、值不值得抄、能不能迁移",
    "拆系统：定位三问 → 循环图 → 三轴判定 → 失败模式",
    "查循环：核心循环、成长链、经济链、PvP、赛季节奏",
    "配置落地：要改哪些表、字段怎么定、引用链与验收",
    "写东西：策划案、需求文档、系统说明",
    "做原型：单文件 HTML 可点击原型 + 截图 / PDF",
    "管知识：项目底座挂载、检索、记忆维护、多 runtime 导出",
]


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8-sig"))
    except (OSError, json.JSONDecodeError):
        return {}


def package_version() -> str:
    try:
        return (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    except OSError:
        return "unknown"


def python_ok() -> tuple[str, bool]:
    version = platform.python_version()
    return version, sys.version_info >= (3, 10)


def openpyxl_ok() -> bool:
    try:
        import openpyxl  # noqa: F401
    except ImportError:
        return False
    return True


def base_state() -> dict:
    registry = load_json(ROOT / "bases" / "registry.json")
    active = registry.get("active") or "soc-general"
    entry = next(
        (b for b in registry.get("bases", []) if b.get("id") == active),
        {},
    )
    rel = entry.get("path") or f"bases/{active}"
    base_dir = (ROOT / rel).resolve()
    meta = load_json(base_dir / "base.json")
    tables = meta.get("tables") or []
    knowledge_dir = base_dir / "knowledge"
    knowledge = (
        len([p for p in knowledge_dir.iterdir() if p.is_file()])
        if knowledge_dir.is_dir()
        else 0
    )
    return {
        "id": active,
        "name": meta.get("name") or entry.get("name") or active,
        "kind": meta.get("kind") or entry.get("kind") or "method",
        "confidential": bool(meta.get("confidential")),
        "tables": len(tables),
        "knowledge": knowledge,
        "dir": rel,
        "is_general": active == "soc-general",
        "exists": base_dir.is_dir(),
    }


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


def project_state() -> dict:
    paths = load_json(ROOT / "skills" / "_project-paths.json")
    filled = {key: paths.get(key) for key in PATH_FIELDS if paths.get(key)}
    return {
        "id": paths.get("project_id"),
        "filled": sorted(filled),
        "empty": sorted(set(PATH_FIELDS) - set(filled)),
    }


def skills_state() -> dict:
    skills_dir = ROOT / "skills"
    names = sorted(
        p.parent.name for p in skills_dir.glob("*/SKILL.md") if p.is_file()
    )
    return {"count": len(names), "names": names}


def memory_state() -> int:
    facts = ROOT / "memory" / "facts"
    return len(list(facts.glob("*.md"))) if facts.is_dir() else 0


def integrations_state() -> list[str]:
    out = ROOT / "integrations"
    if not out.is_dir():
        return []
    return sorted(p.name for p in out.iterdir() if p.is_dir())


def build_state() -> dict:
    version = package_version()
    py, py_ok = python_ok()
    base = base_state()
    project = project_state()
    skills = skills_state()
    memory = memory_state()
    integrations = integrations_state()
    deps = openpyxl_ok()

    steps: list[str] = []
    if not py_ok:
        steps.append("Python 版本低于 3.10：升级后再用（本包用到 `X | None` 语法）。")
    if not deps:
        steps.append("缺 openpyxl：跑 `pip install openpyxl`，否则配置表扫描与 xlsx 检索会跳过。")
    if not base["exists"]:
        steps.append(f"当前底座目录不存在：检查 `bases/registry.json`，或先跑 `python tools/validate_package.py`。")

    mounted = project["id"] is not None
    if base["is_general"] and not mounted:
        steps.append(
            "还没挂项目：`python tools/mount_project.py <项目资料目录> --id <项目id> --name \"<项目名>\"`"
            "（目录里放 paths.json + 配置表即可；只想聊方法论可以跳过）"
        )
    elif mounted and not project["filled"]:
        steps.append(
            f"已挂 `{project['id']}` 但技能路径为空：把 paths.json 放进项目目录后重跑 mount，或手填 `skills/_project-paths.json`。"
        )
    elif mounted:
        steps.append(
            f"`{project['id']}` 已就绪（已配 {len(project['filled'])} 个路径字段）：先试三句——"
            "「XX 配置在哪」「拆一下 XX 系统」「这个循环为什么后期没得玩」"
        )
    if not steps:
        steps.append("状态就绪：直接问一个具体的设计问题。")

    return {
        "package": {"version": version, "root": str(ROOT)},
        "python": {"version": py, "ok": py_ok, "openpyxl": deps},
        "base": base,
        "project": project,
        "skills": skills,
        "memory": memory,
        "integrations": integrations,
        "capabilities": CAPABILITIES,
        "next_steps": steps,
    }


def render_full(state: dict) -> str:
    base = state["base"]
    project = state["project"]
    lines = [
        f"SOC-Assistant v{state['package']['version']} · 自检",
        "",
        f"路径      {state['package']['root']}",
        f"Python    {state['python']['version']}"
        + ("" if state["python"]["ok"] else "（需要 3.10+）")
        + f" · openpyxl {'可用' if state['python']['openpyxl'] else '缺失'}",
        f"底座      {base['id']}（{base['name']}）"
        + (" · 通用方法论" if base["is_general"] else " · 项目底座")
        + (f" · 配置表 {base['tables']} 个" if base["tables"] else ""),
        f"知识      {base['knowledge']} 个文件 · 技能 {state['skills']['count']} 个 · 记忆 {state['memory']} 条",
        "项目      "
        + (
            f"{project['id']} · 已配路径 {len(project['filled'])} 个"
            if project["id"]
            else "未挂载（只回答问题、不碰项目事实）"
        ),
        "导出      "
        + (", ".join(state["integrations"]) if state["integrations"] else "尚未导出（dsh 本机可直接用）"),
        "",
        "能干什么",
    ]
    lines += [f"  {i}. {item}" for i, item in enumerate(state["capabilities"], 1)]
    lines += ["", "下一步"]
    lines += [f"  {i}. {step}" for i, step in enumerate(state["next_steps"], 1)]
    lines += [
        "",
        "完整说明见 ONBOARDING.md；底座与记忆规则见 AGENTS.md §6 / §7。",
    ]
    return "\n".join(lines)


def render_brief(state: dict) -> str:
    base = state["base"]
    project = state["project"]
    lines = [
        f"SOC-Assistant v{state['package']['version']} | Python {state['python']['version']}"
        + ("" if state["python"]["ok"] else "（<3.10）")
        + f" | openpyxl {'ok' if state['python']['openpyxl'] else 'missing'}",
        f"底座：{base['id']}（{base['name']}）"
        + ("｜通用" if base["is_general"] else "｜项目")
        + f"｜配置表 {base['tables']}｜知识 {base['knowledge']}｜技能 {state['skills']['count']}｜记忆 {state['memory']}",
        f"项目：{project['id'] or '未挂载'}"
        + (f"（已配路径 {len(project['filled'])} 项）" if project["id"] else ""),
        "能做：" + " / ".join(
            ["顾问判断", "拆系统", "查循环", "配置落地", "写文档", "做原型", "管知识"]
        ),
        "下一步：" + state["next_steps"][0],
    ]
    return "\n".join(lines)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="onboard.py",
        description="自检当前安装状态，并给出下一步该做什么",
    )
    parser.add_argument("--brief", action="store_true", help="短版输出（给模型读）")
    parser.add_argument("--json", action="store_true", help="输出 JSON")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    state = build_state()
    if args.json:
        print(json.dumps(state, ensure_ascii=False, indent=2))
    elif args.brief:
        print(render_brief(state))
    else:
        print(render_full(state))


if __name__ == "__main__":
    main()
