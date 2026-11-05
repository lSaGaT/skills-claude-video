#!/usr/bin/env python
"""strip_pro.py — cria uma CÓPIA do draft sem os recursos Pro bloqueadores.

Caminho legítimo quando o diálogo "Obtenha o Pro" bloqueia o export: remove os
recursos Pro do projeto (cópia!) e exporta a versão limpa. NÃO contorna
licença — apenas edita o draft, como faria o usuário à mão.

Recursos Pro conhecidos no 9.7 (ground truth diálogo + draft 1104):
  * Filtro "4K" (category_name "Tools") = "Aprimorar qualidade" (enhance)
  * Estabilização = materials.videos[].stable.stable_level != 0
  * (novos marcadores podem existir — o agente lê o diálogo e mapeia)

CLI:
  python strip_pro.py <draft_dir> [--out <novo_draft_dir>]
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

DRAFT_ROOT = Path(r"C:\Users\Conectare\AppData\Local\CapCut\User Data\Projects\com.lveditor.draft")

# Filtros Pro conhecidos (por categoria/nome observados)
PRO_FILTER_CATEGORIES = {"Tools"}      # "4K" = Aprimorar qualidade
PRO_FILTER_NAMES = {"4K"}


def strip(draft_dir: Path, out_dir: Path) -> dict:
    src_content = draft_dir / "draft_content.json"
    c = json.loads(src_content.read_text(encoding="utf-8"))
    mats = c["materials"]
    removed: list[str] = []

    # 1) filtros Pro: remover material + segmentos das tracks 'filter'
    pro_ids = {m["id"] for m in mats.get("effects", [])
               if m.get("category_name") in PRO_FILTER_CATEGORIES
               or m.get("name") in PRO_FILTER_NAMES}
    if pro_ids:
        mats["effects"] = [m for m in mats.get("effects", []) if m["id"] not in pro_ids]
        removed += [f"filtro Pro ({len(pro_ids)})"]
    for t in c.get("tracks", []):
        if t.get("type") == "filter":
            t["segments"] = [s for s in t.get("segments", [])
                             if s.get("material_id") not in pro_ids]
            if not t["segments"] and c.get("tracks"):
                c["tracks"].remove(t)
                removed.append("track filter vazia")

    # 2) estabilização: stable_level = 0 em todos os vídeos
    n_stab = 0
    for v in mats.get("videos", []):
        st = v.get("stable")
        if isinstance(st, dict) and st.get("stable_level"):
            st["stable_level"] = 0
            st["matrix_path"] = ""
            n_stab += 1
    if n_stab:
        removed.append(f"estabilização ({n_stab} clipes)")

    # 3) duração recompute leve (remoção de tracks filter não altera duration)

    # grava cópia
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "draft_content.json").write_text(
        json.dumps(c, ensure_ascii=False, indent=1), encoding="utf-8")
    meta_src = draft_dir / "draft_meta_info.json"
    if meta_src.exists():
        meta = json.loads(meta_src.read_text(encoding="utf-8"))
        meta["draft_folder_path"] = str(out_dir)
        meta["draft_root_path"] = str(out_dir)
        meta["draft_name"] = (meta.get("draft_name") or draft_dir.name) + " (sem Pro)"
        (out_dir / "draft_meta_info.json").write_text(
            json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    # copia recursos locais de mídia referenciados? não — paths são absolutos
    return {"out": str(out_dir), "removed": removed,
            "duration": c.get("duration")}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Remove recursos Pro de uma cópia do draft")
    ap.add_argument("draft_dir")
    ap.add_argument("--out", default=None)
    a = ap.parse_args(argv)
    src = Path(a.draft_dir)
    out = Path(a.out) if a.out else DRAFT_ROOT / f"{src.name}-sempro"
    r = strip(src, out)
    print(json.dumps(r, ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
