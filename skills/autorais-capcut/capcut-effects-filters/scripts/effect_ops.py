#!/usr/bin/env python
"""effect_ops.py — efeitos, filtros, transicoes, animacoes e ajustes de cor.

Modelo do draft (publico, a confirmar no draft real do 9.7):
  Transicao  = materials.transitions[] + segment.extra_material_refs do segmento
               A DIREITA do corte; aplica-se entre segmento anterior e este.
  Efeito     = track type="effect" com segmentos -> materials.video_effects[]
               (efeito de cena aplicado a tela, com tracking_id/apply_target)
  Filtro     = track type="filter" com segmentos -> materials.video_effects[]
               (adjust_params com filter_id)
  Animacao   = materials.material_animations[] (via extra_material_refs do segmento)
               anim_in/anim_out/loop de animacoes de entrada/saida/loop
  Ajuste     = materials.video_effects[].adjust_params[] (brightness/contrast/
               saturation etc.) aplicado via segmento na track video (companion)

IDs de efeito/filtro/transicao sao slugs do catalogo do CapCut (ex.: transition
"Fountain", filter "ZQ001"); a lista local fica em User Data\\Cache\\effect\\<id>\\
e no catalogo remoto. Os ids usados aqui precisam existir no CapCut 9.7 —
confirmar com draft real aberto (ground truth).
"""
from __future__ import annotations

import json
import sys

from draft_io import (new_id, load_draft, save_draft, us, validate_draft,
                      find_track, resolve_material)
from timeline_ops import _find_segment, _material_ref


def add_transition(draft: dict, right_seg_id: str, transition_id: str,
                   duration_us: int = 500_000) -> dict:
    """Transicao no corte: pertence ao segmento da DIREITA do corte."""
    _, s = _find_segment(draft, right_seg_id)
    tr = {"id": new_id(), "type": "transition", "name": transition_id,
          "resource_id": transition_id, "effect_id": transition_id,
          "duration": duration_us, "category_id": "", "category_name": "",
          "effect_name": transition_id, "panel": "", "platform": "all",
          "path": "", "orientation": 0, "sub_type": "", "extra": None,
          "is_overlap": False}
    draft["materials"].setdefault("transitions", []).append(tr)
    s.setdefault("extra_material_refs", []).append(tr["id"])
    return tr


def add_scene_effect(draft: dict, effect_id: str, start: int, duration: int,
                     apply_target_type: int = 2, track_name: str = "") -> dict:
    """Efeito de cena (track 'effect') — shape real 9.7 do draft "1104":
    {id, effect_id, resource_id, name, type:"video_effect", sub_type:0,
    bind_segment_id:"", transparent_params:"", path→Cache\\effect\\<id>\\<md5>,
    value:1.0, category_id, category_name, apply_target_type, ...}.
    apply_target_type real do efeito de exemplo: 2."""
    mat = {"id": new_id(), "type": "video_effect", "name": effect_id,
           "effect_id": effect_id, "resource_id": effect_id,
           "sub_type": 0, "bind_segment_id": "", "transparent_params": "",
           "path": "", "value": 1.0,
           "category_id": "", "category_name": "",
           "platform": "all", "apply_target_type": apply_target_type,
           "source_platform": 1, "version": "", "item_effect_type": 0,
           "adjust_params": [], "keyframe_adjust": None}
    draft["materials"].setdefault("video_effects", []).append(mat)
    track = find_track(draft, "effect", create=True)
    if track_name:
        track["name"] = track_name
        track["is_default_name"] = False
    seg = {"id": new_id(), "material_id": mat["id"],
           "target_timerange": {"start": start, "duration": duration},
           "source_timerange": {"start": 0, "duration": duration},
           "extra_material_refs": [], "speed": 1.0, "volume": None,
           "visible": True, "render_index": 0, "render_uniform_index": -1}
    track["segments"].append(seg)
    return seg


