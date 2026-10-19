#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""校验迁移包：技能 frontmatter、底座契约、记忆、脚本可编译。

用法：
    python tools/validate_package.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

TOOLS_DIR = Path(__file__).resolve().parent
ROOT = TOOLS_DIR.parent
ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)

problems: list[str] = []
warnings: list[str] = []


def problem(message: str) -> None:
    problems.append(message)


def warn(message: str) -> None:
    warnings.append(message)


def parse_frontmatter(text: str) -> dict[str, str] | None:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None
    data: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" in line:
            key, value = line.split(":", 1)
            data[key.strip()] = value.strip().strip('"').strip("'")
    return data


def check_agents() -> None:
    agents = ROOT / "AGENTS.md"
    if not agents.exists():
        problem("缺少 AGENTS.md")
        return
    text = agents.read_text(encoding="utf-8", errors="replace")
    for heading in ["身份与使命", "会话启动流程", "信息分层", "技能", "内容底座", "记忆协议"]:
        if heading not in text:
            warn(f"AGENTS.md 缺少章节关键词：{heading}")
    if len(text) < 1500:
        warn("AGENTS.md 内容较短，可能缺少关键规则")


def check_skills() -> None:
    skills_dir = ROOT / "skills"
    if not skills_dir.exists():
        problem("缺少 skills/ 目录")
        return
    skill_files = list(skills_dir.glob("*/SKILL.md"))
    if not skill_files:
        problem("skills/ 下没有 SKILL.md")
    for path in sorted(skill_files):
        rel = path.relative_to(ROOT).as_posix()
        text = path.read_text(encoding="utf-8", errors="replace")
        data = parse_frontmatter(text)
        if data is None:
            problem(f"{rel}: 缺少 YAML frontmatter")
            continue
        name = data.get("name", "")
        description = data.get("description", "")
        if not name:
            problem(f"{rel}: frontmatter 缺少 name")
        elif not ID_RE.match(name):
            problem(f"{rel}: name 不是 kebab-case：{name}")
        elif name != path.parent.name:
            problem(f"{rel}: name='{name}' 与目录名='{path.parent.name}' 不一致")
        if not description:
            problem(f"{rel}: frontmatter 缺少 description")
        elif len(description) < 10:
            warn(f"{rel}: description 过短，可能影响路由")
        # dsh 不会发现嵌套 SKILL.md
        for nested in path.parent.rglob("SKILL.md"):
            if nested != path:
                problem(f"{rel}: 存在嵌套 SKILL.md（dsh 不会加载）：{nested.relative_to(ROOT)}")
    if len(skill_files) < 5:
        warn(f"技能数量偏少：{len(skill_files)}")


def check_bases() -> None:
    registry_path = ROOT / "bases" / "registry.json"
    if not registry_path.exists():
        problem("缺少 bases/registry.json")
        return
    try:
        registry = json.loads(registry_path.read_text(encoding="utf-8-sig"))
    except json.JSONDecodeError as exc:
        problem(f"registry.json 解析失败：{exc}")
        return
    bases = registry.get("bases", [])
    if not isinstance(bases, list):
        problem("registry.bases 必须是数组")
        return
    seen: set[str] = set()
    for entry in bases:
        base_id = entry.get("id", "")
        if not base_id:
            problem("registry 中存在缺少 id 的条目")
            continue
        if base_id in seen:
            problem(f"registry id 重复：{base_id}")
        seen.add(base_id)
        raw = Path(str(entry.get("path", "")))
        base_dir = raw if raw.is_absolute() else (ROOT / raw).resolve()
        if not base_dir.exists():
            problem(f"[{base_id}] 路径不存在：{base_dir}")
            continue
        meta_path = base_dir / "base.json"
        if not meta_path.exists():
            problem(f"[{base_id}] 缺少 base.json")
            continue
        try:
            meta = json.loads(meta_path.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError as exc:
            problem(f"[{base_id}] base.json 解析失败：{exc}")
            continue
        if meta.get("id") != base_id:
            problem(f"[{base_id}] base.json id='{meta.get('id')}' 不匹配")
        entry_file = base_dir / meta.get("entry", "INDEX.md")
        if not entry_file.exists():
            problem(f"[{base_id}] 入口文件不存在：{entry_file.name}")
        for rel in meta.get("knowledge", []) or []:
            if not (base_dir / rel).exists():
                problem(f"[{base_id}] 知识文件不存在：{rel}")
        for rel in meta.get("templates", []) or []:
            if not (base_dir / rel).exists():
                problem(f"[{base_id}] 模板文件不存在：{rel}")
    active = registry.get("active")
    if active and active not in seen:
        problem(f"active 指向不存在的底座：{active}")
    if not active:
        problem("registry.active 为空")


def check_memory() -> None:
    memory = ROOT / "memory" / "MEMORY.md"
    protocol = ROOT / "memory" / "PROTOCOL.md"
    if not memory.exists():
        problem("缺少 memory/MEMORY.md")
    if not protocol.exists():
        problem("缺少 memory/PROTOCOL.md")
    facts_dir = ROOT / "memory" / "facts"
    if not facts_dir.exists():
        problem("缺少 memory/facts/")
        return
    for path in sorted(facts_dir.glob("*.md")):
        text = path.read_text(encoding="utf-8", errors="replace")
        data = parse_frontmatter(text)
        if data is None:
            problem(f"{path.name}: 缺少 frontmatter")
            continue
        for key in ("name", "description", "type"):
            if key not in data:
                problem(f"{path.name}: frontmatter 缺少 {key}")
        if data.get("type") not in {"user", "feedback", "project", "reference", None}:
            warn(f"{path.name}: 未知 type={data.get('type')}")


def check_tools() -> None:
    for path in sorted(TOOLS_DIR.glob("*.py")):
        try:
            compile(path.read_text(encoding="utf-8-sig"), str(path), "exec")
        except SyntaxError as exc:
            problem(f"{path.name}: 语法错误：第 {exc.lineno} 行 {exc.msg}")


def check_required_files() -> None:
    required = ["README.md", "AGENTS.md", "ONBOARDING.md", "MIGRATION.md", "bases/README.md"]
    for rel in required:
        if not (ROOT / rel).exists():
            problem(f"缺少 {rel}")
    bootstrap = ROOT / "bootstrap"
    if not bootstrap.exists():
        problem("缺少 bootstrap/")
    else:
        for name in ["restore.py", "restore.ps1", "restore.sh", "restore.cmd", "uninstall.py"]:
            if not (bootstrap / name).exists():
                warn(f"缺少 bootstrap/{name}")


def main() -> None:
    check_required_files()
    check_agents()
    check_skills()
    check_bases()
    check_memory()
    check_tools()

    if warnings:
        print("警告：")
        for item in warnings:
            print("  - " + item)
        print()
    if problems:
        print("校验失败：")
        for item in problems:
            print("  - " + item)
        print(f"\n共 {len(problems)} 个问题")
        raise SystemExit(1)
    skill_count = len(list((ROOT / "skills").glob("*/SKILL.md")))
    fact_count = len(list((ROOT / "memory" / "facts").glob("*.md")))
    print(f"[通过] 技能 {skill_count} 个，记忆 {fact_count} 条，包根目录 {ROOT}")


if __name__ == "__main__":
    main()
