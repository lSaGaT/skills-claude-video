---
name: capcut-media-export
description: Inspeção e processamento de mídia usando o próprio toolkit do CapCut (ffmpeg/ffprobe embutidos) e utilitários do app (draft-converter para AAF), mais o estado real da automação de exportação do CapCut 9.7. Use para probe de mídia, conversão, geração de clipes de teste, ou quando o usuário pedir exportar/renderizar um projeto CapCut (a exportação por JSON não existe — veja a seção Exportação).
---
> **Uso global (qualquer pasta):** os caminhos absolutos funcionam de qualquer
> diretório — `python "C:\Users\Conectare\.claude\skills\capcut-media-export\scripts\<modulo>.py" ...`.
> Módulos disponíveis nesta skill: draft_io.py timeline_ops.py (probe_media).
> Para importar como biblioteca, antes faça `sys.path.insert(0, r"C:\Users\Conectare\.claude\skills\capcut-media-export\scripts")`.


# CapCut Media & Export

## Toolkit embutido do CapCut 9.7

| Binário | Caminho (`...\AppData\Local\CapCut\Apps\9.7.0.4153\`) | Uso |
|---|---|---|
| `ffmpeg.exe` | raiz | encode/decode/filters (avcodec-61, ByteVC1, SVT-AV1, dav1d) |
| `ffprobe.exe` | raiz | inspeção de mídia (usado por `timeline_ops.probe_media`) |
| `Tools\draft-converter\draft-converter.exe` | PyInstaller + módulo `aaf2` | conversão de projeto (AAF/Avid ↔ draft) |
| `VEHelper.exe` / sandbox `vm_sdk` | raiz / `vm_sdk` | processos helper do editor |

Preferir estes binários: versões idênticas às do app (mesmos codecs, mesmo
comportamento de render).

## Probe rápido

```python
from timeline_ops import probe_media
info = probe_media(r"C:\clips\video.mp4")
# {"duration_us": ..., "width": ..., "height": ..., "has_audio": bool}
```

## Exportação — fluxo real mapeado no 9.7 (ground truth E-11)

Home e editor são **QML nativo** (não expõem controles UIA nem página CDP —
o CEF só hospeda painéis web) → automação por **loop de visão**:
`export_ui.py shot` → o AGENTE lê o screenshot → `click_at(fx, fy)` → repete.
Coordenadas conhecidas (frações da janela) no topo de `export_ui.py`.

```bash
S="C:\Users\Conectare\.claude\skills\capcut-media-export\scripts"
python "$S\export_ui.py" state                 # home | editor | ?
python "$S\export_ui.py" shot img.png          # screenshot para o agente ler
python "$S\export_ui.py" export-editor         # botão Exportar (ou: key "^e")
python "$S\export_ui.py" click 0.411 0.760     # ex.: Voltar à edição no paywall
python "$S\export_ui.py" wait-file "C:\Users\<u>\Videos\CapCut" 1800
```

**Máquina de estados** (validada ao vivo):
1. `state()==editor` → `export-editor` (ou Ctrl+E)
2. Screenshot → casos: **(a)** diálogo de export normal → preencher → Exportar →
   `wait-file`; **(b)** paywall Pro ("Obtenha o Pro ... desbloquear") → opções
   legítimas: conta com Pro ativo (diálogo nem aparece), OU `strip_pro.py`
   numa CÓPIA do draft → reabrir → exportar versão limpa, OU cancelar.
   Bloqueadores conhecidos: filtro "4K" (`effects[].category_name=="Tools"`)
   = "Aprimorar qualidade"; `videos[].stable.stable_level != 0` = "Estabilização".
   **NUNCA contornar o diálogo** — editar o draft é o caminho.
3. Abrir projeto = Home → `dclick` no card (1º ~0.178/0.775, passo ~0.102);
   sempre re-sacar screenshot para confirmar.

**O render só existe após o export**: a pasta do draft NÃO contém vídeo final —
apenas caches de algoritmo por segmento (`Resources\videoAlg\*.mp4` sem moov,
`audioAlg\*.wav` de separação vocal) e a receita (`draft_content.json`).

**Exportação por draft JSON não existe** (Mojo out-of-process; `automation/v1`
do app-server é ponte interna do agente, exige sessão). Para render 100% local
sem app: compor com ffmpeg embutido a partir do draft (subconjunto de features
sem shaders proprietários do CapCut — ver scripts do capcut-draft-core).

### Integração com agente SDK próprio

A pasta da skill é autocontida (SKILL.md + scripts stdlib/pywinauto) — qualquer
harness que leia SKILL.md e execute Python/CLI usa. Recomendações: rode
`state()`/`shot()` a cada passo, nunca confie em coordenadas sem verificar o
screenshot, e trate o paywall como estado de negócio (não falha).

## Componentes de export observados

`vesdk.ini` (84 chaves — `evidence\catalogs\vesdk-summary.md`): `encoder=auto`,
`rctype=7`, `crf=17`, `preset=4`, `d3d11_prefered_renderer=1`,
`disable_dx12_playback=1`, flags NV/AMF/HEVC. `ve_ab_conf.ini` (~125 flags A/B:
decoder bytevc1, SVT-AV1, matting async, export VBR).

## Contas/carimbo

`tt_c2pa_sdk.dll` (content provenance) e watermark: `globalSetting.needWaterMark=false`
nesta instalação; exports podem carregar metadados C2PA do CapCut.