def add_filter(draft: dict, filter_id: str, start: int, duration: int,
               intensity: float = 1.0, track_name: str = "") -> dict:
    """Filtro (track 'filter') — NO 9.7 vai em materials.effects[] (nao video_effects).
    Shape real: {id, effect_id, resource_id, name, type:"filter", sub_type:"none",
    path (Cache\\effect\\<id>\\<md5>), value, visible, item_effect_type:0,
    category_id, category_name, apply_target_type:0, ...}"""
    mat = {"id": new_id(), "type": "filter", "name": filter_id,
           "effect_id": filter_id, "resource_id": filter_id,
           "third_resource_id": "0", "report_name": "",
           "sub_type": "none", "path": "", "value": intensity,
           "visible": True, "item_effect_type": 0,
           "category_id": "", "category_name": "", "category_key": "",
           "sub_category_id": "", "sub_category_name": "",
           "platform": "all", "apply_target_type": 0, "source_platform": 1,
           "version": "", "level": 100.0, "extend": None,
           "enable_matrix": False, "matrix_path": "",
           "alpha_out_of_range_action": 0, "adjust_params": []}
    draft["materials"].setdefault("effects", []).append(mat)
    track = find_track(draft, "filter", create=True)
    if track_name:
        track["name"] = track_name
        track["is_default_name"] = False
    seg = {"id": new_id(), "material_id": mat["id"],
           "target_timerange": {"start": start, "duration": duration},
           "source_timerange": {"start": 0, "duration": duration},
           "extra_material_refs": [], "speed": 1.0, "volume": None,
           "visible": True, "render_index": 0, "render_uniform_index": -1}
    track["segments"].append(seg)
    return seg


def add_animation(draft: dict, seg_id: str, anim_type: str, resource_id: str,
                  name: str, duration_us: int = 1_000_000,
                  start_us: int | None = None) -> dict:
    """Animação de entrada/saída/combinação no segmento — SHAPE REAL 9.7
    (draft "1104"). anim_type: "in"|"out"|"combo".
    resource_id = id numérico do catálogo (use catalog_local.search(..., kind='animation')).
    start_us = relativo ao segmento (default: 0 para 'in'/'combo';
    para 'out' o app usa (dur_seg - dur_anim))."""
    _, s = _find_segment(draft, seg_id)
    anim_type = anim_type.lower()
    if anim_type not in ("in", "out", "combo"):
        raise ValueError('anim_type deve ser "in"|"out"|"combo"')
    seg_dur = s["target_timerange"]["duration"]
    if start_us is None:
        start_us = 0 if anim_type in ("in", "combo") else max(0, seg_dur - duration_us)
    comp = {m["id"] for m in draft["materials"].get("material_animations", [])}
    existing = next((r for r in s.get("extra_material_refs", []) if r in comp), None)
    anim = next((m for m in draft["materials"].get("material_animations", [])
                 if m["id"] == existing), None) if existing else None
    if anim is None:
        anim = {"id": new_id(), "type": "sticker_animation", "animations": [],
                "multi_language_current": "none"}
        draft["materials"].setdefault("material_animations", []).append(anim)
        s.setdefault("extra_material_refs", []).append(anim["id"])
    # remove animação anterior do mesmo tipo (uma por tipo)
    anim["animations"] = [a for a in anim["animations"] if a.get("type") != anim_type]
    anim["animations"].append({
        "id": str(resource_id), "type": anim_type,
        "start": start_us, "duration": duration_us,
        "path": "", "platform": "all",
        "resource_id": str(resource_id), "third_resource_id": str(resource_id),
        "source_platform": 1, "name": name,
        "category_id": "", "category_name": "",
        "panel": "video", "material_type": "video",
        "anim_adjust_params": None, "request_id": "",
    })
    return anim


def add_sticker(draft: dict, sticker_id: str, name: str, start: int,
                duration: int, scale: float | None = None,
                x: float | None = None, y: float | None = None,
                track_name: str = "") -> dict:
    """Sticker (track 'sticker') — SHAPE REAL 9.7 (draft "1104"):
    material {id, unique_id:"", type:"sticker", path→Cache\\artistEffect\\<id>\\<md5>,
    icon_url, preview_cover_url, sticker_id, resource_id, name, category_id,
    category_name, platform:"all", unicode:"", source_platform:1,...};
    segmento com source_timerange NULL e render_index 14000."""
    mat = {"id": new_id(), "unique_id": "", "type": "sticker",
           "path": "", "icon_url": "", "preview_cover_url": "",
           "sticker_id": str(sticker_id), "resource_id": str(sticker_id),
           "name": name, "category_id": "", "category_name": "",
           "platform": "all", "unicode": "", "source_platform": 1,
           "formula_id": "", "check_flag": 6275077553303615000,
           "traverse_flag": False, "sticker_type": 0}
    draft["materials"].setdefault("stickers", []).append(mat)
    track = find_track(draft, "sticker", create=True)
    if track_name:
        track["name"] = track_name
        track["is_default_name"] = False
    seg = {"id": new_id(), "material_id": mat["id"],
           "target_timerange": {"start": start, "duration": duration},
           "source_timerange": None,
           "extra_material_refs": [], "speed": 1.0, "volume": 1.0,
           "visible": True, "render_index": 14000, "render_uniform_index": -1,
           "track_render_index": 0, "uniform_scale": True, "state": 0,
           "clip": {"alpha": 1.0, "rotation": 0.0, "rotation3d": [],
                    "flip": {"horizontal": False, "vertical": False},
                    "scale": {"x": scale if scale is not None else 1.0,
                              "y": scale if scale is not None else 1.0},
                    "transform": {"x": x if x is not None else 0.0,
                                  "y": y if y is not None else 0.0}}}
    track["segments"].append(seg)
    return seg


