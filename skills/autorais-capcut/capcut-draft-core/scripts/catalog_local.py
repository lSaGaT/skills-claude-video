#!/usr/bin/env python
"""catalog_local.py — catalogo LOCAL de recursos do CapCut 9.7.

Varre User Data\\Cache\\effect\\<id>\\<md5>\\config.json (efeitos, filtros,
animacoes) e Cache\\artistEffect\\<id>\\<md5>\\config.json (stickers) extraindo
o `name` de cada bundle -> capcut-re/evidence/local-catalog.json.
Com isso as skills podem resolver ids NUMERICOS reais por NOME.

CLI:
  python catalog_local.py build                 # (re)constroi o catalogo
  python catalog_local.py search <termo>        # busca por nome (ex.: "zoom")
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

CAPCUT_UD = Path(r"C:\Users\Conectare\AppData\Local\CapCut\User Data")
CACHE = CAPCUT_UD / "Cache"
DRAFTS = CAPCUT_UD / "Projects" / "com.lveditor.draft"
OUT = Path(__file__).resolve().parent.parent.parent.parent / "evidence" / "local-catalog.json"

_TECH_NAMES = {"AE2Effect", ""}


def _add(items: list[dict], seen: set, kind: str, rid: str, name: str,
         cat: str, path: str = "", source: str = "") -> None:
    if not rid or not name or name in _TECH_NAMES:
        return
    key = (kind, str(rid))
    if key in seen:
        return
    seen.add(key)
    items.append({"kind": kind, "resource_id": str(rid), "name": name,
                  "category_name": cat or "", "path": path, "source": source})


def build() -> list[dict]:
    items: list[dict] = []
    seen: set = set()

    # 1) recursos aplicados em drafts locais (nomes humanos garantidos)
    if DRAFTS.exists():
        for d in sorted(DRAFTS.iterdir()):
            cf = d / "draft_content.json"
            if not cf.exists():
                continue
            try:
                c = json.loads(cf.read_text(encoding="utf-8"))
            except Exception:
                continue
            mats = c.get("materials", {})
            for m in mats.get("video_effects", []):
                _add(items, seen, "effect", m.get("effect_id") or m.get("resource_id"),
                     m.get("name") or "", m.get("category_name"), m.get("path"), "draft")
            for m in mats.get("effects", []):
                _add(items, seen, "filter", m.get("effect_id") or m.get("resource_id"),
                     m.get("name") or "", m.get("category_name"), m.get("path"), "draft")
            for m in mats.get("stickers", []):
                _add(items, seen, "sticker", m.get("sticker_id") or m.get("resource_id"),
                     m.get("name") or "", m.get("category_name"), m.get("path"), "draft")
            for m in mats.get("material_animations", []):
                for a in m.get("animations", []):
                    _add(items, seen, "animation",
                         a.get("resource_id") or a.get("id"),
                         a.get("name") or "", a.get("category_name"),
                         a.get("path"), "draft")
            for m in mats.get("text_templates", []):
                _add(items, seen, "text_template",
                     m.get("resource_id") or m.get("effect_id"),
                     m.get("name") or "", m.get("category_name"),
                     m.get("path"), "draft")

    # 2) bundles no cache com config.json nomeado (cobertura extra)
    for md5_dir in CACHE.glob("effect/*/*/config.json"):
        try:
            cfg = json.loads(md5_dir.read_text(encoding="utf-8"))
        except Exception:
            continue
        _add(items, seen, "effect", md5_dir.parent.parent.name,
             cfg.get("name") or "", str(cfg.get("category_id") or ""),
             str(md5_dir.parent), "cache")

    items.sort(key=lambda i: (i["kind"], i["name"].lower()))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"count": len(items), "items": items},
                              ensure_ascii=False, indent=1), encoding="utf-8")
    return items


def load() -> list[dict]:
    if not OUT.exists():
        return build()
    return json.loads(OUT.read_text(encoding="utf-8"))["items"]


def search(term: str, kind: str | None = None) -> list[dict]:
    t = term.lower()
    return [i for i in load()
            if t in i["name"].lower()
            and (kind is None or i["kind"] == kind)]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Catalogo local de recursos CapCut")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("build")
    s = sub.add_parser("search")
    s.add_argument("term")
    s.add_argument("--kind", choices=["effect", "filter", "sticker",
                                      "animation", "text_template"], default=None)
    a = ap.parse_args(argv)
    if a.cmd == "build":
        items = build()
        by = {}
        for i in items:
            by[i["kind"]] = by.get(i["kind"], 0) + 1
        print(f"catalogo: {OUT} — {len(items)} itens {by}")
    else:
        for i in search(a.term, a.kind)[:40]:
            print(f"[{i['kind']}] {i['name']}  id={i['resource_id']}  cat={i['category_name']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
