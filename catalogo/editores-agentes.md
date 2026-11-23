# Editores de vídeo agent-native (por app)

**54 skills** · [← voltar ao índice](../README.md)

---

## openstoryline-install

**O que cria:** Instala/configura/inicia o FireRed-OpenStoryline local (venv, modelos .storyline, config.toml, MCP+web).

**Chaves técnicas:** pré-requisitos git/Python 3.11/ffmpeg/wget/unzip; venv repo-local + requirements + download.sh (modelo transnetv2 + resource/bgms); update_config.py --set llm/vlm model/base_url/api_key; verificação pip check + load_settings; MCP :8001 e uvicorn :8005 como processos long-running.

**Origem:** FireRed-OpenStoryline · [https://github.com/FireRedTeam/FireRed-OpenStoryline](https://github.com/FireRedTeam/FireRed-OpenStoryline)

**Como instalar:** `git clone https://github.com/FireRedTeam/FireRed-OpenStoryline` → copie `<repo>/.claude/skills/openstoryline-install/` para `~/.claude/skills/`

---

## openstoryline-use

**O que cria:** Usa o OpenStoryline instalado — sessão de edição por linguagem natural, multi-turno, validação do MP4.

**Chaves técnicas:** sessão via POST /api/sessions (session_id reutilizável); upload via /media ou cp para outputs/{session}/media; bridge_openstoryline.py --prompt --lang zh/en; pipeline filter_clips→group_clips→generate_script→generate_voiceover→render_video; regras de processo long-running (exec+PTY, poll de logs, nunca head/grep/timeout/pkill).

**Origem:** FireRed-OpenStoryline · [https://github.com/FireRedTeam/FireRed-OpenStoryline](https://github.com/FireRedTeam/FireRed-OpenStoryline)

**Como instalar:** `git clone https://github.com/FireRedTeam/FireRed-OpenStoryline` → copie `<repo>/.claude/skills/openstoryline-use/` para `~/.claude/skills/`

---

## ai_transition_editing_skill

**O que cria:** Workflow OpenStoryline que costura clipes com transições geradas por IA (sem legenda/dublagem).

**Chaves técnicas:** cadeia search_media→load_media→split_shots→understand_clips→filter_clips→group_clips (ordenação p/ transições)→generate_ai_transition (x-1 transições geradas de uma vez, custo alto, confirmação antes)→select_bgm→plan_timeline_ai_transition→render_video.

**Origem:** FireRed-OpenStoryline · [https://github.com/FireRedTeam/FireRed-OpenStoryline](https://github.com/FireRedTeam/FireRed-OpenStoryline)

**Como instalar:** `git clone https://github.com/FireRedTeam/FireRed-OpenStoryline` → copie `<repo>/.storyline/skills/ai_transition_editing_skill/` para `~/.claude/skills/`

---

## create_profile_style_skill

**O que cria:** Meta-skill que extrai o estilo de edição atual e o codifica como skill reutilizável em .storyline/skills/.

**Chaves técnicas:** análise por dimensões (pacing jump-cut vs longa, narrativa linear/flashback/montagem musical, densidade de SFX, estilo de legenda, LUTs, preferências tipo "deletar silêncio"/"B-roll a cada 5s"); template SKILL.md com 5 seções (princípios/áudio/visual/ritmo/tools); write_skills; versionamento em regravação.

**Origem:** FireRed-OpenStoryline · [https://github.com/FireRedTeam/FireRed-OpenStoryline](https://github.com/FireRedTeam/FireRed-OpenStoryline)

**Como instalar:** `git clone https://github.com/FireRedTeam/FireRed-OpenStoryline` → copie `<repo>/.storyline/skills/create_profile_style_skill/` para `~/.claude/skills/`

---

## default_editing_workflow_skill

**O que cria:** Workflow genérico de edição OpenStoryline para vlog/dia a dia ou pedido vago.

**Chaves técnicas:** cadeia search_media→load_media→split_shots→understand_clips→filter_clips→group_clips→generate_script (com subtitle_imitation para estilo)→elementos (花字/título/efeitos/voz)→generate_voiceover→select_BGM→plan_timeline→render_video.

**Origem:** FireRed-OpenStoryline · [https://github.com/FireRedTeam/FireRed-OpenStoryline](https://github.com/FireRedTeam/FireRed-OpenStoryline)

**Como instalar:** `git clone https://github.com/FireRedTeam/FireRed-OpenStoryline` → copie `<repo>/.storyline/skills/default_editing_workflow_skill/` para `~/.claude/skills/`

---

## speech_rough_cut_skill

**O que cria:** Rough cut por áudio (ASR) — extrai trechos valiosos de vídeo falado e corta redundância.

**Chaves técnicas:** split_shots skip→asr (texto + timestamps)→speech_rough_cut (segmentação do corte)→elementos sem TTS/BGM/transição→plan_timeline is_speech_rough_cut=True→render mantendo áudio original; reexecução com user_request se o texto cortado não fluir.

**Origem:** FireRed-OpenStoryline · [https://github.com/FireRedTeam/FireRed-OpenStoryline](https://github.com/FireRedTeam/FireRed-OpenStoryline)

**Como instalar:** `git clone https://github.com/FireRedTeam/FireRed-OpenStoryline` → copie `<repo>/.storyline/skills/speech_rough_cut_skill/` para `~/.claude/skills/`

---

## subtitle_imitation_skill

**O que cria:** Imita o estilo de um texto de referência para gerar narração estilizada ancorada no conteúdo real dos clipes.

**Chaves técnicas:** desconstrução do estilo (padrões de frase, retórica, tom emocional); regra anti "看图说话" (proibida descrição mecânica "a cena mostra"); script obrigatoriamente baseado em understand_clips + group_clips; saída group_scripts {group_id, raw_text} → generate_script custom_script.

**Origem:** FireRed-OpenStoryline · [https://github.com/FireRedTeam/FireRed-OpenStoryline](https://github.com/FireRedTeam/FireRed-OpenStoryline)

**Como instalar:** `git clone https://github.com/FireRedTeam/FireRed-OpenStoryline` → copie `<repo>/.storyline/skills/subtitle_imitation_skill/` para `~/.claude/skills/`

---

## openchatcut

**O que cria:** Ponto de entrada MCP para agentes instalarem/conectarem e editarem projetos do OpenChatCut (editor local agent-native).

**Chaves técnicas:** MCP http://localhost:5199/api/external-mcp/mcp; openchatcut_status→list_projects→load_skill (progressive exposure, tools/list_changed); begin_edit_session (editSessionId, reuseExisting, approvalMode manual/auto); review_edit_session até status applied; recover_edit_session só com recoveryActions listado; referências getting-started/editing-workflow/known-errors.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/skills/openchatcut/` para `~/.claude/skills/`

---

## ai-cinematic-short-film

**O que cria:** Planeja curta-metragem com IA — story, shot list, prompts por toma e continuidade visual.

**Chaves técnicas:** brief (premissa/emocão/aspect/duração/ending); estrutura hook→setup→escalação→payoff→beat final; style bible (mundo/personagem/cor/lente/câmera/movimento/luz/continuidade); shot list com propósito/duração/ação/movimento de câmera/notas de prompt/continuidade; prompts por toma (sujeito/ação/ambiente/câmera/luz/mood/constraints negativas); reference frames só p/ continuidade.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/ai-cinematic-short-film/` para `~/.claude/skills/`

---

## asset-import

**O que cria:** Importa mídia para a biblioteca do projeto OpenChatCut — arquivos locais, URLs públicas ou transfer externo.

**Chaves técnicas:** upload local com transcode condicional (≤1920 long edge, codec browser-friendly, ~8Mbps) + extração de áudio + ASR automático; download_media para URLs públicas; import_media create_session (slot de upload com headers/byte count exatos) + finalize_uploaded_asset + transcribe_track separado; disciplina: importar originais e compor só na timeline (nunca pre-concatenar/queimar legenda).

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/asset-import/` para `~/.claude/skills/`

---

## batch-montage-variants

**O que cria:** Gera N cortes distintos publicáveis do mesmo pool de mídia — matriz de variação, teste de ganchos, adaptações de plataforma.

**Chaves técnicas:** modos distinct cuts / controlled hook test (só o gancho muda, corpo fixo) / platform adaptations; variation matrix (gancho, order signature, ritmo, duração, packaging, dimensão de diferença); dedup budget com separação mínima por par; primeiros 3s sempre diferentes em cuts/hook tests; nomear timelines topic-vNN-hook; QA por corte e no conjunto com par mais similar reportado.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/batch-montage-variants/` para `~/.claude/skills/`

---

## beat-sync-montage

**O que cria:** Montagem dirigida pela música — densidade por seção, âncoras em downbeats, sem metrônomo mecânico.

**Chaves técnicas:** analyze_music (BPM/meter/seções/energia); arco de densidade sparse/medium/dense/rest por seção; 3-6 âncoras em downbeat/fronteira de seção; preenchimento não uniforme entre âncoras; breathing room (≥1 take seguro por 15s); checagem de continuidade de movimento (eixo/direção de tela); music_edit_plan + sync_cuts_to_music com analysisRef; hook no primeiro downbeat ≤3s.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/beat-sync-montage/` para `~/.claude/skills/`

---

## create-motion-graphics

**O que cria:** Autoria direta de Motion Graphics em JSX inline no OpenChatCut (create_motion_graphic_from_code / edit_asset).

**Chaves técnicas:** design do frame assentado antes de animar; gates de estilo (Design Style presets via manage_design_style, representative-MG gate); contrato de código Remotion-like (useCurrentFrame, interpolate, interpolateColors, spring, Easing, Sequence; sem export/TS/Sequence interno; root div com inset:0); props editáveis item.props (text/number/color/boolean/select/font/image/video); fontes via search_fonts (Google Fonts, nunca fontes locais); regras anti-slop (sem gradiente roxo/azul default, glassmorphism gratuito, card-shape default, glow/shine sem propósito); text layout com flex/grid + wrap e headroom p/ animação.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/create-motion-graphics/` para `~/.claude/skills/`

---

## ecommerce-product-montage

**O que cria:** Monta footage de produto/UGC em montagem de conversão com espinha de venda hook→dor→demo→prova→CTA.

**Chaves técnicas:** inventário por papel de venda (hero demo, reação UGC, prova/review, b-roll de contexto, card de preço); espinha: hook 0-3s (open loop ou payoff real, nunca logo sting)→dor/contexto→demo onde há curiosidade→prova como pattern interrupt→CTA legível (preço/oferta/ação cada um com beat próprio); QA: espectador frio cita oferta e ação após 1 exibição; claims sempre ancoradas no material (sem preço/garantia inventados).

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/ecommerce-product-montage/` para `~/.claude/skills/`

---

## explainer-video (OpenChatCut)

**O que cria:** Produz vídeo explicativo completo — plano por seções, modo de narração, timing, montagem e QA.

**Chaves técnicas:** labels de plano (explainer_start, source_structure, narration_mode generated_tts/existing_voiceover/transcript_only/none, visual_mode); Animation Reference Gate + MG Direction Gate; Voice Gate (audição antes de submit_voice); regra dura: duração de MG = duração real do áudio da narração (nunca estimativa de script); Narration-Visual Sync QA (cobertura, densidade de informação, transições cedo/tarde); sem frases faladas inteiras na tela (labels/números/perguntas curtas).

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/explainer-video/` para `~/.claude/skills/`

---

## export

**O que cria:** Exporta/renderiza timelines do OpenChatCut — vídeo, áudio, SRT/XML e ProRes transparente de motion graphics.

**Chaves técnicas:** submit_export (h264/vp8, 24-60fps, mp3) + track_export (status/wait 20s); download p/ pasta Downloads com checagem de .crdownload e nomes numerados; XML fcp_xml/fcp_xml_resolve; subtitles srt/txt com word timing real; export_motion_graphic_prores 4444 + motionGraphicRenderKeys p/ XML; render local headless Chrome sobre o mesmo estado da timeline.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/export/` para `~/.claude/skills/`

---

## image-gen

**O que cria:** Geração de imagens IA no OpenChatCut — Fal.ai, gpt-image-2, nano-banana, MiniMax image-01, Grok Imagine.

**Chaves técnicas:** submit_image com aspectRatio 9:16/1:1/16:9..., imageSize 512px-4K, quality low/high; seleção de modelo: gpt-image-2 (melhor texto/prompt adherence, 16 refs), nano-banana (fidelidade a referência, 14 refs), image-01 MiniMax (1 ref via R2), grok-imagine (≤4 outputs, 1K/2K); referenceAssetIds resolvidos server-side; count até 10; seed/mask/background/moderation.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/image-gen/` para `~/.claude/skills/`

---

## known-errors

**O que cria:** Catálogo de erros conhecidos das ferramentas OpenChatCut e seus fixes.

**Chaves técnicas:** shape raw de edit_item {json:"{\"updates\":[...]}", adds}; overlap → retry com trackId explícito; push_asset só http(s) público, MG via create_motion_graphic_from_code; conversão de vídeo falha → re-encode ffmpeg local (não re-importar); MG: root div (não AbsoluteFill), evitar variável local "scale"; frames blob: vazios = upload em andamento, não bug.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/known-errors/` para `~/.claude/skills/`

---

## livestream-to-clips

**O que cria:** Corta gravação de livestream em clipes prontos por evidência multi-sinal (fala, visual, áudio, interação, metadata).

**Chaves técnicas:** stream map hierárquico (transcript em ranges + perfil/confiança por seção); descoberta de eventos por 5 sinais independentes; arco candidato (setup→trigger→peak→reação→outcome); evidence ledger JSON (sourceRange, evidence, hook, riskFlags); gates de rejeição (payoff ausente, frames pretos/congelados, números não resolvidos); reframing landscape→vertical por segmento (crop cover p/ close-up, wide p/ slide/UI); view_asset_frames contact sheet ≤6 amostras; materialização automática saveToMediaPool:true.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/livestream-to-clips/` para `~/.claude/skills/`

---

## long-video-to-shorts

**O que cria:** corta um vídeo longo (podcast/aula/live) em shorts/reels selecionando momentos autocontidos.

**Chaves técnicas:** seleção por transcript (hook/claim/proof/emotional turn/payoff), plano compacto por clipe, corte em word/phrase/beat boundaries, packaging por plataforma (crop, title text, styled captions, zooms, speed changes), regra "preview 1 clipe forte antes de batch".

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/long-video-to-shorts/` para `~/.claude/skills/`

---

## motion-graphic-placement

**O que cria:** planeja onde e que tipo de motion graphics inserir sem bloquear a história.

**Chaves técnicas:** gatilhos semânticos (quote card, number card/counter, price card, point list/flow steps/timeline, comparison/VS card, warning badge, question card, lower-third, source card, CTA card); densidade short-form 1 MG/3-5s; portrait: 15-20% inferior livre p/ legendas; split_item p/ editar MG aprovado sem regerar.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/motion-graphic-placement/` para `~/.claude/skills/`

---

## multi-clips-to-reels

**O que cria:** transforma múltiplos clipes/ativos crus em reels/montagens com seleção e sequência.

**Chaves técnicas:** papéis por ativo (hook, context, proof, demo, payoff, end card, logo/QR, audio bed), starting points (open_media_reel, script_or_storyboard, asset_pack_promo, highlight_selection), arco hook→context→proof→payoff, beat sync, speed ramps, zooms, regra "shot mais forte primeiro".

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/multi-clips-to-reels/` para `~/.claude/skills/`

---

## music-intelligence

**O que cria:** análise local de música (Beat This + CLAP) e cortes/fotos sincronizados a beat/downbeat/seção.

**Chaves técnicas:** analyze_music/inspect_music (BPM, meter, tags, sections), music_edit_plan, music_image_plan, sync_cuts_to_music, sync_images_to_music, timing:auto sparse/medium/dense (seção→downbeat→beat), plan limitado a 96 cortes, batch como um undo.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/music-intelligence/` para `~/.claude/skills/`

---

## music (OpenChatCut · Mureka)

**O que cria:** geração de música via Mureka/MiniMax/Atlas/Sonilo (instrumental, song, soundtrack, stems).

**Chaves técnicas:** submit_music + track_progress; modos Mureka instrumental/song/prompt-song/soundtrack (score por imagem/vídeo)/track (stem por tipo: Drums etc.), MiniMax t2m/cover com lyricsOptimizer, Sonilo v2m (música condicionada pelo corte renderizado).

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/music/` para `~/.claude/skills/`

---

## news-rough-cut

**O que cria:** rough cut de notícias fiel ao material original, sem música/VO/SFX.

**Chaves técnicas:** abertura com o resultado principal (sem铺垫), regras de retenção/deleção por valor informacional, corte semântico por frase completa via word-level transcript, fadeIn/out apenas p/ suavizar cortes, pipeline determinístico + checklist de aceitação.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/news-rough-cut/` para `~/.claude/skills/`

---

## openchatcut-plugin-basics

**O que cria:** contexto base de operação do OpenChatCut (modelo projeto/track/item, onboarding, handoff, limites do agente).

**Chaves técnicas:** data model (project/timeline/track/item, frame-native), ordem de edição estrutura→timing→acabamento, ripple só na mesma track, Design Style consistente em batch, view_asset_frames (fonte) vs view_timeline_frames (composto), nunca entregar MP4 achatado no lugar do timeline editável.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/openchatcut-plugin-basics/` para `~/.claude/skills/`

---

## product-ad-video-script

**O que cria:** transforma produto/página/oferta em ângulos de anúncio, hooks, cenas e CTA.

**Chaves técnicas:** extração problema/outcome/objeção/diferenciador, 2-4 ad angles via references/ad-script-framework.md, estrutura hook→problem→demo/proof→benefit→objeção→CTA, mapeamento beat→visual, QA de claims sem inventar preços/garantias.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/product-ad-video-script/` para `~/.claude/skills/`

---

## product-help

**O que cria:** base de conhecimento do produto OpenChatCut (UI, providers, chaves) p/ guiar operações GUI.

**Chaves técnicas:** nenhum efeito de vídeo; referências ui-and-features.md, providers-and-keys.md, generation-capabilities.md, generation-official-docs.md; fallback manual quando o agente não pode executar.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/product-help/` para `~/.claude/skills/`

---

## shader-gen

**O que cria:** gera shaders WebGL de efeitos/transições/máscaras/color grade de vídeo.

**Chaves técnicas:** builtin:zoom track-bound (magnification 1-4, shape punch/hold/slow-push/instant, focalPoint, easeIn/Out frames, punch zoom no beat), LUTs .cube (assetId literal "lut", intensity 0-1), transições crossfade/dissolve/cube/flip com validação de seam, item-bound vs track-bound, submit_shader com referenceAssetIds.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/shader-gen/` para `~/.claude/skills/`

---

## skill-creator

**O que cria:** cria/melhora skills customizadas do OpenChatCut (SKILL.md + references/).

**Chaves técnicas:** anatomia SKILL.md (description como gatilho com frases do usuário), corpo <200 linhas com referências on-demand, slug whitelist, test prompts 2-3, manage_skill create/update, progressive disclosure via load_skill.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/skill-creator/` para `~/.claude/skills/`

---

## storyboard-shot-breakdown

**O que cria:** analisa vídeo shot-a-shot e produz storyboard com a lógica de direção.

**Chaves técnicas:** 5 dimensões por shot (composição, focal length, movimento, corte, função narrativa), teste contrafactual ("o que se perde com a alternativa"), formato S{N} + Director's Logic + Visual Rule reutilizável.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/storyboard-shot-breakdown/` para `~/.claude/skills/`

---

## talking-head-guide

**O que cria:** guia de edição de vídeo de pessoas falando (A-roll, MG, B-roll, música, legendas, voice isolation).

**Chaves técnicas:** A-roll por transcript (cleanup de fillers um/uh vs conectores contextuais, retakes/false starts, extrair highlight, reestruturar), pausas: comprimir >0.8-1s p/ ~0.3s, 0.3-0.5s entre frases, clean_script silence rules (compress/restore/normalize/range), ordem de dependência A-roll→MG/B-roll/música/legendas, DeepFilterNet3 voice isolation.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/talking-head-guide/` para `~/.claude/skills/`

---

## transcription

**O que cria:** fluxo de transcrição ASR do OpenChatCut + legendas + retry de ASR travado.

**Chaves técnicas:** import_media→track_progress(action:wait), find_transcript, edit_captions enable, manage_transcript retry_transcription, threshold de espera max(5min, min(60min, 2×duração)), word timestamps como base das captions.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/transcription/` para `~/.claude/skills/`

---

## verification

**O que cria:** níveis de verificação (L0-L2) de que edições refletem no projeto/editor.

**Chaves técnicas:** read_project p/ estrutura + view_timeline_frames como prova visual em frames exatos (30/45/75), view_asset_frames contact-sheet de fonte, conferência do transcript do agente (erros não reportados = falha), checar fps antes de falar em segundos.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/verification/` para `~/.claude/skills/`

---

## video-gen

**O que cria:** geração de clipes AI (Seedance2/Kling/Hailuo/Grok/OFox/Fal) com alinhamento e âncoras de consistência.

**Chaves técnicas:** submit_video com first/last frame, multi-shot num clipe vs múltiplos clipes, âncoras de consistência (@Image1, negações explícitas, posicionais left/right p/ multi-personagem), regra "2 ajustes de texto falhou → trocar âncora/edit mode", ratio 9:16 via manage_timelines + fit:cover.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/video-gen/` para `~/.claude/skills/`

---

## video-thumbnail-generator

**O que cria:** cria thumbnails/capas a partir de frames reais do vídeo.

**Chaves técnicas:** inspeção de frames candidatos (rosto expressivo, produto/UI, ação dramática), classificação do job, estilos via references/thumbnail-styles.md + thumbnail-style-recipes.md, texto 2-5 palavras alta legibilidade mobile, prompt shape COMPOSITION/REAL REFERENCE/TEXT/STYLE/CONSTRAINTS, ratios por plataforma (9:16 Shorts/TikTok).

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/video-thumbnail-generator/` para `~/.claude/skills/`

---

## voice

**O que cria:** TTS/voiceover com sincronização ao vídeo + SFX custom via submit_voice.

**Chaves técnicas:** providers (elevenlabs, doubao, minimax, inworld, fishaudio, speechify, openai, gemini, mistral, cartesia); ElevenLabs eleven_v3 com tags inline ([happy], [excited], [whispers], [laughs], [short pause], [slowly], [strong X accent]); Doubao speedRatio/loudnessRatio/pitch; audição de vozes por widget com samples reais; references/video-sync.md p/ manter VO alinhado após retime visual.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/voice/` para `~/.claude/skills/`

---

## widget-forms

**O que cria:** formulários estruturados in-chat (ask_followup_questions) p/ coletar input do usuário.

**Chaves técnicas:** campos single/multi/text/visual/voice/scenario, máximo 12 campos, opção __other__, voice cards com audioUrl, scenario cards com ids canônicos (talking-head, motion-graphics, app-promo...), sem upload em form.

**Origem:** OpenChatCut · [https://github.com/0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut)

**Como instalar:** `git clone https://github.com/0xsline/OpenChatCut` → copie `<repo>/src/agent/skills/widget-forms/` para `~/.claude/skills/`

---

## manage-storyboard-projects

**O que cria:** Gerencia projetos de storyboard via MCP do Agent Storyboard (criar/buscar/atualizar/apagar sem browser).

**Chaves técnicas:** create_storyboard_project único com shots completos (rollType A-ROLL/B-ROLL, mediaType, duration, dialogue, visualPrompt, generator manual/image-gen/hyperframes/remotion, notes), update_storyboard_project (appendShots/shotUpdates/deleteShotIds/designPath), open_storyboard, arranjo visual director-style com write-back.

**Origem:** agent-storyboard · [https://github.com/Yuuhann1999/agent-storyboard](https://github.com/Yuuhann1999/agent-storyboard)

**Como instalar:** `git clone https://github.com/Yuuhann1999/agent-storyboard` → copie `<repo>/plugins/agent-storyboard/skills/manage-storyboard-projects/` para `~/.claude/skills/`

---

## process-storyboard-tasks

**O que cria:** Processa a fila de geração de imagem/vídeo do Agent Storyboard com claim/complete e gates de B-roll.

**Chaves técnicas:** heartbeat a cada 10min (tasks expiram em 30min), gate plan_broll_motion obrigatório com política reuse-first (templates locais + repos hyperframes-launches/video-shotcraft), brollType/semanticStructure (contraste/agregação/filtragem/hierarquia/causal/troca/expansão), verificação técnica de MP4 (dimensão/duração/codec + frames não vazios), generate_storyboard_image com DESIGN.md, proibição de npx/dlx como probe.

**Origem:** agent-storyboard · [https://github.com/Yuuhann1999/agent-storyboard](https://github.com/Yuuhann1999/agent-storyboard)

**Como instalar:** `git clone https://github.com/Yuuhann1999/agent-storyboard` → copie `<repo>/plugins/agent-storyboard/skills/process-storyboard-tasks/` para `~/.claude/skills/`

---

## cartcut-editing

**O que cria:** Edita no app Cartcut via MCP: corte por transcrição, legendas, títulos e formas na timeline ao vivo.

**Chaves técnicas:** get_transcript (granularidade word, confidence por palavra, diarização por speaker), analyze_audio (silêncios, onsets, beats medidos — nunca bpm calculado), remove_ranges único com ripple, style profiles (paddingMs, maxSilenceMs, onEmphasis), add_subtitles/add_text/add_shape lower-third, get_contact_sheet p/ verificar composição renderizada, regras (não cortar dentro de palavra, trim de pausa não deletar, movimento termina antes do corte).

**Origem:** cartcut · [https://github.com/cartesiancs/cartcut](https://github.com/cartesiancs/cartcut)

**Como instalar:** `git clone https://github.com/cartesiancs/cartcut` → copie `<repo>/plugins/cartcut-editing/skills/cartcut-editing/` para `~/.claude/skills/`

---

## capsule-cinema

**O que cria:** Estúdio local orientado a "capsules" (receitas reutilizáveis) para vídeos AI: storyboard→geração→montagem→QA→release.

**Chaves técnicas:** run_video/run_scene/run_concat, analyze_video_to_capsule, validate_storyboard, run_consistency_qa, local_video_qa, score_video_quality, build_edit_plan/validate_edit_plan, plan_repairs, release_checkpoint, gate de cena difícil representativa antes do batch, tool_registry/tool_capabilities, capsule_package_create/pack/install, contratos content_scope.

**Origem:** cheap-claude-video

**Como instalar:** Coleção local em `editor-chefe/skills/cheap-claude-video/` (sem remote) — copie `skills/capsule-cinema/` para `~/.claude/skills/`

---

## chengfeng-check-updates

**O que cria:** Gerenciador de ambiente do plugin Chengfeng VideoCut: checa atualização de skills e instala/verifica o Runtime.

**Chaves técnicas:** check-plugin-update.cjs (snapshotRevision/contentRevision/SHA-256, ativação com rollback CAS), ensure-runtime.cjs (runtime desktop-managed com Bun/FFmpeg/FFprobe embutidos), doctor --json, credencial de transcrição via videocut-cli config set, fail-closed com Git proof.

**Origem:** chengfeng-videocut-skills · [https://github.com/Agentchengfeng/chengfeng-videocut](https://github.com/Agentchengfeng/chengfeng-videocut)

**Como instalar:** `git clone https://github.com/Agentchengfeng/chengfeng-videocut` → copie `<repo>/plugins/chengfeng-videocut/skills/chengfeng-check-updates/` para `~/.claude/skills/`

---

## chengfeng-cut

**O que cria:** Corta 口播 (fala em vídeo chinês) sem tocar mídia: transcrição por palavra → dicionário → 5 varreduras → ledger de cortes revisado no Studio.

**Chaves técnicas:** transcript dictionary (dicionário geral + usuário), transcript align/correct, playback order como fonte de verdade, 5 varreduras (repetições, frases truncadas, erros corrigidos, engasgos em inglês, vícios de linguagem), ledger cutWordIds com kind/risk, duas tabelas (cortes + frases repetidas), auto-leitura de verificação, Studio review com CAS revisions.

**Origem:** chengfeng-videocut-skills · [https://github.com/Agentchengfeng/chengfeng-videocut](https://github.com/Agentchengfeng/chengfeng-videocut)

**Como instalar:** `git clone https://github.com/Agentchengfeng/chengfeng-videocut` → copie `<repo>/plugins/chengfeng-videocut/skills/chengfeng-cut/` para `~/.claude/skills/`

---

## chengfeng-export

**O que cria:** Exporta o corte em MP4 queimando cortes, push-in, legendas e camada visual HTML via Chrome + FFmpeg.

**Chaves técnicas:** export --dry-run (warnings de legendas/layer cortadas antes de codificar), --scale 2 (legendas/animação re-renderizadas no tamanho de saída — nitidez onde o olho lê), pipeline assemble→overlay→compose→verify, artefatos --keep-work (assembled.mkv / overlay PNGs / spans.mp4) p/ isolar a camada do erro, troca de fonte via hardlink + sha256, verificação por extração de frames ffmpeg com landmarks discriminativos, GSAP timeline paused p/ módulos com seek.

**Origem:** chengfeng-videocut-skills · [https://github.com/Agentchengfeng/chengfeng-videocut](https://github.com/Agentchengfeng/chengfeng-videocut)

**Como instalar:** `git clone https://github.com/Agentchengfeng/chengfeng-videocut` → copie `<repo>/plugins/chengfeng-videocut/skills/chengfeng-export/` para `~/.claude/skills/`

---

## chengfeng-report-bug

**O que cria:** padroniza sanitização, confirmação do usuário e abertura de GitHub Issue de bugs do chengfeng-videocut.

**Chaves técnicas:** diagnóstico mínimo readback; JSON schemaVersion draft/submit; sanitização de chaves/paths; confirmationToken 30min; dedupe por fingerprint

**Origem:** chengfeng-videocut-skills · [https://github.com/Agentchengfeng/chengfeng-videocut](https://github.com/Agentchengfeng/chengfeng-videocut)

**Como instalar:** `git clone https://github.com/Agentchengfeng/chengfeng-videocut` → copie `<repo>/plugins/chengfeng-videocut/skills/chengfeng-report-bug/` para `~/.claude/skills/`

---

## chengfeng-subtitle

**O que cria:** gera legendas por tela do vídeo já cortado, recalculando tempos do ledger em vez de retranscrever.

**Chaves técnicas:** tempo por cálculo ledger+word-ids (não salva segundos); dicionário de termos normalize; 4 regras de quebra de tela (edição→pontuação→parágrafo+pausa→silêncio longo); merge de fragments; stale/tooFast por tela; revisão no Studio

**Origem:** chengfeng-videocut-skills · [https://github.com/Agentchengfeng/chengfeng-videocut](https://github.com/Agentchengfeng/chengfeng-videocut)

**Como instalar:** `git clone https://github.com/Agentchengfeng/chengfeng-videocut` → copie `<repo>/plugins/chengfeng-videocut/skills/chengfeng-subtitle/` para `~/.claude/skills/`

---

## chengfeng-videocut-workbench

**O que cria:** opera projeto existente do chengfeng-videocut via Runtime CLI (overlay de vídeo, remoções, EDL split/move, canvas fit) com readback.

**Chaves técnicas:** overlay visual ligado a word-id (não alonga timeline); distinguir overlay vs insert com defasagem; split/trim/move de segmentos estilo magnetic timeline; canvas vs media fit; readback após cada patch

**Origem:** chengfeng-videocut-skills · [https://github.com/Agentchengfeng/chengfeng-videocut](https://github.com/Agentchengfeng/chengfeng-videocut)

**Como instalar:** `git clone https://github.com/Agentchengfeng/chengfeng-videocut` → copie `<repo>/plugins/chengfeng-videocut/skills/chengfeng-videocut-workbench/` para `~/.claude/skills/`

---

## chengfeng-visual

**O que cria:** cria camadas HTML anotativas (círculos, animações de tela inteira, zoom) sobre a screencast do narrador, ligadas às telas de legenda.

**Chaves técnicas:** camada por cue de legenda (tempo calculado); diff de pixels entre frames p/ janela estável e momento de interação; círculo por varredura em escala de cinza; zoom ≤1.6x centrado 62.5%; validação por pixel (não DOM); glyphs de marca do simple-icons (nunca redesenhar logo)

**Origem:** chengfeng-videocut-skills · [https://github.com/Agentchengfeng/chengfeng-videocut](https://github.com/Agentchengfeng/chengfeng-videocut)

**Como instalar:** `git clone https://github.com/Agentchengfeng/chengfeng-videocut` → copie `<repo>/plugins/chengfeng-videocut/skills/chengfeng-visual/` para `~/.claude/skills/`

---

## ian-xiaohei-svg-motion

**O que cria:** reconstrói cenas em HTML/SVG/GSAP estilo quadrinho Xiaohei (personagem preto) para animar conceitos de narração.

**Chaves técnicas:** grupos SVG semânticos (não vetorizar PNG); metáfora física única (carregar, atravessar, vazar); GSAP timeline x/y/rotation/scale/stroke-drawing; 16:9 branco 35% whitespace; 3-5 anotações manuscritas; cue-map p/ legendas; QA ?static=1/?frame=mid

**Origem:** chengfeng-videocut-skills · [https://github.com/Agentchengfeng/chengfeng-videocut](https://github.com/Agentchengfeng/chengfeng-videocut)

**Como instalar:** `git clone https://github.com/Agentchengfeng/chengfeng-videocut` → copie `<repo>/plugins/chengfeng-videocut/skills/chengfeng-visual/animation-styles/ian-xiaohei-svg-motion/` para `~/.claude/skills/`

---

## editor-de-video

**O que cria:** editor de vídeo PT-BR no Claude Code: corte pela fala, legenda palavra a palavra que sobe, telas/efeitos prontos que entram na palavra dita, som desenhado e aprendizado de estilo por referências.

**Chaves técnicas:** receitas (rosto e ideia, tela dividida, motion de produto, conversa crua, bastidor de tela); efeitos prontos (print vivo 3D, tela do assunto, checklist, holofote, comentário, contador, hodômetro, caixa, logo no traço, texto cinético, antes e depois, timeline em chamas) com "quando": palavra#n; corte só em pausa real (volume+agudos); qa.py reouve ≥97%; som desenhado −14 LUFS; efeito grande a cada ~6s

**Origem:** editor-video-ia

**Como instalar:** Coleção local em `editor-chefe/skills/editor-video-ia/` (sem remote) — copie `.claude/skills/editor-de-video/` para `~/.claude/skills/`

---

## hypit

**O que cria:** framework de direção/produção Hypit: media gerada + componentes autorais em Timeline/Canvas semânticos com Brief/Treatment/Analysis.

**Chaves técnicas:** organização por components com boundaries por comportamento; direção de imagem/vídeo/voz com Kits e Recipes; leitura de referência com grids vinculados a transcript; A-roll como performance; WhisperX p/ timing semântico; Profile/credential stores; Builds/Run Candidates; snapshots e Studio review.

**Origem:** hypit · [https://github.com/hypit-ai/hypit](https://github.com/hypit-ai/hypit)

**Como instalar:** `git clone https://github.com/hypit-ai/hypit` → copie `<repo>/skills/hypit/` para `~/.claude/skills/`

---

## mortiflix

**O que cria:** guia do CLI mortiflix — instalação, setup de partes, gates de revisão com o dono até a entrega.

**Chaves técnicas:** mortiflix list/new/review/status/doctor, gates de aprovação (respond --approve/--changes), backends claude-code/anthropic-api/demo, recording booth, MIDI pack import, publish uploadpost

**Origem:** mortiflix-oss · [https://github.com/GTKottman/mortiflix-oss](https://github.com/GTKottman/mortiflix-oss)

**Como instalar:** `git clone https://github.com/GTKottman/mortiflix-oss` → copie `<repo>/plugin/skills/mortiflix/` para `~/.claude/skills/`

---

## narrator-ai-cli

**O que cria:** CLI de API chinesa que gera vídeo de comentário/dublagem de filmes automaticamente (material→roteiro→composição).

**Chaves técnicas:** material library (~100 filmes+PDF SRT), fast-writing/standard path, voice-clone, TTS, BGM/dubbing/narration-styles, magic-video templates, polling 5s, custos em pontos

**Origem:** narrator-ai-cli-skill

**Como instalar:** Coleção local em `editor-chefe/skills/narrator-ai-cli-skill/` (sem remote) — copie `SKILL.md/` para `~/.claude/skills/`

