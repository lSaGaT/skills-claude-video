#!/usr/bin/env python
"""draft_io.py — core I/O for CapCut draft_content.json (international CapCut, app_source "cc").

Projetos CapCut 6.x-9.x guardam o rascunho como JSON plano:
  tracks[].segments[].material_id -> materials.<categoria>[].id
  segment.extra_material_refs[]   -> materiais companheiros (speeds, masks, transitions,
                                     audio_fades, material_animations, canvases)
Durations are integer MICROSECONDS everywhere.

Regras de segurança:
  * Nunca salvar por cima do original sem backup (save_draft faz backup por padrao).
  * Validar sempre depois de editar (validate_draft).

CLI:
  python draft_io.py info <draft_dir|draft.json>
  python draft_io.py validate <draft_dir|draft.json>
  python draft_io.py backup <draft_dir|draft.json>
  python draft_io.py init <new_draft_dir> --name X [--width 1080 --height 1920 --fps 30]
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

DRAFT_FILE = "draft_content.json"
META_FILE = "draft_meta_info.json"

# Categoria primaria de material para cada tipo de track
TRACK_MATERIAL = {
    "video": "videos",
    "audio": "audios",
    "text": "texts",
    "sticker": "stickers",
    "effect": "video_effects",
    "filter": "effects",
    "subtitle": "texts",
}

# Categorias companheiras (via extra_material_refs) — ground truth 9.7:
# video seg refs = speeds, placeholder_infos, canvases, sound_channel_mappings,
#                  material_colors, vocal_separations
COMPANION_CATEGORIES = [
    "speeds", "masks", "common_mask", "audio_fades",
    "material_animations", "transitions", "canvases",
    "sound_channel_mappings", "placeholder_infos", "vocal_separations",
    "smart_crops", "manual_deformations", "material_colors",
    "loudnesses", "realtime_denoises", "vocal_beautifys",
]

# Categorias reais de materials no CapCut 9.7 (draft "1104"):
# filtros ficam em "effects" (type "filter"); cenas em "video_effects";
# mascaras em "common_mask" SINGULAR
MATERIAL_CATEGORIES = [
    "audios", "videos", "texts", "stickers", "video_effects", "effects",
    "material_animations", "transitions", "masks", "common_mask",
    "canvases", "speeds", "audio_fades", "placeholder_infos",
    "vocal_separations", "sound_channel_mappings", "smart_crops",
    "manual_deformations", "material_colors", "beats", "loudnesses",
    "realtime_denoises", "vocal_beautifys", "text_templates",
    "ai_translates", "color_adjustments", "color_curves",
    "color_adjust_effects", "effect_expressions",
]


def us(seconds: float) -> int:
    """Segundos -> microssegundos (int)."""
    return int(round(seconds * 1_000_000))


def sec(micros: int) -> float:
    return (micros or 0) / 1_000_000


def new_id() -> str:
    """UUID no estilo CapCut (maiusculo, hifenizado)."""
    return str(uuid.uuid4()).upper()


def load_draft(path: str | Path) -> dict:
    """Carrega draft_content.json de um diretorio de draft ou caminho direto."""
    p = Path(path)
    if p.is_dir():
        p = p / DRAFT_FILE
    if not p.exists():
        raise FileNotFoundError(f"draft nao encontrado: {p}")
    text = p.read_text(encoding="utf-8")
    stripped = text.lstrip()
    if not stripped.startswith("{"):
        # Blob criptografado ou binario — detectar e abortar com mensagem clara
        magic = stripped[:24].replace("\n", " ")
        raise ValueError(f"arquivo nao parece JSON plaintext (inicio: {magic!r}). "
                         f"Drafts JianYing 6.0+ sao criptografados; CapCut internacional "
                         f"6.x-9.x deve ser plaintext. Verifique o arquivo correto.")
    return json.loads(text)


def draft_dir_of(path: str | Path) -> Path:
    p = Path(path)
    return p if p.is_dir() else p.parent


def save_draft(draft: dict, path: str | Path, backup: bool = True,
               indent: int = 1) -> Path:
    """Salva draft_content.json. Se backup=True e o arquivo existe, copia
    <nome>.backup-YYYYmmdd-HHMMSS.json antes de sobrescrever."""
    p = Path(path)
    if p.is_dir():
        p = p / DRAFT_FILE
    p.parent.mkdir(parents=True, exist_ok=True)
    if backup and p.exists():
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        shutil.copy2(p, p.with_name(f"{p.stem}.backup-{stamp}{p.suffix}"))
    tmp = p.with_name(p.name + ".tmp")
    tmp.write_text(json.dumps(draft, ensure_ascii=False, indent=indent),
                   encoding="utf-8")
    tmp.replace(p)
    return p


# ---------------------------------------------------------------- init

def new_draft(name: str, width: int = 1080, height: int = 1920,
              fps: int = 30, app_source: str = "cc",
              app_version: str = "9.7.0") -> dict:
    """Draft novo no formato REAL do 9.7 (top-level observado no draft "1104")."""
    ratio = "original"
    if width and height:
        r = width / height
        ratio = ("16:9" if abs(r - 16 / 9) < 0.05 else
                 "9:16" if abs(r - 9 / 16) < 0.05 else
                 "1:1" if abs(r - 1) < 0.05 else
                 "4:5" if abs(r - 4 / 5) < 0.05 else "original")
    materials = {cat: [] for cat in MATERIAL_CATEGORIES}
    now_ts = int(datetime.now().timestamp() * 1_000_000)
    return {
        "id": new_id(),
        "name": name,
        "path": "",
        "duration": 0,
        "fps": fps,
        "version": 360000,
        "new_version": "360000",
        "draft_type": "video",
        "source": "default",
        "canvas_config": {"width": width, "height": height,
                          "ratio": ratio, "background": None},
        "platform": {"os": "windows", "os_version": platform_win(),
                     "app_id": 359289, "app_version": app_version,
                     "app_source": app_source, "device_id": "", "hard_disk_id": "",
                     "mac_address": ""},
        "create_time": now_ts,
        "update_time": now_ts,
        "tracks": [],
        "materials": materials,
        "keyframes": {k: [] for k in ("videos", "audios", "texts", "stickers",
                                      "filters", "adjusts", "handwrites", "effects")},
        "keyframe_graph_list": [],
        "relationships": [],
        "config": {
            "video_mute": False, "record_audio_last_index": 1,
            "extract_audio_last_index": 1, "original_sound_last_index": 2,
            "subtitle_recognition_id": "", "subtitle_taskinfo": [],
            "lyrics_recognition_id": "", "lyrics_taskinfo": [],
            "subtitle_sync": True, "lyrics_sync": True, "voice_change_sync": False,
        },
        "mutable_config": None,
        "color_space": 0,
        "is_drop_frame_timecode": False,
        "mixed_track_mode_on": False,
        "render_index_track_mode_on": False,
        "free_render_index_mode_on": False,
        "extra_info": None,
        "group_container": None,
        "time_marks": None,
        "cover": None,
        "retouch_cover": None,
        "static_cover_image_path": "",
        "lyrics_effects": [],
        "smart_ads_info": None,
        "function_assistant_info": None,
        "uneven_animation_template_info": None,
        "last_modified_platform": {"os": "windows", "app_version": app_version,
                                   "app_source": app_source},
    }


def platform_win() -> str:
    """os_version no formato do draft (ex.: '10.0.19045')."""
    try:
        import platform as _p
        return _p.version().split(" ")[0] or "10.0.19045"
    except Exception:
        return "10.0.19045"


def init_draft_dir(target_dir: str | Path, draft: dict,
                   meta_extra: dict | None = None) -> Path:
    """Cria o diretorio de draft (draft_content.json + draft_meta_info.json)."""
    d = Path(target_dir)
    d.mkdir(parents=True, exist_ok=True)
    (d / DRAFT_FILE).write_text(json.dumps(draft, ensure_ascii=False, indent=1),
                                encoding="utf-8")
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3] + " UTC"
    meta = {
        "cloud_info": "",
        "draft_cloud_last_action_download": False,
        "draft_cloud_purchase_info": "",
        "draft_cloud_template_id": "",
        "draft_cloud_tutorial_info": "",
        "draft_cover": "",
        "draft_deeplink_url": "",
        "draft_enterprise_info": "",
        "draft_folder_path": str(d),
        "draft_id": draft["id"],
        "draft_is_ai_shortcut": False,
        "draft_is_article_video_draft": False,
        "draft_is_from_deeplink": "false",
        "draft_materials": [],
        "draft_name": draft["name"],
        "draft_new_version": "",
        "draft_removable_storage_device": "",
        "draft_root_path": str(d),
        "draft_timeline_materials_size_": 0,
        "draft_type": "",
        "tm_draft_cloud_completed": str(int(datetime.now().timestamp() * 1000)),
        "tm_draft_create": int(datetime.now().timestamp() * 1000000),
        "tm_draft_modified": int(datetime.now().timestamp() * 1000000),
        "tm_duration": draft.get("duration", 0),
    }
    if meta_extra:
        meta.update(meta_extra)
    (d / META_FILE).write_text(json.dumps(meta, ensure_ascii=False, indent=1),
                               encoding="utf-8")
    return d


# ---------------------------------------------------------------- consultas

def find_track(draft: dict, track_type: str, create: bool = False) -> dict | None:
    """Primeira track do tipo dado (array order = z-order; ultima = topo)."""
    for t in draft["tracks"]:
        if t.get("type") == track_type:
            return t
    if create:
        t = {"id": new_id(), "type": track_type, "attribute": 0,
             "flag": 0, "is_default_name": True, "name": "", "segments": []}
        draft["tracks"].append(t)
        return t
    return None


def resolve_material(draft: dict, material_id: str) -> tuple[str, dict] | None:
    """Localiza o material primario (qualquer categoria) por id."""
    for cat, items in draft["materials"].items():
        if not isinstance(items, list):
            continue
        for m in items:
            if isinstance(m, dict) and m.get("id") == material_id:
                return cat, m
    return None


def resolve_companions(draft: dict, segment: dict) -> dict:
    """Materiais companheiros de um segmento via extra_material_refs."""
    out = {}
    refs = segment.get("extra_material_refs") or []
    for cat, items in draft["materials"].items():
        if cat not in COMPANION_CATEGORIES or not isinstance(items, list):
            continue
        for m in items:
            if isinstance(m, dict) and m.get("id") in refs:
                out.setdefault(cat, []).append(m)
    return out


def recompute_duration(draft: dict) -> int:
    end = 0
    for t in draft["tracks"]:
        for s in t.get("segments", []):
            tr = s.get("target_timerange") or {}
            end = max(end, (tr.get("start", 0) or 0) + (tr.get("duration", 0) or 0))
    draft["duration"] = end
    return end


# ---------------------------------------------------------------- validacao

def _utf16_byte_len(text: str) -> int:
    return len(text.encode("utf-16-le"))


def _check_text_content(draft: dict, issues: list[str]) -> None:
    for t in draft["materials"].get("texts", []):
        raw = t.get("content") or ""
        try:
            c = json.loads(raw) if isinstance(raw, str) else raw
        except json.JSONDecodeError as e:
            issues.append(f"texts[{t.get('id')}] content nao e JSON valido: {e}")
            continue
        full = c.get("text", "")
        total = _utf16_byte_len(full)
        for i, st in enumerate(c.get("styles", [])):
            r = st.get("range")
            if not r or len(r) != 2:
                issues.append(f"texts[{t.get('id')}] styles[{i}].range ausente/malformado")
                continue
            if not (0 <= r[0] <= r[1] <= total):
                issues.append(
                    f"texts[{t.get('id')}] styles[{i}].range={r} fora do texto "
                    f"(bytes UTF-16 totais={total}); ranges sao BYTE offsets, nao chars")


def validate_draft(draft: dict) -> list[str]:
    issues: list[str] = []
    for k in ("id", "name", "tracks", "materials", "platform", "fps"):
        if k not in draft:
            issues.append(f"chave top-level ausente: {k}")
    src = draft.get("platform", {}).get("app_source")
    if src not in ("cc", "lv"):
        issues.append(f"platform.app_source inesperado: {src!r} (cc=CapCut, lv=JianYing)")
    # 9.x usa common_mask SINGULAR (ground truth draft "1104"); masks[] e legado
    mask_field = "common_mask"
    seen_ids: set[str] = set()
    for cat, items in draft["materials"].items():
        if not isinstance(items, list):
            issues.append(f"materials.{cat} nao e lista")
            continue
        for m in items:
            if isinstance(m, dict):
                mid = m.get("id")
                if not mid:
                    issues.append(f"materials.{cat} item sem id")
                elif mid in seen_ids:
                    issues.append(f"id de material duplicado: {mid} ({cat})")
                seen_ids.add(mid)
    for ti, t in enumerate(draft.get("tracks", [])):
        for si, s in enumerate(t.get("segments", [])):
            mid = s.get("material_id")
            if not mid:
                issues.append(f"tracks[{ti}].segments[{si}] sem material_id")
            elif mid not in seen_ids:
                issues.append(f"tracks[{ti}].segments[{si}] material_id={mid} nao existe em materials")
            tr = s.get("target_timerange")
            if not tr or tr.get("duration") is None:
                issues.append(f"tracks[{ti}].segments[{si}] sem target_timerange.duration")
    _check_text_content(draft, issues)
    return issues


# ---------------------------------------------------------------- CLI

def _fmt_info(draft: dict) -> str:
    lines = [
        f"name: {draft.get('name')}",
        f"id: {draft.get('id')}",
        f"duration: {draft.get('duration')} us ({sec(draft.get('duration', 0)):.3f} s)",
        f"fps: {draft.get('fps')}  canvas: {draft.get('canvas_config')}",
        f"platform: {draft.get('platform')}",
        "",
        "tracks:",
    ]
    for t in draft.get("tracks", []):
        lines.append(f"  [{t.get('type')}] {t.get('name') or '(sem nome)'} "
                     f"segments={len(t.get('segments', []))} id={t.get('id')}")
    lines.append("")
    lines.append("materials:")
    for cat, items in draft.get("materials", {}).items():
        if items:
            lines.append(f"  {cat}: {len(items)}")
    return "\n".join(lines)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="CapCut draft_content.json I/O")
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("info", "validate", "backup"):
        s = sub.add_parser(name)
        s.add_argument("path")
    s = sub.add_parser("init")
    s.add_argument("target_dir")
    s.add_argument("--name", required=True)
    s.add_argument("--width", type=int, default=1080)
    s.add_argument("--height", type=int, default=1920)
    s.add_argument("--fps", type=int, default=30)

    a = ap.parse_args(argv)
    if a.cmd == "init":
        d = new_draft(a.name, a.width, a.height, a.fps)
        out = init_draft_dir(a.target_dir, d)
        print(f"draft criado: {out}")
        return 0
    draft = load_draft(a.path)
    if a.cmd == "info":
        print(_fmt_info(draft))
    elif a.cmd == "validate":
        issues = validate_draft(draft)
        if issues:
            print("PROBLEMAS:")
            for i in issues:
                print(f"  - {i}")
            return 1
        print("OK: nenhuma inconsistencia estrutural detectada")
    elif a.cmd == "backup":
        src = Path(a.path)
        src = src if src.is_file() else src / DRAFT_FILE
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        dst = src.with_name(f"{src.stem}.backup-{stamp}{src.suffix}")
        shutil.copy2(src, dst)
        print(f"backup: {dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
