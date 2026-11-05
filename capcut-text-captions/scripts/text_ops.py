#!/usr/bin/env python
"""text_ops.py — texto avancado: import SRT, estilos por range, bubble/fancy.

O material de texto do CapCut e JSON-in-JSON:
  materials.texts[].content = '{"text": "...", "styles": [...], "layer_weight": 1, "effect": []}'
Os ranges dos styles sao BYTE OFFSETS UTF-16 (nao chars!) — ASCII 1 byte=1 char,
BMP (acentos) 2 bytes, emoji/suplementar 4 bytes (surrogate pair).

CLI:
  python text_ops.py import-srt <draft_dir> <arquivo.srt> [--size 8] [--start-offset 0]
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from draft_io import load_draft, save_draft, us, validate_draft
from timeline_ops import add_text

_SRT_TIME = re.compile(r"(\d+):(\d+):(\d+)[,.](\d+)")


def _srt_ts(text: str) -> int:
    m = _SRT_TIME.match(text.strip())
    if not m:
        raise ValueError(f"timestamp SRT invalido: {text!r}")
    h, mi, s, ms = map(int, m.groups())
    return ((h * 60 + mi) * 60 + s) * 1_000_000 + ms * 1000


def parse_srt(path: str | Path) -> list[dict]:
    """Parse SRT basico -> [{'index','start_us','end_us','text'}]."""
    raw = Path(path).read_text(encoding="utf-8-sig", errors="replace")
    blocks = re.split(r"\r?\n\r?\n", raw.strip())
    out = []
    for b in blocks:
        lines = [l for l in b.strip().splitlines() if l.strip()]
        if len(lines) < 2:
            continue
        idx = lines[0].strip() if lines[0].strip().isdigit() else ""
        tline = next((l for l in lines if "-->" in l), None)
        if not tline:
            continue
        a, z = tline.split("-->")
        body = "\n".join(lines[lines.index(tline) + 1:])
        out.append({"index": idx, "start_us": _srt_ts(a),
                    "end_us": _srt_ts(z), "text": body.strip()})
    return out


def import_srt(draft: dict, srt_path: str, font_size: float = 8.0,
               start_offset: int = 0, track_name: str = "") -> list[dict]:
    """Importa SRT como segmentos de texto na track 'text'."""
    entries = parse_srt(srt_path)
    segs = []
    for e in entries:
        dur = e["end_us"] - e["start_us"]
        if dur <= 0:
            continue
        # quebra multi-linha em \n; CapCut preserva \n no content
        segs.append(add_text(draft, e["text"], e["start_us"] + start_offset,
                             dur, font_size=font_size))
    return segs


def set_text_styles(draft: dict, seg_id: str, styles: list[dict]) -> dict:
    """Reescreve os styles do material de texto do segmento.
    styles: [{'start_char','end_char','bold','italic','size','color':[r,g,b]}]"""
    from timeline_ops import _find_segment
    _, s = _find_segment(draft, seg_id)
    _, mat = None, None
    for t in draft["materials"].get("texts", []):
        if t["id"] == s["material_id"]:
            mat = t
            break
    if not mat:
        raise KeyError(f"material de texto do segmento {seg_id} nao encontrado")
    c = json.loads(mat["content"])
    text = c.get("text", "")
    new_styles = []
    for st in styles:
        s0, s1 = st.get("start_char", 0), st.get("end_char", len(text))
        style = {"range": [len(text[:s0].encode("utf-16-le")),
                           len(text[:s1].encode("utf-16-le"))],
                 "fill": None, "font": None,
                 "size": st.get("size"), "bold": bool(st.get("bold")),
                 "italic": bool(st.get("italic"))}
        if st.get("color"):
            # shape real 9.7: fill.content.render_type + solid.color
            style["fill"] = {"content": {"render_type": "solid",
                                         "solid": {"color": st["color"]}}}
        new_styles.append(style)
    c["styles"] = new_styles
    mat["content"] = json.dumps(c, ensure_ascii=False)
    return mat


# ---------------------------------------------------------------- CLI

def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Texto/SRT CapCut draft")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("import-srt")
    s.add_argument("draft_dir"); s.add_argument("srt")
    s.add_argument("--size", type=float, default=8.0)
    s.add_argument("--start-offset", type=float, default=0.0)
    a = ap.parse_args(argv)
    draft = load_draft(a.draft_dir)
    if a.cmd == "import-srt":
        segs = import_srt(draft, a.srt, font_size=a.size,
                          start_offset=us(a.start_offset))
        print(f"{len(segs)} segmentos importados")
    issues = validate_draft(draft)
    for i in issues:
        print("VALIDACAO:", i, file=sys.stderr)
    save_draft(draft, a.draft_dir)
    return 0


if __name__ == "__main__":
    sys.exit(main())
