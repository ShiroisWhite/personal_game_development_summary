#!/usr/bin/env python3
"""export_runtime.py — 把本包导出成别的 runtime 认识的形状。

用法：
    python tools/export_runtime.py --target all
    python tools/export_runtime.py --target claude-code
    python tools/export_runtime.py --target codex

产物：
    integrations/claude-code/   CLAUDE.md + .claude/skills/ + knowledge/ + templates/ + memory/
    integrations/codex/         AGENTS.md + .agents/skills/ + knowledge/ + templates/ + memory/

导出内容（技能与方法论是一个共享池，不分来源、不做过滤）：
    - 人格与规则（AGENTS.md）
    - skills/ 全部技能
    - soc-general 的 knowledge/ 与 templates/
    - 用户级记忆（memory/facts/*.md 中 type != project）
不导出：项目底座、confidential 底座、任何密钥。
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from datetime import date
from pathlib import Path

TOOLS_DIR = Path(__file__).resolve().parent
ROOT = TOOLS_DIR.parent
OUT_ROOT = ROOT / "integrations"
GENERAL_BASE = "soc-general"

TARGETS = {
    "claude-code": {
        "rules_file": "CLAUDE.md",
        "skills_dir": ".claude/skills",
        "runtime": "Claude Code",
        "install": [
            "把 `CLAUDE.md` 放到项目根目录（或 `~/.claude/CLAUDE.md` 作为全局规则）。",
            "把 `.claude/skills/` 整个目录放到项目根目录，或合并进 `~/.claude/skills/`。",
            "`knowledge/` 与 `templates/` 是资料，放到项目里任意位置，规则里用相对路径引用即可。",
            "`memory/` 里是用户级记忆，按需拷进 `~/.claude/`。",
        ],
    },
    "codex": {
        "rules_file": "AGENTS.md",
        "skills_dir": ".agents/skills",
        "runtime": "OpenAI Codex",
        "install": [
            "把 `AGENTS.md` 放到项目根目录。",
            "把 `.agents/skills/` 放到项目根目录。",
            "`knowledge/` 与 `templates/` 作为资料目录保留。",
            "`memory/` 里是用户级记忆，按需放进 `~/.codex/`。",
        ],
    },
}

IGNORE = shutil.ignore_patterns(
    "__pycache__", "*.pyc", ".git", ".DS_Store", "*.tmp", "node_modules"
)


def memory_type(text: str) -> str:
    match = re.search(r"^metadata:\s*$\n(?:.*\n)*?\s*type:\s*(\w+)", text, re.MULTILINE)
    if match:
        return match.group(1)
    match = re.search(r"^type:\s*(\w+)", text, re.MULTILINE)
    return match.group(1) if match else "reference"


def memory_name(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    match = re.search(r"^name:\s*(.+)$", text, re.MULTILINE)
    return match.group(1).strip() if match else path.stem


def memory_description(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    match = re.search(r"^description:\s*(.+)$", text, re.MULTILINE)
    return match.group(1).strip() if match else ""


def rules_for(runtime: str, target: str) -> str:
    source = ROOT / "AGENTS.md"
    if not source.is_file():
        raise SystemExit("[失败] 找不到 AGENTS.md")
    body = source.read_text(encoding="utf-8")
    body = body.replace(
        "适用运行时：DeepSeek Harness（dsh）为主，可导出到 Claude Code / Codex（见 §9）。",
        f"适用运行时：{runtime}（由 SOC-Assistant 导出，见文末「导出说明」）。",
    )
    note = [
        "",
        "---",
        "",
        "## 导出说明",
        "",
        f"- 本文件由 `tools/export_runtime.py` 从 SOC-Assistant 导出，目标 runtime：{runtime}。",
        f"- 导出时间：{date.today().isoformat()}。请勿在此手改规则，改源包后重新导出。",
        "- 通用技能在 `" + TARGETS[target]["skills_dir"] + "/`；方法论在 `knowledge/`；",
        "- 本导出不含 `tools/`：被问「你能干什么」时直接读 `ONBOARDING.md` 第 3 节回答；",
        "  要挂项目、跑自检或检索配置表，回源包执行对应命令。",
        "- 项目事实不在本包内：到目标机器上把项目目录挂成底座（`python tools/mount_project.py <路径>`）。",
        "",
    ]
    return body.rstrip() + "\n" + "\n".join(note)


def copy_all_skills(dest: Path) -> list[str]:
    skills_root = ROOT / "skills"
    copied: list[str] = []
    for skill_dir in sorted(p for p in skills_root.iterdir() if p.is_dir()):
        if not (skill_dir / "SKILL.md").is_file():
            continue
        shutil.copytree(skill_dir, dest / skill_dir.name, ignore=IGNORE)
        copied.append(skill_dir.name)
    return copied


def copy_general_knowledge(dest: Path) -> None:
    base = ROOT / "bases" / GENERAL_BASE
    for subdir in ("knowledge", "templates"):
        src = base / subdir
        if src.is_dir():
            shutil.copytree(src, dest / subdir, ignore=IGNORE)


def copy_memory(dest: Path) -> list[str]:
    facts = ROOT / "memory" / "facts"
    dest.mkdir(parents=True, exist_ok=True)
    kept: list[str] = []
    lines = ["# 记忆索引", ""]
    groups: dict[str, list[str]] = {}
    for path in sorted(facts.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        if memory_type(text) == "project":
            continue
        shutil.copy2(path, dest / path.name)
        kept.append(path.stem)
        groups.setdefault(memory_type(text), []).append(
            f"- [{memory_name(path)}](facts/{path.name}) — {memory_description(path)}"
        )
    titles = {"user": "用户", "feedback": "反馈", "reference": "参考"}
    for kind, items in groups.items():
        lines += [f"## {titles.get(kind, kind)}", ""] + items + [""]
    (dest / "MEMORY.md").write_text("\n".join(lines), encoding="utf-8")
    return kept


def write_sanitized_paths(skills_dest: Path) -> None:
    """导出时把项目路径抹掉：只带空模板和说明，避免把本地项目路径带出去。"""
    source = ROOT / "skills" / "_project-paths.json"
    if not source.is_file():
        return
    data = json.loads(source.read_text(encoding="utf-8-sig"))
    data["project_id"] = None
    for field in (
        "engine",
        "unity_project",
        "code_csharp",
        "code_lua",
        "prefab_root",
        "config_root",
        "language_table",
        "prototype_out",
        "memory_root",
    ):
        data[field] = None
    data.pop("_example", None)
    (skills_dest / "_project-paths.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    schema = ROOT / "skills" / "_project-paths.schema.md"
    if schema.is_file():
        shutil.copy2(schema, skills_dest / schema.name)


def write_target(target: str) -> None:
    spec = TARGETS[target]
    dest = OUT_ROOT / target
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    skills_dest = dest / spec["skills_dir"]
    skills_dest.mkdir(parents=True, exist_ok=True)

    (dest / spec["rules_file"]).write_text(rules_for(spec["runtime"], target), encoding="utf-8")
    onboarding = ROOT / "ONBOARDING.md"
    if onboarding.is_file():
        shutil.copy2(onboarding, dest / onboarding.name)

    copied = copy_all_skills(skills_dest)
    write_sanitized_paths(skills_dest)
    copy_general_knowledge(dest)
    kept_memory = copy_memory(dest / "memory")

    manifest = {
        "target": target,
        "runtime": spec["runtime"],
        "exported_at": date.today().isoformat(),
        "package_version": (ROOT / "VERSION").read_text(encoding="utf-8").strip(),
        "rules_file": spec["rules_file"],
        "skills": copied,
        "memory": kept_memory,
        "excluded": {"bases": "项目底座与 confidential 底座一律不导出"},
    }
    (dest / "SOURCES.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    readme = [
        f"# {spec['runtime']} 导出",
        "",
        f"由 SOC-Assistant v{manifest['package_version']} 导出（{manifest['exported_at']}）。",
        "",
        "## 安装",
        "",
    ] + [f"{i}. {step}" for i, step in enumerate(spec["install"], 1)] + [
        "",
        "## 内容",
        "",
        f"- 规则：`{spec['rules_file']}`",
        "- 上手：`ONBOARDING.md`（第一次用读这个）",
        f"- 技能：`{spec['skills_dir']}/`（{len(copied)} 个）",
        "- 方法论：`knowledge/`（soc-general 全部）",
        "- 模板：`templates/`",
        f"- 用户级记忆：`memory/`（{len(kept_memory)} 条）",
        "",
        "## 不含",
        "",
        "- 任何项目底座内容（含 confidential 底座）",
        "- 密钥、账号、公司内部链接",
        "",
        "项目事实的处理方式：到目标机器把项目目录挂成底座——",
        "`python tools/mount_project.py <项目路径> --id <id> --name <名称>`。",
        "",
    ]
    (dest / "README.md").write_text("\n".join(readme), encoding="utf-8")
    print(f"[完成] {target}: 规则 1 · 技能 {len(copied)} · 记忆 {len(kept_memory)} → {dest}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="export_runtime.py",
        description="把本包导出成 Claude Code / Codex 可用的形状",
    )
    parser.add_argument(
        "--target",
        choices=["all", *TARGETS.keys()],
        default="all",
        help="导出目标（默认 all）",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    targets = list(TARGETS) if args.target == "all" else [args.target]
    for target in targets:
        write_target(target)
    print(f"\n导出目录：{OUT_ROOT}")


if __name__ == "__main__":
    main()
