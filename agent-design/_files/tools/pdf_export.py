#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""HTML → PDF / 截图（Chrome 或 Edge headless）。

用法：
    python tools/pdf_export.py 输入.html 输出.pdf
    python tools/pdf_export.py 输入.html --screenshot 输出.png --width 1280 --height 2000

说明：
- 中文路径不稳定，脚本会先把 HTML 复制到临时 ASCII 路径再渲染。
- PDF 渲染后若安装了 PyMuPDF，会报告页数与文本量。
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

WINDOWS_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]
UNIX_CANDIDATES = ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "msedge"]


def find_browser(explicit: str = "") -> str:
    if explicit:
        if Path(explicit).exists():
            return explicit
        raise SystemExit(f"[失败] 指定的浏览器不存在：{explicit}")
    env = os.environ.get("CHROME_PATH", "")
    if env and Path(env).exists():
        return env
    for candidate in WINDOWS_CANDIDATES:
        if Path(candidate).exists():
            return candidate
    for name in UNIX_CANDIDATES:
        found = shutil.which(name)
        if found:
            return found
    raise SystemExit("[失败] 未找到 Chrome/Edge。设置环境变量 CHROME_PATH 后重试。")


def run(cmd: list[str], timeout: int) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )


def render_pdf(browser: str, html: Path, output: Path, timeout: int) -> None:
    with tempfile.TemporaryDirectory(prefix="soc_pdf_") as tmp:
        tmp_dir = Path(tmp)
        src = tmp_dir / "input.html"
        dst = tmp_dir / "output.pdf"
        shutil.copyfile(html, src)
        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            "--virtual-time-budget=8000",
            f"--user-data-dir={tmp_dir / 'profile'}",
            f"--print-to-pdf={dst}",
            src.as_uri(),
        ]
        result = run(cmd, timeout)
        if not dst.exists():
            stderr = (result.stderr or "").strip()
            raise SystemExit(f"[失败] 渲染未产出 PDF。\n{stderr[-2000:]}")
        output.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(dst), str(output))


def render_png(browser: str, html: Path, output: Path, width: int, height: int, timeout: int) -> None:
    with tempfile.TemporaryDirectory(prefix="soc_png_") as tmp:
        tmp_dir = Path(tmp)
        src = tmp_dir / "input.html"
        dst = tmp_dir / "output.png"
        shutil.copyfile(html, src)
        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            f"--window-size={width},{height}",
            "--hide-scrollbars",
            f"--user-data-dir={tmp_dir / 'profile'}",
            f"--screenshot={dst}",
            src.as_uri(),
        ]
        result = run(cmd, timeout)
        if not dst.exists():
            stderr = (result.stderr or "").strip()
            raise SystemExit(f"[失败] 截图未产出。\n{stderr[-2000:]}")
        output.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(dst), str(output))


def report_pdf(output: Path) -> None:
    try:
        import fitz  # PyMuPDF
    except ImportError:
        print("提示：未安装 PyMuPDF，跳过页数统计（python -m pip install pymupdf）")
        return
    try:
        doc = fitz.open(str(output))
        text = "".join(page.get_text() for page in doc)
        han = sum(1 for ch in text if "\u4e00" <= ch <= "\u9fff")
        print(f"页数：{doc.page_count}")
        print(f"文本行字符：{len(text)}（汉字 {han}）")
        try:
            links = sum(len(page.get_links()) for page in doc)
            print(f"可点链接：{links}")
        except Exception:
            pass
        doc.close()
    except Exception as exc:
        print(f"提示：PDF 统计失败：{exc}")


def main() -> None:
    parser = argparse.ArgumentParser(description="HTML → PDF / 截图")
    parser.add_argument("input", help="输入 HTML")
    parser.add_argument("output", nargs="?", default="", help="输出 PDF 路径")
    parser.add_argument("--screenshot", default="", help="改为截图并指定 PNG 输出路径")
    parser.add_argument("--width", type=int, default=1280)
    parser.add_argument("--height", type=int, default=2000)
    parser.add_argument("--chrome", default="", help="浏览器可执行文件路径")
    parser.add_argument("--timeout", type=int, default=120)
    args = parser.parse_args()

    html = Path(args.input).expanduser().resolve()
    if not html.exists():
        raise SystemExit(f"[失败] 输入文件不存在：{html}")
    if not html.suffix.lower() in {".html", ".htm"}:
        raise SystemExit("[失败] 输入必须是 .html / .htm")

    browser = find_browser(args.chrome)
    print(f"浏览器：{browser}")

    if args.screenshot:
        output = Path(args.screenshot).expanduser().resolve()
        render_png(browser, html, output, args.width, args.height, args.timeout)
        print(f"[完成] 截图：{output}")
        return

    if not args.output:
        raise SystemExit("[失败] 请提供输出 PDF 路径，或使用 --screenshot")
    output = Path(args.output).expanduser().resolve()
    render_pdf(browser, html, output, args.timeout)
    print(f"[完成] PDF：{output}")
    report_pdf(output)


if __name__ == "__main__":
    main()
