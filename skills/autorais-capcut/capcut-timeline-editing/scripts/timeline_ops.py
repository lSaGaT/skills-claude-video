#!/usr/bin/env python
"""timeline_ops.py — operacoes de timeline sobre CapCut draft_content.json.

Todas as duracoes/posicoes sao MICROSEGUNDOS (int). Helpers us()/sec() em draft_io.

Operacoes:
  add_media      — video/imagem/audio na track (material + speed companion + segment)
  add_text       — segmento de texto (content JSON-in-JSON com ranges UTF-16)
  split_segment  — corta um segmento em dois (source_timerange)
  trim_segment   — ajusta inicio/fim de um segmento
  move_segment   — reposiciona sem mudar duracao
  delete_segment — remove segmento (+ materiais orfaos primarios)
  set_speed      — altera velocidade (speed companion + segment.speed)
  set_volume     — volume de segmento audio/video
  set_fade       — fade in/out de audio (audio_fades companion)
  set_transform  — clip.transform/scale/rotation/alpha/flip do segmento

CLI (teste rapido):
  python timeline_ops.py add-text <draft_dir> --text "Ola" --start 0 --duration 3
  python timeline_ops.py add-media <draft_dir> <arquivo> --kind video
  python timeline_ops.py split <draft_dir> <segment_id> --at 2.5
  python timeline_ops.py info <draft_dir>
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

from draft_io import (new_id, load_draft, save_draft, us, sec,
                      find_track, resolve_material, resolve_companions,
                      recompute_duration, validate_draft)

# ffprobe embutido do CapCut (caminho padrao da instalacao 9.7)
CAPCUT_ROOT = Path(r"C:\Users\Conectare\AppData\Local\CapCut\Apps\9.7.0.4153")
FFPROBE = CAPCUT_ROOT / "ffprobe.exe"


# ---------------------------------------------------------------- probe

def probe_media(path: str | Path) -> dict:
    """Duracao (us), largura/altura, tem_audio via ffprobe (embutido do CapCut)."""
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(p)
    out = {"duration_us": None, "width": None, "height": None, "has_audio": False}
    exe = str(FFPROBE) if FFPROBE.exists() else "ffprobe"
    try:
        r = subprocess.run(
            [exe, "-v", "quiet", "-print_format", "json",
             "-show_format", "-show_streams", str(p)],
            capture_output=True, text=True, timeout=30)
        data = json.loads(r.stdout or "{}")
    except Exception:
        return out
    fmt = data.get("format", {})
    if fmt.get("duration"):
        out["duration_us"] = us(float(fmt["duration"]))
    for s in data.get("streams", []):
        if s.get("codec_type") == "video" and out["width"] is None:
            out["width"] = s.get("width")
            out["height"] = s.get("height")
        if s.get("codec_type") == "audio":
            out["has_audio"] = True
    return out


# ---------------------------------------------------------------- helpers

def _next_free_start(draft: dict, track_type: str) -> int:
    t = find_track(draft, track_type, create=False)
    if not t or not t.get("segments"):
        return 0
    return max((s.get("target_timerange", {}).get("start", 0) +
                s.get("target_timerange", {}).get("duration", 0))
               for s in t["segments"])


def _material_ref(draft: dict, seg: dict, category: str, create: dict) -> dict:
    """Cria material companheiro + registra em extra_material_refs."""
    m = dict(create)
    m.setdefault("id", new_id())
    draft["materials"].setdefault(category, []).append(m)
    seg.setdefault("extra_material_refs", []).append(m["id"])
    return m


def _orphan_cleanup(draft: dict, seg: dict) -> None:
    """Remove materiais companheiros que perderam o segmento."""
    refs = set(seg.get("extra_material_refs") or [])
    for cat, items in draft["materials"].items():
        if not isinstance(items, list):
            continue
        items[:] = [m for m in items
                    if not (isinstance(m, dict) and m.get("id") in refs)]


# ---------------------------------------------------------------- add media

def add_media(draft: dict, media_path: str, kind: str = "video",
              start: int | None = None, trim: tuple[int, int] | None = None,
              track_name: str = "", track_index: int | None = None,
              volume: float = 1.0) -> dict:
    """Adiciona video/imagem/audio. kind: video|audio (imagem vai como video type=photo).

    trim = (source_start_us, source_duration_us); None usa o arquivo inteiro.
    """
    kind = kind.lower()
    if kind not in ("video", "audio"):
        raise ValueError("kind deve ser video|audio")
    info = probe_media(media_path)
    src_start, src_dur = trim if trim else (0, info["duration_us"] or us(3.0))
    p = Path(media_path).resolve()
    is_image = p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}

    track = find_track(draft, kind, create=True)
    if track_name:
        track["name"] = track_name
        track["is_default_name"] = False
    if track_index is not None:
        draft["tracks"].remove(track)
        draft["tracks"].insert(min(track_index, len(draft["tracks"])), track)

    if kind == "video":
        mat = {
            "id": new_id(),
            "unique_id": _file_md5(p),
            "type": "photo" if is_image else "video",
            "path": str(p), "media_path": "",
            "duration": info["duration_us"] or src_dur,
            "width": info["width"], "height": info["height"],
            "has_audio": bool(info["has_audio"]) and not is_image,
            "category_id": "", "category_name": "local",
            "material_id": "", "material_name": p.name, "material_url": "",
            "crop_ratio": "free", "crop_scale": 1.0,
            "audio_fade": None, "extra_type_option": 0,
        }
        draft["materials"].setdefault("videos", []).append(mat)
    else:
        mat = {
            "id": new_id(),
            "unique_id": _file_md5(p),
            "type": "music",
            "name": p.stem, "path": str(p),
            "duration": info["duration_us"] or src_dur,
            "category_name": "local", "category_id": "",
            "wave_points": [], "music_id": "", "app_id": 0, "text_id": "",
            "tone_type": "", "source_platform": 0,
        }
        draft["materials"].setdefault("audios", []).append(mat)

    target_start = start if start is not None else _next_free_start(draft, kind)
    seg = {
        "id": new_id(), "material_id": mat["id"],
        "target_timerange": {"start": target_start, "duration": src_dur},
        "source_timerange": {"start": src_start, "duration": src_dur},
        "extra_material_refs": [], "speed": 1.0, "volume": volume,
        "visible": True, "render_index": 0, "render_uniform_index": -1,
        "track_render_index": 0, "uniform_scale": True, "state": 0,
        "clip": None if kind == "audio" else {
            "alpha": 1.0, "rotation": 0.0,
            "flip": {"horizontal": False, "vertical": False},
            "scale": {"x": 1.0, "y": 1.0},
            "transform": {"x": 0.0, "y": 0.0},
        },
    }
    _material_ref(draft, seg, "speeds",
                  {"type": "speed", "mode": 0, "speed": 1.0, "range": None,
                   "curve_speed": None})
    track["segments"].append(seg)
    track["segments"].sort(key=lambda s: s["target_timerange"]["start"])
    recompute_duration(draft)
    return seg


def add_text(draft: dict, text: str, start: int, duration: int,
             font_size: float = 15.0, color: str = "#ffffffff",
             align: int = 1, styles: list[dict] | None = None) -> dict:
    """Segmento de texto. styles = [{'start_char':0,'end_char':5,'bold':True,
    'color':[1.0,0.5,0.5]} ...] — offsets em CARACTERES, convertidos p/ UTF-16 bytes."""
    content_styles = []
    for st in (styles or []):
        s0 = st.get("start_char", 0)
        s1 = st.get("end_char", len(text))
        fill = st.get("color")
        style = {
            "range": [_utf16_offset(text, s0), _utf16_offset(text, s1)],
        }
        if fill:
            # shape real 9.7: fill.content.render_type + solid.color
            style["fill"] = {"content": {"render_type": "solid",
                                         "solid": {"color": fill}}}
        else:
            style["fill"] = None
        for k in ("font", "size", "bold", "italic"):
            if st.get(k) is not None:
                style[k] = st[k]
        content_styles.append(style)
    content = json.dumps({"text": text, "styles": content_styles},
                         ensure_ascii=False)
    mat = {
        "id": new_id(), "type": "text", "content": content,
        "font_name": "", "font_id": "", "font_path": "", "font_url": "",
        "font_size": font_size, "text_color": color,
        "alignment": align, "text_alignment": None, "vertical": None,
        "border_color": "", "border_width": 0.0, "border_alpha": 0.0,
        "has_border": False, "letter_spacing": 0.0, "line_spacing": 0.02,
        "has_shadow": False, "shadow_color": "", "shadow_alpha": 1.0,
        "shadow_distance": 8.0, "shadow_angle": 45.0,
        "background_color": "", "background_alpha": 0.0,
        "background_style_id": None, "has_background": False,
        "background_round_radius": 0.0, "background_width": 0.0,
        "background_height": 0.0, "background_horizontal_offset": 0.0,
        "background_vertical_offset": 0.0, "typesetting": 0,
        "bold_width": 0.0, "bold_alpha": 0.0, "has_bold": False,
        "recognize_type": 0, "caption_template": None,
        "words": [], "language": "pt-BR", "layer_weight": 1,
    }
    draft["materials"].setdefault("texts", []).append(mat)
    track = find_track(draft, "text", create=True)
    seg = {
        "id": new_id(), "material_id": mat["id"],
        "target_timerange": {"start": start, "duration": duration},
        "source_timerange": {"start": 0, "duration": duration},
        "extra_material_refs": [], "speed": 1.0, "volume": None,
        "visible": True, "render_index": 14008, "render_uniform_index": -1,
        "track_render_index": 0, "uniform_scale": True, "state": 0,
        "common_keyframes": [], "clip": {
            "alpha": 1.0, "rotation": 0.0, "rotation3d": [],
            "flip": {"horizontal": False, "vertical": False},
            "scale": {"x": 1.0, "y": 1.0},
            "transform": {"x": 0.0, "y": -0.73},
        },
    }
    track["segments"].append(seg)
    track["segments"].sort(key=lambda s: s["target_timerange"]["start"])
    recompute_duration(draft)
    return seg


def _utf16_offset(text: str, char_index: int) -> int:
    return len(text[:max(0, min(char_index, len(text)))].encode("utf-16-le"))


def _file_md5(p: Path, chunk: int = 1 << 20) -> str:
    """md5 do arquivo (streaming) — o 9.7 usa como unique_id do material."""
    import hashlib
    h = hashlib.md5()
    with open(p, "rb") as f:
        while True:
            b = f.read(chunk)
            if not b:
                break
            h.update(b)
    return h.hexdigest()


# ---------------------------------------------------------------- edicao

def _find_segment(draft: dict, seg_id: str) -> tuple[dict, dict]:
    for t in draft["tracks"]:
        for s in t.get("segments", []):
            if s["id"] == seg_id:
                return t, s
    raise KeyError(f"segmento {seg_id} nao encontrado")


def split_segment(draft: dict, seg_id: str, at_us: int) -> tuple[dict, dict]:
    """Corta segmento no instante at_us (timeline) -> dois segmentos."""
    t, s = _find_segment(draft, seg_id)
    tstart = s["target_timerange"]["start"]
    tdur = s["target_timerange"]["duration"]
    if not (tstart < at_us < tstart + tdur):
        raise ValueError(f"at_us={at_us} fora do segmento [{tstart}, {tstart+tdur}]")
    left_len = at_us - tstart
    right_len = tdur - left_len
    sst = (s.get("source_timerange") or {}).get("start", 0)
    srate = tdur and left_len  # 1:1 sem speed; com speed, source proporcional
    src_left = s.get("source_timerange")
    if src_left and src_left.get("duration"):
        sp = src_left["duration"] / tdur
        src_split = sst + int(left_len * sp)
    else:
        src_split = sst + left_len
    right = json.loads(json.dumps(s))
    right["id"] = new_id()
    s["target_timerange"]["duration"] = left_len
    right["target_timerange"] = {"start": at_us, "duration": right_len}
    if s.get("source_timerange"):
        s["source_timerange"]["duration"] = src_split - sst
        right["source_timerange"] = {"start": src_split, "duration":
                                     (s["source_timerange"]["start"] or 0) +
                                     (s.get("source_timerange", {}).get("duration", 0)) -
                                     src_split}
    # companheiros compartilhados (speed/mask) continuam nos refs dos dois
    t["segments"].insert(t["segments"].index(s) + 1, right)
    return s, right


def trim_segment(draft: dict, seg_id: str, new_start: int | None = None,
                 new_end: int | None = None) -> dict:
    """Redefine target_timerange; new_start/new_end em us de timeline."""
    t, s = _find_segment(draft, seg_id)
    tr = s["target_timerange"]
    start = tr["start"] if new_start is None else new_start
    end = tr["start"] + tr["duration"] if new_end is None else new_end
    if end <= start:
        raise ValueError("new_end deve ser maior que new_start")
    # ajusta source para manter a mesma fatia de origem
    src = s.get("source_timerange")
    if src and src.get("duration"):
        ratio = src["duration"] / tr["duration"]
        old_start = tr["start"]
        src["start"] = max(0, src["start"] + int((start - old_start) * ratio))
        src["duration"] = int((end - start) * ratio)
    tr["start"], tr["duration"] = start, end - start
    recompute_duration(draft)
    return s


def move_segment(draft: dict, seg_id: str, new_start: int) -> dict:
    t, s = _find_segment(draft, seg_id)
    s["target_timerange"]["start"] = new_start
    t["segments"].sort(key=lambda x: x["target_timerange"]["start"])
    recompute_duration(draft)
    return s


def delete_segment(draft: dict, seg_id: str) -> None:
    t, s = _find_segment(draft, seg_id)
    t["segments"].remove(s)
    mat = resolve_material(draft, s.get("material_id", ""))
    if mat:
        cat, m = mat
        # remove primario se nenhum outro segmento usa
        used = any(seg.get("material_id") == m["id"]
                   for tt in draft["tracks"] for seg in tt.get("segments", []))
        if not used:
            draft["materials"][cat].remove(m)
    _orphan_cleanup(draft, s)
    recompute_duration(draft)


# ---------------------------------------------------------------- ajustes

def set_speed(draft: dict, seg_id: str, speed: float) -> dict:
    t, s = _find_segment(draft, seg_id)
    old = s.get("speed", 1.0) or 1.0
    comp = resolve_companions(draft, s).get("speeds", [])
    if comp:
        comp[0]["speed"] = speed
    else:
        _material_ref(draft, s, "speeds",
                      {"type": "speed", "mode": 0, "speed": speed, "range": None})
    # target_timerange escala inversamente a velocidade (mesma fonte)
    tr = s["target_timerange"]
    tr["duration"] = int(tr["duration"] * old / speed)
    s["speed"] = speed
    recompute_duration(draft)
    return s


def set_volume(draft: dict, seg_id: str, volume: float) -> dict:
    _, s = _find_segment(draft, seg_id)
    s["volume"] = volume
    return s


def set_fade(draft: dict, seg_id: str, fade_in: int = 0,
             fade_out: int = 0) -> dict:
    _, s = _find_segment(draft, seg_id)
    comp = resolve_companions(draft, s).get("audio_fades", [])
    if comp:
        comp[0].update({"fade_in": fade_in, "fade_out": fade_out, "fade_type": 0})
        return s
    _material_ref(draft, s, "audio_fades",
                  {"id": new_id(), "type": "audio_fade",
                   "fade_in": fade_in, "fade_out": fade_out, "fade_type": 0})
    return s


def set_transform(draft: dict, seg_id: str, scale: float | None = None,
                  x: float | None = None, y: float | None = None,
                  rotation: float | None = None, alpha: float | None = None,
                  flip_h: bool | None = None, flip_v: bool | None = None) -> dict:
    _, s = _find_segment(draft, seg_id)
    clip = s.setdefault("clip", {})
    if scale is not None:
        clip.setdefault("scale", {})["x"] = scale
        clip.setdefault("scale", {})["y"] = scale
    if x is not None or y is not None:
        clip.setdefault("transform", {})
        if x is not None:
            clip["transform"]["x"] = x
        if y is not None:
            clip["transform"]["y"] = y
    if rotation is not None:
        clip["rotation"] = rotation
    if alpha is not None:
        clip["alpha"] = alpha
    if flip_h is not None or flip_v is not None:
        clip.setdefault("flip", {})
        if flip_h is not None:
            clip["flip"]["horizontal"] = flip_h
        if flip_v is not None:
            clip["flip"]["vertical"] = flip_v
    return s


# ---------------------------------------------------------------- CLI

def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Operacoes de timeline CapCut")
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("add-media")
    s.add_argument("draft_dir"); s.add_argument("media")
    s.add_argument("--kind", choices=["video", "audio"], default="video")
    s.add_argument("--start", type=float, default=None)
    s.add_argument("--volume", type=float, default=1.0)

    s = sub.add_parser("add-text")
    s.add_argument("draft_dir"); s.add_argument("text")
    s.add_argument("--start", type=float, required=True)
    s.add_argument("--duration", type=float, required=True)
    s.add_argument("--size", type=float, default=8.0)

    s = sub.add_parser("split")
    s.add_argument("draft_dir"); s.add_argument("seg_id")
    s.add_argument("--at", type=float, required=True)

    s = sub.add_parser("delete")
    s.add_argument("draft_dir"); s.add_argument("seg_id")

    s = sub.add_parser("speed")
    s.add_argument("draft_dir"); s.add_argument("seg_id")
    s.add_argument("--value", type=float, required=True)

    s = sub.add_parser("info"); s.add_argument("draft_dir")

    a = ap.parse_args(argv)
    draft = load_draft(a.draft_dir)
    if a.cmd == "add-media":
        seg = add_media(draft, a.media, a.kind,
                        start=None if a.start is None else us(a.start),
                        volume=a.volume)
        print(json.dumps({"segment_id": seg["id"],
                          "start_s": sec(seg["target_timerange"]["start"]),
                          "duration_s": sec(seg["target_timerange"]["duration"])},
                         ensure_ascii=False))
    elif a.cmd == "add-text":
        seg = add_text(draft, a.text, us(a.start), us(a.duration),
                       font_size=a.size)
        print(json.dumps({"segment_id": seg["id"],
                          "text_material_id": seg["material_id"]}, ensure_ascii=False))
    elif a.cmd == "split":
        left, right = split_segment(draft, a.seg_id, us(a.at))
        print(json.dumps({"left": left["id"], "right": right["id"]}))
    elif a.cmd == "delete":
        delete_segment(draft, a.seg_id)
        print("removido")
    elif a.cmd == "speed":
        seg = set_speed(draft, a.seg_id, a.value)
        print(json.dumps({"segment_id": seg["id"],
                          "duration_s": sec(seg["target_timerange"]["duration"])}))
    elif a.cmd == "info":
        from draft_io import _fmt_info
        print(_fmt_info(draft))
    issues = validate_draft(draft)
    for i in issues:
        print("VALIDACAO:", i, file=sys.stderr)
    if a.cmd != "info":
        save_draft(draft, a.draft_dir)
    return 0


if __name__ == "__main__":
    sys.exit(main())
