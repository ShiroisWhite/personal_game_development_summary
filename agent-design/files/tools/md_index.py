#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""为内容底座生成 INDEX.md / INDEX.generated.md。

用法：
    python tools/md_index.py <base-path> [--output <file>]
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)


def read_head(path: Path) -> tuple[str, str]:
    """返回 (标题, 一句话说明)。"""
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return path.stem, ""
    description = ""
    match = FRONTMATTER_RE.match(text)
    if match:
        for line in match.group(1).splitlines():
            if line.strip().lower().startswith("description:"):
                description = line.split(":", 1)[1].strip().strip('"').strip("'")
                break
        text = text[match.end():]
    title = ""
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("# "):
            title = stripped[2:].strip()
            break
    if not title:
        title = path.stem
    if not description:
        for line in text.splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith(("#", ">", "|", "-", "*", "```")):
                continue
            description = stripped[:120]
            break
    return title, description


def collect(base_dir: Path, folder: str, pattern: str) -> list[tuple[str, str, str]]:
    root = base_dir / folder
    if not root.exists():
        return []
    rows: list[tuple[str, str, str]] = []
    for path in sorted(root.rglob(pattern)):
        if not path.is_file():
            continue
        rel = path.relative_to(base_dir).as_posix()
        title, desc = read_head(path)
        rows.append((rel, title, desc))
    return rows


def build_index(base_dir: Path, output: Path) -> None:
    meta_text = base_dir / "base.json"
    name = base_dir.name
    description = ""
    if meta_text.exists():
        import json

        try:
            meta = json.loads(meta_text.read_text(encoding="utf-8-sig"))
            name = meta.get("name", name)
            description = meta.get("description", "")
        except json.JSONDecodeError:
            pass

    knowledge = collect(base_dir, "knowledge", "*.md")
    templates = collect(base_dir, "templates", "*.md")
    cases = collect(base_dir, "cases", "*.md")

    lines: list[str] = []
    lines.append(f"# {name} · 入口")
    lines.append("")
    lines.append("> 本文件由 `tools/md_index.py` 生成。可手工改写；重新生成会覆盖 `INDEX.generated.md`，加 `--write` 才会覆盖 `INDEX.md`。")
    lines.append("")
    if description:
        lines.append(description)
        lines.append("")

    def section(title: str, rows: list[tuple[str, str, str]], empty: str) -> None:
        lines.append(f"## {title}")
        lines.append("")
        if not rows:
            lines.append(empty)
            lines.append("")
            return
        lines.append("| 文件 | 标题 | 说明 |")
        lines.append("| --- | --- | --- |")
        for rel, heading, desc in rows:
            safe_desc = desc.replace("|", "\\|")
            lines.append(f"| [{rel}]({rel}) | {heading} | {safe_desc} |")
        lines.append("")

    section("知识文件", knowledge, "（暂无）")
    section("模板", templates, "（暂无）")
    section("案例", cases, "（暂无）")

    lines.append("## 边界与时效")
    lines.append("")
    lines.append("- 由生成器自动生成目录；内容边界需人工补充。")
    lines.append("- 涉密底座只在本地使用。")
    lines.append("")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="生成内容底座索引")
    parser.add_argument("base")
    parser.add_argument("--output", default="")
    args = parser.parse_args()
    base_dir = Path(args.base).expanduser().resolve()
    if not base_dir.exists():
        print(f"[失败] 路径不存在：{base_dir}")
        raise SystemExit(1)
    output = Path(args.output).expanduser().resolve() if args.output else base_dir / "INDEX.generated.md"
    build_index(base_dir, output)
    print(f"[完成] {output}")


if __name__ == "__main__":
    main()