def set_matting(draft: dict, seg_id: str, enable: bool = True,
                feather: float = 0.0, expansion: float = 0.0,
                reverse: bool = False) -> dict:
    """Remover plano de fundo — escreve o objeto `matting` do MATERIAL de vídeo
    (shape real 9.7: flag, path, strokes, feather, expansion, reverse,
    custom_matting_id, mask_video_path...).

    ATENÇÃO: a segmentação IA do sujeito roda DENTRO do app (modelo local
    Cache\\effect\\7369530763454190081 + openvino). Aqui escrevemos a estrutura;
    o app recalcula a máscara ao abrir/ajustar. Para máscara pronta, gere um
    vídeo-alfa e aponte `matting.mask_video_path` (avançado, não testado)."""
    _, s = _find_segment(draft, seg_id)
    _, mat = resolve_material(draft, s["material_id"])
    if not mat:
        raise KeyError("material do segmento nao encontrado")
    m = mat.setdefault("matting", {
        "flag": 0, "path": "", "interactiveTime": [],
        "has_use_quick_brush": False, "strokes": [],
        "has_use_quick_eraser": False, "expansion": 0, "feather": 0,
        "reverse": False, "custom_matting_id": "",
        "enable_matting_stroke": False, "is_clould": False,
        "mask_video_path": "", "cloud_product_fps": 0.0})
    m["flag"] = 1 if enable else 0
    m["feather"] = feather
    m["expansion"] = expansion
    m["reverse"] = reverse
    return m


def add_chroma(draft: dict, seg_id: str, color_sdr: list[float],
               intensity: float = 0.3, shadow: float = 0.0) -> dict:
    """Chroma key (fundos verdes/azuis) — shape do schema público
    (EXPERIMENTAL no 9.7: categoria `chromas` existia vazia no draft "1104";
    validar num projeto com chroma aplicado antes de confiar)."""
    _, s = _find_segment(draft, seg_id)
    chroma = {"id": new_id(), "type": "chroma",
              "key_frames": [{"id": new_id(),
                              "values": [{"color_pick": {"sdr": color_sdr,
                                                         "hdr": None},
                                          "intensity": intensity,
                                          "shadow": shadow}]}],
              "holds": [], "common_keyframes": [],
              "keyframe_list": []}
    draft["materials"].setdefault("chromas", []).append(chroma)
    s.setdefault("extra_material_refs", []).append(chroma["id"])
    return chroma


def add_adjust(draft: dict, seg_id: str, brightness: float | None = None,
               contrast: float | None = None, saturation: float | None = None,
               temperature: float | None = None, hue: float | None = None) -> dict:
    """Ajustes de cor no segmento (video_effects tipo adjust via companion)."""
    _, s = _find_segment(draft, seg_id)
    vals = {}
    if brightness is not None: vals["brightness"] = brightness
    if contrast is not None: vals["contrast"] = contrast
    if saturation is not None: vals["saturation"] = saturation
    if temperature is not None: vals["temperature"] = temperature
    if hue is not None: vals["hue"] = hue
    adj = {"id": new_id(), "type": "adjust",
           "adjust_params": [{"adjust_type": i, "value": v, "mask": None}
                             for i, v in enumerate([
                                 vals.get("brightness", 0.0),
                                 vals.get("contrast", 0.0),
                                 vals.get("saturation", 0.0),
                                 vals.get("temperature", 0.0),
                                 vals.get("hue", 0.0)])]}
    draft["materials"].setdefault("video_effects", []).append(adj)
    s.setdefault("extra_material_refs", []).append(adj["id"])
    return adj
