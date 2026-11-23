# skills-claude-video — o arsenal completo

Catálogo das **310 skills** de produção de vídeo/criação que vivem nesta máquina (22 autorais 🏠 + 288 de coleções open-source estudadas em produção).

Cada skill tem ficha completa: **o que cria**, **chaves técnicas**, **origem** e **como instalar** — nas páginas de `catalogo/`.

## Skills autorais 🏠 (corpo completo neste repo)

Nascidas em produção real de vídeo com agentes (Claude/ZCode SDK). Clone e instale:

| Suíte CapCut (draft JSON + app aberto) | O que faz |
|---|---|
| [`capcut-agent-ipc`](capcut-agent-ipc/SKILL.md) | Controla o CapCut Desktop aberto via IPC nativo (lyra-cli-ipc) — canvas nodes, timeline add-draft, shadow drafts. |
| [`capcut-audio`](capcut-audio/SKILL.md) | Áudio em drafts CapCut por JSON — música/SFX, volume, fades e múltiplas tracks. |
| [`capcut-browser`](capcut-browser/SKILL.md) | Opera o browser gerenciado do agente do CapCut — abrir URL, snapshot acessível, clicar/preencher/rolar. |
| [`capcut-draft-core`](capcut-draft-core/SKILL.md) | Ler/validar/criar/editar projetos CapCut (draft_content.json) programaticamente em Python. |
| [`capcut-effects-filters`](capcut-effects-filters/SKILL.md) | Efeitos visuais em drafts CapCut — transições, efeitos de cena, filtros, animações in/out/combo, cor e matting. |
| [`capcut-media-export`](capcut-media-export/SKILL.md) | Probe de mídia e exportação do CapCut 9.7 — ffmpeg/ffprobe embutidos + automação de export por loop de visão. |
| [`capcut-text-captions`](capcut-text-captions/SKILL.md) | Texto e legendas em drafts CapCut — segmentos estilizados, estilos por trecho e importação de SRT. |
| [`capcut-timeline-editing`](capcut-timeline-editing/SKILL.md) | Editar timeline de draft CapCut por JSON — mídia, split, trim, velocidade, transform e volume. |

| Ofícios & pipelines | O que faz |
|---|---|
| `cel_iphone_html` ([SKILL.md](cel_iphone_html/SKILL.md)) | Réplica fiel de iPhone em HTML/three.js a partir de GLB de teardown — geometria extraída é a fonte da verdade. |
| `reverse-engineer-anything` ([SKILL.md](reverse-engineer-anything/SKILL.md)) | Engenharia reversa de alvos shipped (nativo, Electron/ASAR, APK, firmware, capturas de rede) via MCP REA (207 ferramentas). |
| `heygen-avatar` ([SKILL.md](heygen-avatar/SKILL.md)) | Cria avatar HeyGen persistente (rosto + voz) por prompt ou foto, salvo em AVATAR-<NOME>.md. |
| `heygen-translate` ([SKILL.md](heygen-translate/SKILL.md)) | Traduz/dubla vídeo existente em 175+ línguas com voice cloning e lip-sync. |
| `heygen-video` ([SKILL.md](heygen-video/SKILL.md)) | Gera vídeo de apresentador HeyGen via pipeline v3 Video Agent (Frame Check, prompt craft, avatar/voz). |
| `heygen-nanoclaw` ([SKILL.md](heygen-nanoclaw/SKILL.md)) | Receita container NanoClaw para vídeo com avatar HeyGen via CLI (avatar→voz→script→create→poll→download). |
| `reels-dev-tech` ([SKILL.md](reels-dev-tech/SKILL.md)) | produz Reels 9:16 dev/tech PT-BR (padrão devjuniors7) — README scroll, moldura neon, legenda cinética, 25-35 beats de 1s. |
| `video-campanha-politica` ([SKILL.md](video-campanha-politica/SKILL.md)) | pipeline PT-BR completo de Reels 9:16 narrado: roteiro em beats → ElevenLabs → canvas/ffmpeg → QA. |
| `text-to-speech` ([SKILL.md](text-to-speech/SKILL.md)) | TTS ElevenLabs — texto→fala em 90+ línguas com modelos, vozes, settings e efeitos de áudio. |
| `watch` ([SKILL.md](watch/SKILL.md)) | assiste vídeo (URL/local): frames auto-escala + transcrição (captions/WhisperX/Groq/OpenAI) ou Gemini, e responde perguntas sobre o conteúdo. |

