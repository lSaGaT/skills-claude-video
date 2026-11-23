#!/usr/bin/env python
"""make_demo_draft.py — gera um draft CapCut completo de demonstracao.

Cria midias de teste com o ffmpeg EMBUTIDO do CapCut (testsrc + tom),
constroi um draft com: 2 clipes de video, corte/divisao implicito,
texto estilizado, velocidade, transform, fade de audio, ajuste de cor.
Estrutura minima de risco: sem ids de catalogo remoto (transicao/filtro/efeito
de biblioteca entram em iteracao posterior, apos validar v1 no app).

Uso:
  python make_demo_draft.py <dir_saida>
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from draft_io import new_draft, init_draft_dir, save_draft, us, validate_draft
from timeline_ops import (add_media, add_text, set_speed, set_transform,
                          set_volume, set_fade, split_segment, probe_media)
from effect_ops import add_adjust, add_animation

CAPCUT_ROOT = Path(r"C:\Users\Conectare\AppData\Local\CapCut\Apps\9.7.0.4153")
FFMPEG = CAPCUT_ROOT / "ffmpeg.exe"


def gen_media(out_dir: Path) -> dict:
    out_dir.mkdir(parents=True, exist_ok=True)
    exe = str(FFMPEG) if FFMPEG.exists() else "ffmpeg"
    v1 = out_dir / "test-clip-1.mp4"
    v2 = out_dir / "test-clip-2.mp4"
    a1 = out_dir / "test-music.mp3"
    if not v1.exists():
        subprocess.run([exe, "-y", "-v", "quiet", "-f", "lavfi",
                        "-i", "testsrc2=duration=5:size=1280x720:rate=30",
                        "-pix_fmt", "yuv420p", str(v1)], check=True, timeout=120)
    if not v2.exists():
        subprocess.run([exe, "-y", "-v", "quiet", "-f", "lavfi",
                        "-i", "gradients=duration=5:size=1280x720:rate=30",
                        "-pix_fmt", "yuv420p", str(v2)], check=True, timeout=120)
    if not a1.exists():
        subprocess.run([exe, "-y", "-v", "quiet", "-f", "lavfi",
                        "-i", "sine=frequency=440:duration=10",
                        "-q:a", "6", str(a1)], check=True, timeout=120)
    return {"v1": v1, "v2": v2, "a1": a1}


def build(out_dir: Path) -> Path:
    media = gen_media(out_dir)
    draft = new_draft("Demo RE CapCut", width=1280, height=720, fps=30)

    # 1) dois clipes de video em sequencia
    s1 = add_media(draft, media["v1"], "video")
    s2 = add_media(draft, media["v2"], "video")

    # 2) transform no primeiro + velocidade 2x no segundo
    set_transform(draft, s1["id"], scale=0.9, y=0.05)
    set_speed(draft, s2["id"], 2.0)  # 5s -> 2.5s

    # 3) ajuste de cor no primeiro (brightness/saturation genericos)
    add_adjust(draft, s1["id"], brightness=0.1, saturation=0.15)

    # 4) animacao de entrada no primeiro clip (id de catalogo desconhecido ->
    #    campo opcional; se o app nao resolver, ignora ou mostra placeholder)
    # add_animation(draft, s1["id"], anim_in="ZoomIn")  # deixar p/ iteracao 2

    # 5) texto principal + legenda estilizada
    add_text(draft, "Demo engenharia reversa", us(0.5), us(3.0), font_size=10)
    t2 = add_text(draft, "skill capcut-draft-core v1", us(4.0), us(3.0),
                  font_size=7, color="#FFD54F", align=1)
    from timeline_ops import _find_segment
    from text_ops import set_text_styles
    set_text_styles(draft, t2["id"], [
        {"start_char": 0, "end_char": 19, "bold": True,
         "color": [1.0, 0.84, 0.31]},
        {"start_char": 19, "end_char": 22, "bold": False},
    ])

    # 6) musica com fade in/out e volume baixo
    a = add_media(draft, media["a1"], "audio", volume=0.4)
    set_fade(draft, a["id"], fade_in=us(1.0), fade_out=us(1.5))

    issues = validate_draft(draft)
    if issues:
        print("VALIDACAO:", *issues, sep="\n  ", file=sys.stderr)
    return init_draft_dir(out_dir / "demo-draft", draft)


if __name__ == "__main__":
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent / "test" / "demo"
    p = build(out)
    d = __import__("draft_io").load_draft(p)
    print(json.dumps({"draft": str(p), "duration_s": d["duration"] / 1e6,
                      "tracks": len(d["tracks"]),
                      "materials": {k: len(v) for k, v in d["materials"].items() if v}},
                     ensure_ascii=False, indent=1))
