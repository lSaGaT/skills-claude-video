# skills-claude-video

Skills criadas em produção real de vídeo com agentes (Claude/ZCode SDK) — CapCut Desktop,
Reels de ataque político, Reels dev/tech e assistente de referência. Cada pasta é uma
skill com `SKILL.md` pronto para instaladores de skills.

## Suíte CapCut (draft JSON + app aberto)

| Skill | O que faz |
|---|---|
| `capcut-draft-core` | Ler, validar, criar e editar projetos do CapCut (`draft_content.json`) — backup, validação, estrutura de tracks/materials |
| `capcut-timeline-editing` | Mídia na timeline: adicionar vídeo/imagem/áudio, cortar, splitar, trim, velocidade, transform (escala/posição/rotação/alpha) |
| `capcut-text-captions` | Texto e legendas: segmentos estilizados, estilos por trecho (ranges UTF-16 corretos), importar SRT |
| `capcut-audio` | Música/SFX, volume, fade in/out, múltiplas tracks de áudio |
| `capcut-effects-filters` | Transições, efeitos de cena, filtros de cor, animações de entrada/saída/loop |
| `capcut-agent-ipc` | Controlar o CapCut Desktop ABERTO via o plano IPC nativo (lyra-cli-ipc): canvas nodes, add-draft, shadow drafts |
| `capcut-browser` | O browser gerenciado que acompanha o agente do CapCut (snapshots, cliques, navegação) |
| `capcut-media-export` | ffmpeg/ffprobe embutidos do CapCut, draft-converter (AAF), estado da exportação 9.7 |

Regras de ouro da suíte: backup antes, nunca editar draft aberto no app, tempos em
microssegundos, ranges de texto em UTF-16.

## Ofícios de vídeo (pipelines completos)

| Skill | O que faz |
|---|---|
| `video-campanha-politica` | Vídeos de campanha/ataque 9:16: pipeline de beats (1 fala = 1 beat 3–7s), narração ElevenLabs, carimbos de manchete sobre vídeo mudo, blindagem anti-fact-check, QA com prova + regra TSE |
| `reels-dev-tech` | Reels 9:16 dev/tech "tech explainer PT-BR": repo GitHub → janela falsa com moldura neon, scroll em saltos, destaques amarelos, legenda cinética (engenharia reversa de 23 reels) |
| `watch` | Assistir referências (URL ou arquivo local): yt-dlp + frames auto-escalados + transcrição (WhisperX/legendas) para o agente responder sobre o vídeo |

## Uso

Clone e aponte seu instalador de skills para as pastas, ou copie a pasta da skill para
o diretório de skills do seu agente (`~/.claude/skills/`, `.agents/skills/`, etc.).
Dependências comuns: Node 18+, ffmpeg (o do CapCut serve), Python 3.10+ para a suíte CapCut.