| Automação & negócio | O que faz |
|---|---|
| `asaas-integration` ([SKILL.md](asaas-integration/SKILL.md)) | Código de integração com a API Asaas (pagamentos BR) — cobranças, Pix, assinaturas, NF-e, negativação. |
| `autentique-integration` ([SKILL.md](autentique-integration/SKILL.md)) | Integração com a API Autentique (assinatura eletrônica BR) — 100% GraphQL, documentos e signatários. |
| `evolution-api` ([SKILL.md](evolution-api/SKILL.md)) | Referência de endpoints da Evolution API v2 (WhatsApp via Baileys) — instâncias, envio de mensagens, webhooks. |
| `stripe-integration` ([SKILL.md](stripe-integration/SKILL.md)) | Integração com a API Stripe — Checkout, PaymentIntent, assinaturas, cupons, Pix, cripto e Connect/marketplace. |

### Como instalar uma skill

```bash
# 1. clone este repo
git clone https://github.com/lSaGaT/skills-claude-video
# 2. copie a pasta da skill para o diretório que seu agente lê
cp -r skills-claude-video/<skill>/ ~/.claude/skills/   # ou .agents/skills/, conforme seu agente
```
Dependências comuns: Node 18+, ffmpeg (o embutido do CapCut serve), Python 3.10+ p/ a suíte CapCut. Skills de terceiros: veja a ficha em `catalogo/` — instalação é clonar a coleção de origem e copiar a pasta da skill.

## Catálogo completo do arsenal (310)

| Categoria | Skills |
|---|---|
| [Suíte CapCut — autorais da casa](catalogo/autorais-capcut.md) | 8 |
| [Ofícios & pipelines — autorais da casa](catalogo/autorais-pipelines.md) | 10 |
| [Automação & APIs de negócio](catalogo/automacao-negocio.md) | 4 |
| [Editores de vídeo agent-native (por app)](catalogo/editores-agentes.md) | 54 |
| [Motion graphics & animação em código](catalogo/motion-codigo.md) | 26 |
| [HyperFrames & Remotion (HTML/React → vídeo)](catalogo/render-codigo.md) | 37 |
| [Geração AI — vídeo, avatar & imagem](catalogo/geracao-ai.md) | 24 |
| [Voz, TTS, música & áudio](catalogo/voz-audio.md) | 18 |
| [3D, Three.js & shaders](catalogo/3d-shaders.md) | 18 |
| [Explicativos, dados & matemática](catalogo/explicativos-dados.md) | 19 |
| [Formatos sociais — TikTok, Reels, Shorts & ads](catalogo/formatos-sociais.md) | 29 |
| [Craft, direção & negócio de motion](catalogo/craft-direcao.md) | 26 |
| [Web, UI & GSAP](catalogo/web-ui.md) | 25 |
| [Infra & utilidades de mídia](catalogo/infra-midia.md) | 12 |

🏠 = autoral da casa. As fichas de todas as skills (o que cria · chaves técnicas · origem · como instalar) estão em `catalogo/<categoria>.md`.

## Nota

- As 22 skills 🏠 são de autoria própria (corpo completo aqui, use livremente).
- As outras 288 pertencem às coleções open-source de origem indicadas em cada ficha — este repo é um **catálogo de estudo** que documenta o que cada uma cria e como instalá-la; os créditos e as licenças são dos autores originais.
- Catálogo gerado da varredura completa de 17/11/2026 (396 SKILL.md lidos 1 a 1) com diffs de 23/11/2026.
