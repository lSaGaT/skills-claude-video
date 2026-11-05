#!/usr/bin/env python
"""export_ui.py — automação do fluxo de export do CapCut Desktop 9.7 (QML nativo).

Descobertas da RE (ledger E-11):
  * Home e editor são janelas QML NATIVAS (HomePageX_QMLTYPE_*, MainWindow_QMLTYPE_*)
    — NÃO expõem controles via UIA e NÃO há página CDP (o CEF só hospeda painéis web).
  * Automação = foco na janela + CLIQUE por coordenada + TECLADO + SCREENSHOT.
    O padrão da skill é o LOOP DE VISÃO do agente: shot() -> ler imagem -> decidir
    coordenada -> click_at() -> repetir. As coordenadas conhecidas estão abaixo
    como pontos de partida (janela 1920x1040, escaladas automaticamente).
  * Editor: botão Exportar topo-direito (~0.909, ~0.016); atalho exportVideo
    Ctrl+E (mapa FCP) / Ctrl+M (mapa Premiere).
  * Diálogo paywall Pro ("Obtenha o Pro ... desbloquear estes recursos") aparece
    quando o projeto usa recursos Pro — detectável por screenshot; botões:
    Voltar à edição (~0.411, ~0.760) | Obter Pro gratuito | Obter desconto.
    SEM Pro NÃO HÁ export com esses recursos: use strip_pro_resources() numa
    CÓPIA do draft (remover filtro "4K"/Tools e stable_level) e exporte a
    versão limpa, ou ative o Pro na conta. NUNCA tente contornar o diálogo.
  * Home: cards de projeto na grade (1º card ~0.178, ~0.775 do centro do card;
    passo horizontal ~0.102 da largura) — sempre re-sacar screenshot.

CLI:
  python export_ui.py shot <arquivo.png>
  python export_ui.py state                       # home | editor | ? (classe da janela)
  python export_ui.py click <fx> <fy>             # frações da janela (0..1)
  python export_ui.py dclick <fx> <fy>
  python export_ui.py key "<sequência pywinauto>" # ex.: "^e" = Ctrl+E
  python export_ui.py export-editor               # clica Exportar no editor
  python export_ui.py wait-file <dir> <timeout_s> # arquivo de vídeo mais novo
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

from pywinauto import Desktop
from pywinauto.keyboard import send_keys
from pywinauto.mouse import click, double_click

WIN_TIMEOUT = 10

# Coordenadas conhecidas (frações da janela, janela de referência 1920x1040)
EDITOR_EXPORT_BTN = (0.909, 0.016)
EDITOR_MENU = (0.056, 0.015)
EDITOR_LOGO = (0.021, 0.015)
PAYWALL_BACK = (0.411, 0.760)
HOME_FIRST_CARD = (0.178, 0.775)   # centro do 1º card
HOME_CARD_DX = 0.102               # passo horizontal entre cards
HOME_CARD_DY = 0.0


def _window(class_substr: str | None = None):
    wins = Desktop(backend="uia").windows()
    if class_substr:
        cands = [w for w in wins
                 if class_substr in (w.element_info.class_name or "")]
    else:
        cands = [w for w in wins if "QMLTYPE" in (w.element_info.class_name or "")
                 and "CapCut" in (w.window_text() or "")]
    if not cands:
        raise RuntimeError(f"janela CapCut nao encontrada (filtro={class_substr!r})")
    return cands[0]


def state() -> str:
    for w in Desktop(backend="uia").windows():
        cn = w.element_info.class_name or ""
        if cn.startswith("HomePageX_QMLTYPE"):
            return "home"
        if cn.startswith("MainWindow_QMLTYPE"):
            return "editor"
    return "?"


def shot(out_path: str) -> str:
    w = _window()
    w.set_focus()
    time.sleep(0.6)
    img = w.capture_as_image()
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path)
    return out_path


def click_at(fx: float, fy: float, dbl: bool = False) -> None:
    w = _window()
    w.set_focus()
    time.sleep(0.5)
    r = w.rectangle()
    x = r.left + int(r.width() * fx)
    y = r.top + int(r.height() * fy)
    (double_click if dbl else click)(button="left", coords=(x, y))
    time.sleep(1.0)


def key(seq: str) -> None:
    w = _window()
    w.set_focus()
    time.sleep(0.5)
    send_keys(seq)
    time.sleep(1.0)


def export_editor() -> None:
    """Clica o botão Exportar no editor (equivalente a Ctrl+E)."""
    click_at(*EDITOR_EXPORT_BTN)


def wait_file(directory: str, timeout_s: float = 1800,
              exts: tuple[str, ...] = (".mp4", ".mov", ".mkv", ".webm")) -> str:
    """Retorna o arquivo de vídeo MAIS RECENTE criado/finalizado em `directory`.
    Considera estável um arquivo cujo tamanho não muda por 2 varreduras."""
    d = Path(directory)
    d.mkdir(parents=True, exist_ok=True)
    deadline = time.time() + timeout_s
    last_size = -1
    stable_since = None
    candidate = None
    while time.time() < deadline:
        vids = [p for p in d.rglob("*")
                if p.is_file() and p.suffix.lower() in exts
                and time.time() - p.stat().st_mtime < timeout_s]
        if vids:
            candidate = max(vids, key=lambda p: p.stat().st_mtime)
            sz = candidate.stat().st_size
            if sz == last_size and sz > 0:
                if stable_since and time.time() - stable_since > 3:
                    return str(candidate)
                stable_since = stable_since or time.time()
            else:
                stable_since = None
            last_size = sz
        time.sleep(2)
    raise TimeoutError(f"nenhum arquivo estabilizado em {d} após {timeout_s}s")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Automação de export CapCut 9.7")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("shot"); s.add_argument("out")
    sub.add_parser("state")
    s = sub.add_parser("click"); s.add_argument("fx", type=float); s.add_argument("fy", type=float)
    s = sub.add_parser("dclick"); s.add_argument("fx", type=float); s.add_argument("fy", type=float)
    s = sub.add_parser("key"); s.add_argument("seq")
    sub.add_parser("export-editor")
    s = sub.add_parser("wait-file"); s.add_argument("directory"); s.add_argument("timeout_s", type=float)
    a = ap.parse_args(argv)
    if a.cmd == "shot":
        print(shot(a.out))
    elif a.cmd == "state":
        print(state())
    elif a.cmd == "click":
        click_at(a.fx, a.fy)
    elif a.cmd == "dclick":
        click_at(a.fx, a.fy, dbl=True)
    elif a.cmd == "key":
        key(a.seq)
    elif a.cmd == "export-editor":
        export_editor()
    elif a.cmd == "wait-file":
        print(wait_file(a.directory, a.timeout_s))
    return 0


if __name__ == "__main__":
    sys.exit(main())
