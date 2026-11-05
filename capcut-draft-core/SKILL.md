---
name: capcut-draft-core
description: Ler, validar, criar e editar projetos do CapCut Desktop (draft_content.json) programaticamente — criar projeto novo, inspecionar tracks/materials, salvar com backup e validar. Use quando o pedido envolver manipular um projeto CapCut por arquivo (sem abrir a interface), automatizar edição de vídeo via drafts, ou inspecionar/recuperar projetos. Não use para controlar o CapCut aberto via IPC (use capcut-agent-ipc) nem para exportar/renderizar vídeo.
---
> **Uso global (qualquer pasta):** os caminhos absolutos funcionam de qualquer
> diretório — `python "C:\Users\Conectare\.claude\skills\capcut-draft-core\scripts\<modulo>.py" ...`.
> Módulos disponíveis nesta skill: draft_io.py timeline_ops.py text_ops.py effect_ops.py catalog_local.py make_demo_draft.py.
> Para importar como biblioteca, antes faça `sys.path.insert(0, r"C:\Users\Conectare\.claude\skills\capcut-draft-core\scripts")`.


# CapCut Draft Core

Ferramentas Python para o formato de projeto do CapCut Desktop internacional
(`platform.app_source: "cc"`), versões 6.x–9.x. O projeto (rascunho) é uma pasta
contendo `draft_content.json` + `draft_meta_info.json`, escrito em JSON plaintext
pelo CapCut 9.7 nesta máquina (verificado: `User Data\Projects\com.lveditor.draft`).

## Mental model do formato

- **Tudo em microssegundos inteiros** (`duration`, `target_timerange.start`, etc.).
- **Estrutura flat e desacoplada**: cada `segment` de uma `track` aponta para seu
  material por `material_id`; não carrega o material inline.
- `tracks[]` em **ordem de z-stack** (primeira do array = camada de baixo).
- `segment.extra_material_refs[]` liga **materiais companheiros**: `speeds`,
  `masks`/`common_masks`, `transitions`, `audio_fades`, `material_animations`,
  `canvases`.
- **Texto é JSON-in-JSON**: `materials.texts[].content` é uma *string* contendo
  JSON `{"text","styles",...}`; os `styles[].range` são **byte offsets UTF-16**
  (não caracteres!). Editar à mão quebra o texto silenciosamente — use os helpers.
- Máscaras: **`materials.common_mask[]`** (singular!) no 9.7 — ground truth do
  draft "1104"; `masks[]` é legado.
- Filtros (color grade) vivem em `materials.effects[]` (`type:"filter"`);
  efeitos de cena em `materials.video_effects[]` (`type:"video_effect"`) —
  ambos com ids numéricos de catálogo e `path` para `Cache\effect\<id>\<md5>`.
- Drafts JianYing CN 6.0+ são **criptografados** — nunca confundir com `cc`.

## Scripts desta skill

Rodar a partir do diretório `scripts/` desta skill (imports entre módulos):

```bash
python scripts/draft_io.py info <draft_dir>          # resumo (tracks, materials, duration)
python scripts/draft_io.py validate <draft_dir>      # consistência estrutural
python scripts/draft_io.py backup <draft_dir>        # cópia .backup-TIMESTAMP
python scripts/draft_io.py init <novo_dir> --name X --width 1080 --height 1920 --fps 30
```

API (importável):

```python
from draft_io import (load_draft, save_draft, new_draft, init_draft_dir,
                      validate_draft, find_track, resolve_material,
                      resolve_companions, recompute_duration, us, sec, new_id)
```

## Regras de segurança

1. **Nunca edite o draft aberto no CapCut** — o app sobrescreve `draft_content.json`
   ao salvar e pode regravar o seu arquivo no meio. Feche o projeto no app antes de
   editar, ou trabalhe numa **cópia**.
2. `save_draft` faz backup `.backup-YYYYmmdd-HHMMSS.json` por padrão. Não desligue.
3. Depois de qualquer operação, rode `validate_draft` e confira as issues.
4. Caminhos de mídia nos materiais são absolutos — se mover mídia, atualize os
   materiais (`materials.videos[].path`, `materials.audios[].path`).
5. `draft_meta_info.json` guarda `draft_folder_path`/`draft_root_path` — ao copiar
   um draft para outro lugar, **atualize esses dois campos** para o novo caminho.

## Criar projeto novo instalável no CapCut

```python
draft = new_draft("Meu projeto", width=1080, height=1920, fps=30)
init_draft_dir(r"C:\...\com.lveditor.draft\meu-projeto-001", draft)
```

Para o draft aparecer na lista do app, a pasta precisa estar dentro de
`C:\Users\<user>\AppData\Local\CapCut\User Data\Projects\com.lveditor.draft\`
(path padrão confirmado em `globalSetting.currentCustomDraftPath`). Se o CapCut
estiver aberto, reinicie-o ou atualize a lista de projetos para listar.

## Validação (o que é checado)

- Chaves top-level obrigatórias; `platform.app_source` ∈ {cc, lv}
- Integridade `segment.material_id` → material existe
- `target_timerange.duration` presente
- Texto: `content` é JSON válido e `styles[].range` dentro do texto em bytes UTF-16
- IDs duplicados de material

## Fluxo recomendado

1. `info` → entender o projeto atual
2. cópia/backup se vai editar
3. operações (ver skills irmãs: capcut-timeline-editing, capcut-text-captions,
   capcut-audio, capcut-effects-filters)
4. `validate` → issues == []
5. abrir no CapCut para verificação visual (fechando o projeto antes)

## Limitações conhecidas

- Schema consolidado com **ground truth do draft "1104"** (criado na UI do 9.7,
  2026-11-04) + docs públicas — ver `references\capcut-9.7-schema.md`.
  Transições e ajustes de cor continuam no formato público (não presentes no
  draft de teste) — validar num projeto futuro se necessário.
- Exportação/renderização NÃO é feita por draft JSON (o CapCut renderiza via
  export out-of-process; ver capcut-media-export).
