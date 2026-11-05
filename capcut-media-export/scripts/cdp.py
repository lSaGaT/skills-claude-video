#!/usr/bin/env python
"""cdp.py — cliente CDP (Chrome DevTools Protocol) minimalista para o CapCut.

O CapCut Desktop 9.7 roda a UI em CEF (Chromium). Relançado com
`CapCut.exe --remote-debugging-port=9223`, expõe o DOM da interface inteira
via CDP — base da automação de export (abrir projeto, clicar Exportar,
preencher diálogo, detectar conclusão).

CLI:
  python cdp.py list                          # alvos abertos
  python cdp.py eval "<js>" [--match SUBURL]  # avalia JS na página (await ok)
API:
  from cdp import find_target, cdp_eval
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.request

import websocket  # pip install websocket-client

DEBUG_HOST = "127.0.0.1"
DEBUG_PORT_DEFAULT = 9223


def list_targets(port: int = DEBUG_PORT_DEFAULT) -> list[dict]:
    with urllib.request.urlopen(f"http://{DEBUG_HOST}:{port}/json", timeout=5) as r:
        return json.loads(r.read().decode("utf-8"))


def find_target(match: str = "", port: int = DEBUG_PORT_DEFAULT) -> dict | None:
    tgts = [t for t in list_targets(port) if t.get("type") == "page"]
    if match:
        for t in tgts:
            if match.lower() in (t.get("url") or "").lower() or \
               match.lower() in (t.get("title") or "").lower():
                return t
        return None
    return tgts[0] if tgts else None


def cdp_eval(js: str, match: str = "", port: int = DEBUG_PORT_DEFAULT,
             timeout: float = 20.0):
    """Avalia `js` na página alvo. Retorna o valor de `result.result`."""
    tgt = find_target(match, port)
    if not tgt:
        raise RuntimeError(f"nenhuma pagina CDP para match={match!r}")
    ws = websocket.create_connection(tgt["webSocketDebuggerUrl"], timeout=timeout,
                                     suppress_origin=True)
    try:
        ws.send(json.dumps({"id": 1, "method": "Runtime.evaluate",
                            "params": {"expression": js,
                                       "awaitPromise": True,
                                       "returnByValue": True}}))
        deadline_msg = None
        while True:
            msg = json.loads(ws.recv())
            if msg.get("id") == 1:
                deadline_msg = msg
                break
        res = deadline_msg.get("result", {})
        if res.get("exceptionDetails"):
            ed = res["exceptionDetails"]
            text = ed.get("exception", {}).get("description") or ed.get("text")
            raise RuntimeError(f"JS exception: {text}")
        return res.get("result", {}).get("value")
    finally:
        ws.close()


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="CDP helper para CapCut")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list")
    s = sub.add_parser("eval")
    s.add_argument("js")
    s.add_argument("--match", default="")
    s.add_argument("--port", type=int, default=DEBUG_PORT_DEFAULT)
    a = ap.parse_args(argv)
    if a.cmd == "list":
        for t in list_targets(getattr(a, "port", DEBUG_PORT_DEFAULT)):
            print(f"{t.get('type')} | {(t.get('title') or '')[:50]} | "
                  f"{(t.get('url') or '')[:80]}")
    else:
        out = cdp_eval(a.js, a.match, a.port)
        print(json.dumps(out, ensure_ascii=False) if not isinstance(out, str) else out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
